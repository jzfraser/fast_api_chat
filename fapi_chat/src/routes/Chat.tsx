import { useEffect, useRef, useState } from "react";

type Message = {
  sender: string;
  message: string;
};

export function Chat() {
  const [user, setUser] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const socket = useRef<WebSocket>();

  function getMessages() {
    return messages.map(({ sender, message }, index) => (
      <p key={index}>
        <strong>{sender} </strong>
        {message}
      </p>
    ));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (message) {
      const data = { sender: user, message: message };
      socket.current?.send(JSON.stringify(data));
      setMessage("");
    }
  }

  function fetchUser() {
    fetch("http://localhost:8000/api/current_user", {
      credentials: "include",
    }).then(async (res) => {
      if (res.ok) {
        const username = await res.json();
        setUser(username);
      }
    });
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    socket.current = new WebSocket("ws://localhost:8000/api/chat");
    socket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const sender = data["sender"] === user ? "You" : data["sender"];
      const message = data["message"];
      setMessages((prev) => {
        return [...prev, { sender, message }];
      });
    };

    return () => {
      socket.current?.close();
    };
  }, [user]);

  return (
    <div className="chat-body card">
      <div className="card-body">
        <strong id="profile">{user}</strong>
        <h4 className="card-title text-center">Chat App</h4>
        <hr />
        <div id="messages">{getMessages()}</div>
        <form className="form-inline" id="chat-form" onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <input
                type="text"
                className="form-control col-sm"
                placeholder="Write your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button id="send" type="submit" className="btn btn-primary col-2">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
