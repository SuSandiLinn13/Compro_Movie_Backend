from fastapi import APIRouter, HTTPException, status, Depends
from models.favorites import *
from queries.favorites import *
from auth.auth import get_current_user
import logging

favoriteRouter = APIRouter(tags=["favorites"])
logger = logging.getLogger("favorites_route")

@favoriteRouter.post("/favorites", response_model=FavoriteResponse)
async def add_movie_to_favorites(
    favorite: FavoriteCreate,
    current_user: int = Depends(get_current_user)
):
    """
    Add a movie to user's favorites (max 10 favorites per user)
    """
    result = await add_to_favorites(current_user, favorite.movie_id)
    
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return FavoriteResponse(
        message="Movie added to favorites",
        favorite_id=result["favorite_id"],
        user_id=result["user_id"],
        movie_id=result["movie_id"]
    )

@favoriteRouter.delete("/favorites/{movie_id}")
async def remove_movie_from_favorites(
    movie_id: int,
    current_user: int = Depends(get_current_user)
):
    """
    Remove a movie from user's favorites
    """
    result = await remove_from_favorites(current_user, movie_id)
    
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"]
        )
    
    return {"message": result["message"]}

@favoriteRouter.get("/favorites", response_model=FavoriteListResponse)
async def get_user_favorites_route(
    current_user: int = Depends(get_current_user)
):
    """
    Get all favorites for the current user (max 10)
    """
    favorites = await get_user_favorites(current_user)
    return FavoriteListResponse(favorites=favorites)

@favoriteRouter.get("/favorites/{movie_id}/check")
async def check_if_favorite(
    movie_id: int,
    current_user: int = Depends(get_current_user)
):
    """
    Check if a movie is in user's favorites
    """
    is_favorite = await is_movie_in_favorites(current_user, movie_id)
    return {"is_favorite": is_favorite}

@favoriteRouter.get("/favorites/count")
async def get_favorites_count_route(
    current_user: int = Depends(get_current_user)
):
    """
    Get the number of favorites for the current user
    """
    count = await get_favorites_count(current_user)
    return {"count": count}