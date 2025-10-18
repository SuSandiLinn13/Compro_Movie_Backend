from fastapi import APIRouter, Depends, HTTPException, status
from models.watch_history import *
from queries.watch_history import *
from auth.auth import get_current_user
import logging

watch_history_router = APIRouter(tags=["watch_history"])
logger = logging.getLogger("watch_history routes")

@watch_history_router.post("/watch-history", response_model=WatchHistoryResponse)
async def add_watch_history(
    watch_data: WatchHistoryCreate,
    current_user: int = Depends(get_current_user)
):
    if watch_data.user_id != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    history = await add_to_watch_history(
        watch_data.user_id, 
        watch_data.movie_id, 
        watch_data.duration_watched
    )
    
    return WatchHistoryResponse(
        message="Added to watch history",
        watch_history=history
    )

@watch_history_router.get("/watch-history", response_model=List[WatchHistoryOut])
async def get_watch_history(current_user: int = Depends(get_current_user)):
    return await get_user_watch_history(current_user)

@watch_history_router.delete("/watch-history/{history_id}")
async def delete_watch_history(
    history_id: int,
    current_user: int = Depends(get_current_user)
):
    await remove_from_watch_history(history_id, current_user)
    return {"message": "Removed from watch history"}