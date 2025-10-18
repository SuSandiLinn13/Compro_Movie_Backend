# fastapi/queries/movies.py

from typing import Any, Optional, List
from database import database
from datetime import date
import logging

logger = logging.getLogger("movies queries")

async def insert_movie(values: dict) -> int:
    query = """
    INSERT INTO movies
    (title, description, director, genre, casts, release_date, poster_url)
    VALUES (:title, :description, :director, :genre, :casts, :release_date, :poster_url)
    RETURNING movie_id
    """
    result = await database.fetch_one(query, values)
    return result["movie_id"]

async def get_all_movies() -> list[dict]:
    try:
        query = "SELECT * FROM movies"
        rows = await database.fetch_all(query=query)
        return [dict(row) for row in rows if row]
    except Exception as e:
        logger.error(f"Error fetching all movies: {str(e)}")
        return []

async def get_movie_by_id(movie_id: int) -> Optional[dict[str, Any]]:
    try:
        query = "SELECT * FROM movies WHERE movie_id = :movie_id"
        result = await database.fetch_one(query=query, values={"movie_id": movie_id})
        
        if result:
            movie_dict = dict(result)
            logger.info(f"Retrieved movie: {movie_dict.get('title')}")
            return movie_dict
        else:
            logger.warning(f"No movie found with ID: {movie_id}")
            return None
            
    except Exception as e:
        logger.error(f"Database error in get_movie_by_id: {str(e)}")
        return None

async def update_movie(
        movie_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        director: Optional[str] = None,
        genre: Optional[List[str]] = None,
        casts: Optional[List[str]] = None, 
        release_date: Optional[date] = None,
        poster_url: Optional[str] = None
    ) -> Optional[dict[str, Any]]:
    updates: list[str] = []
    values: dict[str, Any] = {"movie_id": movie_id}

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
    if release_date is not None:  # Changed from released_date to release_date
        updates.append("release_date = :release_date")
        values["release_date"] = release_date
    if poster_url is not None:
        updates.append("poster_url = :poster_url")
        values["poster_url"] = poster_url

    if not updates: 
        return None
    
    set_clause = ",".join(updates)
    query = f"""
    UPDATE movies
    SET {set_clause}
    WHERE movie_id = :movie_id
    RETURNING *
    """
    return await database.fetch_one(query=query, values=values)

async def delete_movie(movie_id: int) -> Optional[dict[str, Any]]:
    query = "DELETE FROM movies WHERE movie_id = :movie_id RETURNING *"
    return await database.fetch_one(query=query, values={"movie_id": movie_id})

async def get_movies_by_genre(genre_name: str) -> list[dict]:
    query = """
        SELECT *
        FROM movies
        WHERE :genre_name = ANY(genre)
    """
    rows = await database.fetch_all(query=query, values={"genre_name": genre_name})
    return [dict(row) for row in rows if row]

async def get_all_genres() -> list[str]:
    query = """
        SELECT DISTINCT unnest(genre) AS genre_name
        FROM movies
    """
    rows = await database.fetch_all(query=query)
    return [row["genre_name"] for row in rows]

async def get_movies_only():
    query = "SELECT * FROM movies WHERE type = 'movie'"
    return await database.fetch_all(query)

async def get_series_only():
    query = "SELECT * FROM movies WHERE type = 'series'"
    return await database.fetch_all(query)

async def get_top_imdb():
    query = "SELECT * FROM movies ORDER BY imdb_rating DESC"
    return await database.fetch_all(query)