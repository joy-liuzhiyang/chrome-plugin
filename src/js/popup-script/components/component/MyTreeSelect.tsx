import * as React from "react";
import classNames from "classnames";
import LoadingOutlined from "@ant-design/icons/es/icons/LoadingOutlined";
import FileOutlined from "@ant-design/icons/es/icons/FileOutlined";
import MinusSquareOutlined from "@ant-design/icons/es/icons/MinusSquareOutlined";
import PlusSquareOutlined from "@ant-design/icons/es/icons/PlusSquareOutlined";
import CaretDownFilled from "@ant-design/icons/es/icons/CaretDownFilled";
import DownOutlined from "@ant-design/icons/es/icons/DownOutlined";
import CloseCircleFilled from "@ant-design/icons/es/icons/CloseCircleFilled";
import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import TreeSelect from "rc-tree-select";

function renderSwitcherIcon(prefixCls, switcherIcon, showLine, _ref) {
  var isLeaf = _ref.isLeaf,
    expanded = _ref.expanded,
    loading = _ref.loading;

  if (loading) {
    return React.createElement(LoadingOutlined, {
      className: "".concat(prefixCls, "-switcher-loading-icon"),
    });
  }

  var showLeafIcon;

  if (showLine && typeof showLine === "object") {
    showLeafIcon = showLine.showLeafIcon;
  }

  if (isLeaf) {
    if (showLine) {
      if (typeof showLine === "object" && !showLeafIcon) {
        return React.createElement("span", {
          className: "".concat(prefixCls, "-switcher-leaf-line"),
        });
      }

      return React.createElement(FileOutlined, {
        className: "".concat(prefixCls, "-switcher-line-icon"),
      });
    }

    return null;
  }

  var switcherCls = "".concat(prefixCls, "-switcher-icon");

  if (React.isValidElement(switcherIcon)) {
    return React.cloneElement(switcherIcon as any, {
      className: classNames(
        (switcherIcon.props as any).className || "",
        switcherCls
      ),
    }) as any;
  }

  if (switcherIcon) {
    return switcherIcon;
  }

  if (showLine) {
    return expanded
      ? React.createElement(MinusSquareOutlined, {
          className: "".concat(prefixCls, "-switcher-line-icon"),
        })
      : React.createElement(PlusSquareOutlined, {
          className: "".concat(prefixCls, "-switcher-line-icon"),
        });
  }

  return React.createElement(CaretDownFilled, {
    className: switcherCls,
  });
}

const MyTreeSelect = React.memo((props: any) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef() as any;
  function onClick(e: any) {
    setOpen((lastOpen: any) => !lastOpen);
  }

  function onDropdownVisibleChange(open: boolean) {
    setOpen(open);
  }
  return (
    <TreeSelect
      ref={ref}
      className="ant-tree-selct"
      prefixCls="ant-select"
      dropdownClassName="ant-tree-select-dropdown"
      placeholder="请选择自定义人才库"
      inputIcon={<DownOutlined onClick={onClick} />}
      clearIcon={<CloseCircleFilled />}
      removeIcon={<CloseOutlined />}
      showSearch={true}
      optionFilterProp="label"
      {...props}
      open={open}
      onDropdownVisibleChange={onDropdownVisibleChange}
      switcherIcon={(nodeProps: any) => {
        return renderSwitcherIcon("ant-select-tree", null, false, nodeProps);
      }}
    />
  );
});

export default MyTreeSelect;
