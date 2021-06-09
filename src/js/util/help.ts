import http from "./http";

export const getCookie = (key, cookie = document.cookie) => {
  const paramsArr = (cookie || "").split("; ");
  for (const arr of paramsArr) {
    const arr2 = arr.split("=");
    if (arr2[0] === key) {
      return arr2[1];
    }
  }
  return "";
};

export const isIhrLogin = (url = location.href) => {
  return url.includes("web/page/single") && url.includes("ihr360.com");
};

function timePromise(time: number = 100) {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

const getDomWrap = (resolve: any, domString: string) => {
  if (eval(domString)) {
    resolve(eval(domString));
  } else {
    setTimeout(() => getDomWrap(resolve, domString), 50);
  }
};

const getDomWrapPromise = (domString) => {
  return new Promise((resolve: any) => {
    getDomWrap(resolve, domString);
  });
};

const getDom = async (domString) => {
  return Promise.race([timePromise(3000), getDomWrapPromise(domString)]);
};

const getBossResumeHTML = async () => {
  const obj = {
    fileContent: null,
    errorInfo: null,
  };
  const currentPageKey = document
    .querySelector(".side-menu .router-link-active")
    .getAttribute("ka");
  if (["menu-geek-recommend"].includes(currentPageKey)) {
    //推荐牛人
    const iFrameEle = document.querySelector('[name="recommendFrame"]') as any;
    if (iFrameEle) {
      const resumeModalEle =
        iFrameEle.contentDocument.querySelector(".resume-dialog");
      if (!resumeModalEle) {
        const resumeDetailEle = (await getDom(
          `document.querySelector('[name=\"recommendFrame\"]').contentDocument.querySelector("#resume-page .resume-item-content")`
        )) as any;
        if (!resumeDetailEle) {
          obj.errorInfo = "未检测到简历详情";
        } else {
          obj.fileContent = resumeDetailEle.outerHTML;
        }
      } else {
        obj.errorInfo = "请先打开简历详情,再尝试解析";
      }
    } else {
      obj.errorInfo = "请先打开简历详情,再尝试解析";
    }
  } else if (["menu-geek-search"].includes(currentPageKey)) {
    //搜索牛人
    const resumeModalEle = document.querySelector(
      ".dialog-resume-full.search-resume"
    );
    if (!resumeModalEle) {
      obj.errorInfo = "请先打开简历详情,再尝试解析";
    } else {
      const resumeDetailEle = (await getDom(
        `document.querySelector('.dialog-resume-full.search-resume').querySelector(".resume-dialog")`
      )) as any;
      if (!resumeDetailEle) {
        obj.errorInfo = "未检测到简历详情";
      } else {
        obj.fileContent = resumeDetailEle.outerHTML;
      }
    }
  } else if (["menu-im"].includes(currentPageKey)) {
    //沟通
    try {
      (
        document.querySelector(".conversation-hd-box").children[1] as any
      ).click();
      const resumeDetailEle = (await getDom(
        `document.querySelector('.resume-detail')`
      )) as any;
      if (!resumeDetailEle) {
        obj.errorInfo = "未检测到简历详情";
      } else {
        obj.fileContent = resumeDetailEle.outerHTML;
      }
    } catch (error) {
      obj.errorInfo = "未检测到简历详情";
    }
  }
  return obj;
};

export const webJudge = async (data: any, sendResponse: any) => {
  const url = location.href;

  let fileContent = document.querySelector("body").outerHTML;
  let errorInfo = null;

  try {
    if (url.includes("zhaopin.com/resume/detail")) {
      //智联
      if (document.querySelector(".resume-detail--default")) {
        fileContent = document.querySelector(
          ".resume-detail--default"
        ).outerHTML;
      }
    } else if (url.includes("51job.com/Candidate/ResumeViewFolderV2.aspx")) {
      //前程无忧
      if (document.querySelector("#divResume")) {
        fileContent = document.querySelector("#divResume").outerHTML;
      }
    } else if (url.includes("lagou.com/can/new/index.htm")) {
      //拉勾
      const modalEle = document.querySelector(".lg-modal-content");
      if (!modalEle) {
        errorInfo = "请先打开简历详情,再尝试解析";
      } else {
        fileContent = document.querySelector(".lg-modal-content").outerHTML;
      }
    } else if (url.includes("lagou.com/can/new/details.htm")) {
      //拉勾
      try {
        (
          document.querySelector(".rc-tabs-nav-animated").children[0]
            .children[0] as any
        ).click();
        //200ms 等待在线简历渲染
        await timePromise(200);
      } catch (error) {}

      if (document.querySelector(".scroll-view")) {
        fileContent = document.querySelector(".scroll-view").outerHTML;
      }
    } else if (url.includes("liepin.com/cvview/showresumedetail")) {
      //猎聘
      if (document.querySelector("#water-mark-wrap")) {
        fileContent = document.querySelector("#water-mark-wrap").outerHTML;
      }
    } else if (url.includes("ganji.com/resume_received/index")) {
      //赶集
      if (document.querySelector("resume-content")) {
        fileContent = document.querySelector("resume-content").outerHTML;
      }
    } else if (url.includes("58.com/resumedetail/")) {
      //58
      if (document.querySelector(".resDetailRight")) {
        fileContent = document.querySelector(".resDetailRight").outerHTML;
      }
    } else if (
      url.includes("zhipin.com/web/boss/recommend") ||
      url.includes("zhipin.com/web/boss/search") ||
      url.includes("zhipin.com/web/boss/index")
    ) {
      //boss
      const obj = await getBossResumeHTML();
      if (obj.errorInfo) {
        errorInfo = obj.errorInfo;
      } else {
        fileContent = obj.fileContent;
      }
    }
  } catch (error) {
    fileContent = document.querySelector("body").outerHTML;
  }

  sendResponse({
    siteUrl: url,
    title: document.title,
    fileContent,
    errorInfo,
  });
};

/** background popup 专用 */
export const fetchHttpRequest = (
  url: string,
  requestType: "get" | "post",
  params: any,
  extraHeader: any = {}
) => {
  return new Promise((resolve: any, reject: any) => {
    const reg = /^http(s)?:\/\/(.*?)\//;
    try {
      chrome.cookies.getAll(
        { url: "https://" + reg.exec(url)[2] },
        (cookies) => {
          resolve(
            new http()[requestType](url, params, {
              "X-XSRF-TOKEN": cookies.find(
                (item: any) => item.name === "XSRF-TOKEN"
              ).value,
              ...extraHeader,
            })
          );
        }
      );
    } catch (error) {
      reject("url 格式不正确");
    }
  });
};

/* 是否是招聘发布页 */
export function isRecruitPublic() {
  // if (location.href.includes('sourceInfo=ihr')) {
  if (location.href.includes(".51job.com/Jobs/JobEdit.aspx?Mark=New")) {
    return "qiancheng";
  }

  if (location.href.includes(".zhipin.com/web/boss/job/edit?encryptId=0")) {
    return "boss";
  }

  if (
    location.href.includes(
      ".lagou.com/position/multiChannel/createPosition.htm"
    )
  ) {
    return "lagou";
  }

  if (location.href.includes(".zhaopin.com/job/publish")) {
    return "zhilian";
  }

  if (
    location.href.includes(
      ".liepin.com/ejobedit/editsocietyejob?ejobActionType=publish"
    )
  ) {
    return "liepin";
  }

  if (
    location.href.includes(".ganji.com/pub/pub.php") &&
    location.href.includes("_pdt=zhaopin")
  ) {
    return "ganji";
  }

  if (location.href.includes(".58.com/zhaopin/")) {
    return "58";
  }

  // }
  return false;
}
