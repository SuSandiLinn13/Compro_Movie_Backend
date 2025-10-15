from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models.users import *
from queries.users import *
import logging
from auth.auth import verify_password, create_access_token, get_current_user
from database import database
from passlib.hash import bcrypt

userRouter = APIRouter(tags=["users"])
logger = logging.getLogger("users route")
logging.basicConfig(level=logging.INFO)

@userRouter.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    logger.info("User Registeration")
    response = await add_user(user.username, user.email, user.password)
    if "error" in response:
        logger.warning(response['error'])
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST, detail=response['error'] 
        )
    return UserOut(**response)

# @userRouter.post("/signin", response_model=TokenResponse)
# async def signin_user(user: UserLogin):
#     logger.info("Log in user .......")
#     user_data = await get_user_by_username(user.username)
#     if not user_data:
#         logger.warning("User not found....")
#         raise HTTPException(
#             status_code = status.HTTP_401_UNAUTHORIZED, detail='user not found'
#         )
#     if not verify_password(user.password, user_data["password"]):
#         logger.warning("Invalid Credentials...")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
#         )
#     access_token = create_access_token(
#         data = {"sub": str(user_data["id"])}, remember_me= user.remember_me
#     )
#     logger.info(f"Login successful for {user_data['id']}")
#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "username": user_data["username"],
#     }

@userRouter.post("/signout")
async def signout_user(current_user: int = Depends(get_current_user)):
    logger.info(f"User {current_user} signed out successfully")
    return {"message": "User signed out successfully"}



@userRouter.post("/login")
async def login_user(user: UserLogin):
    # find user by email
    query = "SELECT * FROM users WHERE email = :email"
    existing_user = await database.fetch_one(query, {"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # check password match
    if not bcrypt.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "message": "Login successful",
        "user": {
            "id": existing_user["id"],
            "username": existing_user["username"],
            "email": existing_user["email"],
        },
    }

@userRouter.get("/users/me", response_model=UserOut)
async def get_logged_in_user(current_user: dict = Depends(get_current_user)):
    """
    Return the currently logged-in user's information.
    The get_current_user function will decode the JWT token and identify the user.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user = await get_user_by_id(current_user["id"])

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # remove password before returning
    user.pop("password", None)

    return user