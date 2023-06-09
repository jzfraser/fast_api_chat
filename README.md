# fast_api_chat
A simple chat server and client

## Server

The server is very simple, made with Python using FastAPI. It can accept multiple connections using WebSockets and stores usernames in cookies on the client.

## Client (fapi_chat)

A simple frontend/client that communicates with the server, made with Vite, TypeScript, React, and Bootstrap.
Allows a user to register their name and join a chat where messages from other users can be seen.

## How to run

After cloning the repository locally:
- install the server dependencies - `pip install "fastapi[all]"`
- install the frontend dependencies - `cd fapi_chat && npm i`
- run the server from `fast_api_chat/server` with `python main.py`
- run the frontend dev server from `fast_api_chat/fapi_chat` with `npm run dev`

Then connect to the frontend in a browser at `localhost:3000` and start chatting away!
