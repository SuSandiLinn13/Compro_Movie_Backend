from databases import Database
import logging

POSTGRES_USER = "youwerehere"
POSTGRES_PASSWORD = "youwerehere"
POSTGRES_DB = "movie_db"
POSTGRES_HOST = "postgres"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

database = Database(DATABASE_URL)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DATABASE")

async def connect_db() -> None:
    await database.connect()
    logger.info("Database connected")

async def disconnect_db() -> None:
    await database.disconnect()
    logger.info("Database disconnected")

async def init_db() -> None:
    await _create_movies_table()
    await _create_users_table()
    await _create_favorites_table()
    await _create_recently_watched_table()
    await _create_comments_table()
    await _create_series_table()
    await _create_episodes_table()
    await _create_series_comments_table()
    logger.info("Database initialized successfully.")

async def _create_movies_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS movies (
        movie_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        director TEXT,
        genre TEXT[],
        casts TEXT[],
        release_date DATE,  -- CHANGED: released_date -> release_date
        is_published BOOLEAN DEFAULT TRUE,  -- CHANGED: available -> is_published
        created_at TIMESTAMP DEFAULT NOW(),
        poster_url TEXT,
        imdb_rating FLOAT,
        type TEXT DEFAULT 'movie'
    )
    """
    await database.execute(query=query)
    logger.info("Movies table created (or already exists).")

async def _create_users_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """
    await database.execute(query=query)
    logger.info("Users table created (or already exists).")

async def _create_favorites_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS favorites (
        favorite_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, movie_id)
    )
    """
    await database.execute(query=query)
    logger.info("Favorites table created (or already exists).")

async def _create_recently_watched_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS recently_watched (
        watch_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
        watched_at TIMESTAMP DEFAULT NOW()
    )
    """
    await database.execute(query=query)
    logger.info("Recently watched table created (or already exists).")

async def _create_comments_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS comments (
        comment_id SERIAL PRIMARY KEY,
        movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
    await database.execute(query=query)
    logger.info("Comments table created (or already exists).")

    # Create indexes for better performance
    index_queries = [
        "CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comments(movie_id)",
        "CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC)"
    ]
    
    for index_query in index_queries:
        try:
            await database.execute(query=index_query)
        except Exception as e:
            logger.warning(f"Could not create index {index_query}: {e}")

async def _create_series_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS series (
        series_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        director TEXT,
        genre TEXT[],
        casts TEXT[],
        release_date DATE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        poster_url TEXT,
        imdb_rating FLOAT,
        total_seasons INTEGER DEFAULT 1,
        total_episodes INTEGER DEFAULT 1
    )
    """
    await database.execute(query=query)
    logger.info("Series table created (or already exists).")

async def _create_episodes_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS episodes (
        episode_id SERIAL PRIMARY KEY,
        series_id INTEGER NOT NULL REFERENCES series(series_id) ON DELETE CASCADE,
        season_number INTEGER NOT NULL,
        episode_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        duration INTEGER,  -- in minutes
        release_date DATE,
        video_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(series_id, season_number, episode_number)
    )
    """
    await database.execute(query=query)
    logger.info("Episodes table created (or already exists).")

    # Create indexes for better performance
    index_queries = [
        "CREATE INDEX IF NOT EXISTS idx_episodes_series_id ON episodes(series_id)",
        "CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(series_id, season_number)",
        "CREATE INDEX IF NOT EXISTS idx_episodes_created_at ON episodes(created_at DESC)"
    ]
    
    for index_query in index_queries:
        try:
            await database.execute(query=index_query)
        except Exception as e:
            logger.warning(f"Could not create index {index_query}: {e}")

async def _create_series_comments_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS series_comments (
        comment_id SERIAL PRIMARY KEY,
        series_id INTEGER NOT NULL REFERENCES series(series_id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
    await database.execute(query=query)
    logger.info("Series comments table created (or already exists).")

    # Create indexes for better performance
    index_queries = [
        "CREATE INDEX IF NOT EXISTS idx_series_comments_series_id ON series_comments(series_id)",
        "CREATE INDEX IF NOT EXISTS idx_series_comments_user_id ON series_comments(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_series_comments_created_at ON series_comments(created_at DESC)"
    ]
    
    for index_query in index_queries:
        try:
            await database.execute(query=index_query)
        except Exception as e:
            logger.warning(f"Could not create index {index_query}: {e}")

