import debounce from "lodash-es/debounce";

interface IData {
  /** 职位名称 */
  positionName?: string;
  /** 职位描述 */
  positionDescription?: string;
  /** 工作经验 */
  workExperience?: any[];
  /** 教育经历 */
  education?: any[];
  /** 薪资 */
  salaryMin?: number;
  salaryMax?: number;
  /** 薪资单位 */
  salaryUnit?: number;
  /** 多少薪 默认12 */
  salaryMonth?: number;
  /** 部门 */
  department?: string;
  /** 招聘人数 */
  positionTotal?: number;
}

export default class transformBaseClass {
  result: {
    /** 职位名称 */
    positionName?: string;
    /** 职位描述 */
    positionDescription?: string;
    /** 工作经验 */
    workExperience?: string;
    /** 教育经历 */
    education?: string;
    /** 薪资 */
    salaryMin?: number;
    salaryMax?: number;
    /** 薪资单位 */
    salaryUnit?: number;
    /** 多少薪 默认12 */
    salaryMonth?: number;
    /** 部门 */
    department?: string;
    /** 招聘人数 */
    positionTotal?: number;
  };
  baseDataObj: any;
  domString: string;
  delay: number;
  submitBtn: any;
  submitTimer: any;
  type: string;
  id: string;
  channelAccountId: string

  constructor(data: any, baseDataObj: any, id: string, channelAccountId: string) {
    this.baseDataObj = baseDataObj;
    this.channelAccountId = channelAccountId;
    this.result = {
      positionName: data.positionName,
      positionDescription: data.positionDescription,
      positionTotal: data.positionTotal,
      department: data.department,
    };
    this.id = id;
    this.domString = "";
    this.delay = 3000;
    this.submitTimer = null;

    this.submitBtn = `document.querySelector(".frame-box iframe").contentDocument.querySelector('button[type="submit"]')`//--------

    if (data.workExperience) {
      this.result["workExperience"] = this.transform_workExperience(
        data.workExperience
      );
    }

    if (data.education) {
      this.result["education"] = this.transform_education(data.education);
    }

    this.result["salaryUnit"] = data.salaryUnit || 0;
    this.result["salaryMonth"] = data.salaryMonth || 12;

    // 默认转成以k为单位
    this.result = {
      ...this.result,
      ...this.transferSalaryUnit(
        this.result.salaryUnit,
        data.salaryMin,
        data.salaryMax,
        3
      ),
    };
  }

  getReactInstance = (element: Element) => {
    if (!element) return null;
    const key = Object.keys(element).find((key) =>
      key.startsWith("__reactInternalInstance")
    );
    if (!key) return null;
    return element[key];
  };

  transferUnitFun = (salaryUnit: number, transferUnit: number) => {
    return Math.pow(10, salaryUnit) / Math.pow(10, transferUnit);
  };

  transferSalaryUnit = (
    salaryUnit: number = 0,
    salaryMin: any,
    salaryMax: any,
    transferUnit: number
  ) => {
    const ratio = this.transferUnitFun(salaryUnit, transferUnit);
    return {
      salaryMin: salaryMin
        ? ratio === 1
          ? salaryMin
          : Math.floor(ratio * salaryMin)
        : 0,
      salaryMax: salaryMax
        ? ratio === 1
          ? salaryMax
          : Math.ceil(ratio * salaryMax)
        : 0,
    };
  };

  transform_workExperience = (data: any[]) => {
    if (data && data.length === 2) {
      const workExperience_array = this.baseDataObj["workExperience"];
      if (data[0] === 0 && data[1] === 99) {
        return workExperience_array[0].value;
      }
      const item = workExperience_array.find((item: any, index: number) => {
        if (index > 0) {
          const rangleArray = item.range;
          return (
            Math.min(rangleArray[1], data[1]) -
              Math.max(rangleArray[0], data[0]) >
            0
          );
        }
        return false;
      });
      if (item) {
        return item.value;
      }
    }
    return undefined;
  };

  transform_education = (data: any[]) => {
    if (data && data.length === 2) {
      const education_obj = this.baseDataObj["education"];

      if (data[0] === 0 && data[1] === 999) {
        return education_obj[0].value;
      }

      const item = education_obj.find((item: any, index: number) => {
        if (index > 0) {
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

  observerPromise = (resolve: any) => {
    const dom = document.querySelector(this.domString);
    let hasobserver = true;
    let time1 = null;

    const fun = debounce((observer?: any) => {
      if (hasobserver && observer) {
        hasobserver = false;
        observer.disconnect();
        resolve();
      }
    }, 500);

    if (dom) {
      fun();
      let observer = new MutationObserver((e) => {
        console.log("ee!!! ", e);
        fun(observer);
        clearTimeout(time1);
        time1 = setTimeout(() => {
          clearTimeout(time1);
          if (hasobserver) {
            hasobserver = false;
            observer.disconnect();
            resolve();
          }
        }, 1000);
      });

      const time = setTimeout(() => {
        hasobserver = false;
        observer.disconnect();
        resolve();
        clearTimeout(time);
      }, this.delay);

      observer.observe(dom, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    } else {
      setTimeout(() => {
        resolve();
      }, this.delay);
    }
  };

  getDomWrap = (resolve: any) => {
    if (document.querySelector(this.domString)) {
      resolve();
    } else {
      setTimeout(() => this.getDomWrap(resolve), 50);
    }
  };

  getDomWrapPromise = () => {
    return new Promise((resolve: any) => {
      this.getDomWrap(resolve);
    });
  };

  getDom = async () => {
    return new Promise((resolve: any) => {
      console.time("222");
      Promise.race([this.timePromise(), this.getDomWrapPromise()]).then(() => {
        console.timeEnd("222");
        resolve();
      });
    });
  };

  timePromise = (delay: number = this.delay) => {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  isReady = () => {
    return Promise.race([this.timePromise(), this.getDom()]);
  };

  delayFun = (time: number, callBack: any) => {
    setTimeout(() => {
      try {
        callBack();
      } catch (error) {
        console.log("delayFun error ", error);
      }
    }, time);
  };

  fillValue = () => {
    console.time("开始回填");
    this.isReady().then(() => {
      console.timeEnd("开始回填");
      this.setValue();
    });
  };

  setValue = () => {
    this.submit();
  };

  publishSuccess = (name: string) => {
    console.log(name); //publishSuccess
  };

  intervalStatus = () => {};

  submit = () => {
    let submitBtnDom;
    if ((this as any).getSubmitBtn) {
      submitBtnDom = (this as any).getSubmitBtn();
    } else {
      submitBtnDom = eval(this.submitBtn);
    }
    if (submitBtnDom) {
      submitBtnDom.addEventListener("click", () => {
        this.intervalStatus();
      });
    }
  };
}
