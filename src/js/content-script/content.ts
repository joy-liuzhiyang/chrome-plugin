import { isIhrLogin, isRecruitPublic, webJudge } from "../util/help";
import IrsFetchHttp from "../util/http";
import publicResultClass from "./publicResult/publicResultClass";

function requestData(type: "get" | "post", url: string, params: any) {
  return new IrsFetchHttp()[type](url, params);
}

function sendToBackground(type, callBack = null, other = {}) {
  chrome.runtime.sendMessage(
    {
      form: "content",
      to: "background",
      type: type,
      ...other,
    },
    (e) => {
      if (callBack) {
        callBack(e);
      }
    }
  );
}

function sendUser_MeData() {
  let backData = null;
  if (localStorage.USER_ME) {
    backData = JSON.parse(localStorage.USER_ME);
    chrome.runtime.sendMessage(
      {
        form: "content",
        to: "background",
        type: "user_me",
        data: backData,
      },
      (e) => {}
    );
  } else {
    new IrsFetchHttp()
      .get("/web/gateway/authcenter/delegate/user/me", null)
      .then((res: any) => {
        if (res.data) {
          backData = res.data;
          chrome.runtime.sendMessage(
            {
              form: "content",
              to: "background",
              type: "user_me",
              data: backData,
            },
            (e) => {}
          );
        }
      });
  }
}

chrome.runtime.onMessage.addListener(
  (request: any, sender: any, sendResponse: any) => {
    switch (request.type) {
      case "user_me":
        const obj = JSON.parse(localStorage.USER_ME);
        sendResponse({
          userId: obj.userId,
          username: obj.username,
          staffId: obj.staffId,
          currentCompany: obj.currentCompany,
          accountId: obj.accountId,
          mobileNo: obj.mobileNo,
        });
        break;
      case "resume-page":
        webJudge(request.data, sendResponse);
        break;
      default:
        break;
    }
    return true;
  }
);

function injectCustomJs(jsPath: string = "js/content-script/inject.js") {
  var temp = document.createElement("script");
  temp.setAttribute("type", "text/javascript");
  temp.src = chrome.extension.getURL(jsPath);

  temp.onload = function () {
    this.parentNode.removeChild(this);
  };
  document.head.appendChild(temp);
}

console.log("***********");

(window as any).findReactInstance = (el) => {
  if (!el) {
    return;
  }
  let key = Object.keys(el).find((key) =>
    key.startsWith("__reactInternalInstance")
  );
  if (!key) {
    return;
  }
  return el[key];
};

function injectJs(
  jsPath: string = "js/content-script/recruit.js",
  callBack?: any
) {
  var temp = document.createElement("script");
  temp.setAttribute("type", "text/javascript");
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function () {
    this.parentNode.removeChild(this);
    if (callBack) {
      callBack();
    }
  };
  document.head.appendChild(temp);
}

function dealRecruit() {
  const type = isRecruitPublic();
  if (type) {
    //是招聘发布页面 嵌入js
    injectJs("js/content-script/recruit.js", () => {
      chrome.runtime.sendMessage(
        {
          form: "content",
          to: "background",
          type: "get-fill-data",
          data: type,
        },
        (data) => {
          if (data) {
            console.log("data#####%%%%%%", data)
            window.postMessage(
              {
                source: "i-recruit-content",
                data: {
                  type,
                  data,
                },
              },
              "/"
            );
          }
        }
      );
    });

    window.addEventListener("message", function (e) {
      if (
        e.data.source === "i-recruit-boss-submit-script" &&
        e.origin === location.origin
      ) {
        console.log("获取boss的信息为：", e.data)
        chrome.runtime.sendMessage(
          {
            form: "content",
            to: "background",
            type: "bossPublcResult",
            data: {
              channelAccountId: e.data.data.channelAccountId,
              channelCode: "bosszhipin",
              jobDescriptionId: e.data.data.jobDescriptionId
            },
          },
          (e) => {}
        );
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (isIhrLogin()) {
    window.addEventListener("message", function (e) {
      if (
        e.data.source === "i-recruit-script" &&
        e.origin === location.origin
      ) {
        // alert("content sendMessage")
        chrome.runtime.sendMessage(
          {
            form: "content",
            to: "background",
            type: "auto-fill",
            data: e.data.data,
          },
          (e) => {}
        );
      }
    });
    injectCustomJs();
  }
});

window.onload = () => {
  dealRecruit();

  //自动填充账号密码
  injectJs("js/content-script/fillAccount.js");

  window.addEventListener("message", function (e) {
    if (
      e.data.source === "i-recruit-account-script" &&
      e.origin === location.origin
    ) {
      console.log("eeee1111 ", e);
      chrome.runtime.sendMessage(
        {
          form: "content",
          to: "background",
          type: "getAccountInfo",
          data: e.data.data,
        },
        function (response: any) {
          window.postMessage(
            {
              source: "i-recruit-account-back-script",
              data: response,
            },
            "/"
          );
        }
      );
    }
  });

  //发布结果
  new publicResultClass();
};

window.addEventListener("message", function (e) {
  if(e.data.source === "i-submit-recruit-content" && e.origin === location.origin){
    console.log("渠道传过来的data", e.data.data)
    const channelPublishInfo = {
      time: new Date().getTime(),
      channelAccountId: e.data.data.channelAccountId,
      channelCode: e.data.data.channelCode,
      jobDescriptionId: e.data.data.jobDescriptionId,
      field: e.data.data.field,
      name: e.data.data.name
    }
    chrome.storage.local.set(channelPublishInfo, () => {
      console.log("set成功")
    });
  }
})