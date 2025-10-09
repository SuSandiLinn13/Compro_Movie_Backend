# fastapi/models/movies.py

from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel

class Movie(BaseModel):
  movie_id: int
  title: str
  description: str
  director: str
  genre: List[str]
  casts: List[str]
  released_date: date
  available: bool
  created_at: datetime

class MovieCreate(BaseModel):
    title: str
    description: str
    director: Optional[str] = None
    genre: Optional[List[str]] = None
    casts: Optional[List[str]] = None
    released_date: Optional[date] = None

class MovieResponse(BaseModel):
    message: Optional[str] = None
    movie_id: Optional[int] = None
    title: Optional[str] = None
    director: Optional[str] = None

class MovieListItem(BaseModel):
    id: int
    title: str
    description: str

class MovieListResponse(BaseModel):
    movies: List[MovieListItem]

class MovieDetailResponse(BaseModel):
    movie_detail: Movie

class MovieUpdate(BaseModel):
    movie_id: int
    title: Optional[str] = None
    description: Optional[str] = None
    director: Optional[str] = None
    genre: Optional[List[str]] = None
    casts: Optional[List[str]] = None
    released_date: Optional[date] = None