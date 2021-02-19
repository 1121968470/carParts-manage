import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';

export default class LineWrap extends PureComponent {
  render() {
    const { title, lineClampNum } = this.props;
    return (
      <Tooltip placement="topLeft" title={title}>
        <span style={{ WebkitLineClamp: lineClampNum }}>
          {title}
        </span>
      </Tooltip>
    );
  }
}