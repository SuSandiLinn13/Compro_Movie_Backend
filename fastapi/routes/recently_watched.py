from fastapi import APIRouter, HTTPException, status, Depends
from auth.auth import get_current_user
# Fix the import - use relative or absolute imports from your project
from queries.recently_watched import add_recently_watched, get_recently_watched

recentlyWatchedRouter = APIRouter(tags=["recently_watched"])

@recentlyWatchedRouter.post("/recentlywatched")
async def add_to_recently_watched(
    data: dict,
    current_user: int = Depends(get_current_user)
):
    movie_id = data.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=400, detail="movie_id is required")
    
    result = await add_recently_watched(current_user, movie_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {"message": "Added to recently watched"}

@recentlyWatchedRouter.get("/recentlywatched")
async def get_recently_watched_route(
    current_user: int = Depends(get_current_user)
):
    recently_watched = await get_recently_watched(current_user)
    return recently_watched