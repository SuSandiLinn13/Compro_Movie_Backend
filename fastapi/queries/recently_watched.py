from typing import List
from database import database
import logging

logger = logging.getLogger("recently_watched_queries")

async def create_recently_watched_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS recently_watched (
        watch_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
        watched_at TIMESTAMP DEFAULT NOW()
    )
    """
    await database.execute(query=query)
    logger.info("Recently watched table created (or already exists).")

async def add_recently_watched(user_id: int, movie_id: int) -> dict:
    # Check if movie exists
    movie_check = "SELECT 1 FROM movies WHERE movie_id = :movie_id"
    movie_exists = await database.fetch_one(movie_check, {"movie_id": movie_id})
    if not movie_exists:
        return {"error": "Movie not found"}
    
    # Remove old entry if exists to avoid duplicates
    delete_query = """
    DELETE FROM recently_watched 
    WHERE user_id = :user_id AND movie_id = :movie_id
    """
    await database.execute(delete_query, {"user_id": user_id, "movie_id": movie_id})
    
    # Add new entry
    query = """
    INSERT INTO recently_watched (user_id, movie_id)
    VALUES (:user_id, :movie_id)
    RETURNING watch_id, user_id, movie_id, watched_at
    """
    try:
        result = await database.fetch_one(query, {"user_id": user_id, "movie_id": movie_id})
        return dict(result) if result else {"error": "Failed to add to recently watched"}
    except Exception as e:
        logger.error(f"Error adding to recently watched: {e}")
        return {"error": "Database error"}

async def get_recently_watched(user_id: int, limit: int = 10) -> List[dict]:
    query = """
    SELECT DISTINCT ON (m.movie_id) 
           m.movie_id as id, m.title, m.description, m.genre, 
           m.poster_url, m.imdb_rating, m.type,
           rw.watched_at
    FROM recently_watched rw
    JOIN movies m ON rw.movie_id = m.movie_id
    WHERE rw.user_id = :user_id
    ORDER BY m.movie_id, rw.watched_at DESC
    LIMIT :limit
    """
    try:
        rows = await database.fetch_all(query, {"user_id": user_id, "limit": limit})
        return [dict(row) for row in rows]
    except Exception as e:
        logger.error(f"Error fetching recently watched: {e}")
        return []