from fastapi import APIRouter, HTTPException, status, Depends
from models.comment_series import *
from queries.comment_series import *
from auth.auth import get_current_user
import logging
import traceback

seriesCommentRouter = APIRouter(tags=["series-comments"])
logger = logging.getLogger("series comments route")

@seriesCommentRouter.post("/series-comments", response_model=SeriesCommentResponse)
async def create_series_comment(
    comment: SeriesCommentCreate,
    current_user: int = Depends(get_current_user)
):
    try:
        # Validate content
        if not comment.content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Comment content cannot be empty"
            )

        # Check if series exists
        series_exists = await check_series_exists(comment.series_id)
        if not series_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Series not found"
            )

        # Create comment
        comment_id = await insert_series_comment(
            series_id=comment.series_id,
            user_id=current_user,
            content=comment.content.strip()
        )

        # Fetch the created comment with user info
        new_comment = await get_series_comment_by_id(comment_id)
        if not new_comment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create comment"
            )

        return SeriesCommentResponse(**new_comment)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating series comment: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create comment"
        )

@seriesCommentRouter.get("/series/{series_id}/comments", response_model=SeriesCommentListResponse)
async def get_series_comments(
    series_id: int,
    current_user: int = Depends(get_current_user)
):
    try:
        # Check if series exists
        series_exists = await check_series_exists(series_id)
        if not series_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Series not found"
            )

        comments = await get_comments_by_series(series_id)
        return SeriesCommentListResponse(comments=comments)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching comments for series {series_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch comments"
        )

@seriesCommentRouter.put("/series-comments/{comment_id}", response_model=SeriesCommentResponse)
async def update_series_comment_route(
    comment_id: int,
    comment_update: SeriesCommentUpdate,
    current_user: int = Depends(get_current_user)
):
    try:
        # Check if comment exists and user owns it
        existing_comment = await get_series_comment_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )

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

        updated_comment = await update_series_comment(comment_id, comment_update.content.strip())
        if not updated_comment:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update comment"
            )

        # Fetch updated comment with user info
        final_comment = await get_series_comment_by_id(comment_id)
        return SeriesCommentResponse(**final_comment)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating series comment {comment_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update comment"
        )

@seriesCommentRouter.delete("/series-comments/{comment_id}", response_model=SeriesCommentDeleteResponse)
async def delete_series_comment_route(
    comment_id: int,
    current_user: int = Depends(get_current_user)
):
    try:
        # Check if comment exists and user owns it
        existing_comment = await get_series_comment_by_id(comment_id)
        if not existing_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found"
            )

        if existing_comment["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this comment"
            )

        success = await delete_series_comment(comment_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete comment"
            )

        return SeriesCommentDeleteResponse(
            message="Comment deleted successfully",
            comment_id=comment_id
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting series comment {comment_id}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete comment"
        )