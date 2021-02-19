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

import styles from './Card.less';
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
	  const { modalVisible, form, handleAdd, handleModalVisible,values} = this.props;
	  return (
			  <Drawer
	          title="新增卡号"
	          placement="right"
	          width={480}
	          closable={true}
	          onClose={() => handleModalVisible()}
	          visible={modalVisible}
	        >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卡号">
        {form.getFieldDecorator('cardNum', {
          rules: [{ required: true, message: '请输入卡号！'}],
        })(<TextArea placeholder="卡号，每行一个卡号"rows={20} />)}
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
@connect(({ card, loading }) => ({
  card,
  loading: loading.models.card,
}))
@Form.create()
class IdCard extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
  };

  columns = [
	    {
	      title: '卡号',
	      dataIndex: 'cardNum',
	    },
      {
          title: '用户',
          dataIndex: 'teacherName',
      },
	    {
	      title: '操作',
	      render: (text, record) => (
	        <Fragment>
            <Popconfirm title={'确认删除['+record.cardNum+']吗？'}
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
      type: 'card/list',
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
      type: 'card/list',
      payload: {},
    });
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
        type: 'card/list',
        payload: {
            ...values,
          callback:(result)=>{
            this.setState({result});
          }
        },
      });
    });
  };
  handleTableChange=(pagination)=>{
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
    };
    dispatch({
      type: 'card/list',
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
      type: 'card/del',
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
      type: 'card/save',
      payload: fields,
      callback:(result)=>{
        if(result.succee){
          message.success('添加成功');
         this.firstLoad()
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
            <FormItem label="卡号">
              {getFieldDecorator('cardNum')(<Input placeholder="卡号" />)}
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
    const { result,modalVisible,formVals} = this.state;
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
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
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
        <CreateForm {...parentMethods}  values={formVals} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default IdCard;
