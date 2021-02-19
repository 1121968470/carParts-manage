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
import {host} from '@/utils/app.js';

import styles from './Article.less';
import Popconfirm from 'antd/es/popconfirm';
import LineWrap from './LineWrap';

import Link from 'umi/link';
import router from 'umi/router';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
@Form.create()
class CreateForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return <div/>;
    }
}

/* eslint react/no-multi-comp:0 */
@connect(({ activity, loading }) => ({
    activity,
    loading: loading.models.activity,
}))
@Form.create()
class Article extends PureComponent {
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
                return <LineWrap title={text} lineClampNum={2}/>;
            },
        },
        {
            title: '内容',
            dataIndex: 'content',
            render: (text, record) => {
                text = text.replace(/<[^<>]+?>/g, '');
                return <LineWrap title={text} lineClampNum={2}/>;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => (
                <Fragment>
                    <Link to={{pathname: '/article/article/articleEdit', query:{id:record.id}}}>
                        <Button type="primary" size="small" >
                            编辑
                        </Button>
                    </Link>
                    <Divider type="vertical"/>
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
        const {dispatch} = this.props;
        dispatch({
            type: 'article/list',
            payload: {
                pageNum: 0,
                pageSize: 20,
                callback: result => {
                    this.setState({result: result});
                },
            },
        });
    };

    //获取文章标签
    getSelectType = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'article/get',
            payload: {
                callback: result => {
                    this.setState({typeData: result});
                },
            },
        });
    };

    toEdit = record => {
        //跳转编辑页面
        router.push({
            pathname: '/article/articleEdit',
            params: {
                data: record,
            },
        });
    };

    handleFormReset = () => {
        const {form, dispatch} = this.props;
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
        const {dispatch, form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            const {typeId} = this.state;
            this.setState({
                formValues: values,
            });
            dispatch({
                type: 'article/list',
                payload: {
                    pageNum: 0,
                    pageSize: 20,
                    keyword: values.title,
                    catalogId: typeId,
                    callback: result => {
                        this.setState({result});
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
        const {dispatch} = this.props;
        const {formValues} = this.state;
        const params = {
            ...formValues,
        };
        dispatch({
            type: 'article/list',
            payload: {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                callback: result => {
                    this.setState({result: result});
                },
            },
        });
    };

    //删除
    handleDelete = id => {
        const {dispatch} = this.props;
        dispatch({
            type: 'article/del',
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
        const {dispatch} = this.props;
        dispatch({
            type: 'article/save',
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

    handleChange = value => {
        this.setState({typeId: `${value}`});
    };

    renderSimpleForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        const {typeData} = this.state;
        const TypeData = typeData && typeData.data;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Col md={2} sm={24}>
                    <Link to={{pathname: '/article/article/articleEdit'}}>
                        <Button icon="plus" type="primary">
                            新建
                        </Button>
                    </Link>
                </Col>
                <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
                    <Col md={6} sm={12}>
                        <FormItem label="文章类型">
                            <Select defaultValue="全部" style={{width: 120}} onChange={this.handleChange}>
                                {(TypeData || []).map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="标题或内容">
                            {getFieldDecorator('title')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
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
        const {result, modalVisible, formVals, allMenu} = this.state;
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
                                rowKey={'key'}
                                dataSource={list}
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

export default Article;
