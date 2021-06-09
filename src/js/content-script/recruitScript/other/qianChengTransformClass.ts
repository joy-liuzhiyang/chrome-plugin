import transformBaseClass from "../transformBaseClass";

class QianChengTransformClass extends transformBaseClass {
  constructor(
    data: any,
    baseDataObj: any,
    id: string,
    channelAccountId: string
  ) {
    super(data, baseDataObj, id, channelAccountId);

    this.result = {
      ...this.result,
      ...this.transferSalaryUnit(
        this.result.salaryUnit,
        data.salaryMin,
        data.salaryMax,
        0
      ),
    };

    this.domString = "#jobdesc-editor iframe";
    this.submitBtn = "document.querySelector('#publish-button')";
  }

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
    try {
      console.log(this.result);

      if (this.result.positionName) {
        $("#jobname-input input")
          .trigger("focus")
          .val(this.result.positionName)
          .trigger("blur");
      }

      if (this.result.positionTotal) {
        $("#hirenum-input input")
          .trigger("focus")
          .val(this.result.positionTotal)
          .trigger("blur");
      }

      setTimeout(() => {
        if (document.querySelector("#salary14-button")) {
          (document.querySelector("#salary14-button") as any).click();
        }
        if (this.result.salaryMin) {
          $("#salary14-from-input input")
            .trigger("focus")
            .val(this.result.salaryMin)
            .trigger("blur");
        }
        if (this.result.salaryMax) {
          $("#salary14-to-input input")
            .trigger("focus")
            .val(this.result.salaryMax)
            .trigger("blur");
        }
      }, 100);

      if (this.result.positionDescription) {
        let iframe = document.querySelector("#jobdesc-editor iframe") as any;
        if (iframe) {
          iframe.contentDocument.body.innerHTML =
            "<div>" +
            this.result.positionDescription
              .replace(/\n*$/g, "")
              .replace(/\n/g, "</div><div>") +
            "</div>";
        }
      }

      if (this.result.workExperience) {
        const workyear = document.querySelector(
          `#workyear-select .downList a[data-value=\"${this.result.workExperience}\"]`
        ) as any;
        if (workyear) {
          workyear.click();
        }
      }

      if (this.result.education) {
        const degree = document.querySelector(
          `#degree-select .downList a[data-value=\"${this.result.education}\"]`
        ) as any;
        if (degree) {
          degree.click();
        }
      }
      this.submit();
    } catch (error) {
      console.log("error", error);
    }
  };

  intervalStatus = () => {
    // alert("渠道为前程无忧Class" )
    window.postMessage(
      {
        source: "i-submit-recruit-content",
        data: {
          channelAccountId: this.channelAccountId,
          channelCode: "51job",
          jobDescriptionId: this.id,
          field: "qianchengPublishInfo",
        },
      },
      "/"
    );
  };
}

export default QianChengTransformClass;
