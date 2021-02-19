import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Radio,
  Message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './Attend.less';

const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;

@connect(({ group, loading }) => ({
  group,
  dataLoading: loading.effects['group/fetchList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      shiftVisible: false,
      selectShift: null,
      groupShifts: [],
    };
  }

  _groupShifts = [
    { dayOfWeek: 1, title: '周一', checked: false },
    { dayOfWeek: 2, title: '周二', checked: false },
    { dayOfWeek: 3, title: '周三', checked: false },
    { dayOfWeek: 4, title: '周四', checked: false },
    { dayOfWeek: 5, title: '周五', checked: false },
    { dayOfWeek: 6, title: '周六', checked: false },
    { dayOfWeek: 7, title: '周日', checked: false },
  ];

  columns = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'groupName',
      align: 'center',
      key: 'groupName',
      width: 150,
    },
    {
      title: '人数',
      align: 'center',
      key: 'count',
      dataIndex: 'attendanceCount',
      width: 100,
    },
    {
      title: '负责人',
      key: 'manager',
      align: 'center',
      dataIndex: 'manager',
      width: 150,
    },
    {
      title: '班次',
      key: 'shifts',
      dataIndex: 'shifts',
      render: (text, record) => {
        if (!record.groupShifts) {
          return '未找到班次';
        }
        const _groupShifts = [];

        record.groupShifts.forEach(groupShift1 => {
          let _groupShift = Object.assign({}, groupShift1.shift);
          _groupShift.dayOfWeeks = [];
          _groupShift.dayOfWeeks.push(groupShift1.dayOfWeek);

          record.groupShifts.forEach(groupShift2 => {
            if (groupShift1.shiftId === groupShift2.shiftId && groupShift1.id !== groupShift2.id) {
              _groupShift.dayOfWeeks.push(groupShift2.dayOfWeek);
            }
          });

          let exist = false;
          _groupShifts.forEach(item => {
            if (item.id === _groupShift.id) {
              exist = true;
            }
          });
          if (!exist) {
            _groupShifts.push(_groupShift);
          }
        });
        return _groupShifts
          .sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          })
          .map(item => {
            let content = '每';
            item.dayOfWeeks
              .sort((a, b) => {
                if (a > b) {
                  return 1;
                }
                if (a < b) {
                  return -1;
                }
                return 0;
              })
              .forEach((day, index) => {
                if (index !== 0) {
                  content += '、';
                }
                content += this._groupShifts.filter(filter => filter.dayOfWeek === day)[0].title;
              });
            content += ' ' + item.shiftName;
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
          });
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
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
      this.loadData({ groupName: values.searchGroupName });
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
          <Col md={2}>
              <Button type="primary" onClick={() => this.handleOps({key: 'add'})}>
                  <Icon type="plus"/>
                  新建
              </Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
              <Col md={6} sm={12}>
            <FormItem label="考勤组名称">
              {getFieldDecorator('searchGroupName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

              <Col md={3} sm={12}>
             <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
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
        dispatch({
          type: 'group/basic',
          callback: result => {
            if (result.succee) {
              this.setState({
                visible: true,
                record: null,
                shifts: result.datas && result.datas.shifts,
                users: result.datas && result.datas.users,
                groupShifts: this._groupShifts.map(item => item),
              });
            } else {
              Message.error(result.msg);
            }
          },
        });
        break;
      case 'edit':
        this.props.form.resetFields();
        dispatch({
          type: 'group/getDetail',
          payload: { id: record.id },
          callback: result => {
            if (result.succee) {
              let _groupShifts = this._groupShifts.map(item => {
                let copyItem = Object.assign({}, item);
                if (result.data && result.data.groupShifts) {
                  result.data.groupShifts.forEach(_item => {
                    if (item.dayOfWeek === _item.dayOfWeek) {
                      copyItem.shift = _item.shift;
                      copyItem.checked = true;
                    }
                  });
                }
                return copyItem;
              });

              this.setState({
                visible: true,
                record: result.data,
                shifts: result.datas && result.datas.shifts,
                users: result.datas && result.datas.users,
                groupShifts: _groupShifts,
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
          content: '确定删除该考勤组吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: close => {
            dispatch({
              type: 'group/delete',
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

  handleShiftSelect = e => {
    if (!this.state.selectShift) {
      Message.warn('请先选择班次');
      return;
    }

    let { groupShift } = this.state;
    groupShift.shift = this.state.selectShift;
    groupShift.checked = true;
    this.setState({ shiftVisible: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { groupShifts } = this.state;
        //moment预处理
        const _values = Object.assign({}, this.state.record, values);
        let complete = true;
        let selectedShifts = groupShifts
          .filter(item => item.checked)
          .map(item => {
            if (!item.shift) {
              complete = false;
            }
            return {
              shiftId: item.shift && item.shift.id,
              dayOfWeek: item.dayOfWeek,
            };
          });

        if (!complete) {
          Message.error('请选择班次!');
          return;
        }
        _values.groupShifts = selectedShifts;

        dispatch({
          type: 'group/save',
          payload: _values,
          callback: result => {
            if (result.succee) {
              Message.success(result.msg);
              this.setState({ visible: false, record: null });
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
      type: 'group/fetchList',
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
    this.setState({ visible: false });
  };

  onShiftSelect = record => {
    if (record) {
      this.state.groupShifts.forEach(groupShift => {
        if (groupShift.dayOfWeek === record.dayOfWeek) {
          this.setState({ shiftVisible: true, groupShift, selectShift: null });
        }
      });
    }
  };

  render() {
    const {
      group: { page },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { record = null, shifts = [], users = [] } = this.state;
    let { groupShifts = [] } = this.state;

    // demo pagination.
    const restProps = {
      bordered: true,
      loading: false,
      size: 'small',
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    const formItem = {
      marginBottom: 0,
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

        <Drawer
            title="新增/编辑"
            width={520}
            onClose={this.onClose}
            destroyOnClose={true}
            visible={this.state.visible}
            style={{
            overflow: 'auto',
            height: 'calc(100% - 108px)',
            paddingBottom: '108px',
          }}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item style={formItem} label="考勤组名称">
              {getFieldDecorator('groupName', {
                rules: [{ required: true, message: '请输入考勤组名称' }],
                initialValue: record && record.groupName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item style={formItem} label="考勤人员">
              {getFieldDecorator('attendances', {
                rules: [{ required: true, message: '请选择考勤人员' }],
                initialValue: record && record.attendances ? record.attendances : [],
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                  {users.map(item => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item style={formItem} label="不考勤人员">
              {getFieldDecorator('unAttendances', {
                initialValue: record && record.unAttendances ? record.unAttendances : [],
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择">
                  {users.map(item => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item style={formItem} label="考勤负责人">
              {getFieldDecorator('managerId', {
                rules: [{ required: true, message: '请选择负责人' }],
                initialValue: record && record.managerId,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {users.map(item => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: { span: 24 },
                sm: { span: 0 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 },
              }}
            >
              <Table
                size="small"
                bordered
                rowKey="dayOfWeek"
                rowSelection={{
                  selectedRowKeys:
                    groupShifts.length > 0
                      ? groupShifts.filter(item => item.checked).map(item => item.dayOfWeek)
                      : [],
                  onChange: (selectedRowKeys, selectedRows) => {
                    let _groupShifts = [];
                    _groupShifts = groupShifts.map(groupShift => {
                      groupShift.checked = false;
                      selectedRows.forEach(item => {
                        if (groupShift.dayOfWeek === item.dayOfWeek) {
                          groupShift.checked = true;
                        }
                      });
                      return groupShift;
                    });
                    this.setState({ groupShifts: _groupShifts });
                  },
                }}
                dataSource={groupShifts}
                pagination={false}
              >
                <Column title="工作日" dataIndex="title" align="center" key="title" width={80} />
                <Column
                  title="班次时间段"
                  dataIndex="shift"
                  align="center"
                  key="shift"
                  render={(text, record) => {
                    return text && text.shiftName;
                  }}
                />
                <Column
                  title="操作"
                  align="center"
                  key="dayOfWeek"
                  width={100}
                  dataIndex="dayOfWeek"
                  render={(text, record) => {
                    return (
                      <Button
                        type="dashed"
                        onClick={e => {
                          this.onShiftSelect(record);
                        }}
                      >
                        修改班次
                      </Button>
                    );
                  }}
                />
              </Table>
            </Form.Item>
          </Form>
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
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.handleSubmit} type="primary">
              确认
            </Button>
          </div>
        </Drawer>
        <Modal
          title="新增/编辑"
          visible={this.state.shiftVisible}
          onOk={this.handleShiftSelect}
          onCancel={() => {
            this.setState({ shiftVisible: false });
          }}
        >
          <Table
            size="small"
            bordered
            rowKey="id"
            rowSelection={{
              type: 'radio',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectShift: selectedRows[0] });
              },
              selectedRowKeys: shifts.map((item, index) => {
                if (
                  this.state.groupShift &&
                  (!this.state.selectShift && this.state.groupShift.shift)
                ) {
                  this.state.selectShift = this.state.groupShift.shift;
                }

                if (this.state.selectShift && item.id === this.state.selectShift.id) {
                  return item.id;
                }
                return -1;
              }),
            }}
            dataSource={shifts}
            pagination={true}
          >
            <Column title="班次名称" dataIndex="shiftName" align="center" key="shiftName" />
            <Column
              title="考勤时间"
              align="center"
              dataIndex="dayOfWeek"
              render={(text, record) => {
                let time = '';
                if (record.firstInTime) {
                  time +=
                    moment(record.firstInTime).format('HH:mm') +
                    '-' +
                    moment(record.firstOutTime).format('HH:mm') +
                    ' ';
                }
                if (record.secondInTime) {
                  time +=
                    moment(record.secondInTime).format('HH:mm') +
                    '-' +
                    moment(record.secondOutTime).format('HH:mm') +
                    ' ';
                }
                if (record.thirdInTime) {
                  time +=
                    moment(record.thirdInTime).format('HH:mm') +
                    '-' +
                    moment(record.thirdOutTime).format('HH:mm') +
                    ' ';
                }

                return time;
              }}
            />
          </Table>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

const WrappedListPage = Form.create({ name: 'user' })(ListPage);
export default WrappedListPage;
