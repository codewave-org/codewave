"""API schemas module."""

from typing import Literal

from pydantic import BaseModel, Field


class HealthCheck(BaseModel):
    """Health check response schema."""

    status: Literal["ok", "error"] = Field(
        "ok",
        description="Current health status of the service",
        examples=["ok", "error"],
    )
    version: str = Field(
        ...,
        description="Current version of the API",
        examples=["0.1.0"],
    )


class ErrorResponse(BaseModel):
    """Error response schema."""

    detail: str = Field(
        ...,
        description="Error message",
        examples=["Resource not found", "Invalid input"],
    )
    error_code: str = Field(
        ...,
        description="Error code for the client",
        examples=["NOT_FOUND", "BAD_REQUEST"],
    )


class RootResponse(BaseModel):
    """Root endpoint response schema."""

    name: str = Field(
        ...,
        description="Application name",
        examples=["CodeWave"],
    )
    version: str = Field(
        ...,
        description="API version",
        examples=["0.1.0"],
    )
    environment: str = Field(
        ...,
        description="Current environment",
        examples=["development", "production", "staging"],
    )
