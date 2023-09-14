import { WxChannelShopPrinter } from "../src/index";

const printer = new WxChannelShopPrinter();

printer.getPrinterList().then(list => {
  console.log(list);
});

printer.getAppInfo().then(appInfo => {
  console.log(appInfo);
});

globalThis.printer = printer;