import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
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

const Search = Input.Search;
const { TreeNode } = Tree;
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import styles from './Notice.less';
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
    this.state={
          editorState:null
      }
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.values && nextProps.values.content) {
          const contentBlock = BraftEditor.createEditorState(nextProps.values.content);
          if (contentBlock) {

              this.setState({ editorState: contentBlock });
          }
      }
  }
  render() {
    const { modalVisible, form , handleModalVisible, values } = this.props;
    const {editorState}=this.state;
    return (
      <Modal
          footer={null}
        width={1200}
        title="公告详情"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
      >
          <h2 align="center">{values&&values.title}</h2>
          <div align="center"><span>{values&&(moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'))}</span></div>
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

/* eslint react/no-multi-comp:0 */
@connect(({ notice, loading }) => ({
  notice,
  loading: loading.models.notice,
}))
@Form.create()
class Notice extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    list: [],
  };

  columns = [
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
          <a onClick={() => this.handleModalVisible(true, record)}>查看</a>
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
      type: 'notice/list',
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
      type: 'notice/list',
      payload: {},
    });
  };
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formVals: record || {},
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
        type: 'notice/list',
        payload: {
          name: values.name,
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
      type: 'notice/list',
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
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="标题">
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
      <PageHeaderWrapper title="公告">
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
        <CreateForm {...parentMethods} values={formVals} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Notice;
