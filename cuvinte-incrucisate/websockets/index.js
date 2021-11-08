import WebSocket from "ws";

export default (expressServer) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  return websocketServer;
};