import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
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

const {TreeNode} = Tree;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const {Option} = Select;
import styles from './common.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
    static defaultProps = {
        values: {},
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    okHandle = () => {
        const {form, handleAdd} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            form.resetFields();
            const {values} = this.props;
            fieldsValue = {
                ...fieldsValue,
                id: values.id,
            };
            handleAdd(fieldsValue);
        });
    };

    render() {
        const {modalVisible, form, handleModalVisible, values, catalogs} = this.props;

        return (
            <Drawer
                title="新增/编辑栏目"
                placement="right"
                destroyOnClose
                width={480}
                closable={true}
                onClose={() => handleModalVisible()}
                visible={modalVisible}
            >
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名称">
                    {form.getFieldDecorator('name', {
                        initialValue: values.name,
                        rules: [
                            {required: true, message: '请输入名称！'},
                            {max: 10, message: '名称不超过10个字'},
                        ],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="父栏目">
                    {form.getFieldDecorator('parent', {
                        initialValue: values.parent,
                    })(
                        <Select
                            placeholder="请选择"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {catalogs &&
                            catalogs.map(item => {
                                return <Option value={item.id}>{item.name}</Option>;
                            })}
                        </Select>
                    )}
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
@connect(({officeCatalog, menu_com, loading}) => ({
    officeCatalog,
    menu_com,
    loading: loading.models.officeCatalog,
}))
@Form.create()
class OfficeCatalog extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        list: [],
        allMenu: [],
        checkedKeys: ['1'],
    };

    columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title={'确认删除[' + record.name + ']吗？'}
                        onConfirm={() => this.handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <a>删除</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                </Fragment>
            ),
        },
    ];

    componentDidMount() {
        this.firstLoad();
    }

    firstLoad = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'officeCatalog/listAll',
            payload: {},
            callback: result => {
                this.setState({catalogs: result.data});
            },
        });
        dispatch({
            type: 'officeCatalog/list',
            payload: {
                page: {pageNum: 1, pageSize: 10},
            },
            callback: result => {
                this.setState({result: result});
            },
        });
    };

    handleFormReset = () => {
        const {form, dispatch} = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'officeCatalog/list',
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
    //搜索
    handleSearch = e => {
        e.preventDefault();

        const {dispatch, form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            this.setState({
                formValues: values,
            });
            dispatch({
                type: 'officeCatalog/list',
                payload: {
                    name: values.name,
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
            type: 'officeCatalog/list',
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
            type: 'officeCatalog/del',
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
            type: 'officeCatalog/save',
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
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={6} sm={12}>
                        <FormItem label="名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
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
        const {result, modalVisible, formVals, catalogs} = this.state;
        const list = result && result.list;
        var checkedKeys = [];
        if (formVals) {
            checkedKeys = formVals.menuId;
        }
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
            <PageHeaderWrapper title="栏目管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>

                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
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
                    catalogs={catalogs}
                    checkedKeys={checkedKeys}
                    values={formVals}
                    modalVisible={modalVisible}
                />
            </PageHeaderWrapper>
        );
    }
}

export default OfficeCatalog;
