"""JWT dependencies for FastAPI."""

from typing import Annotated, Optional

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from starlette import status

from .utils import decode_token

security = HTTPBearer(auto_error=True)
optional_security = HTTPBearer(auto_error=False)


async def get_token_payload(
    credentials: Annotated[HTTPAuthorizationCredentials, Security(security)],
) -> dict:
    """
    Get and validate JWT token from authorization header.
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        return decode_token(credentials.credentials)
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_id(
    payload: Annotated[dict, Depends(get_token_payload)],
) -> str:
    """
    Get current user ID from token payload.
    
    Args:
        payload: Decoded token payload
        
    Returns:
        User ID from token subject
    """
    return payload["sub"]


async def get_optional_user_id(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Security(optional_security)],
) -> Optional[str]:
    """
    Get current user ID if token is present and valid.
    
    Args:
        credentials: Optional HTTP Authorization credentials
        
    Returns:
        User ID if token is valid, None otherwise
    """
    if not credentials:
        return None
        
    try:
        payload = decode_token(credentials.credentials)
        return payload["sub"]
    except InvalidTokenError:
        return None 