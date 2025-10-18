from typing import List, Optional
from database import database
import logging

logger = logging.getLogger("watch_history queries")

async def add_to_watch_history(user_id: int, movie_id: int, duration_watched: int = 0) -> dict:
    query = """
    INSERT INTO watch_history (user_id, movie_id, duration_watched)
    VALUES (:user_id, :movie_id, :duration_watched)
    ON CONFLICT (user_id, movie_id) 
    DO UPDATE SET watched_at = NOW(), duration_watched = :duration_watched
    RETURNING *
    """
    values = {"user_id": user_id, "movie_id": movie_id, "duration_watched": duration_watched}
    
    result = await database.fetch_one(query, values)
    return dict(result) if result else None

async def get_user_watch_history(user_id: int) -> List[dict]:
    query = """
    SELECT wh.*, m.title as movie_title, m.poster_url
    FROM watch_history wh
    JOIN movies m ON wh.movie_id = m.movie_id
    WHERE wh.user_id = :user_id
    ORDER BY wh.watched_at DESC
    """
    rows = await database.fetch_all(query, {"user_id": user_id})
    return [dict(row) for row in rows]

async def remove_from_watch_history(history_id: int, user_id: int) -> bool:
    query = "DELETE FROM watch_history WHERE id = :id AND user_id = :user_id"
    await database.execute(query, {"id": history_id, "user_id": user_id})
    return True