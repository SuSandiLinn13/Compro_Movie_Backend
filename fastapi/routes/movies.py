# # fastapi/routes/movies.py

# from fastapi import APIRouter, HTTPException, status, Depends, Body
# from fastapi.exceptions import RequestValidationError
# from models.movies import *
# from queries.movies import *
# import logging
# import traceback

# from functools import wraps
# from auth.auth import get_current_user

# movieRouter = APIRouter(tags=["movies"])
# logger = logging.getLogger("movies route")
# logging.basicConfig(level=logging.INFO)

# @movieRouter.post("/movies", response_model=MovieResponse)
# async def create_movie(
#     movie: MovieCreate,
#     current_user: int = Depends(get_current_user)  # Authorization required
# ):
#     # Validate required fields
#     if not movie.title:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Title is required"
#         )
    
#     # Prepare values with defaults for None values
#     values = {
#         "title": movie.title,
#         "description": movie.description or "",
#         "director": movie.director or "",
#         "genre": movie.genre or [],
#         "casts": movie.casts or [],
#         "released_date": movie.released_date,
#         "poster_url": movie.poster_url or "",
#     }

#     try:
#         movie_id = await insert_movie(values)
        
#         return MovieResponse(
#             message="Movie created successfully",
#             movie_id=movie_id,
#             title=movie.title,
#             director=movie.director or "Unknown"
#         )
#     except Exception as e:
#         logger.error(f"Error creating movie: {str(e)}")
#         logger.error(traceback.format_exc())
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to create movie"
#         )

# def format_movie(row) -> dict:
#     try:
#         # Safely handle missing fields with defaults
#         return {
#             "movie_id": row.get("movie_id"),
#             "title": row.get("title", ""),
#             "description": row.get("description", ""),
#             "director": row.get("director", ""),
#             "genre": list(row.get("genre", []) or []),
#             "casts": list(row.get("casts", []) or []),
#             "released_date": row.get("released_date"),
#             "available": bool(row.get("available", True)),
#             "created_at": row.get("created_at"),
#             "poster_url": row.get("poster_url", ""),
#             "imdb_rating": float(row.get("imdb_rating", 0.0)) if row.get("imdb_rating") is not None else 0.0,
#             "type": row.get("type", "movie"),
#         }
#     except Exception as e:
#         logger.error(f"Error formatting movie row: {e}")
#         logger.error(f"Problematic row: {dict(row)}")
#         raise

# def handle_route_errors(action: str):
#     def decorator(func):
#         @wraps(func)
#         async def wrapper(*args, **kwargs):
#             try: 
#                 return await func(*args, **kwargs)
#             except (HTTPException, RequestValidationError) as e:
#                 logger.error(f"{action} - Request/HTTP error: {e}")
#                 logger.error(traceback.format_exc()) 
#                 raise
#             except Exception as e:
#                 logger.error(f"{action} - Unexpected error: {str(e)}")
#                 logger.error(f"{action} - Error type: {type(e).__name__}")
#                 logger.error(traceback.format_exc())
#                 raise HTTPException(
#                     status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                     detail=f"Error while {action.lower()}.",
#                 )
#         return wrapper
#     return decorator

# @movieRouter.get("/movies", response_model=MovieListResponse)
# @handle_route_errors("Fetching all movies")
# async def show_all_movies_route():  # No authorization required
#     data = await get_all_movies()
#     movies = [format_movie(row) for row in data]
#     return MovieListResponse(
#         movies=[
#             MovieListItem(
#                 id=movie["movie_id"],
#                 title=movie["title"],
#                 description=movie["description"],
#                 genre=movie["genre"],
#                 poster_url=movie["poster_url"],
#                 imdb_rating=movie["imdb_rating"],  
#                 type=movie["type"],                
#             )
#             for movie in movies
#         ]
#     )

# @movieRouter.get("/movie/{movie_id}", response_model=MovieDetailResponse)
# @handle_route_errors("Fetching movie details")
# async def get_movie_details_route(movie_id: int):  # No authorization required
#     logger.info(f"Fetching movie with ID: {movie_id}")
    
#     try:
#         movie = await get_movie_by_id(movie_id)
#         if not movie:
#             logger.warning(f"Movie with ID {movie_id} not found")
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND, 
#                 detail="Movie not found"
#             )
        
#         logger.info(f"Movie found: {movie.get('title')}")
        
#         # Format the movie data to ensure all fields are properly handled
#         formatted_movie = format_movie(movie)
#         return MovieDetailResponse(movie_detail=Movie(**formatted_movie))
        
#     except Exception as e:
#         logger.error(f"Error in get_movie_details_route: {str(e)}")
#         logger.error(traceback.format_exc())
#         raise

# @movieRouter.put("/movies/{movie_id}", response_model=MovieResponse)
# @handle_route_errors("updating movie")
# async def update_movie_route(
#     movie_id: int,  # This comes from the URL path
#     update: MovieUpdate,  # This no longer contains movie_id
#     current_user: int = Depends(get_current_user)
# ):
#     updated_movie = await update_movie(
#         movie_id,  # Use the path parameter
#         update.title,
#         update.description,
#         update.director,
#         update.genre,
#         update.casts,
#         update.released_date,
#         update.poster_url
#     )

#     if not updated_movie:
#         logger.warning(f"Movie with ID {movie_id} not found or no fields to update")
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Movie not found or no fields to update",
#         )
    
#     # Convert Record to dict before using .get()
#     updated_movie_dict = dict(updated_movie)
    
#     return MovieResponse(
#         message="Movie updated successfully",
#         movie_id=movie_id,
#         title=updated_movie_dict.get("title"),
#         director=updated_movie_dict.get("director")
#     )

# @movieRouter.delete("/movies/{movie_id}", response_model=MovieResponse)
# @handle_route_errors("Deleting movie")
# async def remove_movie_route(
#     movie_id: int,
#     current_user: int = Depends(get_current_user)
# ):
#     deleted_movie = await delete_movie(movie_id)
#     if not deleted_movie:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, 
#             detail="Movie not found"
#         )
    
#     deleted_movie_dict = dict(deleted_movie)
    
#     return MovieResponse(
#         message="Movie deleted successfully", 
#         movie_id=movie_id,
#         title=deleted_movie_dict.get("title")
#     )
# @movieRouter.get("/genres", response_model=list[str])
# @handle_route_errors("Fetching all genres")
# async def show_all_genres():  # No authorization required
#     return await get_all_genres()

# @movieRouter.get("/genres/{genre_name}", response_model=MovieListResponse)
# @handle_route_errors("Fetching movies by genre")
# async def show_movies_by_genre(genre_name: str):  # No authorization required
#     data = await get_movies_by_genre(genre_name)
#     movies = [format_movie(row) for row in data]
#     return MovieListResponse(
#         movies=[
#             MovieListItem(
#                 id=movie["movie_id"],
#                 title=movie["title"],
#                 description=movie["description"],
#                 genre=movie["genre"],
#                 poster_url=movie["poster_url"],
#                 imdb_rating=movie["imdb_rating"],  
#                 type=movie["type"],                
#             )
#             for movie in movies
#         ]
#     )

# @movieRouter.get("/moviesonly")
# @handle_route_errors("Fetching movies only")
# async def movies_only():  # No authorization required
#     return await get_movies_only()

# @movieRouter.get("/seriesonly")
# @handle_route_errors("Fetching series only")
# async def series_only():  # No authorization required
#     return await get_series_only()

# @movieRouter.get("/imdb")
# @handle_route_errors("Fetching top IMDB")
# async def top_imdb():  # No authorization required
#     return await get_top_imdb()

from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.exceptions import RequestValidationError
from models.movies import *
from queries.movies import *
import logging
import traceback

from functools import wraps
from auth.auth import get_current_user

movieRouter = APIRouter(tags=["movies"])
logger = logging.getLogger("movies route")
logging.basicConfig(level=logging.INFO)

@movieRouter.post("/movies", response_model=MovieResponse)
async def create_movie(
    movie: MovieCreate,
    current_user: int = Depends(get_current_user)
):
    if not movie.title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )
    
    values = {
        "title": movie.title,
        "description": movie.description or "",
        "director": movie.director or "",
        "genre": movie.genre or [],
        "casts": movie.casts or [],
        "release_date": movie.release_date, 
        "poster_url": movie.poster_url or "",
    }

    try:
        movie_id = await insert_movie(values)
        
        return MovieResponse(
            message="Movie created successfully",
            movie_id=movie_id,
            title=movie.title,
            director=movie.director or "Unknown"
        )
    except Exception as e:
        logger.error(f"Error creating movie: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create movie"
        )

def format_movie(row) -> dict:
    try:
        return {
            "movie_id": row.get("movie_id"),
            "title": row.get("title", ""),
            "description": row.get("description", ""),
            "director": row.get("director", ""),
            "genre": list(row.get("genre", []) or []),
            "casts": list(row.get("casts", []) or []),  
            "release_date": row.get("release_date"),  # Changed from released_date to release_date
            "is_published": bool(row.get("is_published", True)),  # Changed from available to is_published
            "created_at": row.get("created_at"),
            "poster_url": row.get("poster_url", ""),
            "imdb_rating": float(row.get("imdb_rating", 0.0)) if row.get("imdb_rating") is not None else 0.0,
            "type": row.get("type", "movie"),
        }
    except Exception as e:
        logger.error(f"Error formatting movie row: {e}")
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

@movieRouter.get("/movies", response_model=MovieListResponse)
@handle_route_errors("Fetching all movies")
async def show_all_movies_route():
    data = await get_all_movies()
    movies = [format_movie(row) for row in data]
    return MovieListResponse(
        movies=[
            MovieListItem(
                id=movie["movie_id"],
                title=movie["title"],
                description=movie["description"],
                genre=movie["genre"],
                poster_url=movie["poster_url"],
                imdb_rating=movie["imdb_rating"],  
                type=movie["type"],                
            )
            for movie in movies
        ]
    )

@movieRouter.get("/movie/{movie_id}", response_model=MovieDetailResponse)
@handle_route_errors("Fetching movie details")
async def get_movie_details_route(movie_id: int):
    logger.info(f"Fetching movie with ID: {movie_id}")
    
    try:
        movie = await get_movie_by_id(movie_id)
        if not movie:
            logger.warning(f"Movie with ID {movie_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Movie not found"
            )
        
        logger.info(f"Movie found: {movie.get('title')}")
        
        formatted_movie = format_movie(movie)
        return MovieDetailResponse(movie_detail=Movie(**formatted_movie))
        
    except Exception as e:
        logger.error(f"Error in get_movie_details_route: {str(e)}")
        logger.error(traceback.format_exc())
        raise

@movieRouter.put("/movies/{movie_id}", response_model=MovieResponse)
@handle_route_errors("updating movie")
async def update_movie_route(
    movie_id: int,
    update: MovieUpdate,
    current_user: int = Depends(get_current_user)
):
    updated_movie = await update_movie(
        movie_id,
        update.title,
        update.description,
        update.director,
        update.genre,
        update.casts, 
        update.release_date,
        update.poster_url
    )

    if not updated_movie:
        logger.warning(f"Movie with ID {movie_id} not found or no fields to update")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found or no fields to update",
        )
    
    # Convert Record to dict before using .get()
    updated_movie_dict = dict(updated_movie)
    
    return MovieResponse(
        message="Movie updated successfully",
        movie_id=movie_id,
        title=updated_movie_dict.get("title"),
        director=updated_movie_dict.get("director")
    )

@movieRouter.delete("/movies/{movie_id}", response_model=MovieResponse)
@handle_route_errors("Deleting movie")
async def remove_movie_route(
    movie_id: int,
    current_user: int = Depends(get_current_user)
):
    deleted_movie = await delete_movie(movie_id)
    if not deleted_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Movie not found"
        )
    
    # Convert Record to dict before using .get()
    deleted_movie_dict = dict(deleted_movie)
    
    return MovieResponse(
        message="Movie deleted successfully", 
        movie_id=movie_id,
        title=deleted_movie_dict.get("title")
    )

@movieRouter.get("/genres", response_model=list[str])
@handle_route_errors("Fetching all genres")
async def show_all_genres():
    return await get_all_genres()

@movieRouter.get("/genres/{genre_name}", response_model=MovieListResponse)
@handle_route_errors("Fetching movies by genre")
async def show_movies_by_genre(genre_name: str):
    data = await get_movies_by_genre(genre_name)
    movies = [format_movie(row) for row in data]
    return MovieListResponse(
        movies=[
            MovieListItem(
                id=movie["movie_id"],
                title=movie["title"],
                description=movie["description"],
                genre=movie["genre"],
                poster_url=movie["poster_url"],
                imdb_rating=movie["imdb_rating"],  
                type=movie["type"],                
            )
            for movie in movies
        ]
    )

@movieRouter.get("/moviesonly")
@handle_route_errors("Fetching movies only")
async def movies_only():
    return await get_movies_only()

@movieRouter.get("/seriesonly")
@handle_route_errors("Fetching series only")
async def series_only():
    return await get_series_only()

@movieRouter.get("/imdb")
@handle_route_errors("Fetching top IMDB")
async def top_imdb():
    return await get_top_imdb()