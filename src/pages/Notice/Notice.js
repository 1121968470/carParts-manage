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
import {host}from '@/utils/app.js';
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    values: {},
  };
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values && nextProps.values.content) {
      const contentBlock = BraftEditor.createEditorState(nextProps.values.content);
      if (contentBlock) {
        this.setState({ editorState: contentBlock });
      }
    }else{
        this.setState({ editorState: null });
    }
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    const {editorState}=this.state;
      if(editorState==null){
          message.error("公告内容不能为空")
          return;
      }
    var editorContent = editorState.toHTML();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      const { values } = this.props;
      fieldsValue = {
        ...fieldsValue,
        id: values.id,
        content: editorContent,
      };
      handleAdd(fieldsValue);
    });
  };
  //braft-editor
  handleEditorChange = editorState => {
    this.setState({ editorState });
  };
  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };
  onContentStateChange = contentState => {
    this.setState({
      contentState,
    });
  };



  render() {
    const  myUploadFn = param => {
        const serverURL = host+'/api/v1/common/upload/img';
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        const successFn = response => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            const result = JSON.parse(xhr.responseText);
            param.success({
                url:  result.datas.url,
                meta: {
                  id: result.datas.id,
                }
            });
        };

        const progressFn = event => {
            param.progress((event.loaded / event.total) * 100);
        };

        const errorFn = response => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.',
            });
        };
        xhr.upload.addEventListener('progress', progressFn, false);
        xhr.addEventListener('load', successFn, false);
        xhr.addEventListener('error', errorFn, false);
        xhr.addEventListener('abort', errorFn, false);
        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        xhr.send(fd);
    };
    const toolbar = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'separator',
      'separator',
      'hr',
      'separator',
      'media',
      'separator',
      'clear',
    ];
    const { modalVisible, form, handleAdd, handleModalVisible, values } = this.props;
    const { editorState } = this.state;
    const mediaSet = {
      uploadFn: myUploadFn,
    };

    return (
      <Modal
          width={960}
          title="新增/编辑公告"
          visible={modalVisible}
          onOk={this.okHandle}
          destroyOnClose
          maskClosable={false}
          onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('title', {
            initialValue: values.title,
            rules: [{ required: true, message: '请输入标题！' },{max:30,message:'标题最长30个字'}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {form.getFieldDecorator('content', {
              initialValue: "content",
              rules: [{ required: true }],
          })(
            <div className="my-component">
              <BraftEditor
                  media={{uploadFn: myUploadFn,externals:{image:false,video:false,audio:false,embed:false}}}
                value={editorState}
                controls={toolbar}
                onChange={this.handleEditorChange}
              />
            </div>
          )}
        </FormItem>
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
      title: '创建人',
      dataIndex: 'userName',
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
            {record.isFirst?(
            <Popconfirm
                title={'确认取消置顶[' + record.title + ']吗？'}
                onConfirm={() => this.handleDownIt(record.id)}
                okText="确认"
                cancelText="取消"
            >
                <a>取消置顶</a>
            </Popconfirm>
         )
          :(
            <Popconfirm
                title={'确认置顶[' + record.title + ']吗？'}
                onConfirm={() => this.handleTopIt(record.id)}
                okText="确认"
                cancelText="取消"
            >
                <a>置顶</a>
            </Popconfirm>
            )}
          <Divider type="vertical" />
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title={'确认删除[' + record.title + ']吗？'}
            onConfirm={() => this.handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
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
  //删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/del',
      payload: {
        id: id,
      },
      callback: () => {
        this.firstLoad();
      },
    });
  };
  //置顶
  handleTopIt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/top',
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
      type: 'notice/down',
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
      type: 'notice/save',
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Col md={2} sm={24}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
              </Button>
          </Col>
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
          <Col md={6} sm={12}>
            <FormItem label="标题">
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
      <PageHeaderWrapper title="角色管理">
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
