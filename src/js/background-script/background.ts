import { isIhrLogin, getCookie } from "../util/help";
// import { refeshTabs } from './util/logic';
import registerPluginClass from "./util/registerClass";
import versionManger from "./util/versionManager";
// import ListerInterfaceClass from './util/InterfaceLister';
import { updatePulishStatus } from "./util/logic";

/** ihr 活跃的 tab */
let registerID = [];
let registerObj = {};
let loginCallBack;
let nextFillData = {};
let accountInfoObj = {};
let tabId = 0;

const registerClass = new registerPluginClass();
console.log("*****", registerClass.currentRegisterUrl);
new registerPluginClass();
new versionManger();
// new ListerInterfaceClass(onChangeEvent);

const bgData = new Proxy(
  { registerInfo: {} },
  {
    get: (target, key) => {
      return target[key];
    },
    set: (target, key, value) => {
      // if (key === 'registerInfo') {
      //     registerContent(value.request, value.sender, value.sendResponse);
      // }
      return Reflect.set(target, key, value);
    },
  }
);

function requestData(tabId, type, url, params, requestId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (tab && isIhrLogin(tab.url)) {
        chrome.tabs.sendMessage(
          tabId,
          {
            form: "background",
            to: "content",
            type: "request",
            params: [type, url, params],
            requestId: requestId,
          },
          (res) => {
            resolve(res);
          }
        );
        setTimeout(() => {
          reject(`${tabId}---无响应`);
        }, 300);
      } else {
        registerID = registerID.filter((id) => id !== tabId);
        delete registerObj[tabId];
        reject(`tabId --- 地址不符合`);
      }
    });
  });
}

/** ihr360 注册 */
// function registerContent(request, sender, sendResponse) {
//     if (request.form === 'content') {
//         if (request.isLogin) {
//             console.log("注册成功 ", sender.tab.id);
//             if (!registerID.some((id) => id)) {
//                 registerID.push(sender.tab.id);
//                 registerObj[sender.tab.id] = {
//                     origin: sender.origin,
//                     url: sender.url,
//                 }
//                 triggerLogin();
//             }
//             sendResponse('注册成功');
//         } else {
//             console.log("取消注册成功 ", sender.tab.id)
//             if (registerID.some((id) => id)) {
//                 registerID = registerID.filter((id) => id !== sender.tab.id);
//                 delete registerObj[sender.tab.id];
//                 triggerLogin();
//             }
//             sendResponse('取消注册成功');
//         }
//     }
// }

function dealRequestBack(request, sender, sendResponse) {
  console.log("request ", request);
  switch (request.requestId) {
    case "getaaa":
      break;
    default:
      break;
  }
  sendResponse("收到返回值");
}

function getAutoFillData(type: any) {
  if (nextFillData[type]) return nextFillData[type];
  return null;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "requestBack":
      dealRequestBack(request, sender, sendResponse);
      return;
    case "auto-fill":
      accountInfoObj[request.data.type] = request.data.accountInfo;
      delete request.data.accountInfo;
      nextFillData[request.data.type] = request.data;
      sendResponse();
      openRecruitWindow(request.data.type);
      tabId = sender.tab.id;
      return;
    case "get-fill-data":
      sendResponse(getAutoFillData(request.data));
      //只自动填充一次
      delete nextFillData[request.data];
    case "getAccountInfo":
      sendResponse(accountInfoObj[request.data]);
    case "publcResult":
      sendResponse(request.data);
      console.log("tabId",tabId)
      console.log("发布成功")
      if (tabId) {
        updateChannelStatus(
          registerClass.currentRegisterUrl.url,
          request.data,
          tabId
        );
      }
    case "bossPublcResult":
      console.log("bosstabId",tabId)
      sendResponse(request.data);
      console.log("boss发布成功")
      if (tabId) {
        updateChannelStatus(
          registerClass.currentRegisterUrl.url,
          request.data,
          tabId
        );
      }
    default:
      break;
  }
});

function updateChannelStatus(prefixUrl: string, params: any, tabId: any) {
  updatePulishStatus(prefixUrl, params).then((res: any) => {
    if (res.res.code === 0 && res.res.data) {
      console.log("#发布成功");
      chrome.tabs.reload(tabId, { bypassCache: false }, () => {
        console.log("The tab has been reloaded");
      });
    }
  });
}

function openRecruitWindow(type: string) {
  const obj = {
    liepin:
      "https://lpt.liepin.com/ejobedit/editsocietyejob?ejobActionType=publish",
    qiancheng: "https://ehire.51job.com/Jobs/JobEdit.aspx?Mark=New",
    boss: "https://www.zhipin.com/web/boss/job/edit?encryptId=0",
    lagou: "https://easy.lagou.com/position/multiChannel/createPosition.htm",
    zhilian: "https://rd6.zhaopin.com/job/publish",
    ganji:
      "http://www.ganji.com/pub/pub.php?act=pub&method=load&cid=2&domain=sh&from=uc&_pdt=zhaopin",
    58: "https://employer.58.com/position/post?/position/display&PGTID=0d000000-0000-0262-9612-77e052768ff4&ClickID=28", //"https://zppost.58.com/zhaopin/1/9224/j5",
  };

  chrome.tabs.create({ url: obj[type] });
}

//
function onChangeEvent() {}
