import * as React from "react";
import Select from "rc-select";
import DownOutlined from "@ant-design/icons/es/icons/DownOutlined";
import CloseCircleFilled from "@ant-design/icons/es/icons/CloseCircleFilled";
import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";

const Option = Select.Option;

const MySelect = React.memo((props: any) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef() as any;
  function onClick(e: any) {
    setOpen((lastOpen: any) => !lastOpen);
  }

  function onDropdownVisibleChange(open: boolean) {
    setOpen(open);
  }

  const { option, ...resetProps } = props;

  return (
    <Select
      ref={ref}
      prefixCls="ant-select"
      inputIcon={<DownOutlined onClick={onClick} />}
      clearIcon={<CloseCircleFilled />}
      removeIcon={<CloseOutlined />}
      showAction={["click"]}
      defaultActiveFirstOption={true}
      allowClear={true}
      showArrow={true}
      labelInValue={false}
      showSearch={true}
      optionFilterProp="label"
      filterOption={true}
      optionLabelProp="label"
      virtual={false}
      backfill={true}
      {...resetProps}
      open={open}
      onDropdownVisibleChange={onDropdownVisibleChange}
    >
      {(option || []).map((item: any) => {
        return (
          <Option
            value={item.value}
            title={item.label || item.key}
            key={item.label || item.key}
            label={item.label || item.key}
            children={item.label || item.key}
          />
        );
      })}
    </Select>
  );
});

export default MySelect;
