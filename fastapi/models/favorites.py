from pydantic import BaseModel
from typing import List, Optional

class FavoriteBase(BaseModel):
    movie_id: int

class FavoriteCreate(FavoriteBase):
    pass

class FavoriteResponse(BaseModel):
    message: str
    favorite_id: int
    user_id: int
    movie_id: int

class FavoriteMovie(BaseModel):
    id: int
    title: str
    description: str
    genre: Optional[List[str]] = []
    poster_url: Optional[str] = None
    imdb_rating: Optional[float] = None
    type: Optional[str] = None

class FavoriteListResponse(BaseModel):
    favorites: List[FavoriteMovie]