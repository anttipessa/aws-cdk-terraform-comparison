import { MessageType } from "./types";

export const getMessages = async () => {
  const result = await fetch(process.env.REACT_APP_API_URL!);
  return await result.json();
};

export const saveMessage = async (message: MessageType) => {
  return await fetch(process.env.REACT_APP_API_URL!, {
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    mode: "cors",
  });
};
