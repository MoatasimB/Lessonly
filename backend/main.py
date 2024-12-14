from typing import Union
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.api.endpoints import lesson_plans, users
from app.db.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Customize the error response
    errors = []
    for error in exc.errors():
        loc = " -> ".join([str(loc) for loc in error["loc"]])
        errors.append({
            "location": loc,
            "message": error["msg"],
            "type": error["type"]
        })

    response = {
        "code": 422,
        "status": "fail",
        "detail": errors
    }
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder(response)
    )

Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(lesson_plans.router, prefix="/lesson-plans", tags=["Lesson Plans"])


