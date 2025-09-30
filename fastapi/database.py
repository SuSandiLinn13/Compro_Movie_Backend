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

# -------------------
# Table creation
# -------------------
async def init_db() -> None:
    await _create_movies_table()
    await _create_users_table()
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
        released_date DATE,
        available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
    )
    """
    await database.execute(query=query)
    logger.info("Movies table created (or already exists).")


# async def _create_users_table()-> None:
#     query = """"
#     CREATE TABLE IF NOT EXISTS users (
#         id SERIAL PRIMARY KEY,
#         username TEXT UNIQUE NOT NULL,
#         email TEXT UNIQUE NOT NULL,
#         password TEXT NOT NULL  
#     )
#     """
#     await database.execute(query=query)
#     logger.info("Users table created (or already exists).")

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