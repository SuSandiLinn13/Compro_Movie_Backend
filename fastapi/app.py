from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from routes.movies import movieRouter
from routes.users import userRouter
from routes.favorites import favoriteRouter
from database import connect_db, disconnect_db, init_db
from typing import Optional
# Comment out the problematic import for now
# from routes.recently_watched import recentlyWatchedRouter

# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
appRouter = APIRouter()
# app.include_router(recentlyWatchedRouter)  # Comment this out for now

@appRouter.get("/")
def read_root():
    return {"message": "Hello from FastAPI with Router + CORS!"}

@appRouter.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "query": q}

@appRouter.post("/echo")
def echo_data(data: dict):
    return {"you_sent": data}

# app.include_router(appRouter, tags=["app"])
app.include_router(movieRouter)
app.include_router(userRouter)
app.include_router(favoriteRouter)

@app.on_event("startup")
async def startup():
    await connect_db()
    await init_db()

@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()