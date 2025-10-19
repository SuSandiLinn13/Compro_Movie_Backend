from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.exceptions import RequestValidationError
from models.series import *
from queries.series import *
import logging
import traceback

from functools import wraps
from auth.auth import get_current_user

seriesRouter = APIRouter(tags=["series"])
logger = logging.getLogger("series route")
logging.basicConfig(level=logging.INFO)

@seriesRouter.post("/series", response_model=SeriesResponse)
async def create_series(
    series: SeriesCreate,
    current_user: int = Depends(get_current_user)
):
    if not series.title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )
    
    values = {
        "title": series.title,
        "description": series.description or "",
        "director": series.director or "",
        "genre": series.genre or [],
        "casts": series.casts or [],
        "release_date": series.release_date,
        "poster_url": series.poster_url or "",
        "total_seasons": series.total_seasons or 1,
        "total_episodes": series.total_episodes or 1,
    }

    try:
        series_id = await insert_series(values)
        
        return SeriesResponse(
            message="Series created successfully",
            series_id=series_id,
            title=series.title,
            director=series.director or "Unknown"
        )
    except Exception as e:
        logger.error(f"Error creating series: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create series"
        )

def format_series(row) -> dict:
    try:
        return {
            "series_id": row.get("series_id"),
            "title": row.get("title", ""),
            "description": row.get("description", ""),
            "director": row.get("director", ""),
            "genre": list(row.get("genre", []) or []),
            "casts": list(row.get("casts", []) or []),
            "release_date": row.get("release_date"),
            "is_published": bool(row.get("is_published", True)),
            "created_at": row.get("created_at"),
            "poster_url": row.get("poster_url", ""),
            "imdb_rating": float(row.get("imdb_rating", 0.0)) if row.get("imdb_rating") is not None else 0.0,
            "total_seasons": row.get("total_seasons", 1),
            "total_episodes": row.get("total_episodes", 1),
        }
    except Exception as e:
        logger.error(f"Error formatting series row: {e}")
        logger.error(f"Problematic row: {dict(row)}")
        raise

def format_episode(row) -> dict:
    try:
        return {
            "episode_id": row.get("episode_id"),
            "series_id": row.get("series_id"),
            "season_number": row.get("season_number", 1),
            "episode_number": row.get("episode_number", 1),
            "title": row.get("title", ""),
            "description": row.get("description", ""),
            "duration": row.get("duration", 0),
            "release_date": row.get("release_date"),
            "video_url": row.get("video_url", ""),
            "created_at": row.get("created_at"),
        }
    except Exception as e:
        logger.error(f"Error formatting episode row: {e}")
        logger.error(f"Problematic row: {dict(row)}")
        raise

def handle_route_errors(action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try: 
                return await func(*args, **kwargs)
            except (HTTPException, RequestValidationError) as e:
                logger.error(f"{action} - Request/HTTP error: {e}")
                logger.error(traceback.format_exc()) 
                raise
            except Exception as e:
                logger.error(f"{action} - Unexpected error: {str(e)}")
                logger.error(f"{action} - Error type: {type(e).__name__}")
                logger.error(traceback.format_exc())
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error while {action.lower()}.",
                )
        return wrapper
    return decorator

@seriesRouter.get("/series", response_model=SeriesListResponse)
@handle_route_errors("Fetching all series")
async def show_all_series_route():
    data = await get_all_series()
    series_list = [format_series(row) for row in data]
    return SeriesListResponse(
        series=[
            SeriesListItem(
                id=series["series_id"],
                title=series["title"],
                description=series["description"],
                genre=series["genre"],
                poster_url=series["poster_url"],
                imdb_rating=series["imdb_rating"],
                total_seasons=series["total_seasons"],
                total_episodes=series["total_episodes"],
            )
            for series in series_list
        ]
    )

@seriesRouter.get("/series/{series_id}", response_model=SeriesDetailResponse)
@handle_route_errors("Fetching series details")
async def get_series_details_route(series_id: int):
    logger.info(f"Fetching series with ID: {series_id}")
    
    try:
        series = await get_series_by_id(series_id)
        if not series:
            logger.warning(f"Series with ID {series_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Series not found"
            )
        
        logger.info(f"Series found: {series.get('title')}")
        
        formatted_series = format_series(series)
        return SeriesDetailResponse(series_detail=Series(**formatted_series))
        
    except Exception as e:
        logger.error(f"Error in get_series_details_route: {str(e)}")
        logger.error(traceback.format_exc())
        raise

@seriesRouter.put("/series/{series_id}", response_model=SeriesResponse)
@handle_route_errors("updating series")
async def update_series_route(
    series_id: int,
    update: SeriesUpdate,
    current_user: int = Depends(get_current_user)
):
    updated_series = await update_series(
        series_id,
        update.title,
        update.description,
        update.director,
        update.genre,
        update.casts,
        update.release_date,
        update.poster_url,
        update.total_seasons,
        update.total_episodes
    )

    if not updated_series:
        logger.warning(f"Series with ID {series_id} not found or no fields to update")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Series not found or no fields to update",
        )
    
    updated_series_dict = dict(updated_series)
    
    return SeriesResponse(
        message="Series updated successfully",
        series_id=series_id,
        title=updated_series_dict.get("title"),
        director=updated_series_dict.get("director")
    )

@seriesRouter.delete("/series/{series_id}", response_model=SeriesResponse)
@handle_route_errors("Deleting series")
async def remove_series_route(
    series_id: int,
    current_user: int = Depends(get_current_user)
):
    deleted_series = await delete_series(series_id)
    if not deleted_series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Series not found"
        )
    
    deleted_series_dict = dict(deleted_series)
    
    return SeriesResponse(
        message="Series deleted successfully", 
        series_id=series_id,
        title=deleted_series_dict.get("title")
    )

# Episode routes
@seriesRouter.post("/episodes", response_model=EpisodeResponse)
async def create_episode(
    episode: EpisodeCreate,
    current_user: int = Depends(get_current_user)
):
    if not episode.title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )
    
    values = {
        "series_id": episode.series_id,
        "season_number": episode.season_number,
        "episode_number": episode.episode_number,
        "title": episode.title,
        "description": episode.description or "",
        "duration": episode.duration or 0,
        "release_date": episode.release_date,
        "video_url": episode.video_url or "",
    }

    try:
        episode_id = await insert_episode(values)
        
        return EpisodeResponse(
            message="Episode created successfully",
            episode_id=episode_id,
            title=episode.title
        )
    except Exception as e:
        logger.error(f"Error creating episode: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create episode"
        )

@seriesRouter.get("/series/{series_id}/episodes")
@handle_route_errors("Fetching episodes for series")
async def get_episodes_for_series(series_id: int):
    episodes = await get_episodes_by_series(series_id)
    return [format_episode(episode) for episode in episodes]

@seriesRouter.get("/series/{series_id}/seasons/{season_number}/episodes")
@handle_route_errors("Fetching episodes for season")
async def get_episodes_for_season(series_id: int, season_number: int):
    episodes = await get_episodes_by_season(series_id, season_number)
    return [format_episode(episode) for episode in episodes]

@seriesRouter.put("/episodes/{episode_id}", response_model=EpisodeResponse)
@handle_route_errors("updating episode")
async def update_episode_route(
    episode_id: int,
    update: EpisodeUpdate,
    current_user: int = Depends(get_current_user)
):
    updated_episode = await update_episode(
        episode_id,
        update.title,
        update.description,
        update.duration,
        update.release_date,
        update.video_url
    )

    if not updated_episode:
        logger.warning(f"Episode with ID {episode_id} not found or no fields to update")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Episode not found or no fields to update",
        )
    
    updated_episode_dict = dict(updated_episode)
    
    return EpisodeResponse(
        message="Episode updated successfully",
        episode_id=episode_id,
        title=updated_episode_dict.get("title")
    )

@seriesRouter.delete("/episodes/{episode_id}", response_model=EpisodeResponse)
@handle_route_errors("Deleting episode")
async def remove_episode_route(
    episode_id: int,
    current_user: int = Depends(get_current_user)
):
    deleted_episode = await delete_episode(episode_id)
    if not deleted_episode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Episode not found"
        )
    
    deleted_episode_dict = dict(deleted_episode)
    
    return EpisodeResponse(
        message="Episode deleted successfully", 
        episode_id=episode_id,
        title=deleted_episode_dict.get("title")
    )


# @seriesRouter.get("/seriesonly")
# @handle_route_errors("Fetching series only")
# async def series_only():
#     data = await get_series_only()
#     series_list = [format_series(row) for row in data]
#     return SeriesListResponse(
#         series=[
#             SeriesListItem(
#                 id=series["series_id"],
#                 title=series["title"],
#                 description=series["description"],
#                 genre=series["genre"],
#                 poster_url=series["poster_url"],
#                 imdb_rating=series["imdb_rating"],
#                 total_seasons=series["total_seasons"],
#                 total_episodes=series["total_episodes"],
#             )
#             for series in series_list
#         ]
#     )


@seriesRouter.get("/seriesonly")
@handle_route_errors("Fetching series only")
async def series_only():
    try:
        logger.info("Fetching all series...")
        data = await get_series_only()
        logger.info(f"Retrieved {len(data)} series from database")
        
        series_list = [format_series(row) for row in data]
        
        response = SeriesListResponse(
            series=[
                SeriesListItem(
                    id=series["series_id"],
                    title=series["title"],
                    description=series["description"],
                    genre=series["genre"],
                    poster_url=series["poster_url"],
                    imdb_rating=series["imdb_rating"],
                    total_seasons=series["total_seasons"],
                    total_episodes=series["total_episodes"],
                )
                for series in series_list
            ]
        )
        return response
        
    except Exception as e:
        logger.error(f"Error in series_only endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch series: {str(e)}"
        )