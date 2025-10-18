from typing import List, Optional
from database import database
import logging

logger = logging.getLogger("comments queries")

async def insert_comment(movie_id: int, user_id: int, content: str) -> int:
    query = """
    INSERT INTO comments (movie_id, user_id, content)
    VALUES (:movie_id, :user_id, :content)
    RETURNING comment_id
    """
    values = {
        "movie_id": movie_id,
        "user_id": user_id,
        "content": content
    }
    result = await database.fetch_one(query, values)
    return result["comment_id"]

async def get_comments_by_movie(movie_id: int) -> List[dict]:
    try:
        query = """
        SELECT c.*, u.username, u.id as user_table_id
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.movie_id = :movie_id
        ORDER BY c.created_at DESC
        """
        rows = await database.fetch_all(query=query, values={"movie_id": movie_id})
        
        formatted_comments = []
        for row in rows:
            comment_dict = dict(row)
            comment_dict["user"] = {
                "id": comment_dict["user_table_id"],
                "username": comment_dict["username"]
            }
            formatted_comments.append(comment_dict)
        
        return formatted_comments
    except Exception as e:
        logger.error(f"Error fetching comments for movie {movie_id}: {str(e)}")
        return []

async def get_comment_by_id(comment_id: int) -> Optional[dict]:
    try:
        query = """
        SELECT c.*, u.username, u.id as user_table_id
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.comment_id = :comment_id
        """
        result = await database.fetch_one(query=query, values={"comment_id": comment_id})
        
        if result:
            comment_dict = dict(result)
            comment_dict["user"] = {
                "id": comment_dict["user_table_id"],
                "username": comment_dict["username"]
            }
            return comment_dict
        return None
    except Exception as e:
        logger.error(f"Error fetching comment {comment_id}: {str(e)}")
        return None

async def update_comment(comment_id: int, content: str) -> Optional[dict]:
    query = """
    UPDATE comments 
    SET content = :content, updated_at = CURRENT_TIMESTAMP
    WHERE comment_id = :comment_id
    RETURNING *
    """
    values = {
        "comment_id": comment_id,
        "content": content
    }
    result = await database.fetch_one(query=query, values=values)
    return dict(result) if result else None

async def delete_comment(comment_id: int) -> bool:
    try:
        query = "DELETE FROM comments WHERE comment_id = :comment_id"
        result = await database.execute(query=query, values={"comment_id": comment_id})
        
        if result is None:
            # Assume success if no exception was raised
            return True
        return bool(result)  
    except Exception as e:
        logger.error(f"Error deleting comment {comment_id}: {str(e)}")
        return False

async def is_comment_owner(comment_id: int, user_id: int) -> bool:
    query = "SELECT 1 FROM comments WHERE comment_id = :comment_id AND user_id = :user_id"
    result = await database.fetch_one(query=query, values={"comment_id": comment_id, "user_id": user_id})
    return result is not None

async def check_movie_exists(movie_id: int) -> bool:
    query = "SELECT 1 FROM movies WHERE movie_id = :movie_id"
    result = await database.fetch_one(query=query, values={"movie_id": movie_id})
    return result is not None