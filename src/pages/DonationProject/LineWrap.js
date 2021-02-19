import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Styles from './DonationProject.less';

export default class LineWrap extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    lineClampNum: PropTypes.number,
  };

  render() {
    const { title, lineClampNum } = this.props;
    return (
      <Tooltip placement="topLeft" title={title}>
        <span className={Styles.col} style={{ WebkitLineClamp: lineClampNum }}>
          {title}
        </span>
      </Tooltip>
    );
  }
}