import { useEffect, useState } from "react";

import { MessageType } from "../types";
import { getMessages, saveMessage } from "../api";
import "./MessageBoard.css";

export const MessageBoard = () => {
  const [body, setBody] = useState("");
  const [messages, setMessage] = useState<any>([]);
  const [sender, setSender] = useState("");

  useEffect(() => {
    getMessages().then((n) => setMessage(n));
  }, []);

  const clickHandler = async () => {
    if (body && sender) {
      setBody("");
      setSender("");
      const message = {
        date: new Date().toISOString(),
        message: body,
        sender: sender,
        type: "message",
      };
      const response = await saveMessage(message);
      if (response.status === 200) setMessage([message, ...messages]);
    }
  };

  return (
    <>
      <div>
        <div>
          <input
            onChange={(e) => setSender(e.target.value)}
            placeholder="Sender"
            type="text"
            value={sender}
          />
        </div>
        <div>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message Body"
            value={body}
          ></textarea>
        </div>
        <div>
          <button onClick={clickHandler}>save</button>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg: MessageType) => (
              <tr key={msg.date}>
                <td>{msg.sender}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
