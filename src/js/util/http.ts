import { getCookie } from "./help";

class IrsFetchHttp {
  contentType: string;
  credentials: string;
  mode: string;
  xsrfToken: string;
  showDefaultErrorTip: boolean;
  needCatchTip: boolean;
  initHeader: any;
  headers: any;
  data: any;
  isIhr: boolean;
  constructor(isIhr: boolean = true) {
    this.contentType = "application/json;charset=UTF-8";
    this.isIhr = isIhr;
    this.credentials = "include";
    this.mode = "cors";
    this.xsrfToken = "";
    this.showDefaultErrorTip = true;
    this.needCatchTip = false;
  }

  handlerErr = (e, url) => {
    return Promise.reject("网络异常，请稍后重试！" + url);
  };

  dealRequestHeader = () => {
    return {
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    };
  };

  async fetchData(
    url: string,
    reqtype: any,
    options: any,
    extHeader = {},
    file: any = false,
    payload: string = "json"
  ) {
    //默认'json'，文本传值‘text’
    this.initHeader = {
      Accept: "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
    };

    if (this.isIhr) {
      this.initHeader["X-XSRF-TOKEN"] = this.xsrfToken;
    }

    if (payload === "json") {
      this.headers = Object.assign(this.initHeader, {
        "Content-Type": !file ? "application/json" : "multipart/form-data",
      });
    } else {
      this.headers = !file
        ? (this.headers = Object.assign(this.initHeader, {
            "Content-Type": !file ? "application/json" : "multipart/form-data",
            authorization: "authorization-text",
          }))
        : this.isIhr
        ? {
            "X-XSRF-TOKEN": this.xsrfToken,
          }
        : {};
    }

    if (reqtype === "get") {
      this.data = {
        method: reqtype,
        headers: Object.assign(this.initHeader, {
          "Content-Type": "application/json",
          ...extHeader,
        }),
        credentials: this.credentials,
      };
    } else {
      this.data = {
        method: reqtype,
        headers: Object.assign(this.headers, extHeader),
        credentials: this.credentials,
        // 接口不规范，body结构不为json，做特殊处理
        // body: (reqtype === "post" ? JSON.stringify(options) : null as any)
        // body: (reqtype === "get" ? "" : (url === '/web/flexible/codeValue/list.do' || payload === 'text' ? JSON.stringify(options) : options))
        body:
          reqtype === "get"
            ? ""
            : payload === "text"
            ? options
            : JSON.stringify(options),
      };
    }

    try {
      const response = await fetch(url, this.data).catch((e) =>
        this.handlerErr(e, url)
      );
      return response;
    } catch (error) {}
  }

  get = (url: string, options: any, extHeader: any = {}) => {
    const fetchUrl = this.serializeParma(url, options);
    return this.fetchData(fetchUrl, "get", {}, extHeader)
      .then(async (d: any) => {
        return {
          status: d.status,
          res: await d.json(),
        };
      })
      .then((data) => {
        return data;
      });
  };

  post = (
    url: string,
    options: any,
    extHeader: any = {},
    file: any = false,
    payload: string = "json"
  ) => {
    return this.fetchData(url, "post", options, extHeader, file, payload)
      .then(async (d: any) => {
        return {
          status: d.status,
          res: await d.json(),
        };
      })
      .then((data) => {
        return data;
      });
  };

  put = (
    url: string,
    options: any,
    extHeader: any = {},
    file: any = false,
    payload: string = "json"
  ) => {
    return this.fetchData(url, "put", options, extHeader, file, payload)
      .then(async (d: any) => {
        return {
          status: d.status,
          res: await d.json(),
        };
      })
      .then((data) => {
        return data;
      });
  };

  delete = (url: string, options: any, extHeader: any = {}) => {
    return this.fetchData(url, "delete", options, extHeader)
      .then(async (d: any) => {
        return {
          status: d.status,
          res: await d.json(),
        };
      })
      .then((data) => {
        return data;
      });
  };

  serializeParma = (url: string, options: object) => {
    let urlPath = url;
    if (options) {
      const paramsArray = [];
      //拼接参数
      Object.keys(options).forEach((key) =>
        paramsArray.push(key + "=" + options[key])
      );
      if (url.search(/\?/) === -1) {
        urlPath += "?" + paramsArray.join("&");
      } else {
        urlPath += "&" + paramsArray.join("&");
      }
    }
    return urlPath;
  };
}

export default IrsFetchHttp;
