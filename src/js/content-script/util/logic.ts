import { isIhrLogin } from "../../util/help";

export function triggerLoginStatus(
  url = location.href,
  handlerHashChange?: any,
  data: object = {}
) {
  chrome.runtime.sendMessage(
    {
      form: "content",
      to: "background",
      type: "register",
      isLogin: isIhrLogin(url),
      ...data,
    },
    function (response) {
      console.log("收到来自后台的回复：" + response);
    }
  );
}
