# routes/recently_watched.py

from fastapi import APIRouter, HTTPException
from queries.recently_watched import add_recently_watched, get_recently_watched

recentlyWatchedRouter = APIRouter(prefix="/recently_watched", tags=["recently_watched"])

# ✅ Add or update recently watched movie
@recentlyWatchedRouter.post("/")
async def add_recently_watched_movie(user_id: int, movie_id: int):
    result = await add_recently_watched(user_id, movie_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


# ✅ Get recently watched movies
@recentlyWatchedRouter.get("/{user_id}")
async def fetch_recently_watched_movies(user_id: int):
    result = await get_recently_watched(user_id)
    return result
