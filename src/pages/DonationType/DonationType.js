import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Drawer,
  Row,
  Table,
  Upload,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { host } from '@/utils/app.js';

import styles from './DonationType.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    values: {},
  };

  constructor(props) {
    super(props);
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      const { values } = this.props;
      fieldsValue = {
        ...fieldsValue,
        id: values.id,
      };
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, values } = this.props;
    return (
      <Modal
        width={960}
        title="新增/编辑活动类型"
        visible={modalVisible}
        onOk={this.okHandle}
        destroyOnClose
        maskClosable={false}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型名称">
          {form.getFieldDecorator('name', {
            initialValue: values.name,
            rules: [{ required: true, message: '请输入类型名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ donationType, loading }) => ({
  donationType,
  loading: loading.models.donationType,
}))
@Form.create()
class DonationType extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: {},
    stepFormValues: {},
    list: [],
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <Button type="primary" size="small" onClick={() => this.handleModalVisible(true, record)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={'确认删除[' + record.name + ']吗？'}
            onConfirm={() => this.handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.firstLoad();
  }

  firstLoad = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'donationProject/getType',
      payload: {
        pageNum: 0,
        pageSize: 20,
        callback: result => {
          this.setState({ result: result });
        },
      },
    });
  };

  //获取文章标签
  getSelectType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/get',
      payload: {
        callback: result => {
          this.setState({ typeData: result });
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
    this.firstLoad();
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formVals: record || {},
      checkedKeys: [],
    });
  };

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
        type: 'donationProject/getType',
        payload: {
          pageNum: 0,
          pageSize: 20,
          keyword: values.name,
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
      type: 'donationProject/getType',
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
      type: 'donationProject/delType',
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
      type: 'donationProject/saveType',
      payload: fields,
      callback: result => {
        if (result.succee) {
          if (fields.id) {
            message.success('修改成功');
          } else {
            message.success('添加成功');
          }
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
    const { typeData } = this.state;
    const TypeData = typeData && typeData.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Col md={2} sm={24}>
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            新建
          </Button>
        </Col>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="end">
          <Col md={6} sm={12}>
            <FormItem label="标签名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
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
    const { result, modalVisible, formVals } = this.state;
    const list = result && result.list;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: result && result.total,
      current: result && result.pageNum,
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      firstLoad: this.firstLoad,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="文章管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Table
                loading={false}
                rowKey={record => record.id}
                dataSource={list}
                columns={this.columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} values={formVals} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default DonationType;
