from fastapi import FastAPI
from app.api import courses, notifications
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MuTor")

origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins (for dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(courses.router)
app.include_router(notifications.router)
