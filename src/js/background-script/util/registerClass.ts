import { getInitLoginInfo } from "./logic";


export default class registerPluginClass {

    currentRegisterUrl: any;
    loginStatusChangeFun: (value: any) => void;
    constructor() {
        this.initMessageListener();
        this.initMeListener();
        this.initLogoutListener();
        this.currentRegisterUrl = null;

        getInitLoginInfo().then((res: any) => {
            if (res && !this.currentRegisterUrl) {
                this.currentRegisterUrl = res;
                this.triggerCallBack();
            }
        });

        (window as any).loginStatusChange = this.loginStatusChange;
        (window as any).logout = () => {
            this.currentRegisterUrl = null;
            chrome.storage.sync.set({ ihrResumeData: null });
            this.triggerCallBack();
        };
    }

    initMessageListener = () => {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log("***!!!!! initMessageListener ", request);
            switch (request.type) {
                case 'register':
                    this.register(request, sender);
                    sendResponse('收到');
                    break;
                default:
                    break;
            }
        });
    }

    initMeListener = () => {
        //监听 me 接口返回状态
        chrome.webRequest.onCompleted.addListener(details => {
            setTimeout(() => {
                chrome.tabs.sendMessage(details.tabId, {
                    form: 'background',
                    to: 'content',
                    type: 'user_me',
                }, res => {
                    console.log("!!!!!!!!!!!!", res, this.currentRegisterUrl);
                    // ! todo 切换公司时 res 可能不一致 需要做处理
                    if (!this.currentRegisterUrl || !this.currentRegisterUrl.data || (res.currentCompany && res.currentCompany.companyId !== this.currentRegisterUrl.data.companyId)) {
                        this.currentRegisterUrl = {
                            url: details.initiator,
                            data: res,
                            tabId: details.tabId,
                        }
                        chrome.storage.sync.set({ ihrResumeData: JSON.stringify(this.currentRegisterUrl) });
                        this.triggerCallBack();
                    }
                    //******** *//*/*/*/*/*
                    // window.postMessage({
                    //     source: 'i-reload-iHR-content',
                    //     data: {
                    //         tabId: details.tabId,
                    //     }
                    //   }, '/')
                    //*///*/*/*/*/*//*/*/*
                })
            }, 1000);
        }, {
            urls: ["*://*/web/gateway/authcenter/delegate/user/me"],
        }, [])
    }

    initLogoutListener = () => {
        chrome.webRequest.onBeforeRedirect.addListener(details => {
            if (details.initiator === this.currentRegisterUrl.url) {
                this.currentRegisterUrl = null;
                chrome.storage.sync.set({ ihrResumeData: null });
                this.triggerCallBack();
            }
        }, {
            urls: ["*://*/gateway/pre_logout"],
        }, [])
    }

    loginStatusChange = (callBack: any) => {
        this.loginStatusChangeFun = callBack;
        this.triggerCallBack();
    }

    triggerCallBack = () => {
        if (this.loginStatusChangeFun) {
            this.loginStatusChangeFun({
                isLogin: !!this.currentRegisterUrl,
                data: this.currentRegisterUrl && this.currentRegisterUrl.data ? this.currentRegisterUrl.data : null,
                url: this.currentRegisterUrl ? this.currentRegisterUrl.url : null,
            })
        }
    }
}