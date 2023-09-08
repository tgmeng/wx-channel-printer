import {
  Request,
  Response,
  AppInfo,
  PrintOptions,
  PrintTaskResult,
  PrinterData,
  WxChannelPrinterOptions,
} from "./types";

export class WxChannelPrinter {
  url: string;

  constructor({ url = "ws://127.0.0.1:12705" }: WxChannelPrinterOptions) {
    this.url = url;
  }

  request<TReturn extends Response, TData extends Request = Request>(
    data: TData
  ): Promise<TReturn> {
    const requestID = Date.now();
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      ws.onopen = () => {
        ws.send(JSON.stringify({ ...data, requestID }));
      };

      ws.onmessage = e => {
        const resp = JSON.parse(e.data || "{}");
        if (resp.requestId === requestID) {
          resolve(resp);
        }
        ws.close();
      };

      ws.onerror = e => {
        reject(e);
        ws.close();
      };
    });
  }

  getPrinterList(): Promise<PrinterData[]> {
    return this.request<
      Response<{
        printerList: PrinterData[];
      }>
    >({ command: "getPrinterList" }).then(data => {
      return data.printerList;
    });
  }

  getAppInfo(): Promise<AppInfo> {
    return this.request<
      Response<{
        appInfo: AppInfo;
      }>
    >({ command: "getAppInfo" }).then(data => {
      return data.appInfo;
    });
  }

  print(data: PrintOptions): Promise<PrintTaskResult[]> {
    return this.request<Response<{ results: PrintTaskResult[] }>>({
      ...data,
      command: "print",
    }).then(data => {
      return data.results;
    });
  }
}
