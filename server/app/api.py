from typing import List, Tuple

from fastapi import FastAPI, Response, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["content-type", "set-cookie"],
)


class RegisterValidator(BaseModel):
    username: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Tuple[WebSocket, str]] = []

    async def connect(self, websocket: WebSocket, user: str):
        await websocket.accept()
        self.active_connections.append((websocket, user))

    def disconnect(self, websocket: WebSocket, user: str):
        self.active_connections.remove((websocket, user))

    async def broadcast(self, message):
        for connection in self.active_connections:
            await connection[0].send_json(message)


manager = ConnectionManager()


@app.websocket("/api/chat")
async def websocket_endpoint(websocket: WebSocket):
    sender = websocket.cookies.get("X-Authorization")
    if sender:
        await manager.connect(websocket, sender)
        response = {"sender": sender, "message": "got connected"}
        await manager.broadcast(response)
        try:
            while True:
                data = await websocket.receive_json()
                await manager.broadcast(data)
        except WebSocketDisconnect:
            manager.disconnect(websocket, sender)
            response["message"] = "left"
            await manager.broadcast(response)


@app.get("/api/current_user")
def get_user(request: Request):
    return request.cookies.get("X-Authorization")


@app.post("/api/register")
def register_user(user: RegisterValidator, response: Response):
    response.set_cookie(
        key="X-Authorization",
        value=user.username,
        httponly=True,
        secure=True,
        samesite="none",
    )
