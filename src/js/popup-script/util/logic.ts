import { fetchHttpRequest, isRecruitWebsite } from "../../util/help";
import http from "../../util/http";

// function dealLoginStatus(loginStatus) {
//     if (loginStatus) {

//     } else {

//     }
// }

export function getLoginStatus(prefixUrl: string) {
  return new http()
    .get(
      `${prefixUrl}/gateway/component/manage/api/component/topbar/theme`,
      null
    )
    .then((res) => {
      console.log("res --------", res);
      if (res.status === 401) {
        return false;
      } else {
        return true;
      }
    });
}

/** 获取当前窗口的Tab信息 */
export const getActiveTab = () => {
  return new Promise((resolve: any, reject: any) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs: any) => {
        resolve(tabs[0]);
      }
    );
  });
};

export const activeResumeTab = () => {
  return new Promise((resolve: any, reject: any) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const tab = tabs[0];
        if (isRecruitWebsite(tab.url)) {
          chrome.tabs.sendMessage(
            tab.id,
            {
              form: "popup",
              to: "content",
              type: "resume-page",
            },
            (value: any) => {
              resolve(value);
            }
          );
        } else {
          resolve(null);
        }
      }
    );
  });
};

/** 页面是否为简历详情 */
export const requestCheckResumePage = (prefixUrl: string, params: any) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/plugin/check/is_resume_detail_page`,
    "post",
    params
  ).then((res: any) => {
    return res.res.data;
  });
};

/** 解析简历 */
export const requestParseResume = (prefixUrl: string, params: any) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/plugin/parse`,
    "post",
    params
  );
};

/** 获取 简历解析和简历来源 请求 */
export const getResumeInfoRequest = (prefixUrl: string, res: any) => {
  return [
    fetchHttpRequest(
      `${prefixUrl}/gateway/recruit/api/plugin/parse`,
      "post",
      res
    ),
    fetchHttpRequest(
      `${prefixUrl}/gateway/recruit/api/plugin/check/is_resume_detail_page`,
      "post",
      { siteUrl: res.siteUrl }
    ),
  ];
};

/** 基本信息 */
export const requestBaseInfo = (prefixUrl: string) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/plugin/init`,
    "get",
    null
  );
};

/** 简历是否重复 */
export const requestResumeRepeat = (prefixUrl: string, params: any) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/plugin/check/duplication`,
    "post",
    params
  );
};

/** 简历导入 */
export const requestResumeUpload = (prefixUrl: string, params: any) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/plugin/candidate/resume/import`,
    "post",
    params
  );
};

/** parse label to value */
export const transformLabelToValue = (resumeInfo: any, baseInfo: any) => {
  const obj = {
    username: resumeInfo.name,
    mobileNo: resumeInfo.mobileNo,
    email: resumeInfo.email,
    address: resumeInfo.currentLocation,
  };
  if (resumeInfo.sex) {
    const item = (baseInfo.sexes || []).find(
      (item: any) => item.key === resumeInfo.sex
    );
    obj["sex"] = item ? item.value : undefined;
  }
  if (resumeInfo.yearWorkExperience) {
    const item = (baseInfo.experiences || []).find(
      (item: any) =>
        item.key === resumeInfo.yearWorkExperience.replace("年", "")
    );
    obj["workYear"] = item ? item.value : undefined;
  }
  if (resumeInfo.topEduDegree) {
    const item = (baseInfo.diplomaTypes || []).find(
      (item: any) => item.key === resumeInfo.topEduDegree
    );
    obj["topEduDegree"] = item ? item.value : undefined;
  }
  return obj;
};

/** parse value to label */
export const transformValueToLabel = (value: any, baseInfo: any) => {
  const obj = {
    ...value,
    currentLocation: value.address,
    yearWorkExperience: value.workYear,
    name: value.username,
  };

  delete obj.address;
  delete obj.workYear;
  delete obj.username;

  if (obj["yearWorkExperience"]) {
    const item = (baseInfo.experiences || []).find(
      (item: any) => item.value === obj["workYear"]
    );
    if (item) {
      obj["yearWorkExperience"] = item.key;
    }
  }
  return obj;
};
