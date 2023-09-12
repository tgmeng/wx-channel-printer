import {
  RequestParams,
  RequestResult,
  AppInfo,
  PrintOptions,
  PrintTaskResult,
  PrinterData,
  WxChannelShopPrinterOptions,
} from "./types";

export class WxChannelShopPrinter {
  url: string;

  constructor({ url = "ws://127.0.0.1:12705" }: WxChannelShopPrinterOptions = {}) {
    this.url = url;
  }

  request<TData extends RequestParams, TReturn extends RequestResult>(
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
        if (resp.requestID === requestID) {
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
      RequestParams,
      RequestResult<{
        printerList: PrinterData[];
      }>
    >({ command: "getPrinterList" }).then(data => {
      return data.printerList;
    });
  }

  getAppInfo(): Promise<AppInfo> {
    return this.request<
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
    let now = Date.now();
    return this.request<
      RequestParams<PrintOptions>,
      RequestResult<{
        results: PrintTaskResult[];
      }>
    >({
      ...restData,
      command: "print",
      taskList: taskList.map((task, index) => {
        return { ...task, taskID: String(now + index) };
      }),
    }).then(data => {
      return data.results;
    });
  }
}
