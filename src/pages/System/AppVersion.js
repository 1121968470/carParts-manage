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
    message,
    Divider,
    Steps,
    Radio, Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { TextArea } = Input;
import styles from '../System/System.less';
import Popconfirm from 'antd/es/popconfirm';
import {host} from '@/utils/app.js';
const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({appVersion, loading}) => ({
    appVersion,
    loading: loading.models.appVersion,
}))
@Form.create()
class Status extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        values: {},
        list: [],
    };

    componentDidMount() {
        this.firstLoad();
    }

    firstLoad = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'appVersion/list',
            payload: {
                page: {},
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
            type: 'appVersion',
            payload: {},
            callback: result => {
                this.setState({result: result});
            },
        });

    };
    handleModalVisible = (flag, record) => {
        this.setState({
            modalVisible: !!flag,
            values: record || {},
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
                type: 'appVersion/listStatus',
                payload: {
                    name: values.name,
                },
                callback: result => {
                    this.setState({result});
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
            type: 'appVersion/list',
            payload: {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,

            },
            callback: result => {
                this.setState({result: result});
            },
        });
    };
    //删除
    handleDelete = id => {
        const {dispatch} = this.props;
        dispatch({
            type: 'appVersion/del',
            payload: {
                id: id,
            },
            callback: () => {
                this.firstLoad();
            },
        });
    };
    okHandle = () => {
        const {form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const {values} = this.state;
            fieldsValue = {
                ...fieldsValue,
                id: values.id,
                latestVerUrl:values.latestVerUrl
            };
            this.handleAdd(fieldsValue,()=>{
                form.resetFields();
            });
        });
    };
    //添加
    handleAdd = (fields,callback) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'appVersion/save',
            payload: fields,
            callback: result => {
                if (result.succee) {
                    message.success('添加成功');
                    this.firstLoad();
                    this.handleModalVisible();
                    callback();
                } else {
                    message.warn(result.msg);
                }
            },
        });

    };

    renderSimpleForm() {
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="start">
                    <Col md={3} sm={12}>
                        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                            新增
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }

    render() {
        const {form: {getFieldDecorator},} = this.props;
        const {result, modalVisible,values} = this.state;
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
        const handleUploadAvatarLoading = () => {
            this.setState({loading: true})
        };
        const uploadImgSuccess = (url) => {
            let {values} = this.state;
            values.latestVerUrl = url;
            this.setState({loading: false,values:values})
            console.log("values",this.state.values);
        }
        const uploadProps = {

            showUploadList: false,
            beforeUpload: this.beforeUpload,
            type:"post",
            name: 'file',
            action: host + '/api/v1/common/upload/img',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    handleUploadAvatarLoading();
                }
                if (info.file.status === 'done') {
                    const url = info.file.response.datas.url;
                    message.success('上传成功。', url, info.file.response);
                    uploadImgSuccess(url);
                } else if (info.file.status === 'error') {
                    message.error(info.file.name + ' 上传失败。');
                }
            },
        };
        return ([
            <PageHeaderWrapper title="app版本管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Table
                                loading={false}
                                rowKey={'key'}
                                dataSource={list}
                                columns={[
                                    {
                                        title: '版本',
                                        dataIndex: 'lastVer',
                                        render: (val, record) => {
                                            return (
                                                <Tooltip placement="topLeft" title={record.directions} arrowPointAtCenter>
                                                    <span>{val}</span>
                                                </Tooltip>
                                            );
                                        },
                                    },
                                    {
                                        title: '强制升级',
                                        dataIndex: 'forceUpdate',
                                        render:(val) =><span>{val?"是":"否"}</span>
                                    },
                                    {
                                        title: '操作',
                                        render: (text, record) => (
                                                <Fragment>
                                                    <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
                                                    <Divider type="vertical"/>
                                                    <Popconfirm
                                                        title={'确认删除[版本：' + record.lastVer + ']吗？'}
                                                        onConfirm={() => this.handleDelete(record.id)}
                                                        okText="确认"
                                                        cancelText="取消"
                                                    >
                                                        <a>删除</a>
                                                    </Popconfirm>
                                                    <Divider type="vertical"/>
                                                    <a  download={record.latestVerUrl&&record.latestVerUrl.substring(record.latestVerUrl.lastIndexOf("/")+1)}  href={record.latestVerUrl}><Icon type="cloud-download" /></a>
                                                </Fragment>
                                            ),
                                    },
                                ]}
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                            />
                        </div>
                    </div>
                </Card>
            </PageHeaderWrapper>,
                <Drawer
                    title="新增/编辑"
                    placement="right"
                    width={480}
                    closable={true}
                    destroyOnClose
                    onClose={() => this.handleModalVisible()}
                    visible={modalVisible}
                >
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="版本号">
                        {getFieldDecorator('lastVer', {
                            initialValue: values.lastVer,
                            rules: [{required: true, message: '请输入版本号！'}, {max: 10, message: '名称不超过10个字'}],
                        })(<Input placeholder="请输入"/>)}
                    </FormItem>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="强制更新">
                        {getFieldDecorator('forceUpdate', {
                            initialValue: values.forceUpdate,
                        })(
                            <Select
                                style={{width: 200}}
                                placeholder="请选择"
                                onChange={this.onChange}
                            >
                                <option value={true} >是</option>
                                <option value={false} defaultChecked  >否</option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="版本说明">
                        {getFieldDecorator('directions', {
                            initialValue: values.directions,
                        })(
                            <TextArea  rows={5} placeholder="请输入"></TextArea>
                        )}
                    </FormItem>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="上传apk">
                        <Upload
                            {...uploadProps}
                        >
                            <Button>
                                <Icon type="upload" />
                            </Button>
                        </Upload>
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
                        }}
                    >
                        <Button
                            style={{
                                marginRight: 8,
                            }}
                            onClick={() => this.handleModalVisible()}
                        >
                            取消
                        </Button>
                        <Button onClick={this.okHandle} type="primary">
                            确定
                        </Button>
                    </div>
                </Drawer>

            ]
        );
    }
}

export default Status;
