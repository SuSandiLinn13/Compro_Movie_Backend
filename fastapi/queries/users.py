from typing import Any, Optional
from database import database
from auth.auth import hash_password
import logging

logger = logging.getLogger("user_queries")


# ✅ Add a new user
async def add_user(username: str, email: str, password: str) -> dict[str, Any]:
    existing_user_query = """
    SELECT 1 FROM users WHERE username = :username OR email = :email
    """
    result = await database.fetch_one(
        query=existing_user_query,
        values={"username": username, "email": email},
    )
    if result:
        return {"error": "Username or email already exists"}

    hashed_password = hash_password(password)
    query = """
    INSERT INTO users (username, email, password)
    VALUES (:username, :email, :password)
    RETURNING id, username, email
    """
    values = {"username": username, "email": email, "password": hashed_password}

    try:
        new_user = await database.fetch_one(query=query, values=values)
        if new_user:
            return dict(new_user)  # ✅ convert to plain dict
        return {"error": "User creation failed"}
    except Exception as e:
        logger.error(f"Error inserting user: {e}")
        return {"error": "Failed to add user"}    

# ✅ Get user by username (for authentication)
async def get_user_by_username(username: str) -> Optional[dict[str, Any]]:
    query = "SELECT id, username, email, password FROM users WHERE username = :username"
    result = await database.fetch_one(query=query, values={"username": username})
    return dict(result) if result else None


# ✅ Get user by ID
async def get_user_by_id(user_id: int) -> Optional[dict[str, Any]]:
    query = "SELECT id, username, email, password FROM users WHERE id = :user_id"
    result = await database.fetch_one(query=query, values={"user_id": user_id})
    return dict(result) if result else None


# ✅ Update user (optional)
async def update_user(
    user_id: int,
    username: Optional[str] = None,
    email: Optional[str] = None,
    password: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    updates: list[str] = []
    values: dict[str, Any] = {"user_id": user_id}

    if username:
        updates.append("username = :username")
        values["username"] = username
    if email:
        updates.append("email = :email")
        values["email"] = email
    if password:
        hashed_password = hash_password(password)
        updates.append("password = :password")
        values["password"] = hashed_password

    if not updates:
        return {"error": "No update data provided"}

    set_clause = ", ".join(updates)
    query = f"""
    UPDATE users
    SET {set_clause}
    WHERE id = :user_id
    RETURNING id, username, email
    """
    result = await database.fetch_one(query=query, values=values)
    return dict(result) if result else None


# ✅ Delete user (works on any DB)
async def delete_user(user_id: int) -> Optional[dict[str, Any]]:
    try:
        # Check if user exists
        query = "SELECT id, username, email FROM users WHERE id = :user_id"
        user = await database.fetch_one(query=query, values={"user_id": user_id})
        if not user:
            logger.warning(f"User {user_id} not found for deletion")
            return None

        # Delete the user
        try:
            delete_query = "DELETE FROM users WHERE id = :user_id RETURNING id, username, email"
            deleted_user = await database.fetch_one(
                query=delete_query, values={"user_id": user_id}
            )
        except Exception:
            # For databases that don't support RETURNING
            delete_query = "DELETE FROM users WHERE id = :user_id"
            await database.execute(query=delete_query, values={"user_id": user_id})
            deleted_user = user

        logger.info(f"User {user_id} deleted successfully")
        return dict(deleted_user)

    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        return None


# ✅ Truncate table
async def truncate_users_table() -> None:
    query = "TRUNCATE TABLE users RESTART IDENTITY CASCADE"
    await database.execute(query=query)

async def get_user_by_email(email: str) -> Optional[dict[str, Any]]:
    query = "SELECT id, username, email, password FROM users WHERE email = :email"
    result = await database.fetch_one(query=query, values={"email": email})
    return dict(result) if result else None