from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WatchHistoryCreate(BaseModel):
    user_id: int
    movie_id: int
    duration_watched: Optional[int] = 0

class WatchHistoryOut(BaseModel):
    id: int
    user_id: int
    movie_id: int
    watched_at: datetime
    duration_watched: int
    movie_title: Optional[str] = None  # For joined queries

class WatchHistoryResponse(BaseModel):
    message: str
    watch_history: Optional[WatchHistoryOut] = None