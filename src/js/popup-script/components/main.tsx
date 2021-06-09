import * as React from "react";
import Spin from "antd/es/spin";
import UnLoginView from "./unLogin";
import LoginView, { ErrorPage } from "./login";
import {
  getActiveTab,
  getLoginStatus,
  requestBaseInfo,
  requestCheckResumePage,
  requestParseResume,
} from "../util/logic";
import message from "antd/lib/message";
import AnalysisView from "./analysisView";
import "antd/es/button/style/index.less";
import "antd/es/form/style/index.less";
import "antd/es/spin/style/index.less";
import "antd/es/input/style/index.less";
import "antd/es/select/style/index.less";
import "antd/es/grid/style/index.less";
import "antd/es/alert/style/index.less";
import "antd/es/empty/style/index.less";
import "antd/es/menu/style/index.less";
import "antd/es/dropdown/style/index.less";
import "antd/es/tree-select/style/index.less";
import "antd/es/message/style/index.less";

class PopupView extends React.PureComponent<any, any> {
  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      bgWin: chrome.extension.getBackgroundPage(),
      isLogin: false,
      tabData: {},
      hasResume: false,
      resumeInfo: null,
      analysising: false,
      judging: true,
      baseInfo: null,
      checking: false,
      isRepeat: false,
      siteUrl: "",
    };
  }

  requestBaseInfo = () => {
    if (!this.state.baseInfo) {
      requestBaseInfo(this.state.prefixUrl).then((res: any) => {
        console.log("baseInfo --- ", res);
        this.setState({
          baseInfo: res.res.data,
        });
      });
    }
  };

  componentDidMount() {
    /** 获取登录状态 */
    this.state.bgWin.loginStatusChange((loginStatus) => {
      let isLogin = loginStatus.isLogin;
      this.setState(
        {
          isLogin: isLogin,
          userName: loginStatus.data ? loginStatus.data.username : "",
          tabData: loginStatus.data,
          prefixUrl: loginStatus.url,
          // analysising: false,
          // hasResume: true
        },
        () => {
          console.log("登录状态的this.state.prefixUrl", this.state.prefixUrl);
          setTimeout(async () => {
            if (isLogin) {
              //再次验证登录状态
              const status = await getLoginStatus(loginStatus.url);
              if (this.state.prefixUrl === loginStatus.url && !status) {
                this.state.bgWin.logout();
                isLogin = false;
                this.setState({
                  vaildLogin: false,
                });
              } else {
                this.setState({
                  vaildLogin: true,
                });
              }
            }
            if (isLogin) {
              //请求基本信息
              this.requestBaseInfo();
              this.dealOtherInfo();
            }
          }, 2000);
        }
      );
    });
  }

  componentDidCatch() {
    this.setState({
      isCatch: true,
    });
  }

  dealOtherInfo = async () => {
    const tab = (await getActiveTab()) as any;
    /** 后端判断是否为简历页面 */
    const resumePageObj = await requestCheckResumePage(this.state.prefixUrl, {
      siteUrl: tab.url,
    });

    if (resumePageObj && resumePageObj.channelDetailPage) {
      console.log("开始获取简历信息");
      chrome.tabs.sendMessage(
        tab.id,
        {
          form: "popup",
          to: "content",
          type: "resume-page",
          data: resumePageObj,
        },
        (res: any) => {
          console.log("获取简历信息完成 ", res);

          if (res && !res.errorInfo) {
            this.setState(
              {
                hasResume: true,
                analysising: true,
                siteUrl: res.siteUrl,
                judging: false,
              },
              () => {
                requestParseResume(this.state.prefixUrl, res).then(
                  (res1: any) => {
                    // const res1 = {
                    //     status: 200,
                    //     res: {
                    //         code: 0,
                    //         data: {
                    //             currentLocation: null,
                    //             email: "15673302767@163.com",
                    //             ihrResume: { companyId: null, id: null, sourceResumeNo: null, resumeType: null, createdDate: null, },
                    //             mobileNo: "15673302767",
                    //             name: "张天天",
                    //             sex: null,
                    //             sourceId: 2,
                    //             sourceResumeNo: null,
                    //             topEduDegree: "本科",
                    //             yearWorkExperience: "3",
                    //         }
                    //     }
                    // }
                    console.log("res1 -----", res1);
                    if (
                      res1.status === 200 &&
                      res1.res &&
                      res1.res.code === 0 &&
                      res1.res.data
                    ) {
                      this.setState({
                        hasResume: true,
                        analysising: false,
                        resumeInfo: res1.res.data,
                        checking: true,
                        isRepeat: false,
                        fileContent: res.fileContent,
                      });
                    } else {
                      message.error(
                        res.res ? res.res.message || "解析失败" : "解析失败",
                        3
                      );
                    }
                  }
                );
              }
            );
          } else {
            const obj = {
              resumeInfo: null,
              analysising: false,
              hasResume: false,
              checking: false,
              isRepeat: false,
            };
            if (res && res.errorInfo) {
              obj["errorInfo"] = res.errorInfo;
            }
            this.setState({
              ...obj,
            });
          }
        }
      );
    } else {
      this.setState({
        resumeInfo: null,
        analysising: false,
        hasResume: false,
        checking: false,
        isRepeat: false,
        judging: false,
      });
    }
  };

  render() {
    const {
      isLogin,
      tabData,
      prefixUrl,
      hasResume,
      resumeInfo,
      analysising,
      baseInfo,
      siteUrl,
      fileContent,
      errorInfo,
      judging,
    } = this.state;
    return (
      <div className="popup-class-wrap">
        <Spin
          delay={0}
          spinning={isLogin ? judging : false}
          tip="正在检查当前页面..."
        >
          {isLogin ? (
            !hasResume ? (
              <LoginView data={tabData} prefixUrl={prefixUrl} />
            ) : errorInfo ? (
              <ErrorPage errorInfo={errorInfo} />
            ) : (
              <AnalysisView
                baseInfo={baseInfo}
                resumeInfo={resumeInfo}
                prefixUrl={prefixUrl}
                siteUrl={siteUrl}
                analysising={analysising}
                fileContent={fileContent}
              />
            )
          ) : (
            <UnLoginView />
          )}
        </Spin>
      </div>
    );
  }
}

export default PopupView;
