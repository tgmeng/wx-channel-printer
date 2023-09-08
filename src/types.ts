export interface WxChannelPrinterOptions {
  url?: string;
}

/**
 * 通用
 */

export type Request<T = unknown> = {
  command: string;
} & T;

export type Response<T = unknown> = {
  command: string;
  requestID: number;
} & T;

/**
 * 环境信息
 */

export interface AppInfo {
  version: string;
}

/**
 * 打印
 */

export interface PrinterData {
  name: string;
  displayName: string;
  status: number;
}

export interface PrintOptions {
  version: string;
  requestID: string;
  taskList: PrintTask[];
  printer: string;
}

export interface PrintTask {
  taskID: string;
  printInfo: string;
  printNum: PrintNum;
}

export interface PrintNum {
  curNum: number;
  sumNum: number;
}

export interface PrintTaskResult {
  taskID: string;
  success: boolean;
  failureReason: string;
}
