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

import styles from './Donation.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
@Form.create()
class CreateForm  extends PureComponent {
  static defaultProps = {
    values: {},
    allMenu:{}
  };
  constructor(props) {
    super(props);
  }
  okHandle = () => {
	const {form,handleAdd} = this.props;
    form.validateFields((err, fieldsValue) => {
     if (err){ return;}

      form.resetFields();
      const {values}=this.props;
      fieldsValue={
        ...fieldsValue,
        id:values.id,
        fileId:values.fileId,
      }
      handleAdd(fieldsValue);
    });
  };
  render() {
	  const { modalVisible, form, handleAdd, handleModalVisible,values,allMenu} = this.props;
      const options = allMenu.map(d => <Option value ={d.id} key={d.id}>{d.name}</Option>);
	  return (
          <Drawer
          title="新增/编辑菜单"
          placement="right"
          destroyOnClose
          width={480}
          closable={true}
          onClose={() => handleModalVisible()}
          visible={modalVisible}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('name', {
        	initialValue: values.name,
          rules: [{ required: true, message: '请输入名称！',max:10}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="访问路径">
          {form.getFieldDecorator('path', {
              initialValue: values.name,
              rules: [{ required: true, message: '请输入访问路径！'}],
          })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组件路径">
          {form.getFieldDecorator('componnet', {
              initialValue: values.componnet,
              rules: [{ required: true, message: '请输入组件路径！'}],
          })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标名称">
          {form.getFieldDecorator('icon', {
              initialValue: values.icon,
              rules: [{ required: true, message: '图标名称！'}],
          })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父节点">
          {form.getFieldDecorator('parent', {initialValue: values.parent,})
          (<Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {options}
          </Select>)}
      </FormItem>
        <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
          }}>
        <Button style={{marginRight: 8,}} onClick={() => handleModalVisible()}>取消</Button>
        <Button onClick={this.okHandle} type="primary">确定</Button>
       </div>
    </Drawer>
  );}
};

/* eslint react/no-multi-comp:0 */
@connect(({ donation, loading }) => ({
    donation,
  loading: loading.models.donation,
}))
@Form.create()
class Donation extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    list:[],
    allMenu:[],
  };

  columns = [
	    {
	      title: '姓名',
	      dataIndex: 'name',
	    },
	    {
	      title: '性别',
	      dataIndex: 'sex',
	    },
	    {
	      title: '省份',
	      dataIndex: 'province',
	    },
	    {
	      title: '城市',
	      dataIndex: 'city',
	    },
	    {
	      title: '地区',
	      dataIndex: 'area',
	    },
	    {
	      title: '住址',
	      dataIndex: 'address',
	    },
	    {
	      title: '联系方式',
	      dataIndex: 'phone',
	    },
	    {
	      title: '微信名',
	      dataIndex: 'wechatUnionId',
	    },
	    {
	      title: '微信号',
	      dataIndex: 'wechatOpenId',
	    },
	    {
	      title: '公司',
	      dataIndex: 'company',
	    },
	    {
	      title: '生日',
	      dataIndex: 'birthday',
	    },
	    {
	      title: '毕业班级',
	      dataIndex: 'graduateClazz',
	    },
	    {
	      title: '毕业时间',
	      dataIndex: 'graduateTime',
	    },
	    {
	      title: '入院时间',
	      dataIndex: 'admissionTime',
	    },
//	    {
//	      title: '操作',
//	      render: (text, record) => (
//	        <Fragment>
//	            <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
//                <Divider type="vertical" />
//                <Popconfirm title={'确认删除['+record.name+']吗？'}
//                    onConfirm={() => this.handleDelete( record.id)}
//                    okText='确认'
//                    cancelText='取消'>
//                  <a>删除</a>
//                </Popconfirm>
//               <Divider type="vertical" />
//	        </Fragment>
//	      ),
//	    },
	  ];

  componentDidMount() {
    this.firstLoad();
  }

  firstLoad=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'usermanagement/list',
      payload:{
        pageNum: 0,
        pageSize: 20,
        callback:(result)=>{
            this.setState({result:result});
        }
      }
    });
  };

  getAllMemu=()=>{
      const { dispatch } = this.props;
      dispatch({
          type: 'usermanagement/list',
          callback:(result)=>{
            this.setState({allMenu:result.data});
          }
      })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.firstLoad();
//    dispatch({
//      type: 'usermanagement/list',
//      payload: {},
//    });
  };
    handleModalVisible = (flag,record) => {
        this.setState({
            modalVisible: !!flag,
            formVals: record || {},
            checkedKeys:[]
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
        type: 'usermanagement/list',
        payload: {
            pageNum: 0,
            pageSize: 20,
            name: values.name,
            phone: values.phone,
            clazz: values.graduateClazz,
            callback:(result)=>{
                this.setState({result});
            }
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
  handleTableChange=(pagination)=>{
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
    };
    dispatch({
      type: 'usermanagement/list',
      payload:{
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        callback:(result)=>{
            this.setState({result:result});
        }
      }
    });

  }
   //删除
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usermanagement/del',
      payload: {
        id:id,
      },
      callback: () => {
        this.firstLoad()
      },
    });

  };
    //添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu_com/save',
      payload: fields,
      callback:(result)=>{
        if(result.succee){
          message.success('添加成功');
          this.firstLoad();
        }else{
          message.warn(result.msg)
        }
      }
    });
    this.handleModalVisible();

  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="联系方式">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="班级">
              {getFieldDecorator('graduateClazz')(<Input placeholder="请输入" />)}
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
    const { result,modalVisible,formVals,allMenu} = this.state;
    const list = result&&result.list;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: result && result.total,
      current: result&&result.pageNum,
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      firstLoad:this.firstLoad,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="捐赠管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <div className={styles.tableListOperator}>
                <Table
                loading={false}
                rowKey={"key"}
                dataSource={list}
                columns={this.columns}
                pagination={paginationProps}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} allMenu={allMenu} values={formVals} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Donation;
