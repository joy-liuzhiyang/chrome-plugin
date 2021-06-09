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
