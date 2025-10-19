# models/comments
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    movie_id: int

class CommentUpdate(CommentBase):
    pass

class CommentUser(BaseModel):
    id: int  # Changed from user_id to id to match your UserOut
    username: str

class CommentResponse(BaseModel):
    comment_id: int
    movie_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user: Optional[CommentUser] = None

class CommentListResponse(BaseModel):
    comments: List[CommentResponse]

class CommentDeleteResponse(BaseModel):
    message: str
    comment_id: int