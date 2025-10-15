# queries/recently_watched.py

from typing import Any, List
from database import database
import logging

logger = logging.getLogger("recently_watched")

# ✅ Add or update recently watched movie
async def add_recently_watched(user_id: int, movie_id: int) -> dict[str, Any]:
    query = """
    INSERT INTO recently_watched (user_id, movie_id)
    VALUES (:user_id, :movie_id)
    ON CONFLICT (user_id, movie_id)
    DO UPDATE SET watched_at = CURRENT_TIMESTAMP
    RETURNING id, user_id, movie_id, watched_at
    """
    try:
        result = await database.fetch_one(query, {"user_id": user_id, "movie_id": movie_id})
        return dict(result) if result else {"error": "Failed to insert"}
    except Exception as e:
        logger.error(f"Error adding recently watched: {e}")
        return {"error": str(e)}


# ✅ Get last 4 recently watched movies
async def get_recently_watched(user_id: int) -> List[dict[str, Any]]:
    query = """
    SELECT m.id AS movie_id, m.title, m.poster_url, rw.watched_at
    FROM recently_watched rw
    JOIN movies m ON rw.movie_id = m.id
    WHERE rw.user_id = :user_id
    ORDER BY rw.watched_at DESC
    LIMIT 4
    """
    result = await database.fetch_all(query, {"user_id": user_id})
    return [dict(row) for row in result]
