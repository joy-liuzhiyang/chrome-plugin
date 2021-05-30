import transformBaseClass from "../transformBaseClass";

class FiveTransformClass extends transformBaseClass {
  constructor(data: any, baseDataObj: any, id: string, channelAccountId: string) {
    super(data, baseDataObj, id, channelAccountId);

    this.id = id;

    this.domString = "#experienceid";

    this.result = {
      ...this.result,
      ...this.transferSalaryUnit(
        this.result.salaryUnit,
        data.salaryMin,
        data.salaryMax,
        0
      ),
    };
    this.type = "58";

    this.submitBtn = "document.querySelector('button#submit')";
  }

  setValue = () => {
    console.log("this.result ", this.result);
    try {
      if (this.result.positionName) {
        const titleEle = this.getReactInstance(
          document.querySelector("#title")
        );
        if (titleEle) {
          titleEle._currentElement.props.onChange({
            target: {
              value: this.result.positionName,
            },
          });
          titleEle._currentElement.props.onBlur({
            target: {
              value: this.result.positionName,
            },
          });
        }
      }

      if (this.result.positionTotal) {
        const personnumberEle = this.getReactInstance(
          document.querySelector("#personnumber")
        );
        if (personnumberEle) {
          personnumberEle._currentElement.props.onChange({
            target: {
              value: `${this.result.positionTotal}`,
            },
          });
          personnumberEle._currentElement.props.onBlur({
            target: {
              value: `${this.result.positionTotal}`,
            },
          });
        }
      }

      if (this.result.salaryMin) {
        const minSalaryEle = this.getReactInstance(
          document.querySelector("#minSalaryValue")
        );
        if (minSalaryEle) {
          minSalaryEle._currentElement.props.onChange({
            target: {
              value: `${this.result.salaryMin}`,
            },
          });
          minSalaryEle._currentElement.props.onBlur({
            target: {
              value: `${this.result.salaryMin}`,
            },
          });
        }
      }

      if (this.result.salaryMax) {
        const maxSalaryEle = this.getReactInstance(
          document.querySelector("#maxSalaryValue")
        );
        if (maxSalaryEle) {
          maxSalaryEle._currentElement.props.onChange({
            target: {
              value: `${this.result.salaryMax}`,
            },
          });
          maxSalaryEle._currentElement.props.onBlur({
            target: {
              value: `${this.result.salaryMax}`,
            },
          });
        }
      }

      if (this.result.workExperience) {
        const educationEle = this.getReactInstance(
          document.querySelector("#experienceid").parentElement
        );
        if (educationEle) {
          educationEle._currentElement._owner._instance.handleMenuClick(
            (this.result.workExperience as any).index,
            (this.result.workExperience as any).item
          );
        }
      }

      if (this.result.education) {
        const educationEle = this.getReactInstance(
          document.querySelector("#eduid").parentElement
        );
        if (educationEle) {
          educationEle._currentElement._owner._instance.handleMenuClick(
            (this.result.education as any).index,
            (this.result.education as any).item
          );
        }
      }

      if (this.result.positionDescription) {
        const contentEle = this.getReactInstance(
          document.querySelector("#content")
        );
        if (contentEle) {
          contentEle._currentElement.props.onChange({
            target: {
              value: `${this.result.positionDescription}`,
            },
          });
          contentEle._currentElement.props.onBlur({
            target: {
              value: `${this.result.positionDescription}`,
            },
          });
        }
      }
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  // intervalStatus = () => {
  //   chrome.storage.local.set({
  //     "58PublishInfo": {
  //       time: new Date().getTime(),
  //       id: this.id,
  //     },
  //   });
  // };

  intervalStatus = () => {
    // alert("渠道为58同城liepinClass" )
    window.postMessage({
      source: 'i-submit-recruit-content',
      data: {
        channelAccountId: this.channelAccountId,
        channelCode: "58tongcheng",
        jobDescriptionId: this.id,
        field: '58PublishInfo'
      }
    }, '/')
  };
}

export default FiveTransformClass;
