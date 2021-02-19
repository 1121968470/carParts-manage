import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Spin,
  Avatar,
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
  Modal,
  message,
  Divider,
  Tree,
} from 'antd';

const Search = Input.Search;
const { TreeNode } = Tree;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './System.less';
import Popconfirm from 'antd/es/popconfirm';

import {host}from '@/utils/app.js';
import Center from "../Account/Center/Center";
const FormItem = Form.Item;
const { Option } = Select;

const AvatarView = ({ avatar }) => {
    return (
        <Fragment>
            <div className={styles.avatar}>
                {avatar ? <img src={avatar} alt="avatar"/> : ""}
            </div>
        </Fragment>
    );
};




@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    parent: '',
    currentOrg: {},
  };
  constructor(props) {
    super(props);
  }
  okHandle = () => {
    const { form, handleAdd, parent, currentOrg } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      fieldsValue = {
        ...fieldsValue,
        id: currentOrg.id,
      };
      handleAdd(fieldsValue);
    });
  };
    validateRank = (rule, val, callback) => {
        if (!val) {
            callback();
        }

        if (val < 1) {
            callback('排序为大于0的整数！');
        }
        callback();
    }
  render() {
    const {
      updateModalVisible,
      form,
      handleAdd,
      handleUpdateModalVisible,
      currentOrg,
    } = this.props;
    return (
      <Modal
        width={680}
        title="编辑本节点"
        visible={updateModalVisible}
        destroyOnClose
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            initialValue: currentOrg.name,
            rules: [{ required: true, message: '请输入名称！' },{max: 10 ,message:'名称不超过10个字'}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="序号">
          {form.getFieldDecorator('rank', {
            initialValue: currentOrg.rank,
              rules: [{validator: this.validateRank}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    values: {},
    checkedKeys: [],
    allOrg: [],
    parent: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      dataList: [],
      autoExpandParent: true,
      expandedKeys: [],
    };
  }
  okHandle = () => {
    const { form, handleAdd, parent } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      const { values } = this.props;
      fieldsValue = {
        ...fieldsValue,
        id: values.id,
        parent: parent,
      };
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, values, allOrg } = this.props;
    const { expandedKeys, searchValue, autoExpandParent, checkedKeys } = this.state;
    return (
      <Drawer
          title="新增"
          placement="right"
          width={480}
          destroyOnClose
          closable={true}
          onClose={() => handleModalVisible()}
          visible={modalVisible}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name', {
            initialValue: values.name,
            rules: [{ required: true, message: '请输入名称！'},{ max: 10 ,message:'名称不超过10个字'}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="序号">
          {form.getFieldDecorator('rank', {
            initialValue: values.rank,
              rules: [{validator: this.validateRank}]
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={() => handleModalVisible()}
          >
            取消
          </Button>
          <Button onClick={this.okHandle} type="primary">
            确定
          </Button>
        </div>
      </Drawer>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({org, loading}) => ({
  org,
    loading: loading.models.org,
}))
@Form.create()
class Org extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    userModalVisible: false,
    fingerModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    result: {},
    allOrg: [],
    parent: 'ROOT',
    currentOrg: {},
    finger: '',
    currentItem:{display:"none"},
      orgSelectedVisible:false,
      selectOrg:'',
      comfirmSelectedOrg:'',
      selectedOrgName:'',
      loading:false,
      values:{}
  };

  columns = [
    {
        title: '名称',
      dataIndex: 'name',
    },
    {
        title: '排序',
        dataIndex: 'rank',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title={'确认删除[' + record.name + ']吗？'}
            onConfirm={() => this.handleUserDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.firstLoad();
  }

  firstLoad = parent => {
    const { dispatch } = this.props;
    parent = parent || this.state.parent;
    if (parent == null) {
      parent = 'ROOT';
    }
    dispatch({
        type: 'org/list',
      payload: {
          parent: parent,
        page: {},
      },
      callback: result => {
        this.setState({ result: result });
      },
    });
    dispatch({
      type: 'org/all',
      payload: {},
      callback: result => {
        this.setState({ allOrg: result.data });
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
        type: 'org/children',
      payload: {},
    });
  };
    handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleFingerModalVisible = flag => {
    this.setState({
      fingerModalVisible: !!flag,
    });
  };

  //搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
      const name = form.getFieldValue("name");
      this.setState({name: name});
      dispatch({
          type: 'org/list',
          payload: {
              name: name,
              parent: this.state.parent,
          },
          callback: result => {
              this.setState({ result });
          },
      });
  };
    handleUpdateModalVisible = (flag, record) => {
        if (flag && record.id) {
            this.getById(record.id);
    }
    this.setState({
      updateModalVisible: !!flag,
    });
  };
  handleTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
    };
      dispatch({
          type: 'staff/list',
          payload: {
              pageNum: pagination.current,
              pageSize: pagination.pageSize,
              name: params.userName,
              orgId: this.state.parent,
          },
          callback: result => {
              this.setState({ result });
          },
      });
  };
  //删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'org/del',
      payload: {
        id: id,
      },
        callback: (result) => {
            if(result.succee){
                this.firstLoad()
            }else{
                message.warn(result.msg)
            }
        },
    });
  };
  //删除用户
    handleUserDelete = id => {
    const { dispatch } = this.props;
    dispatch({
        type: 'org/del',
      payload: {
        id: id,
      },
        callback: (result) => {
            if(result.succee){
                this.firstLoad()
            }else{
                message.warn(result.msg)
            }
        },
    });
  };
  //
  //添加
  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: 'org/save',
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
    this.handleUpdateModalVisible();
  };
  //添加人员
  handleUserAdd = fields => {
    const { dispatch } = this.props;
    fields = {
      ...fields,
      finger: this.state.finger,
    };
    dispatch({
      type: 'staff/save',
      payload: fields,
      callback: result => {
        if (result.succee) {
          message.success('添加成功');
          this.firstLoad();
          this.props.form.resetFields()
        } else {
          message.warn(result.msg);
        }
      },
    });
    this.setState({ finger: '' });

  };
  //获取本节点
  getById = parent => {
    if (!parent) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'org/get',
      payload: {
        id: parent,
      },
      callback: result => {
        this.setState({ currentOrg: result.data });
      },
    });
  };
    handelFinger = v => {
       let values= this.state.values;
       values.boundFinger=true;
        this.setState({ finger: v ,values:values});
    };
  onSelect = (selectedKeys, info) => {
    const key = selectedKeys[0];
    if (!key) return;
    this.setState({ parent: key });
    this.firstLoad(key);
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={3} sm={12}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
              </Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">

              <Col md={8} sm={12}>
                  <FormItem label="名称">{getFieldDecorator('name')(<Input placeholder="请输入"/>)}</FormItem>
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
  }
  renderForm() {
    return this.renderSimpleForm();
  }

    selectedOrg=(selectedKeys,e)=>{
        const key = selectedKeys[0];
        if (!key) return;
        this.setState({ selectOrg: key,selectedOrgName:e.node.props.title });
    };
    handleOrgSelect=()=>{
        const  {values}=this.state;
        values.orgId=this.state.selectOrg;
        values.orgName=this.state.selectedOrgName;
        this.setState({values:values});
    }

    renderSimpleTreeNodes = data => data.map((item) => {
        var titleValue=item.title;
        if(item.title==undefined)return null;
        if (item.children) {
            return (
                <TreeNode key={item.key} title={
                    item.title
                }>
                    {this.renderSimpleTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.key} title={item.title} />;
    })
    render() {
        const {
            result,
            modalVisible,
            updateModalVisible,
            allOrg,
            parent,
            currentOrg,
            values
        } = this.state;
        const list = result && result.list;
        console.log("list", list)
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: false,
            total: result && result.total,
            current: result && result.pageNum,
        };
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            firstLoad: this.firstLoad,
            handleUpdateModalVisible: this.handleUpdateModalVisible,
            getById: this.getById,
        };
        return [
            <PageHeaderWrapper title="组织结构管理">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={12}>
                        <Card>
                            <Tree defaultExpandParent
                                  onSelect={this.onSelect}
                            >
                                {this.renderSimpleTreeNodes(allOrg)}
                            </Tree>
                        </Card>
                    </Col>
                    <Col md={18} sm={12}>
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
                    </Col>
                </Row>
                <CreateForm {...parentMethods} parent={parent} modalVisible={modalVisible} />
                <UpdateForm
                    {...parentMethods}
                    parent={parent}
                    currentOrg={currentOrg}
                    updateModalVisible={updateModalVisible}
                />
            </PageHeaderWrapper>,
    ];
    }
}

export default Org;
