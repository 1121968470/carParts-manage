import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import {Button, Drawer, Form, Input, Layout, message, Table, Modal, Select, Popconfirm, Row, Col} from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import LineWrap from '@/utils/LineWrap.js';
import { encode } from "@/utils/md5";

const { Header } = Layout;
const FormItem = Form.Item;
const powers = require('@/utils/power.js');

@Form.create()
class CreateForm  extends PureComponent {
    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state={
            confirmDirty:false,
            selectedRowKeys: [],
        }
    }

    componentDidMount () {
        this.props.onRef(this)
    }

    okHandle = () => {
        const {form,handleAdd} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err){ return;}
            var password = encode(fieldsValue.newPwd1);
            var oldPwd = encode(fieldsValue.oldPwd);
            fieldsValue={
                oldPwd:oldPwd,
                password:password,
            }
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPwd1')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['newPwd2'], { force: true });
        }
        callback();
    };

    onSelectChange = selectedRowKeys => {//勾选触发
        this.setState({ selectedRowKeys });
    };

    clearSelect = () => {//清除勾选
        this.setState({ selectedRowKeys: [] });
    };

    handleSearch = e => {//搜索
        e.preventDefault();

        const { searchUser, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            searchUser(values);
        });
    };

    render() {
        const {
            pwdModalVisible, form,
            handleModalVisible, keys,powerMsg,handleFormReset,
            result, handleAddOrEdit,handleTableChange,winWidth,
        } = this.props;

        const {selectedRowKeys} = this.state;
        let list = result && result.list;
        let pMsg = powerMsg&&powerMsg.list;

        let newList = [];
        for (let j in list) {
            let powerStr = '';
            let pData = list[j].power&&list[j].power.split(',');
            for (let k in pData) {
                for (let i in pMsg) {
                    if (pMsg[i].userPower == pData[k]) {
                        powerStr = powerStr + pMsg[i].powerName + ',';
                    }
                }
            }
            newList.push({
                id : list[j].id,
                loginStatus : list[j].loginStatus,
                power : powerStr,
                userName : list[j].userName,
            });
        }

        let columns = [
            {
                title: '用户名',
                dataIndex: 'userName',
                width: 100,
                key: 'userName',
                align: 'center',
            },
            {
                title: '权限',
                dataIndex: 'power',
                width: 150,
                key: 'power',
                align: 'center',
                render: text => <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>,
            },
            {
                title: '登录状态',
                dataIndex: 'loginStatus',
                width: 100,
                key: 'loginStatus',
                align: 'center',
                render: val => <div style={{color: isNaN(val)&&val==='true' ? '#1890FF' : 'red'}}>
                    {val=='true' ? '登录':'离线'}
                </div>
            },
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: result && result.total,
            current: result&&result.pageNum,
        };

        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const handleChange = (flag) => {
            if (flag) {
                handleAddOrEdit(flag, selectedRowKeys);
            } else {
                if (selectedRowKeys.length) {
                    handleAddOrEdit(flag, selectedRowKeys);
                } else {
                    message.error('请选择一位用户！')
                }
            }
        };

        const { Option } = Select;

        const option = [];
        // option.push(<Option key={null}>全部</Option>)
        option.push(<Option key={true}>登录</Option>)
        option.push(<Option key={false}>离线</Option>)

        const addOrEdit = powers.powerFilter('add') ? (
            <>
            <Button style={{ marginLeft: 8}} onClick={()=>handleChange(true)}>
                新增
            </Button>
            <Button style={{ marginLeft: 8}} onClick={()=>handleChange(false)}>
                修改
            </Button>
            </>
        ) : null;
        let modalVisible = pwdModalVisible ? true : false;
        let title = keys=='changePwd' ? "密码修改" : "用户管理";
        let drawer = keys=='changePwd' ? (
            <>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧密码">
                {form.getFieldDecorator('oldPwd', {
                    rules: [{ required: true, message: '请输入旧密码！',min:6}],
                })(<Input type="password"
                          placeholder="请输入新密码:至少6位"
                />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
                {form.getFieldDecorator('newPwd1', {
                    rules: [{ required: true, message: '请输入新密码:至少6位！',min:6}, {
                        validator: this.validateToNextPassword,
                    }],
                })(<Input type="password"
                          placeholder="请输入新密码:至少6位"

                />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
                {form.getFieldDecorator('newPwd2', {
                    rules: [{ required: true, message: '请输入新密码:至少6位！',min:6}, {
                        validator: this.compareToFirstPassword,
                    }],
                })(<Input type="password"
                          placeholder="再输入一次:至少6位" onBlur={this.handleConfirmBlur}
                />)}
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
                <Button onClick={this.okHandle} type="primary">
                    确定
                </Button>
            </div>
            </>) : (
            <>
                <Form onSubmit={this.handleSearch} layout="inline">
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem label="角色名">
                                {form.getFieldDecorator('userName')(
                                    <Input style={{ width: '5.5rem' }} placeholder="请输入" />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="登录状态">
                                {form.getFieldDecorator('loginStatus')(
                                    <Select style={{ width: '5.5rem' }}>
                                        {option}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            {/*<span className={styles.submitButtons}>*/}
                            <Button type="primary" htmlType="submit" style={{marginTop: '0.5rem'}}>
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                                重置
                            </Button>
                            {addOrEdit}
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowSelection={rowSelection}
                    loading={false}
                    rowKey={record=>record.id}
                    dataSource={newList}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={handleTableChange}
                />
            </>);

        return (
            <>
            <Drawer
                title={title}
                placement="right"
                width={winWidth>960?winWidth/3+'px':winWidth*0.66+'px'}
                closable={true}
                onClose={() => handleModalVisible(false)}
                visible={modalVisible}
            >
                {drawer}
            </Drawer>
            </>
        );
    }
};

@Form.create()
class HeaderView extends PureComponent {
    state = {
        visible: true,
        pwdModalVisible:false,//判断右边抽屉
        keys: '',
        isModalVisible: false,//判断操作角色的弹窗
        values: [],
        userId: '',
        title: '编辑角色',
        userFlags: false,//判断是否添加角色
        isModalVisiblePower: false,//权限管理弹窗
        winWidth: window.innerWidth,
    };

    componentWillMount() {
        let filter = JSON.parse(localStorage.getItem("userMsg"));
        const checkAccount = (values) =>{//验证用户状态是否登录
            const {dispatch} = this.props;
            dispatch({
                type: 'staff/getAccountMsg',
                payload: {
                    userId: values && values.userId,
                    password: values && values.password,
                    callback: (result) => {
                        let checkData = result && result.data;
                        if (checkData && checkData.loginStatus != "true") {
                            message.warn("请先登录！");
                            localStorage.setItem("userMsg", null);
                            setTimeout(function () {
                                window.location.href = '/user/login';
                            }, 1000)
                        }
                    }
                }
            });
        };
        setInterval(function(){
            checkAccount(filter);
        },3*60*60*1000);
    }

    // static getDerivedStateFromProps(props, state) {
    //     if (!props.autoHideHeader && !state.visible) {
    //         return {
    //             visible: true,
    //         };
    //     }
    //     return null;
    // };
    handleFormReset = () => {//重置查询
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.firstLoad();
    };

    handleAddOrEdit = (flag, selectedRowKeys)=> {//新增与修改用户
        const {result} = this.state;
        if (document.getElementById("nameInput")) {
            setTimeout (function () {
                document.getElementById("nameInput").value = '';
                },100
            )
        }
        if(flag){
            this.setState({
                isModalVisible: flag,
                values: [],
                userName: '',
                userId: null,
                title: '添加角色',
                userFlags: flag,
            });
        } else {
            const defdata = result&&result.list;
            let values = [];
            let userName = '';
            let loginStatus = false;
            if (selectedRowKeys.length) {
                for (let i in defdata) {
                    if (defdata[i].id == selectedRowKeys[0]) {
                        values = defdata[i].power&&defdata[i].power.split(",");
                        userName = defdata[i].userName;
                        loginStatus = defdata[i].loginStatus;
                    }
                }
                this.setState({
                    isModalVisible: !flag,
                    values: values?values:[],
                    userName: userName,
                    userId: selectedRowKeys[0],
                    title: '编辑角色',
                    userFlags: flag,
                    loginStatus: loginStatus,
                });
            }
        }
    };

    handleTableChange = (pagination) => {//页数的变更
        const { dispatch } = this.props;
        const { formValues } = this.state;
        dispatch({
            type: 'staff/list',
            payload:{
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                callback:(result)=>{
                    this.setState({result:result});
                }
            }
        });
    };

    firstLoad=()=>{//初始数据
        const { dispatch } = this.props;
        dispatch({
            type: 'staff/list',
            payload:{
                pageNum: 0,
                pageSize: 20,
                callback:(result)=>{
                    this.setState({result:result});
                }
            }
        });
    };
    getUserPower=()=>{//获取全部权限信息
        const { dispatch } = this.props;
        dispatch({
            type: 'staff/getUserPower',
            payload:{
                pageNum: 0,
                pageSize: 20,
                callback:(result)=>{
                    this.setState({powerMsg:result})
                }
            }
        });
    };
    searchUser=(values)=>{//查询用户数据
        const { dispatch } = this.props;
        dispatch({
            type: 'staff/list',
            payload:{
                pageNum: 0,
                pageSize: 20,
                userName: values.userName,
                loginStatus: values.loginStatus,
                callback:(result)=>{
                    this.setState({result:result});
                }
            }
        });
    };
    handleAdd = fields => {
        const userMsg = JSON.parse(localStorage.getItem("userMsg"));
        const { dispatch } = this.props;
        dispatch({
            type: 'staff/pwd',
            payload: {
                ...fields,
                id: userMsg.id,
                userId: userMsg.userId,
            },
            callback:(result)=>{
                if(result.succee){
                    message.success('修改成功');
                    localStorage.setItem("userMsg", null);//存储本地全局变量
                    dispatch({
                        type: 'login/logout',
                    });
                    this.handleModalVisible();
                }else{
                    message.warn(result.msg)
                }
            }
        });
    };
    handleModalVisible = (flag) => {
        if (flag) {
            this.firstLoad();
            this.getUserPower();
        }
        this.setState({
            pwdModalVisible: !!flag,
        });
    };
    componentDidMount() {
        document.addEventListener('scroll', this.handScroll, { passive: true });
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handScroll);
    }

    getHeadWidth = () => {
        const { isMobile, collapsed, setting } = this.props;
        const { fixedHeader, layout } = setting;
        if (isMobile || !fixedHeader || layout === 'topmenu') {
            return '100%';
        }
        return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
    };

    handleNoticeClear = type => {
        message.success(
            `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
                id: `component.globalHeader.${type}`,
            })}`
        );
        const { dispatch } = this.props;
        dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    };

    handleMenuClick = ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'userCenter') {
            router.push('/account/center');
            return;
        }
        if (key === 'triggerError') {
            router.push('/exception/trigger');
            return;
        }
        if (key === 'userinfo') {
            router.push('/account/settings/base');
            return;
        }
        if (key === 'logout') {
            dispatch({
                type: 'login/logout',
            });
        }
        if(key==='changePwd' || key === 'userManage'){
            this.setState({keys: key});
            this.handleModalVisible(true);
        }
        if(key==='addPower'){
            this.setState({isModalVisiblePower: true});
        }

    };

    getPowerMsg=()=>{//获取权限信息
        const { dispatch } = this.props;
        dispatch({
            type: 'staff/getUserPower',
            payload:{
                pageNum: 0,
                pageSize: 20,
                callback:(result)=>{
                    console.log(result)
                    // this.setState({result:result});
                }
            }
        });
    };

    handleNoticeVisibleChange = visible => {
        if (visible) {
            const { dispatch } = this.props;
            dispatch({
                type: 'global/fetchNotices',
            });
        }
    };

    handScroll = () => {
        const { autoHideHeader } = this.props;
        const { visible } = this.state;
        if (!autoHideHeader) {
            return;
        }
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                if (this.oldScrollTop > scrollTop) {
                    this.setState({
                        visible: true,
                    });
                }
                if (scrollTop > 300 && visible) {
                    this.setState({
                        visible: false,
                    });
                }
                if (scrollTop < 300 && !visible) {
                    this.setState({
                        visible: true,
                    });
                }
                this.oldScrollTop = scrollTop;
                this.ticking = false;
            });
        }
    };

    handleChange = (value) => {
        this.setState({values: value})
    }
    handleChangeStatus = (value) =>{
        this.setState({loginStatus: value})
    }

    handleGO = ()=>{//修改角色权限
        const { dispatch } = this.props;
        const { userId, values, userFlags, userName, loginStatus } = this.state;
        let inputValue = document.getElementById("nameInput").value;
        let userIDValue = '';
        if(userFlags){
            userIDValue = document.getElementById("accountInput").value;
        }
        let params = {
            id: userId,
            userName: inputValue ? inputValue: userName,
            power: values.toString(),
            loginStatus: loginStatus,
        }

        if (userId || userIDValue) {
            if (userIDValue){
                params = {
                    id: userId,
                    userName: inputValue,
                    userId: userIDValue,
                    password: encode('123456'),
                    power: values.toString()
                }
            }
            dispatch({
                type: 'staff/save',
                payload:{
                    ...params,
                    callback:(result)=>{
                        if (result.succee) {
                            message.success(result.msg)
                            this.firstLoad();
                            this.setState({isModalVisible : false});
                            this.child.clearSelect();
                        }
                    }
                }
            });
        } else {
            message.error("账户不能为空！");
        }
    };

    handleSubmit = (e) => {//提交权限信息
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {dispatch} = this.props;
                dispatch({
                    type: 'staff/savePower',
                    payload: values,
                    callback: (result) => {
                        if (result&&result.succee) {
                            message.success(result.msg);
                            this.setState({
                                isModalVisiblePower : false,
                            });
                        } else {
                            message.warn(result.msg);
                        }
                    }
                });
            }
        })
    };

    bindRef (ref) {
        this.child = ref
    }

    render() {
        const { isMobile, handleMenuCollapse, setting, form } = this.props;
        const { navTheme, layout, fixedHeader } = setting;
        const { visible,pwdModalVisible,userFlags,userId,
            keys,result,values,userName,title,dispatch,loginStatus,
            powerMsg,isModalVisible,isModalVisiblePower,
            winWidth,
        } = this.state;
        let pMsg = powerMsg&&powerMsg.list;
        const pwdData={
            keys: keys,
            result: result,
            powerMsg: powerMsg,
            pwdModalVisible: pwdModalVisible,
            dispatch: dispatch,
            winWidth: winWidth,
            handleModalVisible: this.handleModalVisible,
            handleAdd: this.handleAdd,
            handleAddOrEdit: this.handleAddOrEdit,
            handleTableChange: this.handleTableChange,
            searchUser: this.searchUser,
            handleFormReset: this.handleFormReset,
        }

        const config = {
            title: '提示!',
            content: (
                <>
                    <span>确认修改吗?</span>
                </>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: this.handleGO,
        };

        const handleOk = () => {
            Modal.confirm(config);
        };
        const handleCan = () => {
            this.setState({isModalVisible : false});
        };

        const handleCanPower = () => {
            this.setState({
                isModalVisiblePower : false,
            });
        };
        const changeHandlePower = (val) => {
            this.setState({userPower : val});
        };
        const changeHandlePowerName = (val) => {
            this.setState({powerName : val});
        };

        const isTop = layout === 'topmenu';
        const width = this.getHeadWidth();
        const HeaderDom = visible ? (
            <Header style={{ padding: 0, width, zIndex: 21 }} className={fixedHeader ? styles.fixedHeader : ''}>
                {isTop && !isMobile ? (
                    <TopNavHeader
                        theme={navTheme}
                        mode="horizontal"
                        onCollapse={handleMenuCollapse}
                        onNoticeClear={this.handleNoticeClear}
                        onMenuClick={this.handleMenuClick}
                        onNoticeVisibleChange={this.handleNoticeVisibleChange}
                        {...this.props}
                    />
                ) : (
                    <GlobalHeader
                        onCollapse={handleMenuCollapse}
                        onNoticeClear={this.handleNoticeClear}
                        onMenuClick={this.handleMenuClick}
                        onNoticeVisibleChange={this.handleNoticeVisibleChange}
                        {...this.props}
                    />
                )}
            </Header>
        ) : null;

        const { Option } = Select;

        const children = [];
        for (let i in pMsg) {
            children.push(<Option key={pMsg[i].userPower}>{pMsg[i].powerName}</Option>);
        }

        let status = 'false';
        let defdata = result&&result.list;
        for (let i in defdata) {
            if (defdata[i].id == userId) {
                status = defdata[i].loginStatus;
            }
        }

        const loginChange = !userFlags && status=='true' ? (
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录状态">
                <Select
                    style={{ width: '100%' }}
                    value={loginStatus}
                    onChange={this.handleChangeStatus}
                >
                    <Option key={true} disabled={true}>登录</Option>
                    <Option key={false}>离线</Option>
                </Select>
            </FormItem>
        ):null;

        const inputSet = {
            allowClear:true,
            type:"text",
            style:{ width: '100%' },
            placeholder:userName? userName:"请输入名称",
        }

        const userIDSet = {
            allowClear:true,
            type:"text",
            style:{ width: '100%' },
            placeholder: "请设置账户",
        }

        const powerSet = {
            allowClear:true,
            type:"text",
            style:{ width: '100%' },
            placeholder: "请输入",
        }

        const userAccount = userFlags ? (
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录账户">
                <Input id='accountInput' {...userIDSet} />
            </FormItem>
        ):null;

        return (
            <>
            <Animate component="" transitionName="fade">
                <>
                    {HeaderDom}
                    <CreateForm {...pwdData} onRef={this.bindRef.bind(this)}/>
                </>
            </Animate>

            <Modal
                title={title}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCan}
                style={{width: '400px'}}
            >
                <Form>
                    {userAccount}
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
                        <Input id='nameInput' {...inputSet} />
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色权限">
                        <Select mode="tags"
                               style={{ width: '100%' }}
                               placeholder="请选择"
                               value={values}
                               onChange={this.handleChange}>
                            {children}
                        </Select>
                    </FormItem>
                    {loginChange}
                </Form>
            </Modal>

            <Modal
                title="权限添加"
                visible={isModalVisiblePower}
                onOk={this.handleSubmit}
                onCancel={handleCanPower}
                style={{width: '400px'}}
            >
                <Form>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限名称">
                        {form.getFieldDecorator('powerName', {
                            rules: [{ required: true, message: '请输入名称！'}],
                        })
                        (<Input id='powerName'
                                // value={powerName} onChange={changeHandlePower}
                                {...powerSet}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限ID">
                        {form.getFieldDecorator('userPower', {
                            rules: [{ required: true, message: '请输入名称！'}],
                        })
                        (<Input id='userPower'
                                // value={userPower} onChange={changeHandlePowerName}
                                {...powerSet}/>)}
                    </FormItem>
                </Form>
            </Modal>


            </>
        );
    }
}

export default connect(({ user, global, setting, loading }) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
    setting,
}))(HeaderView);
