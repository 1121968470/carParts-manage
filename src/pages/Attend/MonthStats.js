import {Button, Card, Col, DatePicker, Form, Icon, Input, Message, Row, Select, Cascader, Table} from 'antd';
import {connect} from 'dva';
import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {dayList, exportDayList, exportMonthList, monthList} from '@/services/stats';
import moment from 'moment';


import styles from './Attend.less';

const {MonthPicker} = DatePicker;

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
              let _values = {};
              if (values.rangeDate) {
                  _values.beginDate = values.rangeDate.startOf('month').format("YYYY-MM-DD");
                  _values.endDate = values.rangeDate.endOf('month').format("YYYY-MM-DD");
              }
              if (values.orgId && values.orgId.length > 0) {
                  _values.orgId = values.orgId[values.orgId.length - 1];
              }
              _values.userId = values.userId;
              exportMonthList({..._values}).then((response) => {
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
                      a.download = filename ? filename : '考勤月度统计.xls';
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
      let _values = {};
      if (values.rangeDate) {
        _values.beginDate = values.rangeDate.startOf('month').format("YYYY-MM-DD");
        _values.endDate = values.rangeDate.endOf('month').format("YYYY-MM-DD");
      }
      if (values.orgId && values.orgId.length > 0) {
        _values.orgId = values.orgId[values.orgId.length - 1];
      }
      _values.userId = values.userId;

      this.loadData(_values);
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }

  handleOrgChange = (values) => {
    if (values && values.length > 0) {
      this.props.form.resetFields(['userId']);
      this.props.dispatch({
        type: 'staff/all',
        payload: {orgId: values[values.length - 1]},
        callback: result => {
          if (result && result.data) {
            this.setState({userList: result.data});
          }
        }
      });
    }
  }

  renderSimpleForm = () => {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {userList = [], orgList = []} = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={24}>
              <Button type="primary" onClick={e => this.handleOps({key: 'export'})}><Icon type="download"/>导出</Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">

              <Col md={6} sm={24}>
                  <FormItem label="选择部门">
                      {getFieldDecorator('orgId', {})(
                          <Cascader options={orgList} key="orgList" fieldNames={{label: 'title', value: 'key'}} changeOnSelect onChange={this.handleOrgChange} placeholder="请选择部门" />,
                      )}
                  </FormItem>
              </Col>
              <Col md={6} sm={24}>
                  <FormItem label="选择人员">
                      {getFieldDecorator('userId', {})(
                          <Select
                              style={{width: 120}}
                              key="userId"
                              placeholder="请选择"
                          >
                              {userList && userList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                          </Select>
                      )}
                  </FormItem>
              </Col>
              <Col md={6} sm={24}>
                  <Form.Item
                      label="考勤时间"
                      style={{marginBottom: 0}}
                  >
                      {getFieldDecorator('rangeDate', {})(
                          <MonthPicker format="YYYY-MM" />
                      )}
                  </Form.Item>
              </Col>
              <Col md={4} sm={12}>

                  <Col md={4} sm={24}>
                 <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
                       </span>
                  </Col>
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
    this.props.dispatch({
      type: 'org/all',
      payload: {},
      callback: (result) => {
        if (result && result.data) {
          this.setState({orgList: result.data});
        }
      }
    });

    this.loadData();
  }

  loadData = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'stats/fetchMonthList',
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
                scroll={{x: '130%'}}
                rowKey="id"
                columns={[
                    {
                        title: "姓名",
                        dataIndex: "userName",
                        key: "userName",
                        width: 80,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: "部门",
                        dataIndex: "orgName",
                        key: "orgName",
                        width: 80,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: "出勤天数",
                        dataIndex: "attendanceDay",
                        key: "attendanceDay",
                        align: 'center',
                    },
                    {
                        title: "休息次数",
                        dataIndex: "waitDay",
                        key: "waitDay",
                        align: 'center',
                    },
                    {
                        title: "迟到次数",
                        dataIndex: "lateTimes",
                        key: "lateTimes",
                        align: 'center',
                    },
                    {
                        title: "早退次数",
                        dataIndex: "earlyTimes",
                        key: "earlyTimes",
                        align: 'center',
                    },
                    {
                        title: "上班缺卡次数",
                        dataIndex: "inNotCard",
                        key: "inNotCard",
                        align: 'center',
                    },
                    {
                        title: "下班缺卡次数",
                        dataIndex: "outNotCard",
                        key: "outNotCard",
                        align: 'center',
                    },
                    {
                        title: "旷工天数",
                        dataIndex: "absenceDay",
                        key: "absenceDay",
                        align: 'center',
                    },
                    {
                        title: "外出",
                        dataIndex: "outTimes",
                        key: "outTimes",
                        align: 'center',
                    },
                    {
                        title: "加班",
                        dataIndex: "overtimeTimes",
                        key: "overtimeTimes",
                        align: 'center',
                    },
                    {
                        title: "出差",
                        dataIndex: "bussinessTimes",
                        key: "bussinessTimes",
                        align: 'center',
                    },
                    {
                        title: "请假(次数)",
                        children: [
                            {
                                title: "事假",
                                dataIndex: "personalLeave",
                                key: "personalLeave",
                                align: 'center',
                            },
                            {
                                title: "病假",
                                dataIndex: "sickLeave",
                                key: "sickLeave",
                                align: 'center',
                            },
                            {
                                title: "调休",
                                dataIndex: "timeOffLeave",
                                key: "timeOffLeave",
                                align: 'center',
                            },
                            {
                                title: "年假",
                                dataIndex: "annualLeave",
                                key: "annualLeave",
                                align: 'center',
                            },
                            {
                                title: "婚假",
                                dataIndex: "marriageLeave",
                                key: "marriageLeave",
                                align: 'center',
                            },
                            {
                                title: "产假",
                                dataIndex: "maternityLeave",
                                key: "maternityLeave",
                                align: 'center',
                            },
                            {
                                title: "陪产假",
                                dataIndex: "paternityLeave",
                                key: "paternityLeave",
                                align: 'center',
                            },
                            {
                                title: "丧假",
                                dataIndex: "funeralLeave",
                                key: "funeralLeave",
                                align: 'center',
                            },
                            {
                                title: "例假",
                                dataIndex: "menstruationLeave",
                                key: "menstruationLeave",
                                align: 'center',
                            },
                        ]

                    }]}
            >
            </Table>
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}

const WrappedListPage = Form.create({name: 'user'})(ListPage);
export default WrappedListPage;
