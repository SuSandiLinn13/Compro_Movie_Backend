from typing import Any, Optional
from database import database
from auth.auth import hash_password


# Add a new user or return error if username/email already exists
async def add_user(username: str, email: str, password: str) -> dict[str, Any]:
    # Check if username or email already exists
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
    values = {
        "username": username,
        "email": email,
        # "password": password
        "password": hashed_password,
    }
    return await database.fetch_one(query=query, values=values)


# Get user by username (for authentication)
async def get_user_by_username(username: str) -> Optional[dict[str, Any]]:
    query = "SELECT id, username, email, password FROM users WHERE username = :username"
    return await database.fetch_one(query=query, values={"username": username})


# # Update user details (optional fields)
# async def update_user(
#     user_id: int,
#     username: Optional[str] = None,
#     email: Optional[str] = None,
#     password: Optional[str] = None,
# ) -> Optional[dict[str, Any]]:
#     updates: list[str] = []
#     values: dict[str, Any] = {"user_id": user_id}

#     if username is not None:
#         updates.append("username = :username")
#         values["username"] = username
#     if email is not None:
#         updates.append("email = :email")
#         values["email"] = email
#     if password is not None:
#         hashed_password = hash_password(password)
#         updates.append("password = :password")
#         values["password"] = hashed_password

#     if not updates:
#         return {"error": "No update data provided"}  # could also raise an exception

#     set_clause = ", ".join(updates)
#     query = f"""
#     UPDATE users
#     SET {set_clause}
#     WHERE id = :user_id
#     RETURNING id, username, email
#     """
#     return await database.fetch_one(query=query, values=values)


# Delete user by ID
async def delete_user(user_id: int) -> Optional[dict[str, Any]]:
    query = "DELETE FROM users WHERE id = :user_id RETURNING id, username, email"
    return await database.fetch_one(query=query, values={"user_id": user_id})


# Truncate the users table (reset identities)
async def truncate_users_table() -> None:
    query = "TRUNCATE TABLE users RESTART IDENTITY CASCADE"
    await database.execute(query=query)