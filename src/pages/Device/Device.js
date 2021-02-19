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
    TimePicker,
    Modal,
    message,
    Badge,
    Divider,
    Steps,
    Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Device.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
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
                fileId: values.fileId,
            }
            handleAdd(fieldsValue);
        });
    };

    render() {
        const {modalVisible, form, handleAdd, handleModalVisible, values} = this.props;
        return (
            <Drawer
                title="新增/编辑角色"
                placement="right"
                width={480}
                closable={true}
                onClose={() => handleModalVisible()}
                visible={modalVisible}
            >
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名称">
                    {form.getFieldDecorator('name', {
                        initialValue: values.name,
                        rules: [{required: true, message: '请输入名称！', max: 10}],
                    })(<Input placeholder="名称"/>)}
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
@connect(({device, loading}) => ({
    device,
    loading: loading.models.device,
}))
@Form.create()
class Device extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        list: [],
        companies: [],
        departments: [],
        duties: [],
        data: {},
    };

    columns = [
        {
            title: '设备名称',
            dataIndex: 'deviceName',
        },
        {
            title: '设备编码',
            dataIndex: 'deviceSn',
        },
        {
            title: '状态',
            dataIndex: 'isConnect',
            render: val => <span>{val?'正常':'已断开'}</span>,
        },
        {
            title: '最后一次连接时间',
            dataIndex: 'lastReportTime',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm title={'确认删除[' + record.deviceName + ']吗？'}
                                onConfirm={() => this.handleDelete(record.id)}
                                okText='确认'
                                cancelText='取消'

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
            type: 'device/getConfig',
            payload: {
            },
            callback: (result) => {
                this.setState({data: result.datas});
            }
        });
    }


    handleFormReset = () => {
        const {form, dispatch} = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'device/list',
            payload: {},
        });
    };
    handleModalVisible = (flag, record) => {

        this.setState({
            modalVisible: !!flag,
            formVals: record || {},
            checkedKeys: []
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
                type: 'device/list',
                payload: {
                    params: values.params,
                    callback: (result) => {
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
    handleTableChange = (pagination) => {
        const {dispatch} = this.props;
        const {formValues} = this.state;
        const params = {
            ...formValues,
        };
        dispatch({
            type: 'device/list',
            payload: {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                callback: (result) => {
                    this.setState({result: result});
                }
            }
        });

    }
    //删除
    handleDelete = (id) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'device/del',
            payload: {
                id: id,
            },
            callback: () => {
                this.firstLoad()
            },
        });

    };
    //添加
    handleAdd = fields => {
        const {dispatch} = this.props;
        dispatch({
            type: 'device/save',
            payload: fields,
            callback: (result) => {
                if (result.succee) {
                    message.success('添加成功');
                    this.firstLoad()
                } else {
                    message.warn(result.msg)
                }
            }
        });
        this.handleModalVisible();

    };
    //设置时间
    handleConfigSet = e => {
        e.preventDefault();
        const {dispatch,form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            dispatch({
                type: 'device/setConfig',
                payload: fieldsValue,
                callback: (result) => {
                    if (result.succee) {
                        message.success('设置成功');
                    } else {
                        message.warn(result.msg)
                    }
                }
            });
        });
    };

    renderSimpleForm() {
        const {data}=this.state
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.handleConfigSet} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col  md={24} sm={12}>
                    <Col md={24} sm={12}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="开机时间">
                            {getFieldDecorator('open_time', {
                                initialValue: data&&moment(data.open_time),
                            })(<TimePicker   format={'HH:mm'} />)}
                        </FormItem>
                    </Col>
                        <Col md={24} sm={12}>
                            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="关机时间">
                                {getFieldDecorator('close_time', {
                                    initialValue:data&&moment(data.close_time),
                                })(<TimePicker format={'HH:mm'} />)}
                            </FormItem>
                        </Col>
                        <Col md={24} sm={12}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }

    render() {
        const {result, modalVisible, formVals} = this.state;
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
            <PageHeaderWrapper title="设备管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                 {/*       <div className={styles.tableListOperator}>
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

                        </div>*/}
                    </div>
                </Card>
                <CreateForm {...parentMethods} values={formVals} modalVisible={modalVisible}/>
            </PageHeaderWrapper>
        );
    }
}

export default Device;
