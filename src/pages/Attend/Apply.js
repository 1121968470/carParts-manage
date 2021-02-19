import {Button, Card, Col, Divider, Drawer, Form, Icon, Input, Menu, Message, Modal, DatePicker, Row, Select, Table, Tabs} from 'antd';
import {connect} from 'dva';
import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';


import styles from './Attend.less';

const {RangePicker} = DatePicker;
const {TextArea} = Input;

const FormItem = Form.Item;
const {Column, ColumnGroup} = Table;

const iconSpanStyle = {marginLeft: 5};


const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 5},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 19},
  },
};

const formItem = {
  marginBottom: 0
};

@connect(({apply, loading}) => ({
  apply,
  dataLoading: loading.effects['apply/fetchList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      timeType: 'day',
      activeKey: "LEAVE",
      disabled: false,
    };
  }

  columns = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => (index + 1)
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      key: 'name',
      align: 'center',
      width: 150
    },
    {
      title: '部门',
      key: 'count',
      align: 'center',
      dataIndex: 'orgName',
      width: 150,
    },
    {
      title: '考勤组',
      key: 'manager',
      align: 'center',
      dataIndex: 'groupName',
      width: 150,
    },
    {
      title: '时间',
      key: 'time',
      align: 'center',
      render: (text, record) => {
        let content = "";

        if ("ADD_CARD" === record.applyType && record.cardDate) {
          content += moment(record.cardDate).format("YYYY-MM-DD");
          return content;
        }

        if (record.beginTime) {
          content += moment(record.beginTime).format("YYYY-MM-DD HH:mm");
        }
        content += "-"
        if (record.endTime) {
          content += moment(record.endTime).format("YYYY-MM-DD HH:mm");
        }
        return content;
      }
    },
    {
      title: '时长',
      key: 'duration',
      align: 'center',
      dataIndex: 'duration',
      render: (text, record) => {
        if ("LEAVE_DAY" === record.applyType || "BUSSINESS" === record.applyType) {
          return text + "天";
        }
        if ("LEAVE_HOUR" === record.applyType || "OVERTIME" === record.applyType || "OUT" === record.applyType) {
          return text + "小时";
        }

        if ("ADD_CARD" === record.applyType && record.timeMarkerTitle) {
          return record.timeMarkerTitle;
        }

        return "";
      }
    },
    {
      title: '申请类型',
      key: 'applyType',
      align: 'center',
      dataIndex: 'applyTypeTitle',
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      dataIndex: 'dealStatusTitle',
      render: (text, record) => {
        if ("CANCEL" === record.dealStatus) {
          return "已撤销";
        }
        return text;
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleOps({key: 'detail', record})}>
            详情
          </a>
          {"AUDIT" === record.dealStatus && (
            <>
            <Divider type="vertical" />
            <a href="javascript:;" className="ant-dropdown-link" onClick={() => this.handleCancel(record)}>
              撤销
            </a>
            </>
          )}
        </span>
      ),
    },
  ];


  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let _values = {};
      if (values.rangeDate && values.rangeDate.length > 1) {
        _values.beginDate = values.rangeDate[0].format("YYYY-MM-DD");
        _values.endDate = values.rangeDate[1].format("YYYY-MM-DD");
      }
      _values.applyType = values.applyType;
      _values.groupId = values.groupId;
      _values.dealStatus = values.dealStatus;
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
    const {dealStatusList = [], groupList = [], applyTypes = []} = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={24}>
              <Button icon="plus" type="primary" onClick={() => this.handleOps({key: 'add'})}>
                  新建
              </Button>

          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
              <Col span={18}>
                  <FormItem label="考勤组">
                      {getFieldDecorator('groupId', {})(
                          <Select
                              style={{width: 120}}
                              key="groupId"
                              placeholder="请选择"
                          >
                              {groupList && groupList.map(item => <Option key={item.id} value={item.id}>{item.groupName}</Option>)}
                          </Select>
                      )}
                  </FormItem>

                  <FormItem label="处理状态">
                      {getFieldDecorator('dealStatus', {})(
                          <Select

                              style={{width: 120}}
                              key="dealStatus"
                              placeholder="请选择"
                          >
                              {dealStatusList && dealStatusList.map(item => <Option key={item.name} value={item.name}>{item.title}</Option>)}

                          </Select>
                      )}
                  </FormItem>

                  <FormItem label="申请类型">
                      {getFieldDecorator('applyType', {})(
                          <Select
                              style={{width: 120}}
                              key="applyType"
                              placeholder="请选择"
                          >
                              {applyTypes && applyTypes.map(item => <Option key={item.name} value={item.name}>{item.title}</Option>)}
                          </Select>
                      )}
                  </FormItem>

                  <Form.Item
                      label="考勤时间"
                      style={{marginBottom: 0}}
                  >
                      {getFieldDecorator('rangeDate', {})(
                          <RangePicker key="rangeDate" />
                      )}
                  </Form.Item>
              </Col>
              <Col span={3}>
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

  handleOps = ({key, record}) => {
    const {dispatch} = this.props;
    switch (key) {
      case 'add':
        dispatch({
          type: "apply/basic",
          callback: (result) => {
            if (result.succee) {
              this.props.form.resetFields();
              this.setState({
                activeKey: 'LEAVE',
                visible: true,
                timeType: 'day',
                record: null,
                disabled: false,
                key,
                leaveTypes: result.datas && result.datas.leaveTypes,
              });
            } else {
              Message.error(result.msg);
            }
          }
        });

        break;
      case 'detail':
        dispatch({
          type: "apply/getDetail",
          payload: {id: record.id},
          callback: (result) => {
            if (result.succee) {
              this.props.form.resetFields();
              let activeKey = "LEAVE";
              let {timeType} = this.state;

              if (result.data) {


                if (result.data.applyType.indexOf("LEAVE") !== -1) {
                  if (result.data.applyType === 'LEAVE_DAY') {
                    timeType = 'day';
                  }
                  if (result.data.applyType === 'LEAVE_HOUR') {
                    timeType = 'hours';
                  }
                  activeKey = "LEAVE";
                } else {
                  activeKey = result.data.applyType;
                }

              }

              this.setState({
                visible: true,
                timeType,
                key,
                activeKey,
                disabled: true,
                record: result.data,
                leaveTypes: result.datas && result.datas.leaveTypes,
                editable: false,
              });
            } else {
              Message.error(result.msg);
            }
          }
        });
        break;
    }
  };

  handleCancel = record => {
    const {dispatch} = this.props;

    if (record == null) {
      Message.warn("请先选择要撤销的记录!");
      return;
    }

    Modal.confirm({
      title: '提示',
      content: '确定撤销该申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: close => {
        dispatch({
          type: 'apply/cancel',
          payload: record,
          callback: result => {
            if (result.succee) {
              Message.success(result.msg);
              this.setState({visible: false});
              close();
              this.loadData();
            } else {
              Message.error(result.msg);
            }
          },
        });
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        const {timeType, activeKey} = this.state;
        //moment预处理
        const _values = Object.assign({}, this.state.record, values);

        if (activeKey.indexOf("LEAVE") !== -1) {
          if (timeType === 'day') {
            _values.applyType = 'LEAVE_DAY';
          }
          if (timeType === 'hours') {
            _values.applyType = 'LEAVE_HOUR';

          }
        } else {
          _values.applyType = activeKey;
        }

        const format = 'YYYY-MM-DD HH:mm';

        if (values['beginTime']) {
          _values['beginTime'] = values['beginTime'].format(format);
        }

        if (values['endTime']) {
          _values['endTime'] = values['endTime'].format(format);

        }

        dispatch({
          type: 'apply/save',
          payload: _values,
          callback: result => {
            if (result.succee) {
              Message.success(result.msg);
              this.setState({visible: false, record: null});
              this.loadData();
            } else {
              Message.error(result.msg);
            }
          },
        });
      }
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: "apply/basic",
      callback: (result) => {
        if (result && result.datas) {
          this.setState({
            leaveTypes: result.datas && result.datas.leaveTypes,
            groupList: result.datas && result.datas.groupList,
            applyTypes: result.datas && result.datas.applyTypes,
            dealStatusList: result.datas && result.datas.dealStatusList,
          });
        }
      }
    });
    this.loadData();
  }

  loadData = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'apply/fetchList',
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

  onClose = () => {
    this.setState({visible: false});
  }

  handleTimeTypeChange = (value) => {
    this.setState({timeType: value});
  }

  //	LEAVE_DAY("请假(/天)"), LEAVE_HOUR("请假(/小时)"), OUT("外出"), OVERTIME("加班"), BUSSINESS("出差"), ADD_CARD("补卡");

  renderLeaveForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {record = null, leaveTypes = [], activeKey} = this.state;


    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedShifts: selectedRows});
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    const selectAfter = (
      <Select value={this.state.timeType} style={{width: 80}} onChange={this.handleTimeTypeChange}>
        <Option value="day">天数</Option>
        <Option value="hours">小时</Option>
      </Select>
    );

    let reasonLabel = "";
    let inputProps = {};
    let durationLabel = "";
    switch (activeKey) {
      case 'LEAVE':
        inputProps.addonAfter = selectAfter;
        durationLabel = "时长";
        reasonLabel = "请假事由";
        break;
      case 'OUT':
        reasonLabel = "外出事由";
        durationLabel = "时长(小时)";
        break;
      case 'OVERTIME':
        durationLabel = "时长(小时)";
        reasonLabel = "加班事由";
        break;
      case 'BUSSINESS':
        durationLabel = "时长(天)";
        reasonLabel = "出差事由";
        break;
    }

    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
      >
        {(activeKey === 'LEAVE') && (
          <Form.Item
            style={formItem}
            label="请假类型"
          >
            {getFieldDecorator('leaveTypeId', {
              rules: [{required: true, message: '请选择'}],
              initialValue: (record && record.leaveTypeId) ? record.leaveTypeId : null,
            })(
              <Select
                style={{width: '100%'}}
                placeholder="请选择"
              >
                {leaveTypes.map(item => (<Option key={item.id}>{item.title}</Option>))}
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item
          style={formItem}
          label="开始时间"
        >
          {getFieldDecorator('beginTime', {
            rules: [{required: true, message: '请选择开始时间'}],
            initialValue: (record && record.beginTime) && moment(record.beginTime)

          })(
            <DatePicker
              disabledDate={this.disabledStartDate}
              showTime={{format: 'HH:mm'}}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择"
              style={{width: '100%'}}
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="结束时间"
        >
          {getFieldDecorator('endTime', {
            rules: [{required: true, message: '请选择结束时间'}],
            initialValue: (record && record.endTime) && moment(record.endTime)
          })(
            <DatePicker
              showTime={{format: 'HH:mm'}}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择"
              style={{width: '100%'}}
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          extra="时长将自动记入考勤统计"
          label={durationLabel}
        >
          {getFieldDecorator('duration', {
            rules: [
              {required: true, message: '请填写时长'},
              {pattern: new RegExp('^(\\+)?\\d+(\\.\\d+)?$', 'g'), message: '时长必须是数值'}
            ],
            initialValue: (record && record.duration)
          })(
            <Input {...inputProps} placeholder="请输入" />
          )}
        </Form.Item>

        {(activeKey === 'BUSSINESS') && [
          <Form.Item
            style={formItem}
            label="出差地点"
          >
            {getFieldDecorator('place', {
              rules: [{required: true, message: '请填写出差地点'}],
              initialValue: record && record.place
            })(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
        ]}
        <Form.Item
          style={formItem}
          label={reasonLabel}
        >
          {getFieldDecorator('reason', {
            rules: [{required: true, message: `请填写${reasonLabel}`}],
            initialValue: record && record.reason,
          })(
            <TextArea rows={4} />
          )}
        </Form.Item>
        {(record && record.dealStatus !== "AUDIT") && (
          <Form.Item
            style={formItem}
            label="审核理由"
          >
            {this.props.form.getFieldDecorator('approvalRemark', {
              initialValue: record ? record.approvalRemark : null,
            })(
              <TextArea rows={4} max={500} disabled />
            )}
          </Form.Item>
        )}
      </Form>
    );
  }

  tabActiveChange = key => {
    this.setState({activeKey: key})
  }

  render() {
    const {apply: {page}} = this.props;
    const {record = null, leaveTypes = []} = this.state;

    // demo pagination.
    const restProps = {
        border: true,
      loading: false,
      size: 'small',
        // showHeader: true,
    };


    return (
      <PageHeaderWrapper>
        <div className={styles.content}>
            <Card bordered={false}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              {...restProps}
              pagination={this.getPagination(page)}
              columns={this.columns}
              loading={this.props.dataLoading}
              dataSource={(page && page.data) ? page.data : null}
              rowKey="id"
            />
          </Card>
        </div>


        <Drawer
          title="新增/编辑"
          width={620}
          onClose={this.onClose}
          visible={this.state.visible}
          style={{
            overflow: 'auto',
            height: 'calc(100% - 108px)',
            paddingBottom: '108px',
          }}
        >
          {this.state.activeKey === "ADD_CARD" ? (
            <Form
              {...formItemLayout}
            >
              <Form.Item
                style={formItem}
                label="补卡时间"
              >
                {this.props.form.getFieldDecorator('sss', {
                  initialValue: record && moment(record.cardDate).format("YYYY-MM-DD"),
                })(
                  <Input rows={4} />
                )}
              </Form.Item>
              <Form.Item
                style={formItem}
                label="补卡班次"
              >
                {this.props.form.getFieldDecorator('timeMarkerTitle', {
                  initialValue: record ? record.timeMarkerTitle : null,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                style={formItem}
                label="补卡原因"
              >
                {this.props.form.getFieldDecorator('reason', {
                  initialValue: record ? record.reason : null,
                })(
                  <TextArea rows={4} />
                )}
              </Form.Item>
              {(record && record.dealStatus !== "AUDIT") && (
                <Form.Item
                  style={formItem}
                  label="审核理由"
                >
                  {this.props.form.getFieldDecorator('approvalRemark', {
                    initialValue: record ? record.approvalRemark : null,
                  })(
                    <TextArea rows={4} max={500} disabled />
                  )}
                </Form.Item>
              )}
            </Form>
          ) : (
            <Tabs tabPosition="left" onChange={this.tabActiveChange} activeKey={this.state.activeKey}>
              <Tabs.TabPane tab="请假" disabled={this.state.activeKey !== 'LEAVE' && this.state.disabled} key="LEAVE">{this.renderLeaveForm()}</Tabs.TabPane>
              <Tabs.TabPane tab="外出" disabled={this.state.activeKey !== 'OUT' && this.state.disabled} key="OUT">{this.renderLeaveForm()}</Tabs.TabPane>
              <Tabs.TabPane tab="加班" disabled={this.state.activeKey !== 'OVERTIME' && this.state.disabled} key="OVERTIME">{this.renderLeaveForm()}</Tabs.TabPane>
              <Tabs.TabPane tab="出差" disabled={this.state.activeKey !== 'BUSSINESS' && this.state.disabled} key="BUSSINESS">{this.renderLeaveForm()}</Tabs.TabPane>
            </Tabs>
          )}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{marginRight: 8}}>
              取消
            </Button>
            {this.state.key === 'add' && (

              <Button onClick={this.handleSubmit} type="primary">
                确认
              </Button>
            )}
            {(this.state.key === 'detail' && record.dealStatus === 'AUDIT') && (
              <Button type="primary" onClick={e => this.handleCancel(record)}>
                撤销申请
              </Button>
            )}
          </div>
        </Drawer>
      </PageHeaderWrapper>
    )
  }
}

const WrappedListPage = Form.create({name: 'user'})(ListPage);
export default WrappedListPage;
