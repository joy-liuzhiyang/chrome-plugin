import transformBaseClass from "../transformBaseClass";

class BossTransformClass extends transformBaseClass {
  constructor(
    data: any,
    baseDataObj: any,
    id: string,
    channelAccountId: string
  ) {
    super(data, baseDataObj, id, channelAccountId);
    console.log("data", data);
    console.log("baseDataObj", baseDataObj);
    console.log("id", id);
    console.log("channelAccountId", channelAccountId);
    this.domString = "iframe .textarea-container textarea";
    this.delay = 10000;
    this.submitBtn = `document.querySelector(".frame-box iframe").contentDocument.querySelector('button[type="submit"]')`;
  }

  transform_education = (data: any[]) => {
    if (data && data.length === 2) {
      const education_obj = this.baseDataObj["education"];
      if (data[0] === 0 && data[1] === 999) {
        return education_obj[0].value;
      }
      if (data[0] === 0 && data[1] === 5) {
        return education_obj[1].value;
      }
      const item = education_obj.find((item: any, index: number) => {
        if (index > 1) {
          const rangleArray = item.range;
          return rangleArray[0] === data[0];
        }
        return false;
      });
      if (item) {
        return item.value;
      }
    }
    return undefined;
  };

  getCloseSalary = (list: any) => {
    let index = list.findIndex(
      (item: any) => this.result.salaryMin <= item.code
    );
    index =
      list[index].code === this.result.salaryMin
        ? index
        : index > 0
        ? index - 1
        : 0;
    return list[index].code;
  };

  getMaxSalary = (list: any) => {
    let index = list.findIndex(
      (item: any) => this.result.salaryMax <= item.code
    );
    index = index < 0 ? 0 : index;
    return list[index].code;
  };

  getDomWrap = (resolve: any) => {
    if (
      document.querySelector("iframe") &&
      document
        .querySelector("iframe")
        .contentDocument.querySelector(".textarea-container textarea")
    ) {
      resolve();
    } else {
      setTimeout(() => this.getDomWrap(resolve), 50);
    }
  };

  queryDomWrap = (resolve: any) => {
    if (
      document
        .querySelector("iframe")
        .contentDocument.querySelector(".lowSarlay")
    ) {
      resolve();
    } else {
      setTimeout(() => this.queryDomWrap(resolve), 50);
    }
  };

  querySelectorDom = () => {
    return new Promise((resolve: any) => {
      this.queryDomWrap(resolve);
    });
  };

  querySalaryMaxDom = () => {
    document
      .querySelector("iframe")
      .contentDocument.querySelector(".lowSarlay");
  };

  setValue = async () => {
    await this.querySelectorDom();

    const contentDocument = document.querySelector("iframe").contentDocument;
    try {
      this.delayFun(100, () => {
        if (this.result.positionName) {
          this.delayFun(100, () => {
            const positionNameEle = contentDocument.querySelector(
              ".job-name"
            ) as any;
            if (positionNameEle && positionNameEle.__vue__) {
              positionNameEle.__vue__.$options._parentVnode.componentInstance.jobNameFocus();
              positionNameEle.__vue__.jobName = this.result.positionName;
              positionNameEle.__vue__.$options._parentVnode.componentInstance.jobNameBlur();
              positionNameEle.value = this.result.positionName;
            }
          });
        }
        if (this.result.positionDescription) {
          const positionDescriptionEle = contentDocument.querySelector(
            ".performance-row"
          ) as any;
          if (positionDescriptionEle && positionDescriptionEle.__vue__) {
            positionDescriptionEle.__vue__.$options._parentVnode.componentInstance.onFocus();
            positionDescriptionEle.__vue__.description =
              `${this.result.positionDescription}`.replace(/\\n/gi, "\\\\n");
            positionDescriptionEle.__vue__.$options._parentVnode.componentInstance.onBlur();
          }
        }
      });

      if (this.result.workExperience) {
        const workExperienceEle = contentDocument.querySelector(
          ".experience-select"
        ) as any;
        if (workExperienceEle && workExperienceEle.__vue__) {
          workExperienceEle.__vue__._data.values = this.result.workExperience;
        }
      }

      if (this.result.education) {
        const educationEle = contentDocument.querySelector(".experience-select")
          .nextSibling.nextSibling as any;
        if (educationEle && educationEle.__vue__) {
          educationEle.__vue__._data.values = this.result.education;
        }
      }

      this.delayFun(700, () => {
        if (this.result.salaryMin) {
          let salaryMinEle = contentDocument.querySelector(".lowSarlay") as any;
          if (
            salaryMinEle &&
            salaryMinEle.parentElement &&
            salaryMinEle.parentElement.__vue__
          ) {
            if (salaryMinEle && salaryMinEle.__vue__) {
              const value = this.getCloseSalary(
                salaryMinEle.parentElement.__vue__.salarryList
              );
              salaryMinEle.__vue__._data.values = [
                { label: value + "k", value },
              ];
            }
          }

          this.delayFun(100, () => {
            const warpEle = contentDocument.querySelector(
              ".scope-selecter"
            ) as any;
            if (
              this.result.salaryMax &&
              warpEle &&
              warpEle.children.length === 3
            ) {
              const salaryMaxEle = warpEle.children[2];
              if (salaryMaxEle && salaryMaxEle.__vue__) {
                const value = this.getMaxSalary(warpEle.__vue__.selectableList);
                salaryMaxEle.__vue__._data.values = [
                  { label: value + "k", value },
                ];
              }
            }
          });

          if (this.result.salaryMonth) {
            this.delayFun(100, () => {
              const salaryMonthEle = contentDocument.querySelector(
                ".salaryMonth-select"
              ) as any;
              if (salaryMonthEle && salaryMonthEle.__vue__) {
                salaryMonthEle.__vue__._data.values = [
                  {
                    label: this.result.salaryMonth + "个月",
                    value: `${this.result.salaryMonth}`,
                  },
                ];
              }
            });
          }
        }
      });
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  submit = () => {
    const submitBtnDom = (
      document.querySelector(".frame-box iframe") as any
    ).contentDocument.querySelector('button[type="submit"]');
    if (submitBtnDom) {
      submitBtnDom.addEventListener("click", () => {
        clearTimeout(this.submitTimer);

        // window.postMessage({
        //     source: 'i-recruit-boss-submit-script',
        // }, '/');

        this.submitTimer = setTimeout(() => {
          clearTimeout(this.submitTimer);
          this.intervalStatus();
        }, 1000);
      });
    }
  };

  intervalStatus = () => {
    const myWindow = window as any;
    clearInterval(myWindow.submitBossIntervalTimer);
    myWindow.intervalStart = new Date().getTime();
    const iframeDom = $("iframe").contents();
    const selector = iframeDom.find(
      '.job-manage-container input[name="jobName"]'
    );
    const currentJobName = $(selector).val();
    myWindow.submitBossIntervalTimer = setInterval(() => {
      myWindow.intervalEnd = new Date().getTime();
      if (window.location.href === "https://www.zhipin.com/web/boss/job/list") {
        // this.publishSuccess(currentJobName)
        window.postMessage(
          {
            source: "i-recruit-boss-submit-script",
            data: {
              channelAccountId: this.channelAccountId,
              channelCode: "bosszhipin",
              jobDescriptionId: this.id,
            },
          },
          "/"
        );
        myWindow.submitBossIntervalTimer = clearInterval(
          myWindow.submitBossIntervalTimer
        );
      } else if (document.body.innerText.includes("发布成功")) {
        // this.publishSuccess(currentJobName)
        // 针对弹窗
        window.postMessage(
          {
            source: "i-recruit-boss-submit-script",
            data: {
              channelAccountId: this.channelAccountId,
              channelCode: "bosszhipin",
              jobDescriptionId: this.id,
            },
          },
          "/"
        );
        myWindow.submitBossIntervalTimer = clearInterval(
          myWindow.submitBossIntervalTimer
        );
      }
      // 20秒之后清除定时器
      if (myWindow.intervalEnd - myWindow.intervalStart > 20 * 1000) {
        myWindow.submitBossIntervalTimer = clearInterval(
          myWindow.submitBossIntervalTimer
        );
      }
    }, 1000);
  };
}

export default BossTransformClass;
