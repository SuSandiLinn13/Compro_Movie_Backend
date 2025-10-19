from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel, Field

class Series(BaseModel):
    series_id: int
    title: str
    description: str
    director: str
    genre: List[str]
    casts: List[str]
    release_date: date
    is_published: bool
    created_at: datetime
    poster_url: str
    imdb_rating: float
    total_seasons: int
    total_episodes: int

class SeriesCreate(BaseModel):
    title: str
    description: str
    director: Optional[str] = None
    genre: Optional[List[str]] = None
    casts: Optional[List[str]] = None
    release_date: Optional[date] = None
    poster_url: Optional[str] = None
    total_seasons: Optional[int] = 1
    total_episodes: Optional[int] = 1

class SeriesResponse(BaseModel):
    message: Optional[str] = None
    series_id: Optional[int] = None
    title: Optional[str] = None
    director: Optional[str] = None

class SeriesListItem(BaseModel):
    id: int
    title: str
    description: str
    genre: Optional[List[str]] = []
    poster_url: Optional[str] = None
    imdb_rating: Optional[float] = None
    total_seasons: Optional[int] = 1
    total_episodes: Optional[int] = 1

class SeriesListResponse(BaseModel):
    series: List[SeriesListItem]

class SeriesDetailResponse(BaseModel):
    series_detail: Series

class SeriesUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    director: Optional[str] = None
    genre: Optional[List[str]] = None
    casts: Optional[List[str]] = None
    release_date: Optional[date] = None
    poster_url: Optional[str] = None
    total_seasons: Optional[int] = None
    total_episodes: Optional[int] = None

class Episode(BaseModel):
    episode_id: int
    series_id: int
    season_number: int
    episode_number: int
    title: str
    description: str
    duration: int  # in minutes
    release_date: date
    video_url: str
    created_at: datetime

class EpisodeCreate(BaseModel):
    series_id: int
    season_number: int
    episode_number: int
    title: str
    description: str
    duration: Optional[int] = None
    release_date: Optional[date] = None
    video_url: Optional[str] = None

class EpisodeResponse(BaseModel):
    message: Optional[str] = None
    episode_id: Optional[int] = None
    title: Optional[str] = None

class EpisodeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    release_date: Optional[date] = None
    video_url: Optional[str] = None