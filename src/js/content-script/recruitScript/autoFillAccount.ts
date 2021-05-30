class AutoFillAccount {
  username: string;
  psd: string;
  name?: string;
  resumeObj: any;
  resolve: any;

  constructor() {
    this.resumeObj = [
      {
        //https://login.zhipin.com/?ka=header-login
        reg: "^http(?:s)?://\\w+.zhipin\\.com.*",
        dom: "[name='account']",
        type: "boss",
      },
      {
        //https://ehire.51job.com/MainLogin.aspx
        reg: "^http(?:s)?://\\w+.51job\\.com.*",
        dom: ".signUpBox",
        type: "qiancheng",
      },
      {
        //https://passport.58.com/login/
        reg: "^http(?:s)?://\\w+.58\\.com/login.*",
        dom: ".password_login",
        type: "58",
      },
      {
        // https://passport.ganji.com/login.php
        reg: "^http(?:s)?://\\w+.ganji\\.com/login\\.php.*",
        dom: ".loginWrap",
        type: "ganji",
      },
      {
        // https://lpt.liepin.com/user/login
        reg: "^http(?:s)?://\\w+.liepin\\.com/user/login.*",
        dom: ".lpt-login-wrap",
        type: "liepin",
      },
      {
        // https://passport.lagou.com/login/login.html
        reg: "^http(?:s)?://\\w+.lagou\\.com/login/login\\.html.*",
        dom: '[data-view="passwordLogin"]',
        type: "lagou",
      },
      {
        // https://passport.zhaopin.com/org/login
        reg: "^http(?:s)?://\\w+.zhaopin\\.com/org/login.*",
        dom: ".register-container",
        type: "zhilian",
      },
    ];
    this.startFillAccount();

    window.addEventListener("message", (e) => {
      if (
        e.data.source === "i-recruit-account-back-script" &&
        e.origin === location.origin
      ) {
        console.log("eeee ", e, this.resolve);
        if (this.resolve) {
          this.resolve(e.data.data);
        }
      }
    });
  }

  createEvent = (type: any) => {
    return new Event(type, {
      bubbles: true,
      cancelable: true,
    });
  };

  getReactEventInstance = (element: Element) => {
    if (!element) return null;
    const key = Object.keys(element).find((key) =>
      key.startsWith("__reactEventHandlers")
    );
    if (!key) return null;
    return element[key];
  };

  delayTime = (delay: number = 300) => {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  getAccountPsd = (type: any) => {
    return new Promise((resolve: any) => {
      this.resolve = resolve;
      window.postMessage(
        {
          source: "i-recruit-account-script",
          data: type,
        },
        "/"
      );
    });
  };

  startFillAccount = async () => {
    const type = this.getType();
    if (type) {
      const accountInfo = (await this.getAccountPsd(type)) as any;
      console.log("accountInfo ", accountInfo);
      if (accountInfo) {
        this.username = accountInfo.userName;
        this.name = accountInfo.accountName;
        this.psd = accountInfo.psd;

        console.log("this ----- ", accountInfo, this);

        this.fillaccount(type);
      }
    }
  };

  getType = () => {
    const url = decodeURIComponent(location.href);

    const item = this.resumeObj.find((item: any) => {
      const reg = new RegExp(item.reg);
      if (reg.test(url) && document.querySelector(item.dom)) {
        return true;
      }
      return false;
    });

    return item ? item.type : null;
  };

  fillaccount = async (type: string) => {
    try {
      await this.delayTime();
      switch (type) {
        case "zhilian":
          {
            $($("form input")[0])
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $("form input")[0].dispatchEvent(this.createEvent("input"));
            $($("form input")[1])
              .val(this.psd)
              .trigger("focus")
              .trigger("blur");
            $("form input")[1].dispatchEvent(this.createEvent("input"));
          }
          break;
        case "lagou":
          {
            $($("form.active input")[0])
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $($("form.active input")[1])
              .val(this.psd)
              .trigger("focus")
              .trigger("blur");
          }
          break;
        case "liepin":
          {
            this.getReactEventInstance(
              document.querySelector(".user-item-input")
            ).onChange({
              target: { value: this.username },
              persist: () => {},
            });
            this.getReactEventInstance(
              document.querySelector(".pass-item-input")
            ).onChange({
              target: { value: this.psd },
              persist: () => {},
            });
            this.getReactEventInstance(
              document.querySelector(".pass-item-input")
            ).onBlur();
          }
          break;
        case "ganji":
          {
            $('[name="login_username"]')
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $('[name="login_password"]')
              .val(this.psd)
              .trigger("focus")
              .trigger("blur");
          }
          break;
        case "58":
          {
            $('[type="accountlogin"]').trigger("click");
            await this.delayTime();
            $("#mask_body_item_username")
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $("#mask_body_item_newpassword")
              .val(this.psd)
              .trigger("focus")
              .trigger("blur");
          }
          break;
        case "qiancheng":
          {
            $("#txtMemberNameCN")
              .val(this.name)
              .trigger("focus")
              .trigger("blur");
            $("#txtUserNameCN")
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $("#txtPasswordCN").val(this.psd).trigger("focus").trigger("blur");
          }
          break;
        case "boss":
          {
            $('[name="account"]')
              .val(this.username)
              .trigger("focus")
              .trigger("blur");
            $('[name="password"]')
              .val(this.psd)
              .trigger("focus")
              .trigger("blur");
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("自动填充失败", error);
    }
  };
}

new AutoFillAccount();
