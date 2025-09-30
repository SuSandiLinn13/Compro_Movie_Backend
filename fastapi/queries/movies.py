from typing import Any, Optional, List
from database import database
from datetime import date

async def insert_movie(values: dict) -> int:
    query = """
    INSERT INTO movies
    (title, description, director, genre, casts, released_date, available, created_at)
    VALUES (:title, :description, :director, :genre, :casts, :released_date, TRUE, NOW())
    RETURNING movie_id
    """
    result = await database.fetch_one(query, values)
    return result["movie_id"]

# Get all books (basic info only)
async def get_all_movies() -> list[dict[str, Any]]:
    query = """
        SELECT movie_id, title, description
        FROM movies
    """
    return await database.fetch_all(query=query)
    
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
        released_date: Optional[date] = None
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