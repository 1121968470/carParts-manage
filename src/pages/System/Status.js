import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Button, Card, Col, Divider, Drawer, Form, Input, message, Radio, Row, Select, Steps, Table,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../System/System.less';
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
            var rank = fieldsValue.rank;

            const {values} = this.props;
            fieldsValue = {
                ...fieldsValue,
                id: values.id,
            };
            handleAdd(fieldsValue,()=>{ form.resetFields();});
        });
    };
    validateRank = (rule, val, callback) => {
        if (!val) {
            callback();
        }

        if (val < 1) {
            callback('排序为大于0的整数！');
        }
        callback();
    }
    render() {
        const {modalVisible, form, handleAdd, handleModalVisible, values} = this.props;
        return (
            <Drawer
                title="新增/编辑"
                placement="right"
                width={480}
                closable={true}
                destroyOnClose
                onClose={() => handleModalVisible()}
                visible={modalVisible}
            >
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名称">
                    {form.getFieldDecorator('name', {
                        initialValue: values.name,
                        rules: [{required: true, message: '请输入名称！'}, {max: 6, message: '名称不超过6个字'}],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="关联考勤项">
                    {form.getFieldDecorator('attendStatus', {
                        initialValue: values.attendStatus,
                    })(<Select
                        style={{ width: 270 }}
                        defaultValue=""
                       >
                        <Option value="" >不关联</Option>
                        <Option value="LEAVE">请假</Option>
                        <Option value="OUT">外出</Option>
                        <Option value="OVERTIME">加班</Option>
                        <Option value="BUSSINESS">出差</Option>
                    </Select>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="排序">
                    {form.getFieldDecorator('rank', {
                        initialValue: values.rank,
                        rules: [{validator: this.validateRank}],
                        validator: this.validateRank
                    })(<Input type="number" placeholder="请输入"/>)}
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
@connect(({userStatus, office, loading}) => ({
    userStatus,
    loading: loading.models.userStatus,
}))
@Form.create()
class Status extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        formValues: {},
        list: [],
    };

    componentDidMount() {
        this.firstLoad();
    }

    firstLoad = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'userStatus/listStatus',
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
            type: 'userStatus/listStatus',
            payload: {},
            callback: result => {
                this.setState({result: result});
            },
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
                type: 'userStatus/listStatus',
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
            type: 'userStatus/listStatus',
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
            type: 'userStatus/del',
            payload: {
                id: id,
            },
            callback: () => {
                this.firstLoad();
            },
        });
    };
    //添加
    handleAdd = (fields,callback) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'userStatus/save',
            payload: fields,
            callback: result => {
                if (result.succee) {
                    message.success('添加成功');
                    this.firstLoad();
                    callback;
                    this.handleModalVisible();
                } else {
                    message.warn(result.msg);
                }
            },
        });

    };

    renderSimpleForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        const {offices} = this.state;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Col md={3} sm={12}>
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                        新增
                    </Button>
                </Col>
                <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
                    <Col md={6} sm={12}>
                        <FormItem label="名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={3} sm={12}>
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
        const {result, modalVisible, formVals, allMenu, status} = this.state;
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
            <PageHeaderWrapper title="状态管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Table
                                loading={false}
                                rowKey={'key'}
                                dataSource={list

                                }
                                columns={[
                                    {
                                        title: '名称',
                                        dataIndex: 'name',
                                    },
                                    {
                                        title: '考勤状态',
                                        dataIndex: 'attendStatus',
                                        render:(val)=>{
                                            return <span>{val=="LEAVE"?"请假":(val=="BUSSINESS"?"出差":(val=="OVERTIME"?"加班":(val=="OUT"?"外出":"")))}</span>
                                        }
                                    },
                                    {
                                        title: '排序',
                                        dataIndex: 'rank',
                                    },
                                    {
                                      title:'状态',
                                        dataIndex:'createDate',
                                        render:(val)=>{
                                          return <span>{moment().format("YYYY-MM-DD")!=val?"已生效":"次日生效"}</span>
                                        }
                                    },
                                    {
                                        title: '操作',
                                        render: (text, record) => (
                                            !record.fixed && (
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
                                            )),
                                    },
                                ]}
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

export default Status;
