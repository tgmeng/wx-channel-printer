# wx-channel-printer

视频号小店 · 电子面单打印。

https://developers.weixin.qq.com/doc/channels/API/ewaybill/connect_printer.html

## 使用

```ts
import { WxChannelPrinter } from "wx-channel-printer";

const printer = new WxChannelPrinter();
```

### 获取打印机列表

```ts
const list = await printer.getPrinterList();
/**
 * [{
 *   "name": "_KM_202_NEW_",
 *   "displayName": "KM-202(NEW)",
 *   "status": 3
 * }]
 */
```

### 获取打印组件版本号

获取打印组件的版本号。

```ts
const info = await printer.getAppInfo();
/**
 * {
 *   "version": "1.3.4"
 * }
 */
```

### 打印面单

发送指令给打印组件，打印对应的面单

注意：

- 调用前，先从 [获取打印报文](https://developers.weixin.qq.com/doc/channels/API/ewaybill/get_print_info.html) 接口获取返回的 `print_info` 信息
- 调用完此指令成功后，需要自行调用 [电子面单打单成功通知](https://developers.weixin.qq.com/doc/channels/API/ewaybill/notify_print.html) 接口通知平台扭转订单状态

```ts
const tasks = await printer.print({
  version: "2.0", // 必传
  taskList: [
    {
      printInfo: "", // String, [获取打印报文]接口返回的 print_info
      printNum: {
        curNum: 1, // 打印计数-当前张数
        sumNum: 2, // 打印计数-总张数
      },
    },
  ],
  printer: "_KM_202_NEW_", // 选中的打印机，printer.name
});
/**
 * [{
 *   "taskID": "1234",
 *   "success": true,
 *   "failureReason": ""
 * }]
 */
```
