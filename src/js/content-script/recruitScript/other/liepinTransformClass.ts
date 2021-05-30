import transformBaseClass from "../transformBaseClass";

class LiepinTransformClass extends transformBaseClass {
  constructor(data: any, baseDataObj: any, id: string, channelAccountId: string) {
    super(data, baseDataObj, id, channelAccountId);
    console.log("JD信息",data)//JD信息
    console.log("工作经验和学历要求",baseDataObj)//该渠道的工作经验和学历要求下拉选择options
    console.log("jobDescriptionId",id)//jobDescriptionId
    console.log("channelAccountId",channelAccountId)//channelAccountId
    this.domString = '[data-selector="ejob-description-content"]';
    this.submitBtn = `document.querySelector('[data-selector=btn-publish-job]')`;
  }

  setValue = () => {
    try {
      console.log("this.result ", this.result);

      if (this.result.positionName) {
        const positionNameEle = this.getReactInstance(
          document.querySelectorAll('[data-selector="job-name-box"] input')[0]
        );
        if (positionNameEle) {
          positionNameEle.pendingProps.onChange({
            target: { value: this.result.positionName },
          });
        }
        $('[name="ejobTitle"]')
          .trigger("focus")
          .val(this.result.positionName)
          .trigger("blur");
      }

      if (this.result.positionDescription) {
        $('[data-selector="ejob-description-content"]')
          .trigger("focus")
          .val(this.result.positionDescription)
          .trigger("blur");
      }

      let salartInput = document.querySelectorAll(
        '[data-selector="job-salary"] .ant-input-group .ant-input'
      );
      if (salartInput.length >= 1 && this.result.salaryMin) {
        let instance = this.getReactInstance(salartInput[0]);
        if (instance) {
          instance.pendingProps.onChange({
            target: { value: `${this.result.salaryMin}` },
          });
          instance.pendingProps.onBlur();
        }
      }

      if (salartInput.length >= 2 && this.result.salaryMax) {
        let maxInstance = this.getReactInstance(salartInput[1]);
        if (maxInstance) {
          maxInstance.pendingProps.onChange({
            target: { value: `${this.result.salaryMax}` },
          });
          maxInstance.pendingProps.onBlur();
        }
      }

      if (this.result.salaryMonth) {
        let salartInput = document.querySelectorAll(
          '[data-selector="job-salary"] .ant-input-group .ant-input'
        );
        if (salartInput.length >= 3) {
          let salaryMonthInstance = this.getReactInstance(salartInput[2]);
          if (salaryMonthInstance) {
            salaryMonthInstance.pendingProps.onChange({
              target: { value: `${this.result.salaryMonth}` },
            });
            salaryMonthInstance.pendingProps.onBlur();
          }
        }
      }

      if (this.result.department) {
        $('[name="detailDept"]').val(this.result.department);
      }

      if (this.result.workExperience) {
        let target = document.querySelector(
          '[data-selector="change-workyear"] .ant-select .ant-select-selector'
        );
        if (target) {
          let instance = this.getReactInstance(target);
          if (instance) {
            instance.pendingProps.children.props.onSelect(
              `${this.result.workExperience}`
            );
          }
        }
      }

      if (this.result.education) {
        if (
          $(
            `[data-selector=\"edu-level\"] ul li[data-value=\"${this.result.education}\"]`
          )
        ) {
          $(
            `[data-selector=\"edu-level\"] ul li[data-value=\"${this.result.education}\"]`
          ).trigger("click");
        }
      }
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  intervalStatus = () => {
    // alert("渠道为猎聘liepinClass" )
    window.postMessage({
      source: 'i-submit-recruit-content',
      data: {
        channelAccountId: this.channelAccountId,
        channelCode: "liepin",
        jobDescriptionId: this.id,
        field: 'liepinPublishInfo'
      }
    }, '/')
  };
}

export default LiepinTransformClass;
