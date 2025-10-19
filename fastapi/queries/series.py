# queries/series.py
from typing import Any, Optional, List
from database import database
from datetime import date
import logging

logger = logging.getLogger("series queries")

# Series queries
async def insert_series(values: dict) -> int:
    query = """
    INSERT INTO series
    (title, description, director, genre, casts, release_date, poster_url, total_seasons, total_episodes)
    VALUES (:title, :description, :director, :genre, :casts, :release_date, :poster_url, :total_seasons, :total_episodes)
    RETURNING series_id
    """
    result = await database.fetch_one(query, values)
    return result["series_id"]

async def get_all_series() -> list[dict]:
    try:
        query = "SELECT * FROM series"
        rows = await database.fetch_all(query=query)
        return [dict(row) for row in rows if row]
    except Exception as e:
        logger.error(f"Error fetching all series: {str(e)}")
        return []

async def get_series_by_id(series_id: int) -> Optional[dict[str, Any]]:
    try:
        query = "SELECT * FROM series WHERE series_id = :series_id"
        result = await database.fetch_one(query=query, values={"series_id": series_id})
        
        if result:
            series_dict = dict(result)
            logger.info(f"Retrieved series: {series_dict.get('title')}")
            return series_dict
        else:
            logger.warning(f"No series found with ID: {series_id}")
            return None
            
    except Exception as e:
        logger.error(f"Database error in get_series_by_id: {str(e)}")
        return None

async def update_series(
        series_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        director: Optional[str] = None,
        genre: Optional[List[str]] = None,
        casts: Optional[List[str]] = None,
        release_date: Optional[date] = None,
        poster_url: Optional[str] = None,
        total_seasons: Optional[int] = None,
        total_episodes: Optional[int] = None
    ) -> Optional[dict[str, Any]]:
    updates: list[str] = []
    values: dict[str, Any] = {"series_id": series_id}

    if title is not None:
        updates.append("title = :title")
        values["title"] = title
    if description is not None:
        updates.append("description = :description")
        values["description"] = description
    if director is not None:
        updates.append("director = :director")
        values["director"] = director
    if genre is not None:
        updates.append("genre = :genre")
        values["genre"] = genre
    if casts is not None:
        updates.append("casts = :casts")
        values["casts"] = casts
    if release_date is not None:
        updates.append("release_date = :release_date")
        values["release_date"] = release_date
    if poster_url is not None:
        updates.append("poster_url = :poster_url")
        values["poster_url"] = poster_url
    if total_seasons is not None:
        updates.append("total_seasons = :total_seasons")
        values["total_seasons"] = total_seasons
    if total_episodes is not None:
        updates.append("total_episodes = :total_episodes")
        values["total_episodes"] = total_episodes

    if not updates:
        return None
    
    set_clause = ",".join(updates)
    query = f"""
    UPDATE series
    SET {set_clause}
    WHERE series_id = :series_id
    RETURNING *
    """
    return await database.fetch_one(query=query, values=values)

async def delete_series(series_id: int) -> Optional[dict[str, Any]]:
    query = "DELETE FROM series WHERE series_id = :series_id RETURNING *"
    return await database.fetch_one(query=query, values={"series_id": series_id})

async def get_series_by_genre(genre_name: str) -> list[dict]:
    query = """
        SELECT *
        FROM series
        WHERE :genre_name = ANY(genre)
    """
    rows = await database.fetch_all(query=query, values={"genre_name": genre_name})
    return [dict(row) for row in rows if row]


async def get_series_only():
    try:
        query = "SELECT * FROM series"
        rows = await database.fetch_all(query)
        return [dict(row) for row in rows]  # Convert to dictionaries
    except Exception as e:
        logger.error(f"Error in get_series_only: {str(e)}")
        return []

# Episode queries
async def insert_episode(values: dict) -> int:
    query = """
    INSERT INTO episodes
    (series_id, season_number, episode_number, title, description, duration, release_date, video_url)
    VALUES (:series_id, :season_number, :episode_number, :title, :description, :duration, :release_date, :video_url)
    RETURNING episode_id
    """
    result = await database.fetch_one(query, values)
    return result["episode_id"]

async def get_episodes_by_series(series_id: int) -> list[dict]:
    query = """
    SELECT * FROM episodes 
    WHERE series_id = :series_id 
    ORDER BY season_number, episode_number
    """
    rows = await database.fetch_all(query=query, values={"series_id": series_id})
    return [dict(row) for row in rows if row]

async def get_episode_by_id(episode_id: int) -> Optional[dict[str, Any]]:
    query = "SELECT * FROM episodes WHERE episode_id = :episode_id"
    result = await database.fetch_one(query=query, values={"episode_id": episode_id})
    return dict(result) if result else None

async def update_episode(
        episode_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        duration: Optional[int] = None,
        release_date: Optional[date] = None,
        video_url: Optional[str] = None
    ) -> Optional[dict[str, Any]]:
    updates: list[str] = []
    values: dict[str, Any] = {"episode_id": episode_id}

    if title is not None:
        updates.append("title = :title")
        values["title"] = title
    if description is not None:
        updates.append("description = :description")
        values["description"] = description
    if duration is not None:
        updates.append("duration = :duration")
        values["duration"] = duration
    if release_date is not None:
        updates.append("release_date = :release_date")
        values["release_date"] = release_date
    if video_url is not None:
        updates.append("video_url = :video_url")
        values["video_url"] = video_url

    if not updates:
        return None
    
    set_clause = ",".join(updates)
    query = f"""
    UPDATE episodes
    SET {set_clause}
    WHERE episode_id = :episode_id
    RETURNING *
    """
    return await database.fetch_one(query=query, values=values)

async def delete_episode(episode_id: int) -> Optional[dict[str, Any]]:
    query = "DELETE FROM episodes WHERE episode_id = :episode_id RETURNING *"
    return await database.fetch_one(query=query, values={"episode_id": episode_id})

async def get_episodes_by_season(series_id: int, season_number: int) -> list[dict]:
    query = """
    SELECT * FROM episodes 
    WHERE series_id = :series_id AND season_number = :season_number
    ORDER BY episode_number
    """
    rows = await database.fetch_all(query=query, values={"series_id": series_id, "season_number": season_number})
    return [dict(row) for row in rows if row]