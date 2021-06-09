import transformBaseClass from "../transformBaseClass";

class GanjiTransformClass extends transformBaseClass {
  constructor(
    data: any,
    baseDataObj: any,
    id: string,
    channelAccountId: string
  ) {
    super(data, baseDataObj, id, channelAccountId);
    this.delay = 2000;

    this.submitBtn = `document.querySelector('#pub-post')`;
  }

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

  getPrice = (salaryMin: number) => {
    const price = Math.floor(salaryMin);
    if (price === 0) {
      return 1;
    } else if (price >= 1 && price < 2) {
      return 2;
    } else if (price >= 2 && price < 3) {
      return 3;
    } else if (price >= 3 && price < 5) {
      return 4;
    } else if (price >= 5 && price < 8) {
      return 5;
    } else if (price >= 8 && price < 12) {
      return 6;
    } else if (price >= 12 && price < 20) {
      return 7;
    } else {
      return 8;
    }
  };

  setValue = () => {
    try {
      console.log("ganji ", this.result);
      if (this.result.positionName) {
        $('[name="title"]')
          .trigger("focus")
          .val(this.result.positionName)
          .trigger("blur");
      }

      if (this.result.positionTotal) {
        $('[name="need_num"]')
          .trigger("focus")
          .val(this.result.positionTotal)
          .trigger("blur");
      }

      if (this.result.workExperience) {
        const work_yearsEle = document.querySelector('[name="work_years"]');
        if (work_yearsEle && work_yearsEle.nextSibling) {
          if (
            (
              document.querySelector('[name="work_years"]').nextSibling as any
            ).querySelector(`[data-value=\"${this.result.workExperience}\"]`)
          ) {
            (document.querySelector('[name="work_years"]').nextSibling as any)
              .querySelector(`[data-value=\"${this.result.workExperience}\"]`)
              .click();
          }
        }
      }

      if (this.result.education) {
        const degreeEle = document.querySelector('[name="degree"]');
        if (degreeEle && degreeEle.nextSibling) {
          if (
            (degreeEle.nextSibling as any).querySelector(
              `[data-value=\"${this.result.education}\"]`
            )
          ) {
            (degreeEle.nextSibling as any)
              .querySelector(`[data-value=\"${this.result.education}\"]`)
              .click();
          }
        }
      }

      if (this.result.salaryMin) {
        const priceEle = document.querySelector('[name="price"]');
        if (priceEle && priceEle.nextSibling) {
          if (
            (priceEle.nextSibling as any).querySelector(
              `[data-value=\"${this.getPrice(this.result.salaryMin)}\"]`
            )
          ) {
            (priceEle.nextSibling as any)
              .querySelector(
                `[data-value=\"${this.getPrice(this.result.salaryMin)}\"]`
              )
              .click();
          }
        }
      }

      if (this.result.positionDescription) {
        $("#id_description")
          .trigger("focus")
          .val(this.result.positionDescription)
          .trigger("blur");
      }
      this.submit();
    } catch (e) {
      console.log("error ", e);
    }
  };

  intervalStatus = () => {
    // alert("渠道为赶集Class" )
    window.postMessage(
      {
        source: "i-submit-recruit-content",
        data: {
          channelAccountId: this.channelAccountId,
          channelCode: "ganjiwang",
          jobDescriptionId: this.id,
          field: "ganjiPublishInfo",
        },
      },
      "/"
    );
  };
}

export default GanjiTransformClass;
