from typing import List, Optional
from database import database
import logging

logger = logging.getLogger("favorites_queries")

async def create_favorites_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS favorites (
        favorite_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, movie_id)
    )
    """
    await database.execute(query=query)
    logger.info("Favorites table created (or already exists).")

async def add_to_favorites(user_id: int, movie_id: int) -> dict:
    # Check if movie exists
    movie_check = """
    SELECT 1 FROM movies WHERE movie_id = :movie_id
    """
    movie_exists = await database.fetch_one(query=movie_check, values={"movie_id": movie_id})
    if not movie_exists:
        return {"error": "Movie not found"}
    
    # Check if already in favorites
    existing_query = """
    SELECT 1 FROM favorites WHERE user_id = :user_id AND movie_id = :movie_id
    """
    existing = await database.fetch_one(
        query=existing_query, 
        values={"user_id": user_id, "movie_id": movie_id}
    )
    if existing:
        return {"error": "Movie already in favorites"}
    
    # Check if user has reached 10 favorites limit
    count_query = """
    SELECT COUNT(*) as count FROM favorites WHERE user_id = :user_id
    """
    count_result = await database.fetch_one(query=count_query, values={"user_id": user_id})
    if count_result and count_result["count"] >= 10:
        return {"error": "Maximum 10 favorites allowed"}
    
    # Add to favorites
    query = """
    INSERT INTO favorites (user_id, movie_id)
    VALUES (:user_id, :movie_id)
    RETURNING favorite_id, user_id, movie_id
    """
    try:
        result = await database.fetch_one(
            query=query, 
            values={"user_id": user_id, "movie_id": movie_id}
        )
        return dict(result) if result else {"error": "Failed to add to favorites"}
    except Exception as e:
        logger.error(f"Error adding to favorites: {e}")
        return {"error": "Database error"}

async def remove_from_favorites(user_id: int, movie_id: int) -> dict:
    query = """
    DELETE FROM favorites 
    WHERE user_id = :user_id AND movie_id = :movie_id
    RETURNING favorite_id, user_id, movie_id
    """
    try:
        result = await database.fetch_one(
            query=query, 
            values={"user_id": user_id, "movie_id": movie_id}
        )
        if result:
            return {"message": "Removed from favorites", "data": dict(result)}
        return {"error": "Favorite not found"}
    except Exception as e:
        logger.error(f"Error removing from favorites: {e}")
        return {"error": "Database error"}

async def get_user_favorites(user_id: int) -> List[dict]:
    query = """
    SELECT m.movie_id as id, m.title, m.description, m.genre, 
           m.poster_url, m.imdb_rating, m.type
    FROM favorites f
    JOIN movies m ON f.movie_id = m.movie_id
    WHERE f.user_id = :user_id
    ORDER BY f.created_at DESC
    LIMIT 10
    """
    try:
        rows = await database.fetch_all(query=query, values={"user_id": user_id})
        return [dict(row) for row in rows]
    except Exception as e:
        logger.error(f"Error fetching favorites: {e}")
        return []

async def is_movie_in_favorites(user_id: int, movie_id: int) -> bool:
    query = """
    SELECT 1 FROM favorites 
    WHERE user_id = :user_id AND movie_id = :movie_id
    """
    result = await database.fetch_one(
        query=query, 
        values={"user_id": user_id, "movie_id": movie_id}
    )
    return bool(result)

async def get_favorites_count(user_id: int) -> int:
    query = """
    SELECT COUNT(*) as count FROM favorites WHERE user_id = :user_id
    """
    result = await database.fetch_one(query=query, values={"user_id": user_id})
    return result["count"] if result else 0