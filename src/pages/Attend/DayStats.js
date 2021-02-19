import {Button, Card, Col, DatePicker, Form, Icon, Input, Message, Row, Table} from 'antd';
import {connect} from 'dva';
import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {dayList, exportDayList, exportMonthList, monthList} from '@/services/stats';


import styles from './Attend.less';

const {RangePicker} = DatePicker;

const FormItem = Form.Item;
const {Column, ColumnGroup} = Table;

const iconSpanStyle = {marginLeft: 5};

@connect(({stats, loading}) => ({
  stats,
  dataLoading: loading.effects['stats/fetchDayList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      timeType: 'day',
      activeKey: "1"
    };
  }


  handleOps = async ({key}) => {
    const {dispatch} = this.props;
    switch (key) {
      case 'export':
          this.props.form.validateFields((err, values) => {
              let _values = Object.assign({}, values);
              if (values.rangeDate && values.rangeDate.length > 1) {
                  _values.beginDate = values.rangeDate[0].format("YYYY-MM-DD");
                  _values.endDate = values.rangeDate[1].format("YYYY-MM-DD");
              }
              delete _values.rangeDate;

              exportDayList({..._values}).then((response) => {
                  response.blob().then(blob => {
                      let blobUrl = window.URL.createObjectURL(blob);
                      let a = document.createElement('a');
                      //无法从返回的文件流中获取文件名
                      let filename = response.headers.get('Content-Disposition');
                      if(filename){
                          filename=filename.substring(filename.indexOf("=")+1);
                          filename=decodeURI(filename);
                      }
                      a.href = blobUrl;
                      a.download = filename ? filename : '考勤每日统计.xls';
                      a.click();
                      window.URL.revokeObjectURL(blobUrl);
                  });
              }).catch((error) => {
                  Message.error("导出失败");
              });

          });
        break;
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let _values = Object.assign({}, values);
      if (values.rangeDate && values.rangeDate.length > 1) {
        _values.beginDate = values.rangeDate[0].format("YYYY-MM-DD");
        _values.endDate = values.rangeDate[1].format("YYYY-MM-DD");
      }
      delete _values.rangeDate;

      this.loadData(_values);
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }


  renderSimpleForm = () => {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={12}>
              <Button type="primary" onClick={e => this.handleOps({key: 'export'})}><Icon type="download"/>导出</Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
              <Col md={8} sm={12}>
        <Form.Item
          label="考勤时间"
          style={{marginBottom: 0}}
        >
          {getFieldDecorator('rangeDate', {})(
            <RangePicker key="rangeDate" />
          )}
        </Form.Item>
              </Col>
              <Col md={3} sm={12}>
        <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
              </Col>
          </Row>
      </Form>
    );
  }


  handlePaginationChange = (page, pageSize) => {
    this.loadData({
      page,
      limit: pageSize,
    });
  };


  componentDidMount() {
    this.loadData();
  }

  loadData = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stats/fetchDayList',
      payload: param,
    });
  };

  getPagination = page => ({
    total: page && page.count ? page.count : 0,
    current: page && page.curPage ? page.curPage : 0,
    pageSize: page && page.limit ? page.limit : 10,
    position: 'bottom',
    showSizeChanger: true,
    onChange: this.handlePaginationChange,
    onShowSizeChange: this.handlePaginationChange,
  });

  render() {
    const {stats: {page}} = this.props;

    // demo pagination.
    const restProps = {
      bordered: true,
      loading: false,
      size: 'small',
      title: this.header,
      showHeader: true,
    };


    return (
      <PageHeaderWrapper>
        <div className={styles.content}>
            <Card bordered={false}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
                {...restProps}
                pagination={this.getPagination(page)}
                loading={this.props.dataLoading}
                dataSource={(page && page.data) ? page.data : null}
                scroll={{x: "130%"}}
                rowKey="id"
            >
                <Column title="姓名" dataIndex="userName" key="userName" width={80} align="center" fixed='left'/>
                <Column title="部门" dataIndex="orgName" key="orgName" width={80} align="center" fixed='left'/>
                <Column title="日期" dataIndex="checkDateStr" key="checkDateStr" align="center"/>
                <Column title="班次" dataIndex="shiftName" key="shiftName" align="center"/>
                <Column title="第一次上班打卡时间" dataIndex="firstInAttendanceTime" key="firstInAttendanceTime" align="center"/>
                <Column title="第一次上班打卡结果" dataIndex="firstInDealResult" key="firstInDealResult" align="center"/>
                <Column title="第一次下班打卡时间" dataIndex="firstOutAttendanceTime" key="firstOutAttendanceTime"
                        align="center"/>
                <Column title="第一次下班打卡结果" dataIndex="firstOutDealResult" key="firstOutDealResult" align="center"/>
                <Column title="第二次上班打卡时间" dataIndex="secondInAttendanceTime" key="secondInAttendanceTime"
                        align="center"/>
                <Column title="第二次上班打卡结果" dataIndex="secondInDealResult" key="secondInDealResult" align="center"/>
                <Column title="第二次下班打卡时间" dataIndex="secondOutAttendanceTime" key="secondOutAttendanceTime"
                        align="center"/>
                <Column title="第二次下班打卡结果" dataIndex="secondOutDealResult" key="secondOutDealResult" align="center"/>
                <Column title="第三次上班打卡时间" dataIndex="thirdInAttendanceTime" key="thirdInAttendanceTime" align="center"/>
                <Column title="第三次上班打卡结果" dataIndex="thirdInDealResult" key="thirdInDealResult" align="center"/>
                <Column title="第三次下班打卡时间" dataIndex="thirdOutAttendanceTime" key="thirdOutAttendanceTime"
                        align="center"/>
                <Column title="第三次下班打卡结果" dataIndex="thirdOutDealResult" key="thirdOutDealResult" align="center"/>
                <Column title="迟到次数" dataIndex="lateTimes" key="lateTimes" align="center"/>
                <Column title="早退次数" earlyTimes="earlyTimes" key="earlyTimes" align="center"/>
                <Column title="上班缺卡次数" dataIndex="inNotCard" key="inNotCard" align="center"/>
                <Column title="下班缺卡次数" dataIndex="outNotCard" key="outNotCard" align="center"/>
                <Column title="外出" dataIndex="outTimes" key="outTimes" align="center"/>
                <Column title="加班" dataIndex="overtimeTimes" key="overtimeTimes" align="center"/>
                <Column title="出差" dataIndex="bussinessTimes" key="bussinessTimes" align="center"/>
              <ColumnGroup title="请假(次数)">
                  <Column title="事假" dataIndex="personalLeave" key="personalLeave" align="center"/>
                  <Column title="病假" dataIndex="sickLeave" key="sickLeave" align="center"/>
                  <Column title="调休" dataIndex="timeOffLeave" key="timeOffLeave" align="center"/>
                  <Column title="年假" dataIndex="annualLeave" key="annualLeave" align="center"/>
                  <Column title="婚假" dataIndex="marriageLeave" key="marriageLeave" align="center"/>
                  <Column title="产假" dataIndex="maternityLeave" key="maternityLeave" align="center"/>
                  <Column title="陪产假" dataIndex="paternityLeave" key="paternityLeave" align="center"/>
                  <Column title="丧假" dataIndex="funeralLeave" key="funeralLeave" align="center"/>
                  <Column title="例假" dataIndex="menstruationLeave" key="menstruationLeave" align="center"/>
              </ColumnGroup>
            </Table>
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}

const WrappedListPage = Form.create({name: 'user'})(ListPage);
export default WrappedListPage;
