import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Message,
  Modal,
  Popover,
  Row,
  Table,
  Card,
  Radio,
  TimePicker,
} from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './Attend.less';

const FormItem = Form.Item;

const iconSpanStyle = { marginLeft: 5 };

@connect(({ shift, loading }) => ({
  shift,
  dataLoading: loading.effects['shift/fetchList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      clockNum: '1',
    };
  }

  columns = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '班次名称',
      dataIndex: 'shiftName',
      key: 'shiftName',
      align: 'center',
      width: 250,
    },
    {
      title: '时间',
      key: 'time',
      render: (text, item) => {
        let content = '';
        if (item.firstInTime) {
          content +=
            ' ' +
            moment(item.firstInTime).format('HH:mm') +
            '-' +
            moment(item.firstOutTime).format('HH:mm');
        }
        if (item.secondInTime) {
          content +=
            ' ' +
            moment(item.secondInTime).format('HH:mm') +
            '-' +
            moment(item.secondOutTime).format('HH:mm');
        }
        if (item.thirdInTime) {
          content +=
            ' ' +
            moment(item.thirdInTime).format('HH:mm') +
            '-' +
            moment(item.thirdOutTime).format('HH:mm');
        }
        return <div>{content}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 150,
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => this.handleOps({ key: 'edit', record })}>
            编辑
          </a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleOps({ key: 'delete', record })}>
            删除
          </a>
        </span>
      ),
    },
  ];

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.loadData({ shiftName: values._shiftName });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={12}>
              <Button icon="plus" type="primary" onClick={() => this.handleOps({key: 'add'})}>
                  新建
              </Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
          <Col md={6} sm={12}>
            <FormItem label="班次名称">
              {getFieldDecorator('_shiftName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

              <Col md={3} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  handlePaginationChange = (page, pageSize) => {
    this.loadData({
      page,
      limit: pageSize,
    });
  };

  handleOps = ({ key, record }) => {
    const { dispatch } = this.props;

    switch (key) {
      case 'add':
        this.props.form.resetFields();
        this.setState({ visible: true, record: null, clockNum: '1' });
        break;
      case 'edit':
        this.props.form.resetFields();
        dispatch({
          type: 'shift/get',
          payload: record,
          callback: result => {
            if (result.succee) {
              let record = result.data;
              this.setState({
                visible: true,
                record,
                clockNum: record && record.clockNum ? record.clockNum : '1',
              });
            } else {
              Message.error(result.msg);
            }
          },
        });
        break;
      case 'delete':
        Modal.confirm({
          title: '删除',
          content: '确定删除该班次吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: close => {
            dispatch({
              type: 'shift/delete',
              payload: record,
              callback: result => {
                if (result.succee) {
                  Message.success(result.msg);
                  close();
                  this.loadData();
                } else {
                  Message.error(result.msg);
                }
              },
            });
          },
        });
        break;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        //moment预处理
        const _values = Object.assign({}, this.state.record, values);
        const format = 'YYYY-MM-DD HH:mm:ss';

        if (values['firstInTime']) {
          _values['firstInTime'] = values['firstInTime'].format(format);
          _values['firstOutTime'] = values['firstOutTime'].format(format);
        }

        if (values['secondInTime']) {
          _values['secondInTime'] = values['secondInTime'].format(format);
          _values['secondOutTime'] = values['secondOutTime'].format(format);
        }

        if (values['thirdOutTime']) {
          _values['thirdInTime'] = values['thirdInTime'].format(format);
          _values['thirdOutTime'] = values['thirdOutTime'].format(format);
        }

        dispatch({
          type: 'shift/save',
          payload: _values,
          callback: result => {
            if (result.succee) {
              Message.success(result.msg);
              this.setState({ visible: false });
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
    this.loadData();
  }

  loadData = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shift/fetchList',
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

  onChange = e => {
    this.setState({ clockNum: e.target.value });
  };

  render() {
    const {
      shift: { page },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { record = null } = this.state;
    let { clockNum } = this.state;

    // demo pagination.
    const restProps = {
      bordered: true,
      loading: false,
      size: 'small',
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const formItem = {
      marginBottom: 0,
    };
    const timeItemLayout = {
      display: 'inline-block',
      width: 'calc(50% - 12px)',
      marginBottom: 0,
    };
    const timeItem = {
      width: '100%',
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
              dataSource={page && page.data ? page.data : null}
              rowKey="id"
            />
          </Card>
        </div>

        <Modal
          title="新增/编辑"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item style={formItem} label="班次名称">
              {getFieldDecorator('shiftName', {
                rules: [{ required: true, message: '请输入班次名称' }],
                initialValue: record ? record.shiftName : null,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item style={formItem} label="上下班次数">
              {getFieldDecorator('clockNum', {
                initialValue: clockNum.toString(),
              })(
                <Radio.Group onChange={this.onChange}>
                  <Radio value="1">一天一次</Radio>
                  <Radio value="2">一天二次</Radio>
                  <Radio value="3">一天三次</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item style={formItem} label="第一次">
              <Form.Item style={timeItemLayout}>
                {getFieldDecorator('firstInTime', {
                  rules: [{ required: true, message: '请选择时间' }],
                  initialValue: record && moment(record.firstInTime),
                })(
                  <TimePicker
                    style={timeItem}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    format="HH:mm"
                  />
                )}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
              <Form.Item style={timeItemLayout}>
                {getFieldDecorator('firstOutTime', {
                  rules: [{ required: true, message: '请选择时间' }],
                  initialValue: record ? moment(record.firstOutTime) : null,
                })(
                  <TimePicker
                    style={timeItem}
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    format="HH:mm"
                  />
                )}
              </Form.Item>
            </Form.Item>

            {clockNum > 1 && (
              <Form.Item label="第二次" style={formItem}>
                <Form.Item style={timeItemLayout}>
                  {getFieldDecorator('secondInTime', {
                    rules: [{ required: true, message: '请选择时间' }],
                    initialValue: record ? moment(record.secondInTime) : null,
                  })(
                    <TimePicker
                      style={timeItem}
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm"
                    />
                  )}
                </Form.Item>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                  -
                </span>
                <Form.Item style={timeItemLayout}>
                  {getFieldDecorator('secondOutTime', {
                    rules: [{ required: true, message: '请选择时间' }],
                    initialValue: record && moment(record.secondOutTime),
                  })(
                    <TimePicker
                      style={timeItem}
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm"
                    />
                  )}
                </Form.Item>
              </Form.Item>
            )}
            {clockNum > 2 && (
              <Form.Item label="第三次" style={formItem}>
                <Form.Item style={timeItemLayout}>
                  {getFieldDecorator('thirdInTime', {
                    rules: [{ required: true, message: '请选择时间' }],
                    initialValue: record ? moment(record.thirdInTime) : null,
                  })(
                    <TimePicker
                      style={timeItem}
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm"
                    />
                  )}
                </Form.Item>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                  -
                </span>
                <Form.Item style={timeItemLayout}>
                  {getFieldDecorator('thirdOutTime', {
                    rules: [{ required: true, message: '请选择时间' }],
                    initialValue: record && moment(record.thirdOutTime),
                  })(
                    <TimePicker
                      style={timeItem}
                      defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                      format="HH:mm"
                    />
                  )}
                </Form.Item>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

const WrappedListPage = Form.create({ name: 'user' })(ListPage);
export default WrappedListPage;
