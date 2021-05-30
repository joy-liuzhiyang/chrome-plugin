import * as React from "react";
// import IrsButton from "ihr360-web-ui/packages/action/irs-button";
import Button from "antd/es/button";
// import { Button } from "antd";
import baseConfig from "../../util/config";

const bg = chrome.extension.getBackgroundPage() as any;

const UnLoginView = React.memo(() => {
  return (
    <div className="unLogin-wrap">
      <div className="version-wrap">V{bg.version}</div>
      <div className="bottom-wrap">
        <div>请前往登录页进行登录操作</div>
        <Button
          type="primary"
          className="login-btn"
          onClick={() => chrome.tabs.create({ url: baseConfig.loginUrl })}
        >
          登录
        </Button>
      </div>
    </div>
  );
});

export default UnLoginView;
