import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Col, Form, Input, message, Radio, Row, Select, Steps, Table,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './UserStatus.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


/* eslint react/no-multi-comp:0 */
@connect(({ userStatus, office, loading }) => ({
  userStatus,
  office,
  loading: loading.models.userStatus,
}))
@Form.create()
class UserStatus extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    list: [],
    allMenu: [],
    offices: [],
  };

  columns = [
    {
      title: '办公室',
      dataIndex: 'officeName',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '科室',
      dataIndex: 'orgName',
    },
      {
          title: '职务',
          dataIndex: 'dutyName',
      },
    {
      title: '去向状态',
      dataIndex: 'status',
      render: (val, record) => {
        return (
          <RadioGroup
            onChange={this.onUserStatusChange.bind(this, record)}
            value={record.status}
          >
              <Radio value={"0"} disabled={true}>未打卡</Radio>
              {this.state.status && this.state.status.map(d => {
                  return <Radio value={d.id}>{d.name}</Radio>
              })}
          </RadioGroup>
        );
      },
    },

  ];

  componentDidMount() {
    this.firstLoad();
    const { dispatch } = this.props;
    dispatch({
      type: 'userStatus/basic',
      payload: {
        page: {},
      },
      callback: result => {
        this.setState({ offices: result.datas.offices, status: result.datas.status });
      },
    });
  }
  onUserStatusChange = (record, e) => {
    const { dispatch } = this.props;
      var status_=e.target.value;
    dispatch({
        type: 'userStatus/saveOrUpdate',
      payload: {
        userId: record.userId,
        status:status_,
      },
      callback: result => {
        if (result.code == 0) {
          message.success('修改成功');
            record.status=status_;
            this.setState({result:Object.assign({},this.state.result)});
        } else {
          message.warn('修改失败');
        }
      },
    });
  };
  firstLoad = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userStatus/list',
      payload: {
        page: {},
        callback: result => {
          this.setState({ result: result });
        },
      },
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userStatus/list',
      payload: {},
    });
  };
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formVals: record || {},
      checkedKeys: [],
    });
  };
    selectUserStatus = () => {
        let status = this.state.status;
        return status && (status.map(item => {
            <Radio value={item.id}>item.name</Radio>
        }))
    }
  //搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'userStatus/list',
        payload: {
          officeId: values.officeId,
          userName: values.name,
          callback: result => {
            this.setState({ result });
          },
        },
      });
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
    };
    dispatch({
      type: 'userStatus/list',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        callback: result => {
          this.setState({ result: result });
        },
      },
    });
  };
  //删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userStatus/del',
      payload: {
        id: id,
      },
      callback: () => {
        this.firstLoad();
      },
    });
  };
  //添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userStatus/save',
      payload: fields,
      callback: result => {
        if (result.succee) {
          message.success('添加成功');
          this.firstLoad();
        } else {
          message.warn(result.msg);
        }
      },
    });
    this.handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { offices } = this.state;
    const officeOption = offices.map(d => (
      <Option key={d.id}>{d.address ? d.name + '--' + d.address : d.name}</Option>
    ));
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
          <Col md={6} sm={12}>
            <FormItem label="办公室">
              {getFieldDecorator('officeId')(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {officeOption}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="人员姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
      const {result} = this.state;
    const list = result && result.list;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: result && result.total,
      current: result && result.pageNum,
    };

      return (
          <PageHeaderWrapper title="人员状态">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Table
                loading={false}
                rowKey={'key'}
                dataSource={list}
                columns={this.columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserStatus;
