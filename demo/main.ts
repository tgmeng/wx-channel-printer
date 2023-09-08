import { WxChannelPrinter } from "../src/index";

const printer = new WxChannelPrinter();

printer.getPrinterList().then(list => {
  console.log(list);
});

printer.getAppInfo().then(appInfo => {
  console.log(appInfo);
});
