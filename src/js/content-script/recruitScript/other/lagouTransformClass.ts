import transformBaseClass from "../transformBaseClass";

class LagouTransformClass extends transformBaseClass {
  constructor(
    data: any,
    baseDataObj: any,
    id: string,
    channelAccountId: string
  ) {
    super(data, baseDataObj, id, channelAccountId);
    this.domString = "#positionDesc";
  }

  getSubmitBtn = () => {
    let btnDomList = document.querySelectorAll("button");
    let btnDom = null;
    btnDomList.forEach((dom) => {
      if (dom.innerText == "发布") {
        btnDom = dom;
      }
    });
    return btnDom;
  };

  transform_education = (data: any[]) => {
    if (data && data.length === 2) {
      const education_obj = this.baseDataObj["education"];
      if (data[0] === 0 && data[1] === 999) {
        return education_obj[0].value;
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
    try {
      if (this.result.positionName) {
        const positionNameEle = this.getReactInstance(
          document.querySelector("#positionName")
        );
        if (positionNameEle) {
          positionNameEle._currentElement.props.onChange({
            target: { value: `${this.result.positionName}` },
          });
        }
      }

      if (this.result.workExperience) {
        const workYearEle = this.getReactInstance(
          document.querySelector("#workYear")
        );
        if (workYearEle) {
          workYearEle._currentElement._owner._instance.fireChange([
            `${this.result.workExperience}`,
          ]);
        }
      }

      if (this.result.education) {
        const educationEle = this.getReactInstance(
          document.querySelector("#education")
        );
        if (educationEle) {
          educationEle._currentElement._owner._instance.fireChange([
            `${this.result.education}`,
          ]);
        }
      }

      if (this.result.salaryMin) {
        const salaryMinEle = this.getReactInstance(
          document.querySelector("#salaryMin")
        );
        if (salaryMinEle) {
          salaryMinEle._currentElement.props.onChange({
            target: {
              value: `${this.result.salaryMin}`,
            },
          });
        }
      }

      if (this.result.salaryMax) {
        const salaryMaxEle = this.getReactInstance(
          document.querySelector("#salaryMax")
        );
        if (salaryMaxEle) {
          salaryMaxEle._currentElement.props.onChange({
            target: {
              value: `${this.result.salaryMax}`,
            },
          });
        }
      }

      if (this.result.salaryMonth) {
        const salaryMonthEle = this.getReactInstance(
          document.querySelector("#salaryMonth")
        );
        if (salaryMonthEle) {
          salaryMonthEle._currentElement._owner._instance.fireChange([
            `${this.result.salaryMonth}`,
          ]);
        }
      }

      if (this.result.positionDescription) {
        const positionDescEle = this.getReactInstance(
          document.querySelector("#positionDesc")
        );
        if (positionDescEle) {
          positionDescEle._currentElement.props.onChange({
            target: {
              value: this.result.positionDescription.replace(/\\n/gi, "\\\\n"),
            },
          });
        }
      }
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  intervalStatus = () => {
    // alert("渠道为勾Class" )
    window.postMessage(
      {
        source: "i-submit-recruit-content",
        data: {
          channelAccountId: this.channelAccountId,
          channelCode: "lagouwang",
          jobDescriptionId: this.id,
          field: "lagouPublishInfo",
        },
      },
      "/"
    );
  };
}

export default LagouTransformClass;
