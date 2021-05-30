import BossTransformClass from "./other/bossTransformClass";
import LiepinTransformClass from "./other/liepinTransformClass";
import QianChengTransformClass from "./other/qianChengTransformClass";
import LagouTransformClass from "./other/lagouTransformClass";
import ZhilianTransformClass from "./other/zhilianTransformClass";
import GanjiTransformClass from "./other/ganjiTransformClass";
import FiveTransformClass from "./other/58TransformClass";
import {
  liepinBaseData,
  qianChengBaseData,
  bossBaseData,
  lagouBaseData,
  zhilianBaseData,
  ganjiBaseData,
  fiveBaseData,
} from "./transformBaseData";

const obj = {
  liepin: {
    class: LiepinTransformClass,
    data: liepinBaseData,
  },
  qiancheng: {
    class: QianChengTransformClass,
    data: qianChengBaseData,
  },
  boss: {
    class: BossTransformClass,
    data: bossBaseData,
  },
  lagou: {
    class: LagouTransformClass,
    data: lagouBaseData,
  },
  zhilian: {
    class: ZhilianTransformClass,
    data: zhilianBaseData,
  },
  ganji: {
    class: GanjiTransformClass,
    data: ganjiBaseData,
  },
  58: {
    class: FiveTransformClass,
    data: fiveBaseData,
  },
};

/** 猎聘 */
function fillRecruiInfo(
  type: "liepin" | "qiancheng" | "boss" | "lagou" | "zhilian" | "ganji" | "58",
  value: any,
  jobDescriptionId: string,
  channelAccountId: string
) {
  console.log("fillRecruiInfo +++++ ", type, value, jobDescriptionId,channelAccountId);
  if (obj[type]) {
    const classInstance = obj[type].class;
    new classInstance(value.data, obj[type].data, jobDescriptionId,channelAccountId).fillValue();
  }
}

window.addEventListener("message", function (e) {
  if (e.data.source === "i-recruit-content" && e.origin === location.origin) {
    console.log("############## ", e.data.data);
    fillRecruiInfo(e.data.data.data.type, e.data.data.data, e.data.data.data.jobDescriptionId, e.data.data.data.channelAccountId);
  }

});

// let type = null;

// if (location.href.includes('easy.lagou.com')) {
//     type = 'lagou';
// } else if (location.href.includes('zhaopin.com')) {
//     type = 'zhilian';
// } else if (location.href.includes('51job.com')) {
//     type = 'qiancheng';
// } else if (location.href.includes('liepin.com')) {
//     type = 'liepin';
// } else if (location.href.includes('ganji.com')) {
//     type = 'ganji';
// } else if (location.href.includes('58.com')) {
//     type = '58';
// } else if (location.href.includes('zhipin.com')) {
//     type = 'boss';
// }

// console.log("fillRecruiInfo ++++++++++ ", type);

// fillRecruiInfo(type, {
//     positionName: '前端',
//     positionDescription: '职位描述 hahaha',
//     salaryMin: 3500,
//     salaryMax: 6000,
//     salaryMonth: 14,
//     salaryUnit: 0,
//     department: '开发部',
//     workExperience: [2, 5],
//     education: [50, 50],
//     positionTotal: 10
// })
