import {Avatar, Button, Calendar, Card, Col, Divider, Drawer, Form, Input, List, Message, Row, Select, Skeleton, Table, Tabs, Modal} from 'antd';
import {connect} from 'dva';
import React, {Fragment, PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import 'braft-editor/dist/index.css';

import styles from './Workspace.less';
import Center from "../Account/Center/Center";
import BraftEditor from "braft-editor";

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

@Form.create()
class NoticeDetailModal extends PureComponent {
  static defaultProps = {
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values && nextProps.values.content) {
      const contentBlock = BraftEditor.createEditorState(nextProps.values.content);
      if (contentBlock) {
        this.setState({editorState: contentBlock});
      }
    }
  }

  render() {
    const {noticeDetailModalVisible, handleNoticeDetailModalVisible, values} = this.props;
    const {editorState} = this.state;
    return (
      <Modal
        footer={null}
        width={1200}
        title="公告详情"
        visible={noticeDetailModalVisible}
        onCancel={() => handleNoticeDetailModalVisible()}
      >
        <h2 align="center">{values && values.title}</h2>
        <div align="center"><span>{values && (moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'))}</span></div>
        <div className="my-component">
          <BraftEditor
            readOnly
            value={editorState}
            controls={[]}
            onChange={this.handleEditorChange}
          />
        </div>
      </Modal>
    );
  }
}


@connect(({workspace, staff, todo, loading}) => ({
  workspace,
  todo, staff,
  todoLoading: loading.effects['todo/list'],
  dataLoading: loading.effects['workspace/fetchTodoList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      noticeDetailModalVisible: false,
      noticeValue: null,
      user: null,
      visible: false,
      timeType: 'day',
      activeKey: "WAITING"
    };
  }

  handlePaginationChange = (page, pageSize) => {
    this.loadData({
      page,
      limit: pageSize,
    });
  };
  handleNoticeDetailModalVisible = (flag, record) => {
    this.setState({
      noticeDetailModalVisible: !!flag,
      noticeValue: record || {},
    });
  };

  componentDidMount() {
    this.loadData();
    this.loadTodos({status: this.state.activeKey});
    this.loadRecord();
    this.loadUser();
    this.loadNotice();
  }

  loadNotice = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'notice/list',
      payload: {
        page: {},
        callback: result => {
          this.setState({noticeList: result});
        },
      },
    });
  }
  loadData = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workspace/listMonthCheckStats',
      payload: param,
    });
  };


  loadRecord = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'workspace/listDateCheckStats',
      payload: param,
    });
  };

  loadTodos = param => {

    const {todo: {todoPage, havedTodoPage}} = this.props;
    let _param = Object.assign({}, param);
    _param.limit = 5;

    if (_param.status === "WAITING") {
      if (!_param.page && todoPage && todoPage.page) {
        _param.page = (todoPage.page + 1);
      }
    }
    if (_param.status === "HAVED") {
      if (!_param.page && havedTodoPage && havedTodoPage.page) {
        _param.page = (havedTodoPage.page + 1);
      }
    }

    this.props.dispatch({
      type: 'todo/fetchList',
      payload: _param,
    });
  }
  loadUser = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'staff/detail',
      callback: (result) => {
        this.setState({user: result.data})
      }
    });


  }
  handleTableChange = pagination => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const params = {
      ...formValues,
    };
    dispatch({
      type: 'notice/list',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        callback: result => {
          this.setState({noticeList: result});
        },
      },
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

  getTodoDetail = item => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'todo/getDetail',
      payload: {id: item.id},
      callback: result => {
        if (result.succee) {
          this.setState({visible: true, todo: result.data});
        } else {
          Message.error(result.msg);
        }
      }
    });
  }

  renderCheckForm = (record) => {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form
        {...formItemLayout}
      >
        <Form.Item
          style={formItem}
          label="补卡时间"
        >
          {getFieldDecorator('sss', {
            initialValue: record && moment(record.eventInfo.checkDateStr).format("YYYY-MM-DD"),
          })(
            <Input rows={4} disabled />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="补卡时段"
        >
          {getFieldDecorator('sss2', {
            initialValue: record && record.eventName,
          })(
            <Input rows={4} disabled />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="补卡原因"
        >
          {getFieldDecorator('remark', {
            rules: [{required: true, message: '请填写补卡原因'}, {max: 500, message: '最多填写500个字符'}],
            initialValue: record && record.reason,
          })(
            <TextArea rows={4} />
          )}
        </Form.Item>
      </Form>
    );
  }

  renderCheckDetalForm = (record) => {
    const {getFieldDecorator} = this.props.form;

    return (
      <Form
        {...formItemLayout}
      >
        <Form.Item
          style={formItem}
          label="补卡时间"
        >
          {getFieldDecorator('sss', {
            initialValue: record && moment(record.cardDate).format("YYYY-MM-DD"),
          })(
            <Input rows={4} disabled />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="补卡时段"
        >
          {getFieldDecorator('sss2', {
            initialValue: record && record.timeMarkerTitle,
          })(
            <Input rows={4} disabled />
          )}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="补卡原因"
        >
          {getFieldDecorator('remark', {
            initialValue: record && record.reason,
          })(
            <TextArea rows={4} disabled />
          )}
        </Form.Item>
      </Form>
    );
  }

  renderLeaveForm = () => {
    const {getFieldDecorator} = this.props.form;
    const {todo = {}, leaveTypes = [], activeKey} = this.state;
    let record = todo.event;
    if (!record) {
      return null;
    }
    const selectAfter = (
      <Select value={record.applyType} style={{width: 80}} disabled>
        <Option value="LEAVE_DAY">天数</Option>
        <Option value="LEAVE_HOUR">小时</Option>
      </Select>
    );

    let reasonLabel = "";
    let inputProps = {disabled: true};
    let durationLabel = "";
    switch (record.applyType) {
      case 'LEAVE_DAY':
        inputProps.addonAfter = selectAfter;
        durationLabel = "时长";
        reasonLabel = "请假事由";
        break;
      case 'LEAVE_HOUR':
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
      case 'ADD_CARD':
        reasonLabel = "补卡原因";
        break
    }

    return (
      <Form
        {...formItemLayout}
      >
        <Form.Item
          style={formItem}
          label="申请人"
        >
          {record && record.userName}
        </Form.Item>
        {(record.applyType === 'LEAVE_DAY' || record.applyType === 'LEAVE_HOUR') && (
          <Form.Item
            style={formItem}
            label="请假类型"
          >
            {getFieldDecorator('applyTypeTitle', {
              initialValue: record && record.applyTypeTitle
            })(
              <Input disabled style={{width: '100%'}} />
            )}
          </Form.Item>
        )}
        {(record.applyType !== 'ADD_CARD') && (
          <>
          <Form.Item
            style={formItem}
            label="开始时间"
          >
            {getFieldDecorator('beginTime', {
              initialValue: (record && record.beginTime) && moment(record.beginTime).format("YYYY-MM-DD HH:mm")
            })(
              <Input disabled style={{width: '100%'}} />
            )}
          </Form.Item>
          <Form.Item
            style={formItem}
            label="结束时间"
          >
            {getFieldDecorator('endTime', {
              initialValue: (record && record.endTime) && moment(record.endTime).format("YYYY-MM-DD HH:mm")
            })(
              <Input disabled style={{width: '100%'}}
              />
            )}
          </Form.Item>
          <Form.Item
            style={formItem}
            label={durationLabel}
          >
            {getFieldDecorator('duration', {
              initialValue: (record && record.duration)
            })(
              <Input {...inputProps} placeholder="请填写时长" />
            )}
          </Form.Item>
          </>
        )}
        {(record.applyType === 'BUSSINESS' && record.applyType !== 'ADD_CARD') && [
          <Form.Item
            style={formItem}
            label="出差地点"
          >
            {getFieldDecorator('place', {
              initialValue: record && record.place
            })(
              <Input disabled placeholder="请填入" />
            )}
          </Form.Item>
        ]}
        {(record.applyType === 'ADD_CARD') && [
          <Form.Item
            style={formItem}
            label="补卡时间"
          >
            {getFieldDecorator('sss', {
              initialValue: record && moment(record.cardDate).format("YYYY-MM-DD"),
            })(
              <Input rows={4} disabled />
            )}
          </Form.Item>,
          <Form.Item
            style={formItem}
            label="补卡时段"
          >
            {getFieldDecorator('sss2', {
              initialValue: record && record.timeMarkerTitle,
            })(
              <Input rows={4} disabled />
            )}
          </Form.Item>
        ]}
        <Form.Item
          style={formItem}
          label={reasonLabel}
        >
          {getFieldDecorator('remark', {
            initialValue: record && record.reason,
          })(
            <TextArea disabled rows={4} />
          )}
        </Form.Item>
        <Divider>审批操作</Divider>
        <Form.Item
          label="申请状态"
          style={formItem}
        >
          {record.dealStatusTitle}
        </Form.Item>
        <Form.Item
          style={formItem}
          label="审核理由"
        >
          {getFieldDecorator('reason', {
            initialValue: todo && todo.reason,
          })(
            <TextArea rows={4} max={500} />
          )}
        </Form.Item>

      </Form>
    );
  }

  handleAudit = ({todo, status}) => {
    this.props.form.validateFields((err, values) => {
      if ("AUDIT_NOPASS" === status && !values.reason) {
        Message.error("审核未通过需要填写原因");
        return;
      }
      this.props.dispatch({
        type: 'todo/deal',
        payload: {id: todo.id, status, reason: values.reason},
        callback: result => {
          if (result.succee) {
            this.setState({visible: false});
            this.loadTodos({status: "WAITING", page: 1});
          } else {
            Message.error(result.msg);
          }
        }
      })
    });
  };

  handleCheckSubmit = (param) => {
    const {checkInfo} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!values.remark) {
        Message.error("填写补卡原因");
        return;
      }
      let _values = {};
      _values.applyType = checkInfo.eventInfo.applyType;
      _values.checkId = checkInfo.eventInfo.checkId;
      _values.reason = values.remark;
      this.props.dispatch({
        type: 'apply/save',
        payload: _values,
        callback: result => {
          if (result.succee) {
            Message.success(result.msg);
            this.setState({checkVisible: false, checkInfo: {}});
            this.loadData();
            this.loadRecord(param&&{date:param.eventInfo.checkDateStr});
          } else {
            Message.error(result.msg);
          }
        },
      });
    });
  }

  handleCheckApply = (checkInfo) => {
    this.setState({checkVisible: true, checkInfo: checkInfo});
  }

  handleCheckDetail = (applyInfo) => {
    this.setState({applyInfoVisible: true, applyInfo: applyInfo});
  }

  noticeColumns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleNoticeDetailModalVisible(true, record)}>查看</a>
        </Fragment>
      ),
    },
  ];

  render() {
    const {workspace: {abnormalDays = [], normalDays = [], dayRecord = {}, page = []}} = this.props;
    const {activeKey = "WAITING", todo = {}} = this.state;


    // demo pagination.
    const restProps = {
      bordered: true,
      loading: false,
      size: 'small',
      showHeader: true
    };

    const {todo: {todoPage, havedTodoPage}} = this.props;
    const {user, noticeDetailModalVisible, noticeValue, noticeList, todoLoading = false, loading = false, checkInfo = {}, applyInfo = {}} = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: noticeList && noticeList.total,
      current: noticeList && noticeList.pageNum,
    };

    const noticeDetailModalData = {
      handleNoticeDetailModalVisible: this.handleNoticeDetailModalVisible,
      noticeDetailModalVisible: noticeDetailModalVisible,
      values: noticeValue,
    }

    return (
      <PageHeaderWrapper>

        <Card className={styles.content}>
          <Avatar size={100} icon="user" src={user && user.avatar} />
          <span style={{marginLeft: '10px', display: 'inline-block',}}>
            <div style={{fontSize: 18, margin: 0, padding: 0}}>{user && user.name}，祝你开心每一天!</div>
            <div>
                {user && user.dutyName}
              <Divider type="vertical" />
                河南省信阳市纪律检查委员会
            </div>
          </span>
        </Card>
        <Row style={{marginTop: 10}} gutter={12}>
          <Col span={16}>
            <Card
              bordered={false}

            >
              <Tabs
                defaultActiveKey={activeKey}
                onChange={activeKey => {
                  this.setState({activeKey: activeKey});
                  this.loadTodos({status: activeKey, page: 1})
                }}
              >
                <Tabs.TabPane tab="待办" key="WAITING">
                  <List
                    className="demo-loadmore-list"
                    loading={todoLoading}
                    itemLayout="horizontal"
                    loadMore={(
                      <div style={{
                        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
                      }}
                      >
                        {(todoPage && todoPage.page < todoPage.totalPages) ? (
                          <Button onClick={e => this.loadTodos({status: activeKey})}>查看更多</Button>
                        ) : ((todoPage && todoPage.data && todoPage.data.length > 0) ? "没有更多了" : null)}
                      </div>

                    )}
                    dataSource={(todoPage && todoPage.data) ? todoPage.data.map(item => item) : []}
                    renderItem={item => (
                      <List.Item actions={[<Button type="dashed" onClick={(e) => this.getTodoDetail(item)}>审核</Button>]}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                          <List.Item.Meta
                            title={item.title}
                            description={item.content}
                          />

                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="已办" key="HAVED">
                  <List
                    className="demo-loadmore-list"
                    loading={todoLoading}
                    itemLayout="horizontal"
                    loadMore={(
                      <div style={{
                        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
                      }}
                      >
                        {(havedTodoPage && havedTodoPage.page < havedTodoPage.totalPages) ? (
                          <Button onClick={e => this.loadTodos({status: activeKey})}>查看更多</Button>
                        ) : ((havedTodoPage && havedTodoPage.data && havedTodoPage.data.length > 0) ? "没有更多了" : null)}
                      </div>

                    )}
                    dataSource={havedTodoPage ? havedTodoPage.data : []}
                    renderItem={item => (
                      <List.Item actions={[<Button type="dashed" onClick={(e) => this.getTodoDetail(item)}>详情</Button>]}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                          <List.Item.Meta
                            title={item.title}
                            description={item.content}
                          />

                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Card>
            <Card bordered={false} title="通知公告(108)">
              <Table
                columns={this.noticeColumns}
                {...restProps}
                pagination={paginationProps}
                loading={this.props.dataLoading}
                dataSource={noticeList && noticeList.list}
                rowKey="id"
                onChange={this.handleTableChange}
              >
              </Table>
            </Card>
          </Col>
          <Col span={8}>

            <Card
              bordered={false}
              title="考勤日历"
            >
              <Row>

                <Calendar
                  className="hideHeader"
                  mode="month"
                  value={this.state.value ? moment(this.state.value) : moment()}
                  fullscreen={false}
                  onPanelChange={(date) => {
                    this.setState({value: date.format("YYYY-MM-DD")})
                    this.loadRecord({date: date.format("YYYY-MM-DD")});
                    this.loadData({
                      beginDate: date.startOf('month').format("YYYY-MM-DD"),
                      endDate: date.endOf('month').format("YYYY-MM-DD")
                    })
                  }}
                  onSelect={date => {
                    this.setState({value: date.format("YYYY-MM-DD")})
                    this.loadRecord({date: date.format("YYYY-MM-DD")});
                    this.loadData({
                      beginDate: date.startOf('month').format("YYYY-MM-DD"),
                      endDate: date.endOf('month').format("YYYY-MM-DD")
                    })
                  }}
                  dateCellRender={(date) => {
                    const tipStyles = {
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      display: 'inline-block'
                    }
                    normalDays.forEach(item => {
                      if (date.format("YYYY-MM-DD") === moment(item.day).format("YYYY-MM-DD")) {
                        tipStyles.backgroundColor = "blue";
                      }
                    });
                    abnormalDays.forEach(item => {
                      if (date.format("YYYY-MM-DD") === moment(item.day).format("YYYY-MM-DD")) {
                        tipStyles.backgroundColor = "red";
                      }
                    });
                    return (
                      <div style={tipStyles} />
                    )
                  }}
                />
              </Row>
              <Row>
                <Card
                  title={(<div>{dayRecord.overviewMsg ? dayRecord.overviewMsg : '未发现考勤记录'}</div>)}
                >
                  <Table
                    {...restProps}
                    pagination={false}
                    dataSource={dayRecord.events ? dayRecord.events : []}
                    showHeader={false}
                  >
                    <Column title="上下班打卡" dataIndex="eventName" key="eventName" width={80} align="center" />
                    <Column title="打卡时间" dataIndex="eventDesc" attendanceDay="eventDesc" width={100} align="center" />
                    <Column title="考勤状态" dataIndex="eventStatusName" key="eventStatusName" width={60} align="center"
                            render={(text, record) => {

                              if (record.eventInfo && record.isWaitingApproval) {
                                return ( <Button onClick={e => this.handleCheckDetail(record.applyInfo)}>查看详情</Button>);

                              }

                              if (record.eventInfo && !record.isWaitingApproval) {
                                return ( <Button onClick={e => this.handleCheckApply(record)}>补卡申请</Button>);
                              }
                              return record.eventStatusName;
                            }}
                    />
                  </Table>
                </Card>
              </Row>
            </Card>
          </Col>
        </Row>
        {todo.event && (
          <Drawer
            title="新增/编辑"
            width={620}
            onClose={e => {
              this.setState({visible: false})
            }}
            visible={this.state.visible}
            style={{
              overflow: 'auto',
              height: 'calc(100% - 108px)',
              paddingBottom: '108px',
            }}
          >
            {this.renderLeaveForm()}
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
              {todo.status === "WAITING" ? (
                <>
                <Button onClick={e => this.handleAudit({todo, status: 'AUDIT_PASS'})} style={{marginRight: 8}} type="primary">
                  通过
                </Button>
                <Button onClick={e => this.handleAudit({todo, status: 'AUDIT_NOPASS'})}>
                  不通过
                </Button>
                </>
              ) : (
                <Button onClick={e => this.setState({visible: false})} style={{marginRight: 8}} type="primary">
                  关闭
                </Button>
              )}
            </div>
          </Drawer>
        )}
        {checkInfo.eventInfo && checkInfo.eventInfo.checkId && (
          <Modal
            title="考勤补卡"
            visible={this.state.checkVisible}
            onOk={(e)=>this.handleCheckSubmit(checkInfo)}
            onCancel={() => {
              this.setState({checkVisible: false, checkInfo: {}});
            }}
          >
            {this.renderCheckForm(checkInfo)}
          </Modal>
        )}
        {applyInfo.id && (
          <Modal
            title="考勤补卡"
            visible={this.state.applyInfoVisible}
            footer={[
              <Button key="back" onClick={() => {
                this.setState({applyInfoVisible: false, applyInfo: {}});
              }}>关闭</Button>,
            ]}
            onCancel={() => {
              this.setState({applyInfoVisible: false, applyInfo: {}});
            }}
          >
            {this.renderCheckDetalForm(applyInfo)}
          </Modal>
        )}
        <NoticeDetailModal {...noticeDetailModalData} />
      </PageHeaderWrapper>
    )
  }
}

const WrappedListPage = Form.create({name: 'user'})(ListPage);
export default WrappedListPage;
