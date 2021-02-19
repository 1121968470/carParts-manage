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
  Tabs,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Activity.less';
import 'braft-editor/dist/index.css';
import Popconfirm from 'antd/es/popconfirm';

import LineWrap from './LineWrap';

import router from 'umi/router';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <div />;
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ activity, loading }) => ({
  activity,
  loading: loading.models.activity,
}))
@Form.create()
class Activity extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    list: [],
    allMenu: [],
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (text, record) => {
        return <LineWrap title={text} lineClampNum={2} />;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      render: (text, record) => {
        text = text.replace(/<[^<>]+?>/g, '');
        return <LineWrap title={text} lineClampNum={2} />;
      },
    },
    //	    {
    //	        title: '地点',
    //	        dataIndex: 'address',
    //	    },
    {
      title: '费用',
      dataIndex: 'fee',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '报名人数',
      dataIndex: 'limitNum',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.isTop ? (
            <Popconfirm
              title={'确认取消置顶[' + record.title + ']吗？'}
              onConfirm={() => this.handleDownIt(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" size="small">
                取消置顶
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title={'确认置顶[' + record.title + ']吗？'}
              onConfirm={() => this.handleTopIt(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="dashed" size="small">
                置顶
              </Button>
            </Popconfirm>
          )}
          <Divider type="vertical" />
          <Button type="primary" size="small" onClick={() => this.toEdit(record)}>
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title={'确认删除[' + record.title + ']吗？'}
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
    this.getSelectType();
  }

  firstLoad = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/list',
      payload: {
        pageNum: 0,
        pageSize: 20,
        callback: result => {
          this.setState({ result: result });
        },
      },
    });
  };

  ListHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/listHandle',
      payload: {
        pageNum: 0,
        pageSize: 20,
        callback: result => {
          this.setState({ resultHandle: result });
        },
      },
    });
  };

  //获取活动标签
  getSelectType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/get',
      payload: {
        callback: result => {
          this.setState({ typeData: result });
        },
      },
    });
  };

  getAllMemu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/list',
      callback: result => {
        this.setState({ allMenu: result.data });
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

  toEdit = record => {
    //跳转编辑页面
    router.push({
      pathname: '/activity/activity/activityEdit',
      params: {
        data: record,
      },
    });
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
      const { typeId } = this.state;
      //        const { tabsKey } = this.state
      this.setState({
        formValues: values,
      });
      //        let url = 'activity/list';
      //        if (tabsKey == 1) {
      //            url = 'activity/listHandle'
      //        }
      dispatch({
        type: 'activity/list',
        payload: {
          pageNum: 0,
          pageSize: 20,
          keyword: values.title,
          typeId: typeId,
          callback: result => {
            this.setState({ result });
            //                    if (tabsKey != 1) { this.setState({result}); }
            //                    if (tabsKey == 1) { this.setState({resultHandle : result}); }
          },
        },
      });
    });
  };

  //    handleUpdateModalVisible = (flag, record) => {
  //        this.setState({
  //            updateModalVisible: !!flag,
  //            stepFormValues: record || {},
  //        });
  //    };

  handleTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
    };
    dispatch({
      type: 'activity/list',
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

  //置顶
  handleTopIt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/top',
      payload: {
        id: id,
      },
      callback: () => {
        this.firstLoad();
      },
    });
  };

  //取消置顶
  handleDownIt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/down',
      payload: {
        id: id,
      },
      callback: () => {
        this.firstLoad();
      },
    });
  };

  //删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/del',
      payload: {
        id: id,
      },
      callback: () => {
        this.firstLoad();
      },
    });
  };

  handleChange = value => {
    this.setState({ typeId: `${value}` });
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
          <Button icon="plus" type="primary" onClick={() => this.toEdit()}>
            新建
          </Button>
        </Col>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="end">
          <Col md={6} sm={12}>
            <FormItem label="活动类型">
              <Select defaultValue="全部" style={{ width: 120 }} onChange={this.handleChange}>
                {(TypeData || []).map(item => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="标题或内容">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
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
    const { result, modalVisible, formVals, allMenu } = this.state;
    const listWait = result && result.list;
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
    //        const updateMethods = {
    //            handleUpdateModalVisible: this.handleUpdateModalVisible,
    //            handleUpdate: this.handleUpdate,
    //        };
    return (
      <PageHeaderWrapper title="活动管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Table
                loading={false}
                rowKey={record => record.id}
                dataSource={listWait}
                columns={this.columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          allMenu={allMenu}
          values={formVals}
          modalVisible={modalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Activity;
