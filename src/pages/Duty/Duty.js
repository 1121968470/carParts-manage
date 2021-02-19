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
  Tree,
} from 'antd';
const Search=Input.Search;
const { TreeNode } = Tree;
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Duty.less';
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
      checkedKeys:[],
      allMenu :[],
  };
  constructor(props) {
      super(props);
      this.state ={
          searchValue: '',
          dataList:[],
          autoExpandParent: true,
          expandedKeys:[],
      }
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
      }
      handleAdd(fieldsValue);
    });
  };

    render() {
	  const { modalVisible, form, handleAdd, handleModalVisible,values} = this.props;

	  return (
			  <Drawer
                  title="新增/编辑职务"
                  placement="right"
                  width={480}
                  closable={true}
                  destroyOnClose
                  onClose={() => handleModalVisible()}
                  visible={modalVisible}
	        >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
        	initialValue: values.name,
            rules: [{required: true, message: '请输入名称！'},{ max: 10,message:'名称最长10个字'}],
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
};




/* eslint react/no-multi-comp:0 */
@connect(({ duty, loading }) => ({
  duty,
  loading: loading.models.duty,
}))
@Form.create()
class Duty extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    list:[],
    allMenu:[],
      checkedKeys:["1"]
  };

  columns = [
	    {
            title: '职务名称',
	      dataIndex: 'name',
	    },
	    {
	      title: '操作',
	      render: (text, record) => (
	        <Fragment>
	          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title={'确认删除['+record.name+']吗？'}
              onConfirm={() => this.handleDelete( record.id)}
              okText='确认'
              cancelText='取消'

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

  firstLoad=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'duty/list',
      payload:{
        page:{},
        callback:(result)=>{
          this.setState({result:result});
        }
      }
    });
  }


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'duty/list',
      payload: {},
    });
  };
    handleModalVisible = (flag,record) => {
        this.setState({
            modalVisible: !!flag,
            formVals: record || {},
            checkedKeys:[]
        });
        this.props.form.resetFields();
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
        type: 'duty/list',
        payload: {
            name:values.name,
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
      type: 'duty/list',
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
      type: 'duty/del',
      payload: {
        id:id,
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
    //添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'duty/save',
      payload: fields,
      callback:(result)=>{
        if(result.succee){
          message.success('添加成功');
         this.firstLoad()
            this.handleModalVisible();
        }else{
          message.warn(result.msg)
        }
      }
    });


  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={24}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
              </Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
          <Col md={6} sm={12}>
              <FormItem label="职务名称">
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
    const { result,modalVisible,formVals,allMenu} = this.state;
    const list =result&&result.list;
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
      <PageHeaderWrapper title="角色管理">
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
        <CreateForm {...parentMethods} allMenu={allMenu}  values={formVals} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Duty;
