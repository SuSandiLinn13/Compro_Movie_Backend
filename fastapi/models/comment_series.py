from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class SeriesCommentBase(BaseModel):
    content: str

class SeriesCommentCreate(SeriesCommentBase):
    series_id: int

class SeriesCommentUpdate(SeriesCommentBase):
    pass

class SeriesCommentUser(BaseModel):
    id: int
    username: str

class SeriesCommentResponse(BaseModel):
    comment_id: int
    series_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user: Optional[SeriesCommentUser] = None

class SeriesCommentListResponse(BaseModel):
    comments: List[SeriesCommentResponse]

class SeriesCommentDeleteResponse(BaseModel):
    message: str
    comment_id: int