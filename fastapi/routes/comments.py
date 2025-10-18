from fastapi import APIRouter, HTTPException, status, Depends
from models.comments import *
from queries.comments import *
from auth.auth import get_current_user
import logging
import traceback

commentRouter = APIRouter(tags=["comments"])
logger = logging.getLogger("comments route")

@commentRouter.post("/comments", response_model=CommentResponse)
async def create_comment(
    comment: CommentCreate,
    current_user: int = Depends(get_current_user)  # Changed back to int
):
    try:
        # Validate content
        if not comment.content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Comment content cannot be empty"
            )

        # Check if movie exists
        movie_exists = await check_movie_exists(comment.movie_id)
        if not movie_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )

        # Create comment - current_user is now the user_id (int)
        comment_id = await insert_comment(
            movie_id=comment.movie_id,
            user_id=current_user,  # Directly use the integer user_id
            content=comment.content.strip()
        )

        # Fetch the created comment with user info
        new_comment = await get_comment_by_id(comment_id)
        if not new_comment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create comment"
            )

        return CommentResponse(**new_comment)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating comment: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create comment"
        )

@commentRouter.get("/movies/{movie_id}/comments", response_model=CommentListResponse)
async def get_movie_comments(
    movie_id: int,
    current_user: int = Depends(get_current_user)  # Changed back to int
):
    try:
        # Check if movie exists
        movie_exists = await check_movie_exists(movie_id)
        if not movie_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movie not found"
            )

        comments = await get_comments_by_movie(movie_id)
        return CommentListResponse(comments=comments)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching comments for movie {movie_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch comments"
        )

@commentRouter.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment_route(
    comment_id: int,
    comment_update: CommentUpdate,
    current_user: int = Depends(get_current_user)  # Changed back to int
):
    try:
        # Check if comment exists and user owns it
        existing_comment = await get_comment_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )

        # current_user is the user_id (int)
        if existing_comment["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this comment"
            )

        if not comment_update.content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Comment content cannot be empty"
            )

        updated_comment = await update_comment(comment_id, comment_update.content.strip())
        if not updated_comment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update comment"
            )

        # Fetch updated comment with user info
        final_comment = await get_comment_by_id(comment_id)
        return CommentResponse(**final_comment)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating comment {comment_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update comment"
        )

@commentRouter.delete("/comments/{comment_id}", response_model=CommentDeleteResponse)
async def delete_comment_route(
    comment_id: int,
    current_user: int = Depends(get_current_user)  # Changed back to int
):
    try:
        # Check if comment exists and user owns it
        existing_comment = await get_comment_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )

        # current_user is the user_id (int)
        if existing_comment["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this comment"
            )

        success = await delete_comment(comment_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete comment"
            )

        return CommentDeleteResponse(
            message="Comment deleted successfully",
            comment_id=comment_id
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting comment {comment_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete comment"
        )