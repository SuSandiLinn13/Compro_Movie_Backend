# from fastapi.security import OAuth2PasswordBearer
from fastapi.security import APIKeyHeader
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

SECRET_KEY = "kmitl_rai7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Make sure the tokenUrl matches your signin endpoint
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/signin")
oauth2_scheme = APIKeyHeader(name="Authorization", auto_error=False)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AUTH")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, remember_me: bool = False):
    to_encode = data.copy()
    if remember_me:
        logger.info("Remember me is enabled, setting longer token expiry")
        expire = datetime.utcnow() + timedelta(days=30)
    else:
        logger.info("Standard login, setting default token expiry")
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token or not token.startswith("Bearer "):
        raise credentials_exception

    try:
        payload = jwt.decode(token.split("Bearer ")[1], SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return int(user_id)
    except JWTError:
        raise credentials_exception

    

