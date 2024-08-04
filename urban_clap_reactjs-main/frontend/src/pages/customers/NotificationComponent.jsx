// NotificationComponent.jsx
import React, { useEffect, useState } from "react";

const NotificationComponent = () => {
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/notifications/");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage(data.message);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return <div>{message && <p>{message}</p>}</div>;
};

export default NotificationComponent;
