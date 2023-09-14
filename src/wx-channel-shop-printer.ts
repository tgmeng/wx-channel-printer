import { v4 as uuid } from "@lukeed/uuid";
import {
  RequestParams,
  RequestResult,
  AppInfo,
  PrintOptions,
  PrintTaskResult,
  PrinterData,
  WxChannelShopPrinterOptions,
} from "./types";
import { makeConnectError, makeReadyStateError } from "./utils";

export interface WxChannelShopPrinterBuffer<TData = object, TReturn = unknown> {
  resolve: (data: TReturn) => void;
  reject: (err: unknown) => void;
  requestID: string;
  data: TData;
  isSent: boolean;
}

export class WxChannelShopPrinter {
  ws?: WebSocket;
  url: string;

  taskId = 0;

  bufferList: WxChannelShopPrinterBuffer[] = [];
  disconnectTimerId = 0;

  constructor({
    url = "ws://127.0.0.1:12705",
  }: WxChannelShopPrinterOptions = {}) {
    this.url = url;
  }

  private connect() {
    const ws = (this.ws = new WebSocket(this.url));

    clearInterval(this.disconnectTimerId);
    this.disconnectTimerId = setTimeout(() => {
      this.disconnect();
    }, 1000 * 60 * 5);

    return new Promise<void>((resolve, reject) => {
      ws.addEventListener("open", () => {
        this.sendBuffers();
        resolve();
      });

      ws.addEventListener("message", e => {
        const resp = JSON.parse(e.data || "{}");

        const bufferIndex = this.bufferList.findIndex(
          buffer => resp.requestID === buffer.requestID
        );

        if (bufferIndex !== -1) {
          this.bufferList[bufferIndex].resolve(resp);
          this.bufferList.splice(bufferIndex, 1);
        }
      });

      ws.addEventListener("error", () => {
        const error = makeConnectError();
        reject(error);
        this.throwBuffers(error);
      });

      ws.addEventListener("close", () => {
        const error = makeReadyStateError(WebSocket.CLOSED);
        reject(error);
        this.throwBuffers(error);
      });
    });
  }

  private sendBuffers() {
    this.bufferList.forEach(buffer => {
      if (!buffer.isSent) {
        buffer.isSent = true;
        this.ws!.send(
          JSON.stringify({ ...buffer.data, requestID: buffer.requestID })
        );
      }
    });
  }

  private throwBuffers(error: Error) {
    this.bufferList.forEach(buffer => {
      buffer.reject(error);
    });
    this.bufferList.length = 0;
  }

  private send<TData extends RequestParams, TReturn extends RequestResult>(
    data: TData
  ): Promise<TReturn> {
    const requestID = uuid();
    return new Promise<TReturn>((resolve, reject) => {
      const buffer: WxChannelShopPrinterBuffer<TData, TReturn> = {
        resolve,
        reject,
        requestID,
        data,
        isSent: false,
      };
      this.bufferList.push(buffer as WxChannelShopPrinterBuffer);

      if (
        !this.ws ||
        this.ws.readyState === WebSocket.CLOSED ||
        this.ws.readyState === WebSocket.CLOSING
      ) {
        this.connect();
        return;
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        this.sendBuffers();
        return;
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  getPrinterList(): Promise<PrinterData[]> {
    return this.send<
      RequestParams,
      RequestResult<{
        printerList: PrinterData[];
      }>
    >({ command: "getPrinterList" }).then(data => {
      return data.printerList;
    });
  }

  getAppInfo(): Promise<AppInfo> {
    return this.send<
      RequestParams,
      RequestResult<{
        appInfo: AppInfo;
      }>
    >({ command: "getAppInfo" }).then(data => {
      return data.appInfo;
    });
  }

  print(data: PrintOptions): Promise<PrintTaskResult[]> {
    const { taskList, ...restData } = data;
    return this.send<
      RequestParams<PrintOptions>,
      RequestResult<{
        results: PrintTaskResult[];
      }>
    >({
      ...restData,
      command: "print",
      taskList: taskList.map(task => {
        return { ...task, taskID: uuid() };
      }),
    }).then(data => {
      return data.results;
    });
  }
}
