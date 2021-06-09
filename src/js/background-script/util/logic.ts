import http from "../../util/http";
import { fetchHttpRequest } from "../../util/help";

export function getInitLoginInfo() {
  return new Promise((resolve: any, reject: any) => {
    chrome.storage.sync.get(["ihrResumeData"], function (value) {
      if (value.ihrResumeData) {
        const valueObj = {
          ...JSON.parse(value.ihrResumeData),
        };
        new http()
          .get(
            `${valueObj.url}/gateway/component/manage/api/component/topbar/theme`,
            null
          )
          .then((res) => {
            if (res.status === 401) {
              resolve(null);
            } else {
              resolve(valueObj);
            }
          });
      } else {
        resolve(null);
      }
    });
  });
}

/** 更新发布状态 */
export const updatePulishStatus = (prefixUrl: string, params: any) => {
  return fetchHttpRequest(
    `${prefixUrl}/gateway/recruit/api/jd/channel/publish`,
    "post",
    params
  );
};
