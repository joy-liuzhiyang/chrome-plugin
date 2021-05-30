export default class publicResultClass {
  publicResultArr: { reg: string; type: string; field: string }[];

  constructor() {
    this.publicResultArr = [
      {
        reg: "^http(?:s)?://\\w+\\.58\\.com/zhaopin/post/success/(\\d+)\\?isadd=\\w+",
        type: "58",
        field: "58PublishInfo",
      },
      {
        reg: "^http(?:s)?://\\w+\\.liepin\\.com/ejobedit/showpublishejobresult\\?ejobIds=(\\d+)&ejobActionType=((update)|(publish))",
        type: "liepin",
        field: "liepinPublishInfo",
      },
      {
        reg: "^http(?:s)?://www.ganji\\.com/common/success\\.php\\?id=(\\w+)",
        type: "ganji",
        field: "ganjiPublishInfo",
      },
      {
        reg: "^http(?:s)?://\\w+.lagou\\.com/position/multiChannel/myOnlinePositions\\.htm\\?.*&parentPositionId=(\\d+)",
        type: "lagou",
        field: "lagouPublishInfo",
      },
      {
        reg: "^http(?:s)?://\\w+.zhaopin\\.com/job/manage\\?action=PUBLISH",
        type: "zhilian",
        field: "zhilianPublishInfo",
      },
      {
        reg: "^http(?:s)?://\\w+.51job\\.com/Jobs/JobTip\\.aspx\\?.*&JobId=(\\d+)",
        type: "qiancheng",
        field: "qianchengPublishInfo",
      },
    ];
    this.updatePublishResult();
  }

  //智联需要获取渠道class里的额外信息
  getOtherPublicInfo = async (publicPageItem: any, url: string) => {
    return new Promise((resolve: any) => {
      if ( publicPageItem.type === "zhilian" ) {
        chrome.storage.local.get(null, (res: any) => {
          if (res) {
            resolve(res.name);
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(new RegExp(publicPageItem.reg).exec(url)[1]);
      }
    });
  };

  publicSucess = (value: any) => {
    console.log("获取到了发布成功状态", value)
    chrome.runtime.sendMessage({
      from: 'content',
      to: 'background',
      type: 'publcResult',
      data: {
        channelAccountId: value.channelAccountId,
        channelCode: value.channelCode,
        jobDescriptionId: value.jobDescriptionId
      }
    }, (response: any) => {
      console.log("response：",response)
    })
  };

  /** 更新发布结果 */
  updatePublishResult = async () => {
    const url = decodeURIComponent(location.href);
    const publicPageItem = this.publicResultArr.find((item: any) => {
      const reg = new RegExp(item.reg);
      return reg.test(url);
    });
    console.log("publicPageItem", publicPageItem)
    if (publicPageItem) {
      const publicId = await this.getOtherPublicInfo(publicPageItem, url);
      console.log("publicId", publicId)
      if (publicPageItem && publicId) {
        chrome.storage.local.get(null, (res: any) => {
          console.log("get成功", res)
          if (res && res.field) { 
            if (res.time) {
              this.publicSucess(res);
            }
            setTimeout(() => {
              chrome.storage.local.clear(() => {});
            }, 1000);
          }
        });
      }
    }
  };
}
