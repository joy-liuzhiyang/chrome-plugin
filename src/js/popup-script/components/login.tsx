import * as React from "react";
import http from "../../util/http";
import Button from "antd/es/button";
import LeftOutlined from "@ant-design/icons/es/icons/leftOutlined";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tag from "antd/lib/tag";

const bg = chrome.extension.getBackgroundPage() as any;

function NotResumePage() {
  return (
    <React.Fragment>
      <div className="support-text-wrap-no">
        当前页面没有需要发布的职位/求职者简历
      </div>
      <div className="support-text-wrap">
        支持拉勾、猎聘、智联、前程无忧、BOSS直聘、58同城、赶集网
      </div>
    </React.Fragment>
  );
}

function DetailInfo(props: any) {
  const { setVersionPageFun, imgSrc, onError, data } = props;
  return (
    <>
      <div className="version-wrap" onClick={setVersionPageFun}>
        {bg.version !== "1.0" ? (
          <Tag color="#FFFBF3" className="tag-area">
            New
          </Tag>
        ) : null}
        V{bg.version}
      </div>
      <div className="bottom-wrap">
        <img className="icon-img" src={imgSrc} onError={onError} />
        <div className="name-wrap">
          <p className="name-wrap-content">
            {data && data.currentCompany
              ? data.currentCompany.companyName
              : null}
          </p>
          <p className="name-wrap-content">
            {data && data.mobileNo ? data.mobileNo : null}
          </p>
        </div>
        <NotResumePage />
      </div>
    </>
  );
}

const InfoRow = React.memo((props: any) => {
  const { title, children } = props;
  return (
    <div className="version-row">
      <Row>
        <Col span={6} className="version-row-title-no">
          {title}
        </Col>
        <Col span={18}>{children}</Col>
      </Row>
    </div>
  );
});

const UpdateInfoRow = React.memo((props: any) => {
  const { title, children } = props;
  return (
    <div className="version-row">
      <Row>
        <Col span={12} className="version-row-title-no">
          {title}
        </Col>
        <Col span={12} className="version-row-title">
          {children}
        </Col>
      </Row>
    </div>
  );
});

// function aa

function VersionPage(props: any) {
  const { setVersionPageBackFun } = props;
  return (
    <div>
      <header className="version-header-wrap">
        <Button
          type="primary"
          size="small"
          icon={<LeftOutlined />}
          onClick={setVersionPageBackFun}
        />
        <span>查看版本号</span>
      </header>
      <UpdateInfoRow title="当前版本号：V1.0">
        {bg.version !== "1.0" ? (
          <Button
            className="button-to-upate"
            type="primary"
            size="small"
            onClick={() => alert("TODO")}
          >
            立即更新
          </Button>
        ) : null}
      </UpdateInfoRow>
      <InfoRow title="最新版本号：V1.0"></InfoRow>
      <InfoRow title="">1.新增保存简历功能</InfoRow>
      <InfoRow title="">2.新增发布职位功能</InfoRow>
    </div>
  );
}

const LoginView = React.memo((props: any) => {
  const { data, prefixUrl } = props;
  const [isVersionPage, setVersionPage] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState("../assets/img/48.png");

  React.useEffect(() => {
    if (prefixUrl) {
      new http()
        .get(prefixUrl + "/gateway/authcenter/delegate/user/avatar", null)
        .then((res: any) => {
          if (res.res.data) {
            setImgSrc(res.res.data);
          }
        });
    }
  }, [prefixUrl]);

  const setVersionPageFun = React.useCallback(() => {
    setVersionPage(true);
  }, []);

  const setVersionPageBackFun = React.useCallback(() => {
    setVersionPage(false);
  }, []);

  const onError = React.useCallback(() => {
    setImgSrc("../assets/img/48.png");
  }, []);

  return (
    <div className="Login-wrap">
      {!isVersionPage ? (
        <DetailInfo
          setVersionPageFun={setVersionPageFun}
          imgSrc={imgSrc}
          onError={onError}
          data={data}
        />
      ) : (
        <VersionPage setVersionPageBackFun={setVersionPageBackFun} />
      )}
    </div>
  );
});

export default LoginView;

const ErrorPage = React.memo((props: any) => {
  return <div className="Login-wrap">{props.errorInfo}</div>;
});

export { ErrorPage };
