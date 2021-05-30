(window as any).autoFillRecruitInfo = (
  type: "liepin" | "qiancheng" | "boss" | "lagou" | "zhilian" | "ganji" | "58",
  data: any,
  jobDescriptionId: string,
  accountInfo: {
    userName: string;
    psd: string;
    accountName?: string;
  },
  channelAccountId: string,
) => {
  window.postMessage(
    {
      source: "i-recruit-script",
      data: {
        type,
        data,
        jobDescriptionId,
        accountInfo,
        channelAccountId
      },
    },
    "/"
  );
};
