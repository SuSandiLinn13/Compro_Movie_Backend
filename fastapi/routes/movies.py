# fastapi/routes/movies.py

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
    values = {
        "title": movie.title,
        "description": movie.description,
        "director": movie.director,
        "genre": movie.genre,   # store as array or JSON in DB
        "casts": movie.casts,   # store as array or JSON in DB
        "released_date": movie.released_date,
        "poster_url": movie.poster_url,
        
    }

    movie_id = await insert_movie(values)

    return MovieResponse(
        message="Movie created successfully",
        movie_id=movie_id,
        title=movie.title,
        director=movie.director
    )



# def format_movie(row) -> dict:
#     return {
#         "movie_id": row["movie_id"],
#         "title": row["title"],
#         "description": row["description"],
#         "director": row.get("director"),
#         "genre": row.get("genre", []),
#         "casts": row.get("casts", []),
#         "released_date": row.get("released_date"),
#         "poster_url": row.get("poster_url"),
#     }

def format_movie(row) -> dict:
    return {
        "movie_id": row["movie_id"],
        "title": row["title"],
        "description": row["description"],
        "director": row.get("director") or "",
        "genre": list(row.get("genre") or []),  # ensure list
        "casts": list(row.get("casts") or []),  # ensure list
        "released_date": row.get("released_date"),
        "available": row.get("available", True),
        "created_at": row.get("created_at"),
        "poster_url": row.get("poster_url") or "",
        "imdb_rating": row.get("imdb_rating") or 0.0,  
        "type": row.get("type") or "movie",            
    }



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
                logger.error(f"{action} - Unexpected error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error while {action.lower()}.",
                )
        return wrapper
    return decorator

# @movieRouter.get("/movies", response_model=MovieListResponse)
# @handle_route_errors("Fetching all movies...")
# async def show_all_movies_route():
#     data = await get_all_movies()
#     movies = [format_movie(row) for row in data]
#     return MovieListResponse(movies = [MovieListItem(**movie) for movie in movies])

@movieRouter.get("/movies", response_model=MovieListResponse)
@handle_route_errors("Fetching all movies...")
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

@movieRouter.get("/movie/{movie_id}", response_model = MovieDetailResponse)
@handle_route_errors("Fetching movie details.....")
async def get_movie_details_route(
    # movie_id: int, current_user: str = Depends(get_current_user)
    movie_id: int
):
    movie = await get_movie_by_id(movie_id)
    if not movie:
        logger.warning(f"Movie with ID {movie_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found"
        ) 
    return MovieDetailResponse(movie_detail=Movie(**movie))

@movieRouter.post("/update", response_model=MovieResponse)
@handle_route_errors("updating movie")
async def update_movie_route(
    update: MovieUpdate = Body(...)
):
    if not update.movie_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="movie_id is required"
        )
    updated_movie = await update_movie(
        update.movie_id,
        update.title,
        update.description,
        update.director,
        update.genre,
        update.casts,
        update.released_date
    )


    if not update_movie:
        logger.warning(
            f"Movie with ID {update.movie_id} not found or no fields to update"
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found or no fields to update",
        )
    return MovieResponse(
        message = "Movie updated successfully", movie= Movie(**updated_movie)
    )

@movieRouter.delete("/remove/{movie_id}", response_model=MovieResponse)
@handle_route_errors("Deleting movie")
async def remove_movie_route(movie_id: int):
    deleted_movie = await delete_movie(movie_id)
    if not deleted_movie:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND, detail="Movie not found"
        )
    return MovieResponse(
        message="Movie deleted successfully", movie = Movie(**deleted_movie)
    )


@movieRouter.get("/genres", response_model=list[str])
@handle_route_errors("Fetching all genres...")
async def show_all_genres():
    return await get_all_genres()


# @movieRouter.get("/genres/{genre_name}", response_model=MovieListResponse)
# @handle_route_errors("Fetching movies by genre...")
# async def show_movies_by_genre(genre_name: str):
#     data = await get_movies_by_genre(genre_name)
#     movies = [format_movie(row) for row in data]
#     return MovieListResponse(movies=[MovieListItem(**movie) for movie in movies])

@movieRouter.get("/genres/{genre_name}", response_model=MovieListResponse)
@handle_route_errors("Fetching movies by genre...")
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
async def movies_only():
    return await get_movies_only()

@movieRouter.get("/seriesonly")
async def series_only():
    return await get_series_only()

@movieRouter.get("/imdb")
async def top_imdb():
    return await get_top_imdb()


