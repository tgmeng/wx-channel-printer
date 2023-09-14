const ReadyStateMessageMap: Record<number, string> = {
  [WebSocket.CONNECTING]: "打印机连接中，请稍后再试",
  [WebSocket.CLOSING]: "打印机连接断开中，请检查连接",
  [WebSocket.CLOSED]: "打印机连接已断开，请检查连接",
};

export function makeReadyStateError(rs: number) {
  return new Error(ReadyStateMessageMap[rs]);
}

export function makeConnectError() {
  return new Error("打印机连接出错，请重新连接");
}
