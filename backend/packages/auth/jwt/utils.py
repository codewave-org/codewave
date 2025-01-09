"""JWT utilities for authentication."""

from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import jwt
from apps.core.config import settings


def create_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    claims: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Create a JWT token.
    
    Args:
        subject: Token subject (usually user ID)
        expires_delta: Token expiration time
        claims: Additional claims to include in the token
        
    Returns:
        JWT token string
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
    expires_at = datetime.utcnow() + expires_delta
    
    to_encode = {
        "exp": expires_at,
        "sub": str(subject),
        "iat": datetime.utcnow(),
        "type": "access",
    }
    
    if claims:
        to_encode.update(claims)
        
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(subject: str) -> str:
    """Create a refresh token."""
    expires_delta = timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    return create_token(
        subject,
        expires_delta=expires_delta,
        claims={"type": "refresh"},
    )


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload
        
    Raises:
        jwt.InvalidTokenError: If token is invalid
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
        options={
            "verify_signature": True,
            "verify_exp": True,
            "verify_iat": True,
            "require": ["exp", "iat", "sub", "type"],
        },
    )


def verify_token(token: str) -> bool:
    """
    Verify if a token is valid.
    
    Args:
        token: JWT token string
        
    Returns:
        True if token is valid, False otherwise
    """
    try:
        decode_token(token)
        return True
    except jwt.InvalidTokenError:
        return False 