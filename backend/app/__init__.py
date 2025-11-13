from fastapi import FastAPI
from .api import *

def create_app() -> FastAPI:
    """App factory to create FastAPI instance."""
    app = FastAPI(
        title="MuTor",
        description="Backend service for MuTor.",
        version="1.0.0"
    )

    app.include_router(routes_utils.router, tags=["Utils"])
    app.include_router(routes_course.router, prefix="/api", tags=["Course"])
    app.include_router(routes_feedback.router, prefix="/api", tags=["Feedback"])
    app.include_router(routes_forward.router, prefix="/api", tags=["Forward_HCMUT"])
    app.include_router(routes_notification.router, prefix="/api", tags=["Notification"])
    app.include_router(routes_login.router, prefix="/api/auth", tags=["Login"])
    app.include_router(routes_report.router, prefix="/api", tags=["Report"])

    return app