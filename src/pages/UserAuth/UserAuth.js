import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {host} from '../../utils/app';
import {
    Drawer,
    Table,
    Upload,
    Col,
    Card,
    Form,
    Input,
    Icon,
    Button,
    Modal,
    message,
    Divider,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './UserAuth.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
    static defaultProps = {
        values: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            staffSelectModalVisible: false,
        };
    }

    render() {
        const {modalVisible, form, handleModalVisible, values} = this.props;
        return (
            <Modal
                destroyOnClose
                title="新增/编辑验证信息"
                width={480}
                onCancel={() => handleModalVisible()}
                onOk={this.okHandle}
                visible={modalVisible}
            >
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名字">
                    {form.getFieldDecorator('name', {
                        initialValue: values.name,
                        rules: [
                            {required: true, message: '请输入名字！'},
                            {max: 4, message: '名称最长4个字'},
                        ],
                    })(<Input placeholder="请输入名字"/>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="毕业年份">
                    {form.getFieldDecorator('year', {
                        initialValue: values.year,
                        rules: [{required: true, message: '毕业年份！'}, {max: 4, message: '年份为4位'}],
                    })(<Input placeholder="请输入毕业年份"/>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="毕业班级">
                    {form.getFieldDecorator('clazz', {
                        initialValue: values.clazz,
                        rules: [
                            {required: true, message: '毕业班级！'},
                            {max: 2, message: '毕业班级是2位'},
                        ],
                    })(<Input placeholder="请输入班级"/>)}
                </FormItem>
            </Modal>
        );
    }
}

/* eslint react/no-multi-comp:0 */
@connect(({userAuth, loading}) => ({
    userAuth,
    loading: loading.models.userAuth,
}))
@Form.create()
class UserAuth extends PureComponent {
    state = {
        modalVisible: false,
        formValues: {},
    };

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '毕业年份',
            dataIndex: 'year',
            render: val => <div>{val}年</div>,
        },
        {
            title: '毕业班级',
            dataIndex: 'clazz',
            render: val => <div>{val}班</div>,
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
                </Fragment>
            ),
        },
    ];

    componentDidMount() {
        this.firstLoad();
    }

    okHandle = () => {
        const {form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            fieldsValue = {
                ...fieldsValue,
                id: this.state.formValues.id,
            };
            this.handleAdd(fieldsValue);
        });
    };
    firstLoad = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'userAuth/list',
            payload: {
                page: {pageSize: 10, pageNum: 1},
                callback: result => {
                    this.setState({result: result});
                },
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
            type: 'office/list',
            payload: {},
        });
    };
    handleStaffSelectModalVisible = (flag, record) => {
        this.setState({
            staffSelectModalVisible: !!flag,
            selectedStaffCopy: record || [],
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
                type: 'office/list',
                payload: {
                    name: values.name,
                    callback: result => {
                        this.setState({result});
                    },
                },
            });
        });
    };
    handleTableChange = pagination => {
        const {dispatch} = this.props;
        const {formValues} = this.state;
        const params = {
            ...formValues,
        };
        dispatch({
            type: 'userAuth/list',
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
            type: 'userAuth/del',
            payload: {
                id: id,
            },
            callback: result => {
                if (result.succee) {
                    this.firstLoad();
                } else {
                    message.warn(result.msg);
                }
            },
        });
    };
    handleAdd = fields => {
        const {dispatch} = this.props;
        dispatch({
            type: 'userAuth/save',
            payload: {...fields},
            callback: result => {
                if (result.succee) {
                    message.success('添加/编辑成功');
                    this.firstLoad();
                    this.handleModalVisible();
                    this.props.form.resetFields();
                } else {
                    message.warn(result.msg);
                }
            },
        });
    };

    renderForm() {
        return this.renderSimpleForm();
    }

    itemStyles = {
        border: '1px solid gray',
        marginTop: 5,
        padding: '2px 5px',
        backgroundColor: '#F8F8F8',
        borderRadius: 2,
        height: 30,
        width: 97,
    };

    nameStyles = {
        width: 80,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    loopSelectedStaff = data =>
        data.map(item => {
            return (
                <Col span={24}>
                    <Tooltip placement="topLeft" title={item.name} arrowPointAtCenter>
                        <div style={this.itemStyles} onClick={e => this.onStaffClick(item.id)}>
              <span style={this.nameStyles} key={item.id}>
                {item.name.length < 5 ? item.name : item.name.substring(0, 4) + '...'}
              </span>
                        </div>
                    </Tooltip>
                </Col>
            );
        });
    loopStaff = (staff, selectedStaff, otherSelectedStaff) =>
        staff.map(item => {
            if (selectedStaff === undefined) return;
            let checked = false;
            selectedStaff.forEach(_item => {
                if (item.id === _item.id) {
                    checked = true;
                }
            });

            let disableCheck = false;
            otherSelectedStaff.forEach(_item => {
                if (item.id === _item.id) {
                    disableCheck = true;
                }
            });

            let itemProps = {};
            if (disableCheck) {
                //itemStyles.backgroundColor = "#787878";
            } else {
                itemProps.onClick = e => this.onStaffClick(item.id);
            }

            return (
                <Col span={6}>
                    <Tooltip placement="topLeft" title={item.name} arrowPointAtCenter>
                        <div
                            style={
                                disableCheck ? {...this.itemStyles, backgroundColor: '#787878'} : this.itemStyles
                            }
                            {...itemProps}
                        >
              <span style={this.nameStyles} key={item.id}>
                {item.name.length < 5 ? item.name : item.name.substring(0, 4) + '...'}
              </span>

                            {checked && (
                                <span style={{marginLeft: 5, float: 'right'}}>
                  <Icon type="check"/>
                </span>
                            )}
                        </div>
                    </Tooltip>
                </Col>
            );
        });

    loop = data =>
        data.map(item => {
            if (item.title === undefined) return null;
            const title = <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title}/>;
        });

    render() {
        const {result, modalVisible} = this.state;
        let formVals = this.state.formVals || {};
        const {form} = this.props;
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
            modalVisible: modalVisible,
            values: formVals,
        };
        const uploadFiled = {
            name: 'file',
            action: host + '/api/v1/web/userAuth/batchInit',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <PageHeaderWrapper title="信息管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                            <Upload {...uploadFiled}>
                                <Button>
                                    <Icon type="upload"/>
                                    上传
                                </Button>
                            </Upload>

                            <Table
                                loading={false}
                                dataSource={list}
                                columns={this.columns}
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                            />
                        </div>
                    </div>
                </Card>
                <Modal
                    destroyOnClose
                    title="新增/编辑验证信息"
                    width={480}
                    onCancel={() => this.handleModalVisible()}
                    onOk={this.okHandle}
                    visible={modalVisible}
                >
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名字">
                        {form.getFieldDecorator('name', {
                            initialValue: formVals.name,
                            rules: [
                                {required: true, message: '请输入名字！'},
                                {max: 4, message: '名称最长4个字'},
                            ],
                        })(<Input placeholder="请输入名字"/>)}
                    </FormItem>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="毕业年份">
                        {form.getFieldDecorator('year', {
                            initialValue: formVals.year,
                            rules: [{required: true, message: '毕业年份！'}, {max: 4, message: '年份为4位'}],
                        })(<Input placeholder="请输入毕业年份"/>)}
                    </FormItem>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="毕业班级">
                        {form.getFieldDecorator('clazz', {
                            initialValue: formVals.clazz,
                            rules: [
                                {required: true, message: '毕业班级！'},
                                {max: 2, message: '毕业班级是2位'},
                            ],
                        })(<Input placeholder="请输入班级"/>)}
                    </FormItem>
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default UserAuth;
