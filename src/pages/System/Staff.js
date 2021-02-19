import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {
    Spin,
    Avatar,
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
    Modal,
    message,
    Divider,
    Tree,
} from 'antd';

const Search = Input.Search;
const {TreeNode} = Tree;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './System.less';
import Popconfirm from 'antd/es/popconfirm';

import {host} from '@/utils/app.js';
import Center from '../Account/Center/Center';

const FormItem = Form.Item;
const {Option} = Select;

const AvatarView = ({avatar}) => {
    return (
        <Fragment>
            <div className={styles.avatar}>{avatar ? <img src={avatar} alt="avatar"/> : ''}</div>
        </Fragment>
    );
};

@Form.create()
class UpdateForm extends PureComponent {
    static defaultProps = {
        parent: '',
        currentOrg: {},
    };

    constructor(props) {
        super(props);
    }

    okHandle = () => {
        const {form, handleAdd, parent, currentOrg} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            form.resetFields();
            fieldsValue = {
                ...fieldsValue,
                id: currentOrg.id,
            };
            handleAdd(fieldsValue);
        });
    };

    render() {
        const {
            updateModalVisible,
            form,
            handleAdd,
            handleUpdateModalVisible,
            currentOrg,
        } = this.props;
        return (
            <Modal
                width={680}
                title="编辑本节点"
                visible={updateModalVisible}
                destroyOnClose
                onOk={this.okHandle}
                onCancel={() => handleUpdateModalVisible()}
            >
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名称">
                    {form.getFieldDecorator('name', {
                        initialValue: currentOrg.name,
                        rules: [
                            {required: true, message: '请输入名称！'},
                            {max: 10, message: '名称不超过10个字'},
                        ],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="序号">
                    {form.getFieldDecorator('rank', {
                        initialValue: currentOrg.rank,
                    })(<Input placeholder="请输入"/>)}
                </FormItem>
            </Modal>
        );
    }
}

@Form.create()
class CreateForm extends PureComponent {
    static defaultProps = {
        values: {},
        checkedKeys: [],
        allOrg: [],
        parent: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            dataList: [],
            autoExpandParent: true,
            expandedKeys: [],
        };
    }

    okHandle = () => {
        const {form, handleAdd, parent} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            form.resetFields();
            const {values} = this.props;
            fieldsValue = {
                ...fieldsValue,
                id: values.id,
                parent: parent,
            };
            handleAdd(fieldsValue);
        });
    };

    render() {
        const {modalVisible, form, handleAdd, handleModalVisible, values, allOrg} = this.props;
        const {expandedKeys, searchValue, autoExpandParent, checkedKeys} = this.state;
        return (
            <Drawer
                title="新增子节点"
                placement="left"
                width={480}
                destroyOnClose
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
                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="序号">
                    {form.getFieldDecorator('rank', {
                        initialValue: values.rank,
                    })(<Input placeholder="请输入"/>)}
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
@connect(({org, staff, loading}) => ({
    org,
    staff,
    loading: loading.models.staff,
}))
@Form.create()
class Staff extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        userModalVisible: false,
        fingerModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        result: {},
        allOrg: [],
        parent: 'ROOT',
        currentOrg: {},
        finger: '',
        currentItem: {display: 'none'},
        orgSelectedVisible: false,
        selectOrg: '',
        comfirmSelectedOrg: '',
        selectedOrgName: '',
        loading: false,
        fingerLoading: false,
        values: {},
    };

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '科室',
            dataIndex: 'orgName',
        },
        {
            title: '职务',
            dataIndex: 'dutyName',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '录入指纹',
            dataIndex: 'boundFinger',
            render: val => <span>{val ? '已录' : '未录'}</span>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleUserModalVisible(true, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title={'确认删除[' + record.name + ']吗？'}
                        onConfirm={() => this.handleUserDelete(record.id)}
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

    firstLoad = parent => {
        const {dispatch} = this.props;
        parent = parent || this.state.parent;
        if (parent == null) {
            parent = 'ROOT';
        }
        dispatch({
            type: 'staff/list',
            payload: {
                orgId: parent,
                page: {},
            },
            callback: result => {
                this.setState({result: result});
            },
        });
        dispatch({
            type: 'org/all',
            payload: {},
            callback: result => {
                this.setState({allOrg: result.data});
            },
        });
        dispatch({
            type: 'org/basic',
            payload: {},
            callback: result => {
                this.setState({
                    duties: result.datas.duties,
                    orgs: result.datas.orgs,
                    offices: result.datas.offices,
                    roles: result.datas.roles,
                });
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
            type: 'org/list',
            payload: {},
        });
    };
    handleModalVisible = (id, flag, record) => {
        this.setState({
            modalVisible: !!flag,
            formVals: record || {},
            checkedKeys: [],
            parent: id,
        });
    };
    handleUserModalVisible = (flag, record) => {
        this.setState({
            userModalVisible: !!flag,
            values: Object.assign({}, record) || {},
            finger: '',
        });
    };
    handleFingerModalVisible = flag => {
        this.setState({
            fingerModalVisible: !!flag,
        });
    };

    //搜索
    handleSearch = e => {
        e.preventDefault();
        const {dispatch, form} = this.props;
        const userName = form.getFieldValue('userName');
        this.setState({userName: userName});
        dispatch({
            type: 'staff/list',
            payload: {
                name: userName,
                orgId: this.state.parent,
            },
            callback: result => {
                this.setState({result});
            },
        });
    };
    handleUpdateModalVisible = (id, flag, record) => {
        if (flag && id) {
            this.getById(id);
        }
        this.setState({
            updateModalVisible: !!flag,
            parent: id,
        });
    };
    handleTableChange = pagination => {
        const {dispatch} = this.props;
        const {formValues} = this.state;
        const params = {
            ...formValues,
        };
        dispatch({
            type: 'staff/list',
            payload: {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                name: params.userName,
                orgId: this.state.parent,
            },
            callback: result => {
                this.setState({result});
            },
        });
    };
    //删除
    handleDelete = id => {
        const {dispatch} = this.props;
        dispatch({
            type: 'org/del',
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
    //删除用户
    handleUserDelete = id => {
        const {dispatch} = this.props;
        dispatch({
            type: 'staff/del',
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
    //
    //添加
    handleAdd = fields => {
        const {dispatch} = this.props;

        dispatch({
            type: 'org/save',
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
        this.handleUpdateModalVisible();
    };
    //添加人员
    handleUserAdd = fields => {
        const {dispatch} = this.props;
        fields = {
            ...fields,
            finger: this.state.finger,
        };
        dispatch({
            type: 'staff/save',
            payload: fields,
            callback: result => {
                if (result.succee) {
                    message.success('添加成功');
                    this.firstLoad();
                    this.handleUserModalVisible();
                    this.props.form.resetFields();
                } else {
                    message.warn(result.msg);
                }
            },
        });
        this.setState({finger: ''});
    };
    //获取本节点
    getById = parent => {
        if (!parent) return;
        const {dispatch} = this.props;
        dispatch({
            type: 'org/get',
            payload: {
                id: parent,
            },
            callback: result => {
                this.setState({currentOrg: result.data});
            },
        });
    };
    handelFinger = v => {
        let values = this.state.values;
        values.boundFinger = true;
        this.setState({finger: v, values: values});
    };
    onSelect = (selectedKeys, info) => {
        const key = selectedKeys[0];
        if (!key) return;
        this.setState({parent: key});
        this.firstLoad(key);
    };

    renderSimpleForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Col md={3} sm={12}>
                    <Button icon="plus" type="primary" onClick={() => this.handleUserModalVisible(true)}>
                        新增人员
                    </Button>
                </Col>
                <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
                    <Col md={8} sm={12}>
                        <FormItem label="人员名字">
                            {getFieldDecorator('userName')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={3} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
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

    selectedOrg = (selectedKeys, e) => {
        const key = selectedKeys[0];
        if (!key) return;
        this.setState({selectOrg: key, selectedOrgName: e.node.props.title});
    };
    handleOrgSelect = () => {
        const {values} = this.state;
        values.orgId = this.state.selectOrg;
        values.orgName = this.state.selectedOrgName;
        this.setState({values: values});
        this.handleOrgSelectedVisible(false);
    };
    handleOrgSelectedVisible = flag => {
        this.setState({orgSelectedVisible: !!flag});
    };
    okHandle = () => {
        const {form} = this.props;
        const {values} = this.state;
        form.validateFields((err, fieldsValue) => {
            const orgId = values.orgId;
            if (!orgId) {
                message.error('请选择科室');
                return;
            }
            if (err) {
                return;
            }
            fieldsValue = {
                ...fieldsValue,
                id: values.id,
                orgId: values.orgId,
                avatar: values.avatar,
                fingerImage: values.fingerImage,
            };
            this.handleUserAdd(fieldsValue);
        });
    };
    renderSimpleTreeNodes = data =>
        data.map(item => {
            var titleValue = item.title;
            if (item.title == undefined) return null;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.title}>
                        {this.renderSimpleTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.title}/>;
        });
    beforeUpload = file => {
        const isJPG = file.type.indexOf('image');
        if (isJPG < 0) {
            message.error('不是图片格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不超过2M!');
        }
        return isJPG && isLt2M;
    };
    validateRank = (rule, val, callback) => {
        if (!val) {
            callback();
        }

        if (val < 1) {
            callback('排序为大于0的整数！');
        }
        callback();
    };
    handleImageBase64 = imgBase64 => {
        const {values} = this.state;
        values.fingerImage = imgBase64;
        this.setState({
            values: values,
        });
    };
    getFingerCode = () => {
        let spDeviceType = 2;
        let spComPort = 1;
        let spBaudRate = 6;
        let spCharLen = 512;
        let spTimeOut = 3;
        form1.ZAZFingerActivex.spDeviceType = spDeviceType;
        form1.ZAZFingerActivex.spComPort = spComPort;
        form1.ZAZFingerActivex.spBaudRate = spBaudRate;
        form1.ZAZFingerActivex.CharLen = spCharLen;
        form1.ZAZFingerActivex.FingerCode = '';
        form1.ZAZFingerActivex.TimeOut = spTimeOut;
        var baseHeader = 'data:image/bmp;base64,';
        var mesg = form1.ZAZFingerActivex.ZAZRegFinger();
        if (mesg == '-1' || mesg == '-2' || mesg == '-3' || mesg == '-4') {
            let warmMesage = '';
            if (mesg == -1) {
                warmMesage = '设备未连接';
            } else if (mesg == '-2') {
                warmMesage = '数据错误';
            } else if (mesg == '-4') {
                warmMesage = '请求超时';
            } else if (mesg == '-3') {
                warmMesage = '设备控件调用文件被占用或被删除';
            }
            message.error('录入失败,请重试:' + warmMesage);
            return;
        }
        this.setState({fingerLoading: true});
        window.setTimeout(() => {
            var fingerCode = form1.ZAZFingerActivex.FingerCode;
            if (fingerCode) {
                form1.ZAZFingerActivex.ZAZSetIMG(256, 288);
                var ret = form1.ZAZFingerActivex.GetImgBase64();
                if (ret == 1) {
                    var imgaeInBase64 = form1.ZAZFingerActivex.Bmpbase64;
                    this.handleImageBase64(baseHeader + imgaeInBase64);
                } else {
                    this.setState({fingerLoading: false});
                    message.warn('指纹没有提取成功，重试！将手指放在指纹录入设备上,3秒后开始自动采集');
                    this.getFingerCode();
                    return;
                }
                this.handelFinger(fingerCode);
                message.success('指纹提取完成，请点击确认上传指纹');
            } else {
                this.setState({fingerLoading: false});
                message.warn('指纹没有提取成功，重试！将手指放在指纹录入设备上,3秒后开始自动采集');
                this.getFingerCode();
                return;
            }
            this.setState({fingerLoading: false});
        }, 3000);
        return;
    };

    render() {
        const {
            orgSelectedVisible,
            result,
            modalVisible,
            updateModalVisible,
            allOrg,
            parent,
            currentOrg,
            values,
        } = this.state;
        const {
            form: {getFieldDecorator},
        } = this.props;
        const {duties, orgs, offices, roles} = this.state;
        const list = result && result.list;
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: false,
            total: result && result.total,
            current: result && result.pageNum,
        };
        const basicData = {
            duties: duties,
            orgs: orgs,
            offices: offices,
            roles: roles,
            allOrg: allOrg,
            handleUserModalVisible: this.handleUserModalVisible,
            handleUserAdd: this.handleUserAdd,
            handleFingerModalVisible: this.handleFingerModalVisible,
        };
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            firstLoad: this.firstLoad,
            handleUpdateModalVisible: this.handleUpdateModalVisible,
            getById: this.getById,
        };
        const fingerMethods = {
            handelFinger: this.handelFinger,
            handleFingerModalVisible: this.handleFingerModalVisible,
        };
        const renderTreeNodes = data =>
            data.map(item => {
                var titleValue = item.title;
                if (item.title == undefined) return null;
                if (item.children) {
                    return (
                        <TreeNode key={item.key} title={item.title}>
                            {renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={item.title}/>;
            });
        //userModal
        const handleUploadAvatarLoading = () => {
            this.setState({loading: true});
        };
        const uploadImgSuccess = avatar => {
            const {values} = this.state;
            values.avatar = avatar;
            this.setState({loading: false, values: values});
        };
        const uploadProps = {
            listType: 'picture-card',
            className: 'avatar-uploader',
            showUploadList: false,
            beforeUpload: this.beforeUpload,
            name: 'file',
            action: host + '/api/v1/common/upload/img',
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    handleUploadAvatarLoading();
                }
                if (info.file.status === 'done') {
                    const avatar = info.file.response.datas.url;
                    message.success('上传成功。', avatar, info.file.response);
                    uploadImgSuccess(avatar);
                } else if (info.file.status === 'error') {
                    message.error(info.file.name + ' 上传失败。');
                }
            },
        };
        const uploadButton = (
            <div>
                <Icon style={{fontSize: 83}} type={this.state.loading ? 'loading' : 'plus'}/>
                <div style={{width: 102, fontSize: 12}} className="ant-upload-text">
                    头像宽高比建议为4:5，限2M
                </div>
            </div>
        );
        const orgOption = orgs && orgs.map(d => <Option key={d.id}>{d.name}</Option>);
        const dutyOption = offices && duties.map(d => <Option key={d.id}>{d.name}</Option>);
        const roleOption = offices && roles.map(d => <Option key={d.id}>{d.name}</Option>);
        const officeOption =
            offices &&
            offices.map(d => (
                <Option key={d.id}>{d.address ? d.name + '--' + d.address : d.name}</Option>
            ));
        const tipStyles = {
            width: 6,
            height: 11,
            borderRadius: 3,
            display: 'inline-block',
            marginLeft: 16,
        };
        const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
        return [
            <PageHeaderWrapper title="组织结构管理">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={6} sm={12}>
                        <Card>
                            <Tree defaultExpandParent onSelect={this.onSelect}>
                                {this.renderSimpleTreeNodes(allOrg)}
                            </Tree>
                        </Card>
                    </Col>
                    <Col md={18} sm={12}>
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
                    </Col>
                </Row>
                <CreateForm {...parentMethods} parent={parent} modalVisible={modalVisible}/>
                <UpdateForm
                    {...parentMethods}
                    parent={parent}
                    currentOrg={currentOrg}
                    updateModalVisible={updateModalVisible}
                />
            </PageHeaderWrapper>,
            <Modal
                width={680}
                title="新增/编辑用户"
                visible={this.state.userModalVisible}
                onOk={this.okHandle}
                destroyOnClose
                onCancel={() => this.handleUserModalVisible()}
            >
                <Form id="form1" name="form1">
                    <object
                        classid="clsid:87772C8D-3C8C-4E55-A886-5BA5DA384424"
                        id="ZAZFingerActivex"
                        name="ZAZFingerActivex"
                        width="1"
                        height="1"
                        accesskey="a"
                        tabindex="0"
                        title="finger"
                    />
                    <Row gutter={{md: 24, lg: 24, xl: 48}}>
                        <Col md={8}>
                            <Col md={24} sm={12}/>
                        </Col>
                        <Col md={24} sm={12}>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
                                    {getFieldDecorator('name', {
                                        initialValue: values.name,
                                        rules: [{required: true, message: '姓名不能为空'}],
                                    })(<Input placeholder="请输入" style={{width: 200}}/>)}
                                </FormItem>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="科室">
                                    {getFieldDecorator('orgId', {
                                        initialValue: 'orgId',
                                        rules: [{required: true}],
                                    })(
                                        <Button
                                            style={{width: 200, textAlign: 'left'}}
                                            onClick={() => this.handleOrgSelectedVisible(true)}
                                        >
                                            {values.orgName ? <span>{values.orgName}</span> : <span>点击选择</span>}
                                        </Button>
                                    )}
                                </FormItem>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色">
                                    {getFieldDecorator('roleId', {
                                        initialValue: values.roleId,
                                        rules: [{required: true, message: '请选择角色！'}],
                                    })(
                                        <Select
                                            showSearch
                                            style={{width: 200}}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            onChange={this.onChange}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {roleOption}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>

                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="头像">
                                    <Upload {...uploadProps}>
                                        {values && values.avatar ? (
                                            <div style={{height: 135, width: 110}}>
                                                <img
                                                    style={{objectFit: 'cover', height: '100%', width: '100%'}}
                                                    src={values.avatar}
                                                    alt="avatar"
                                                />
                                            </div>
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Col>
                        <Col md={24} sm={12}>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职务">
                                    {getFieldDecorator('dutyId', {
                                        initialValue: values.dutyId,
                                        rules: [{required: true, message: '请选择职务！'}],
                                    })(
                                        <Select
                                            showSearch
                                            style={{width: 200}}
                                            placeholder="请选择"
                                            onChange={this.onChange}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {dutyOption}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="手机号">
                                    {getFieldDecorator('phone', {
                                        initialValue: values.phone,
                                        rules: [
                                            {required: true, message: '请输入11位手机号！'},
                                            {
                                                pattern: '[1][0-9]{10}',
                                                message: '必须是1开头的11位手机号',
                                                min: 11,
                                                max: 11,
                                            },
                                        ],
                                    })(<Input placeholder="请输入" style={{width: 200}}/>)}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col md={24} sm={12}>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="排序">
                                    {getFieldDecorator('rank', {
                                        initialValue: values.rank,
                                        rules: [{validator: this.validateRank}],
                                    })(<Input placeholder="科室排序" type="number" style={{width: 200}}/>)}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="办公室">
                                    {getFieldDecorator('officeId', {
                                        initialValue: values.officeId,
                                        rules: [{required: true, message: '请选择办公室！'}],
                                    })(
                                        <Select
                                            showSearch
                                            style={{width: 200}}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            onChange={this.onChange}
                                        >
                                            {officeOption}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col md={24} sm={12}>
                            <Col md={12} sm={12}>
                                <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="指纹">
                                    <Spin indicator={antIcon} spinning={this.state.fingerLoading}>
                                        <div
                                            style={{
                                                height: 200,
                                                width: 200,
                                                cursor: 'pointer',
                                                border: '1px dashed #d9d9d9',
                                                textAlign: 'center',
                                                lineHeight: '200px',
                                            }}
                                            onClick={this.getFingerCode}
                                        >
                                            {values.fingerImage ? (
                                                <img style={{height: '100%', width: '100%'}} src={values.fingerImage}/>
                                            ) : (
                                                '点击录入指纹'
                                            )}
                                        </div>
                                    </Spin>
                                </FormItem>
                            </Col>
                        </Col>
                    </Row>
                </Form>
            </Modal>,
            <Modal
                key="orgSelectedModal"
                width={680}
                title="选择科室"
                destroyOnClose
                visible={orgSelectedVisible}
                onOk={() => this.handleOrgSelect()}
                onCancel={() => this.handleOrgSelectedVisible()}
            >
                <Tree defaultExpandAll onSelect={this.selectedOrg}>
                    {this.renderSimpleTreeNodes(allOrg)}
                </Tree>
            </Modal>,
        ];
    }
}

export default Staff;
