import versionData from "../../historyVersion";

export default class versionManger {
  constructor() {
    (window as any).version = versionData[versionData.length - 1].version;
    (window as any).allVersionInfo = versionData;
  }
}
