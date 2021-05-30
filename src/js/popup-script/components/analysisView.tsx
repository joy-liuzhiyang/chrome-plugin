import * as React from "react";
import Spin from "antd/es/spin";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Row from "antd/es/row";
import Col from "antd/es/col";
import Alert from "antd/lib/alert";
import Button from "antd/es/button";
import MyTreeSelect from "./component/MyTreeSelect";
import MySelect from "./component/MySelect";
import {
  requestResumeRepeat,
  requestResumeUpload,
  transformLabelToValue,
  transformValueToLabel,
} from "../util/logic";

const FormItem = Form.Item;

function MobileNoView(props: any) {
  const option = [
    {
      label: "+86",
      value: "86",
    },
  ];
  return (
    <Row>
      <Col span={24}>
        <Input
          {...props}
          allowClear={true}
          addonBefore={
            <MySelect
              showSearch={false}
              className="select-before"
              value="86"
              option={option}
              allowClear={false}
            />
          }
        />
      </Col>
    </Row>
  );
}

const AnalysisFormView = React.memo((props: any) => {
  console.log("AnalysisFormView ----- ", props);

  const ref = React.useRef();

  React.useImperativeHandle(props.forwardRef, () => {
    return ref.current;
  });

  return (
    <Form colon={false} autoComplete="off" ref={ref} onFinish={props.submit}>
      <Row>
        <Col span={11}>
          <FormItem name="username">
            <Input
              allowClear={true}
              placeholder="姓名"
              {...(props["username"] || {})}
            />
          </FormItem>
        </Col>
        <Col span={11} offset={2}>
          <FormItem name="sex">
            <MySelect placeholder="请选择性别" {...(props["sex"] || {})} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem name="position">
            <MySelect
              placeholder="请选择应聘职位"
              {...(props["position"] || {})}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={11}>
          <FormItem name="workYear">
            <MySelect placeholder="工作年限" {...(props["workYear"] || {})} />
          </FormItem>
        </Col>
        <Col span={11} offset={2}>
          <FormItem name="topEduDegree">
            <MySelect placeholder="学历" {...(props["topEduDegree"] || {})} />
          </FormItem>
        </Col>
      </Row>
      <FormItem name="mobileNo">
        <MobileNoView placeholder="联系电话" {...(props["mobileNo"] || {})} />
      </FormItem>
      <Row>
        <Col span={24}>
          <FormItem name="email">
            <Input placeholder="邮箱" {...(props["email"] || {})} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem name="address">
            <Input placeholder="所在城市" {...(props["address"] || {})} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem name="note">
            <MyTreeSelect {...(props["note"] || {})} />
          </FormItem>
        </Col>
      </Row>
      <div className="submit-btn-wrap">
        <Button type="primary" htmlType="submit" loading={props.submitLoading}>
          保存
        </Button>
      </div>
    </Form>
  );
});

const ForwordAnalysisFormView = React.forwardRef((props: any, ref: any) => {
  return <AnalysisFormView {...props} forwardRef={ref} />;
});

function getAlertProps(
  status: "checking" | "repeat" | "noRepeat" | "saveFail" | "saveSuccess",
  url?: any
): any {
  switch (status) {
    case "checking":
      return {
        message: "正在进行相似简历查重...",
        type: "info",
      };
    case "repeat":
      return {
        message: (
          <div>
            发现相似简历!{" "}
            <span
              className="jump-warp"
              onClick={() => chrome.tabs.create({ url })}
            >
              点击查看
            </span>
          </div>
        ),
        type: "warning",
      };
    case "noRepeat":
      return {
        message: "系统中未发现相似简历",
        type: "success",
      };
    case "saveFail":
      return {
        message: "保存失败!",
        type: "error",
      };
    case "saveSuccess":
      return {
        message: "保存成功!",
        type: "success",
      };
    default:
      return {};
  }
}

const AnalysisFormViewWrap = React.forwardRef((props: any, ref: any) => {
  const {
    resumeInfo,
    baseInfo,
    repeatInfo,
    prefixUrl,
    fileContent,
    ...otherProps
  } = props;
  const [status, setStatus] = React.useState(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const currentStatus = React.useMemo(() => {
    if (status) {
      return status;
    }
    if (repeatInfo) {
      return repeatInfo.candidateIds && repeatInfo.candidateIds.length > 0
        ? "repeat"
        : "noRepeat";
    }
    return "checking";
  }, [status, repeatInfo]);

  function submit(value: any) {
    setSubmitLoading(true);
    const obj = {
      ...resumeInfo,
      ...transformValueToLabel(value, baseInfo),
      fileContent,
    };

    requestResumeUpload(prefixUrl, obj).then((res: any) => {
      setSubmitLoading(false);
      console.log("res ----- ", res);
      if (res.status === 200 && res.res.code === 0) {
        setStatus("saveSuccess");
      } else {
        setStatus("saveFail");
      }
    });
  }

  return (
    <div className="analysis-content-wrap">
      <div className="title">添加简历</div>
      <Alert
        {...getAlertProps(
          currentStatus,
          repeatInfo ? repeatInfo.seeDetailUrl : null
        )}
        showIcon={true}
      />
      <ForwordAnalysisFormView
        {...otherProps}
        ref={ref}
        submit={submit}
        submitLoading={submitLoading}
      />
    </div>
  );
});

const AnalysisView = React.memo((props: any) => {
  const { analysising, resumeInfo, prefixUrl, siteUrl, baseInfo, fileContent } =
    props;
  const [formRef, setFormRef] = React.useState(null);
  const [baseInfoObj, setBaseInfo] = React.useState({});
  const [repeatInfo, setRepeatInfo] = React.useState(null);

  React.useEffect(() => {
    if (!analysising && resumeInfo) {
      console.log("检测简历是否重复 ----", props, resumeInfo);
      requestResumeRepeat(prefixUrl, { ...resumeInfo, siteUrl }).then(
        (res: any) => {
          if (res.status === 200 && res.res && res.res.code === 0) {
            setRepeatInfo(res.res.data);
          }
        }
      );
    }
  }, [analysising]);

  React.useEffect(() => {
    if (formRef && resumeInfo && baseInfo) {
      formRef.setFieldsValue(transformLabelToValue(resumeInfo, baseInfo));
    }
  }, [resumeInfo, formRef, baseInfo]);

  React.useEffect(() => {
    if (baseInfo) {
      setBaseInfo({
        topEduDegree: {
          option: (baseInfo.diplomaTypes || []).map((item: any) => ({
            ...item,
            label: item.value,
          })),
        },
        workYear: {
          option: (baseInfo.experiences || []).map((item: any) => ({
            ...item,
            label: item.value,
          })),
        },
        sex: {
          option: (baseInfo.sexes || []).map((item: any) => ({
            ...item,
            label: item.value,
          })),
        },
        position: {
          option: baseInfo.positions || [],
        },
        note: {
          treeData: [baseInfo.talentPool || {}],
        },
      });
    }
  }, [baseInfo]);

  function getFormRef(ref: any) {
    setFormRef(ref);
  }

  return (
    <div className={analysising ? "analysis-view" : "analysis-form-view"}>
      <Spin delay={0} spinning={analysising} tip="简历查询中...">
        {analysising ? null : (
          <AnalysisFormViewWrap
            {...baseInfoObj}
            fileContent={fileContent}
            repeatInfo={repeatInfo}
            resumeInfo={resumeInfo}
            baseInfo={baseInfo}
            prefixUrl={prefixUrl}
            ref={getFormRef}
          />
        )}
      </Spin>
    </div>
  );
});

export default AnalysisView;
