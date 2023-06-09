import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (user) {
      const data = { username: user };
      const response = fetch("http://localhost:8000/api/register", {
        credentials: "include",
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response.then((res) => {
        if (res.status === 200) {
          navigate("/chat");
        }
      });
    }
  }

  return (
    <div className="chat-body card">
      <div className="card-body">
        <h4 className="card-title text-center">Chat App</h4>
        <form className="form-inline" id="user-form" onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <input
                type="text"
                className="form-control col-sm"
                id="user_input"
                placeholder="Enter your name"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <button
                id="start"
                type="submit"
                className="btn btn-primary col-3"
              >
                Start Chat
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
