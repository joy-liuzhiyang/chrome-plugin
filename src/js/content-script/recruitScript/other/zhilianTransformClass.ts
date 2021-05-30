import transformBaseClass from "../transformBaseClass";

class ZhilianTransformClass extends transformBaseClass {
  constructor(data: any, baseDataObj: any, id: string, channelAccountId: string) {
    super(data, baseDataObj, id, channelAccountId);
    this.domString = ".publish-form__inner.km-form";
  }

  getSubmitBtn = () => {
    let selector ='.km-button.km-control.km-ripple-off.km-button--primary.km-button--filled';
    return document.querySelectorAll(selector)[0];
  };

  getNum = (
    start: number = 30,
    step: number = 5,
    max: number = 105,
    current: number
  ) => {
    for (let i = start; i < max; i += 5) {
      if (current < i) {
        return start * 1000 + 1;
      }
    }
    return null;
  };

  getPrice = (salaryMin: number) => {
    const price = Math.floor(salaryMin);
    if (price === 0) {
      return 0;
    } else if (price <= 30) {
      return price * 1000 + 1;
    } else if (price <= 100) {
      return this.getNum(30, 5, 101, price);
    } else if (price <= 24) {
      return this.getNum(100, 10, 240, price);
    }
    return null;
  };

  getMaxNum = (start: number, current: number) => {
    if (start <= 30) {
      for (let i = start; i < 31; i += 1) {
        if (current <= i) {
          return i * 1000;
        }
      }
    }

    if (start <= 100) {
      for (let i = 100; i < 105; i += 5) {
        if (current < i) {
          return i * 1000;
        }
      }
    }

    if (start <= 240) {
      for (let i = 240; i < 250; i += 10) {
        if (current < i) {
          return i * 1000;
        }
      }
    }

    return null;
  };

  getMaxPrice = (salaryMin: number, salaryMax: number) => {
    return this.getMaxNum(salaryMin, salaryMax);
  };

  transform_workExperience = (data: any[]) => {
    if (data && data.length === 2) {
      const workExperience_array = this.baseDataObj["workExperience"];
      if (data[0] === 0 && data[1] === 99) {
        return workExperience_array[0].value;
      }

      if (data[0] === 0 && data[1] === 0) {
        return workExperience_array[1].value;
      }

      const item = workExperience_array.find((item: any, index: number) => {
        if (index > 1) {
          const rangleArray = item.range;
          return (
            Math.min(rangleArray[1], data[1]) -
              Math.max(rangleArray[0], data[0]) >=
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

  setValue = () => {
    console.log("this.result ", this.result);
    try {
      const formEle = document.querySelector(".publish-form") as any;

      if (formEle && formEle.__vue__) {
        if (this.result.positionName) {
          formEle.__vue__.job.jobTitle = this.result.positionName;
        }

        if (this.result.workExperience) {
          formEle.__vue__.job.workAge = this.result.workExperience;
        }

        if (this.result.education) {
          formEle.__vue__.job.education = this.result.education;
        }

        if (
          this.result.salaryMin &&
          (this.getPrice(this.result.salaryMin) ||
            this.getPrice(this.result.salaryMin) === 0)
        ) {
          const salaryMin = this.getPrice(this.result.salaryMin);
          formEle.__vue__.job.minSalary = salaryMin;

          if (this.result.salaryMax) {
            const salaryMax = this.getMaxPrice(
              (salaryMin - 1) / 1000,
              this.result.salaryMax
            );
            console.log("salaryMax ", salaryMax, (salaryMin - 1) / 1000);
            if (salaryMax) {
              formEle.__vue__.job.maxSalary = salaryMax;
            }
          }
        }

        if (this.result.positionTotal) {
          formEle.__vue__.job.quantity = `${this.result.positionTotal}`;
        }

        if (this.result.salaryMonth) {
          formEle.__vue__.job.salaryMonths = this.result.salaryMonth;
        }
      }

      if (this.result.positionDescription) {
        const editor = document.querySelector(".jqte_editor") as HTMLElement;
        editor && editor.focus();
        const vm = (document.querySelector(".publish-form") as any).__vue__;
        if (vm) {
          vm.$refs.jobEditor.setData(
            "<div>" +
            this.result.positionDescription.replace(/\n*$/g, "").replace(/\n/g,"</div><div>") +
              "</div>"
          );
          vm.onBlurDescription();
          setTimeout(() => {
            editor && editor.blur();
          });
        }
      }

      if (this.result.positionName) {
        const input = document.querySelector(
          '[placeholder="请输入职位名称"]'
        ) as HTMLElement;
        if (!input) {
          return;
        }
        input.focus();
        const parent = input.parentNode as any;
        if (!parent.__vue__) {
          return;
        }
        parent.__vue__.$emit("input", `${this.result.positionName}`);
        const unwatch = parent.__vue__.$parent.$watch("options", (val = []) => {
          if (val.length) {
            parent.__vue__.$parent.$nextTick(() => {
              parent.__vue__.$parent.handleSelect();
              unwatch();
            });
          }
        });
        input.blur();
      }
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  // intervalStatus = () => {
  //   const formEle = document.querySelector(".publish-form") as any;
  //   chrome.storage.local.set({
  //     zhilianPublishInfo: {
  //       time: new Date().getTime(),
  //       id: this.id,
  //       name: formEle.__vue__.job.jobTitle,
  //     },
  //   });
  // };

  intervalStatus = () => {
    //alert("渠道为智联Class" )
    const formEle = document.querySelector(".publish-form") as any;
    window.postMessage({
      source: 'i-submit-recruit-content',
      data: {
        channelAccountId: this.channelAccountId,
        channelCode: "zhilian",
        jobDescriptionId: this.id,
        field: 'zhilianPublishInfo',
        name: formEle.__vue__.job.jobTitle,

      }
    }, '/')
  };
}

export default ZhilianTransformClass;
