"""Example usage of JWT authentication."""

from typing import Annotated

from fastapi import APIRouter, Depends

from .dependencies import get_current_user_id, get_optional_user_id

router = APIRouter()


@router.get("/protected")
async def protected_route(
    user_id: Annotated[str, Depends(get_current_user_id)],
) -> dict:
    """
    Protected route that requires authentication.
    
    Args:
        user_id: Current user ID from JWT token
        
    Returns:
        Response with user ID
    """
    return {"user_id": user_id, "message": "This is a protected route"}


@router.get("/optional-auth")
async def optional_auth_route(
    user_id: Annotated[str | None, Depends(get_optional_user_id)],
) -> dict:
    """
    Route that supports optional authentication.
    
    Args:
        user_id: Current user ID from JWT token, if present
        
    Returns:
        Response with user ID if authenticated
    """
    if user_id:
        return {"user_id": user_id, "message": "You are authenticated"}
    return {"message": "You are not authenticated"} 