# fastapi/queries/movies.py

from typing import Any, Optional, List
from database import database
from datetime import date

async def insert_movie(values: dict) -> int:
    query = """
    INSERT INTO movies
    (title, description, director, genre, casts, released_date, available, created_at, poster_url)
    VALUES (:title, :description, :director, :genre, :casts, :released_date, TRUE, NOW(), :poster_url)
    RETURNING movie_id
    """
    result = await database.fetch_one(query, values)
    return result["movie_id"]


# async def get_all_movies() -> list[dict[str, Any]]:
#     # First, get all movie IDs
#     query = "SELECT movie_id FROM movies"
#     movie_ids = await database.fetch_all(query=query)
    
#     # Then fetch each movie individually
#     movies = []
#     for row in movie_ids:
#         movie = await get_movie_by_id(row["movie_id"])
#         if movie:
#             movies.append(dict(movie))
    
#     return movies

async def get_all_movies() -> list[dict]:
    query = "SELECT * FROM movies"
    rows = await database.fetch_all(query=query)
    return [dict(row) for row in rows if row]


async def get_movie_by_id(movie_id: int)-> Optional[dict[str, Any]]:
    query = "SELECT * FROM movies WHERE movie_id = :movie_id"
    return await database.fetch_one(query=query, values={"movie_id": movie_id})

async def update_movie(
        movie_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
        director: Optional[str] = None,
        genre: Optional[List[str]] = None,
        casts: Optional[List[str]] = None,
        released_date: Optional[date] = None,
        poster_url: Optional[str] = None
    )-> Optional[dict[str, Any]]:
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
    if released_date is not None:
        updates.append("released_date = :released_date")
        values["released_date"] = released_date
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
    return await database.fetch_one(query = query, values = values)

async def delete_movie(movie_id: int)-> Optional[dict[str, Any]]:
    query = "DELETE FROM movies WHERE movie_id = :movie_id RETURNING *"
    return await database.fetch_one(query=query, values={"movie_id": movie_id})


# async def get_movies_by_genre(genre_name: str) -> list[dict[str, Any]]:
#     # First, get movie IDs that match the genre
#     query = """
#         SELECT movie_id
#         FROM movies
#         WHERE :genre_name = ANY(genre)
#     """
#     movie_ids = await database.fetch_all(query=query, values={"genre_name": genre_name})
    
#     # Then fetch each movie individually
#     movies = []
#     for row in movie_ids:
#         movie = await get_movie_by_id(row["movie_id"])
#         if movie:
#             movies.append(dict(movie))
    
#     return movies

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