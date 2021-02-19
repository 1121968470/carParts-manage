import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {stringify} from 'qs'
import {
    Drawer,
    Row,
    Table,
    Upload,
    Col,
    Card,
    Form,
    Input,
    Icon,
    Button,
    Modal,
    message, Select,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Reconciliation.less';
import {host}from '@/utils/app.js';
import LineWrap from '@/utils/LineWrap.js';

const powers = require( '@/utils/power.js');
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateForm  extends PureComponent {
    static defaultProps = {
        values: {},
    };

    state = {
        values: {},
    };

    constructor(props) {
        super(props);
    };

    componentDidMount () {
        this.props.onRef(this)
    };

    okHandle = () => {
        const {form,handleAdd} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err){ return;}
            form.resetFields();
            const {values}=this.props;
            fieldsValue={
                ...fieldsValue,
                id:values.id,
            };
            handleAdd(fieldsValue);
        });
    };

    clearForm = () => {//清除表单数据
        this.setState({ values: {} });
    };

    render() {
        const { modalVisible, form, handleModalVisible,
            viewTF, title,
            values, winWidth} = this.props;
        const { setFieldsValue } = this.props.form;

        const onGenderChange = e => {
            const valuesChild = this.state.values;

            let value = e.target.value;
            let names = e.target.id;

            valuesChild[names] = value;
            let ncPrice = 0;
            ncPrice = (valuesChild.number ? valuesChild.number : (values.number || 0)) *
                (valuesChild.unitPrice ? valuesChild.unitPrice : (values.unitPrice || 0)) - 0;
            let price = 0;
            let materialCost = valuesChild.materialCost ? valuesChild.materialCost : (values.materialCost || 0);
            price = (ncPrice-0) + (materialCost-0);

            setTimeout(()=>{
                setFieldsValue({"ncPrice" : Math.round(ncPrice*100)/100});
                setFieldsValue({"price" : Math.round(price*100)/100});
            },0);
        };
        const option = [];
        for(let i=2000; i<2050;i++){
            option.push(<Option key={i} value={i}>{i}</Option>);
        }
        return (
            <Drawer
                title={title}
                placement="right"
                destroyOnClose
                width={winWidth>960?winWidth/3+'px':winWidth*0.66+'px'}
                closable={true}
                onClose={() => handleModalVisible(false)}
                visible={modalVisible}>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="年份">
                    {form.getFieldDecorator('year', {
                        initialValue: values.year,
                    })(
                        <Select style={{width: '100%',color: '#000'}} disabled={viewTF}>
                            {option}
                        </Select>
                     )}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="月份">
                    {form.getFieldDecorator('month', {
                        initialValue: values.month,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="客户">
                    {form.getFieldDecorator('customer', {
                        initialValue: values.customer,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="供应商">
                    {form.getFieldDecorator('companyName', {
                        initialValue: values.companyName,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="机种">
                    {form.getFieldDecorator('typeOfMachine', {
                        initialValue: values.typeOfMachine,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="模具名称">
                    {form.getFieldDecorator('moldName', {
                        initialValue: values.moldName,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="模具编号">
                    {form.getFieldDecorator('moldNumber', {
                        initialValue: values.moldNumber,
                    })(<Input placeholder={viewTF?"":"请输入"}disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="品名">
                    {form.getFieldDecorator('productName', {
                        initialValue: values.productName,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="单号">
                    {form.getFieldDecorator('oddNumbers', {
                        initialValue: values.oddNumbers,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="规格">
                    {form.getFieldDecorator('specifications', {
                        initialValue: values.specifications,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="单位">
                    {form.getFieldDecorator('unit', {
                        initialValue: values.unit,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="工时">
                    {form.getFieldDecorator('workingHours', {
                        initialValue: values.workingHours,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="数量">
                    {form.getFieldDecorator('number', {
                        initialValue: values.number,
                    })(<Input placeholder={viewTF?"":"请输入"} type='number' onChange={onGenderChange}
                              disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="单价">
                    {form.getFieldDecorator('unitPrice', {
                        initialValue: values.unitPrice,
                    })(<Input placeholder={viewTF?"":"请输入"} type='number' onChange={onGenderChange}
                              disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="NC金额（元）">
                    {form.getFieldDecorator('ncPrice', {
                        initialValue: values.ncPrice,
                    })(<Input disabled={true} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="材料费">
                    {form.getFieldDecorator('materialCost', {
                        initialValue: values.materialCost,
                    })(<Input placeholder={viewTF?"":"请输入"} type='number' onChange={onGenderChange}
                              disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="金额">
                    {form.getFieldDecorator('price', {
                        initialValue: values.price,
                    })(<Input disabled={true} style={{color: '#000'}} />)}
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="备注">
                    {form.getFieldDecorator('remarks', {
                        initialValue: values.remarks,
                    })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                </FormItem>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                }}>
                    <Button style={{marginRight: 8,}} onClick={() => handleModalVisible(false)}>取消</Button>
                    <Button onClick={this.okHandle} type="primary">确定</Button>
                </div>
            </Drawer>
        );
    }
};

/* eslint react/no-multi-comp:0 */
@connect(({ reconciliation, loading }) => ({
    reconciliation,
    loading: loading.models.reconciliation,
}))
@Form.create()
class Reconciliation extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        list:[],
        isOpen: false,
        year: null,
        totalTF: false,
        selectedRowKeys: [],
        winWidth: window.innerWidth,
        title: '新增/编辑菜单',
        viewTF: false,
        uploadState: true,//是否可以上传
        userMsg: JSON.parse(localStorage.getItem("userMsg")),
    };

    columns = [
        {
            title: '供应商',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 100,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '客户',
            dataIndex: 'customer',
            key: 'customer',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            width: 80,
            align: 'center',
        },
        {
            title: '月份',
            dataIndex: 'month',
            key: 'month',
            width: 250,
            align: 'center',
            // render: val => <div>{val ? moment(val) : ''}</div>,
        },
        {
            title: '机种',
            dataIndex: 'typeOfMachine',
            key: 'typeOfMachine',
            align: 'center',
            width: 200,
        },
        {
            title: '模具名称',
            dataIndex: 'moldName',
            key: 'moldName',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '模具编号',
            dataIndex: 'moldNumber',
            key: 'moldNumber',
            width: 150,
            align: 'center',
        },
        {
            title: '品名',
            dataIndex: 'productName',
            key: 'productName',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '单号',
            dataIndex: 'oddNumbers',
            key: 'oddNumbers',
            width: 150,
            align: 'center',
        },
        {
            title: '规格',
            dataIndex: 'specifications',
            key: 'specifications',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 100,
            align: 'center',
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            width: 80,
            align: 'center',
        },
        {
            title: '工时',
            dataIndex: 'workingHours',
            key: 'workingHours',
            width: 100,
            align: 'center',
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 100,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: 'NC金额（元）',
            dataIndex: 'ncPrice',
            key: 'ncPrice',
            width: 200,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '材料费',
            dataIndex: 'materialCost',
            key: 'materialCost',
            width: 100,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '金额',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '操作人员',
            dataIndex: 'operator',
            key: 'operator',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
    ];

    columnsTotal = [
        {
            title: 'NC金额（元）',
            dataIndex: 'ncPrice',
            key: 'ncPrice1',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '材料费',
            dataIndex: 'materialCost',
            key: 'materialCost1',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '金额',
            dataIndex: 'price',
            key: 'price1',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
    ];

    componentDidMount() {
        this.firstLoad();
    }

    firstLoad=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'reconciliation/list',
            payload:{
                pageNum: 0,
                pageSize: 20,
                callback:(result)=>{
                    this.setState({result:result});
                    this.state.selectedRowKeys = [];
                }
            }
        });
        let values = {
            pageNum: 0,
            pageSize: 20,
            year: '',
            month: '',
            typeOfMachine: '',
            companyName: '',
            customer: '',
        };
        this.handleTotalPrice(values);
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.firstLoad();
        let values = {
            pageNum: 0,
            pageSize: 20,
            year: '',
            month: '',
            typeOfMachine: '',
            companyName: '',
            customer: '',
        };
        this.state.selectedRowKeys = [];
        this.handleTotalPrice(values);
    };

    handleModalVisible = (flag) => {
        if (this.state.selectedRowKeys.length == 1) {
            this.setState({
                title: '新增/编辑菜单',
                viewTF: false,
            });
            this.getId(flag, this.state.selectedRowKeys[0]);
        } else {
            if (this.state.selectedRowKeys.length > 1) {
                message.warn("请选择一行！")
            } else {
                this.setState({
                    modalVisible: !!flag,
                    formVals: {},
                });
            }
        }
        if (!flag) {
            this.setState({
                title: '新增/编辑菜单',
                viewTF: false,
                modalVisible: !!flag,
                formVals: {},
            });
            this.child.clearForm();
        }
    };

    getId = (flag, id)=>{
        if (!flag) {
            return;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'reconciliation/getId',
            payload: {
                id: id,
                callback: result => {
                    let record = result.data;
                    this.setState({
                        modalVisible: !!flag,
                        formVals: record || {},
                    });
                },
            },
        });
    };

    //搜索
    handleSearch = e => {
        e?e.preventDefault():null;
        const { dispatch, form } = this.props;
        const {formValues} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            let pages = e? {
                pageNum: 0,
                pageSize: formValues.pageSize || 20,
            }:{
                pageNum: formValues.pageNum,
                pageSize: formValues.pageSize
            };
            const valueParam = JSON.stringify(formValues) === '{}' || e? {
                ...pages,
                year: values.year,
                month: values.month,
                companyName: values.companyName,
                typeOfMachine: values.typeOfMachine,
                customer: values.customer
            } : formValues;
            dispatch({
                type: 'reconciliation/list',
                payload: {
                    ...valueParam,
                    callback:(result)=>{
                        this.setState({result, formValues: values});
                    }
                },
            });
            this.handleTotalPrice(values);
        });
    };

    handleTotalPrice = values => {
        //查询初始总金额数据
        const { dispatch } = this.props;
        dispatch({
            type: 'reconciliation/listTotal',
            payload: {
                pageNum: 0,
                pageSize: 20,
                year: values.year,
                typeOfMachine: values.typeOfMachine,
                month: values.month,
                companyName: values.companyName,
                customer: values.customer,
                callback: result => {
                    let resultTotal = result ? result.list : [];
                    this.setState({ resultTotal: resultTotal });
                },
            },
        });
    };

    handleTableChange = (pagination) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        let pages = {
            ...formValues,
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
        };
        formValues.pageNum = pagination.current;
        formValues.pageSize = pagination.pageSize;

        this.setState({formValues: pages});
        dispatch({
            type: 'reconciliation/list',
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

    //添加
    handleAdd = fields => {
        const { userMsg } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'reconciliation/save',
            payload: {
                ...fields,
                operator: userMsg?userMsg.userName:'',
            },
            callback:(result)=>{
                if(result.succee){
                    message.success(result.msg);
                    this.handleSearch();
                }else{
                    message.warn(result.msg)
                }
            }
        });
        this.state.selectedRowKeys = [];
        this.handleModalVisible();
    };

    fileDown() {
        //下载模板
        window.location.href = host + '/upload/template/模具对账明细模板.xlsx';
    };

    handleGO = () =>{
        const {selectedRowKeys, userMsg} = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'reconciliation/del',
            payload: {
                id: selectedRowKeys.toString(),
                operator: userMsg ? userMsg.userName : '',
            },
            callback: () => {
                message.success("删除成功！");
                this.firstLoad();
            },
        });
    };

    config = {
        title: '提示!',
        content: (
            <>
                <span>确认删除吗?</span>
            </>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk: this.handleGO,
    };

    handleDelete = () => {
        const {selectedRowKeys} = this.state;
        if (!selectedRowKeys.length) {
            message.warn("请选择一行")
            return
        }
        Modal.confirm(this.config);
    };

    handleDeriveExcel = e =>{
        e.preventDefault();

        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
            };
            let params = {
                // pageNum: 0,
                // pageSize: 20,
                year: values.year,
                month: values.month,
                companyName: values.companyName,
                typeOfMachine: values.typeOfMachine,
                customer: values.customer,
            };
            const deriveExcel = () =>{
                window.location.href = host + '/api/v1/web/reconciliation/deriveExcel?' + stringify(params);
            };
            const config = {
                title: '确认导出!',
                content: (
                    <>
                        <span>筛选条件是否选填完毕?</span>
                    </>
                ),
                okText: '确定',
                cancelText: '取消',
                onOk: deriveExcel,
            };
            Modal.confirm(config);

        });
    };

    handleView = () => {
        const {selectedRowKeys} = this.state;
        if (!selectedRowKeys.length || selectedRowKeys.length>1) {
            message.warn("请选择一行");
            return;
        }
        this.setState({
            title: '查看',
            viewTF: true,
        });

        this.getId(true, this.state.selectedRowKeys[0]);
    };

    renderSimpleForm() {
        const {userMsg,company, year,winWidth,uploadState} = this.state;
        const onChange = (info) => {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                var str = info.file.response;
                if (str.succee) {
                    message.success(`${info.file.name} 文件上传成功`);
                    this.firstLoad();
                } else {
                    message.error(`${info.file.name} 的表头：“${str.msg}” 文件格式或内容不正确`);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败`);
            }
            this.setState({year: null,uploadState: true});
        };

        const handleCourseChange = (value)=>{
            this.setState({
                year: value
            })
        };

        const option = [];
        for(let i=2000; i<2050;i++){
            option.push(<Option key={i} value={i}>{i}</Option>);
        }
        const beforeUpload = (file, fileList) => {    //选择文件后，上传文件前的操作
            return new Promise(                 //返回一个Promise对象
                (resolve, reject) => {
                    /*应该跳出的弹窗，图在下面，因为antd的Modal.confirm自带两个按钮，对应onOk操作和onCancel操作。
                    当时我想有三种情况，就在弹窗中加了个按钮*/

                    Modal.confirm({
                        // title: '是否使用损耗比',
                        width: winWidth>960 ? winWidth*0.2 : winWidth*0.3,
                        content:

                        /*点击‘取消上传‘，触发reject(),用来取消上传，（我试了试，不加这个reject()好像也可以）
                        Modal. destroyAll()是用来注销所有弹窗的。
                        前面说了，Modal.confirm自带两个按钮，这两个按钮都会让弹窗关闭，
                        但是当时我想加入第三种情况的时候，我需要手动触发注销函数。*/
                        <>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="供应商" style={{width: '90%'}}>
                                <Input id={"company"} placeholder="请输入" />
                            </FormItem>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="年份" style={{width: '90%'}}>
                                <Select onChange={handleCourseChange} id={"years"} style={{width: '100%'}}>
                                    {option}
                                </Select>
                            </FormItem>
                        </>,
                        okText: '确定',
                        cancelText: '取消',

                        /* Modal.confirm自带两个的按钮，会触发resolve(),
                        文件就能顺利上传。没有resolve()没触发，文件是不会上传的*/
                        onOk: () => {
                            if (!uploadState) {
                                message.warn("正在上传中...");
                                return;
                            }
                            let company = document.getElementById("company");
                            company = company?company.value:'';
                            let year = this.state.year?this.state.year:'';
                            this.setState({
                                company: company,
                            })
                            if (company && year) {
                                this.setState({uploadState: false});
                                resolve();
                                Modal.destroyAll();
                            } else {
                                message.warn("请输入参数");
                                return;
                            }
                        },
                        onCancel: () => {
                            reject()
                        }
                    })
                })
        };
        const userName = userMsg ? userMsg.userName: '';
        const props = {
            name: 'file',
            action: host + '/api/v1/web/reconciliation/excelExports/',
            data: {
                operator: userName,
                year: year,
                companyName: company,
            },
            accept: '.xlsx, .xls',
            onChange,
            beforeUpload
        };
        const {
            form: { getFieldDecorator },
        } = this.props;

        const upload = powers.powerFilter('upload') ? (
            <>
                <Upload {...props}>
                    <Button  style={{ marginLeft: 8}}>
                        <Icon type="upload"/>
                        上传
                    </Button>
                </Upload>
                {/*<FormItem label="供应商" style={{marginTop: '0.5rem', width: '50%'}}>*/}
                {/*    <Input id={"company"} placeholder="请输入" />*/}
                {/*</FormItem>*/}
                {/*<FormItem label="年份" style={{display: 'none'}}>*/}
                {/*    <DatePicker*/}
                {/*        value={year ? moment(year) : moment(new Date())}*/}
                {/*        open={isOpen}*/}
                {/*        mode="year"*/}
                {/*        placeholder="请选择年份"*/}
                {/*        format="YYYY"*/}
                {/*        onOpenChange={status => {*/}
                {/*            if (status) {*/}
                {/*                this.setState({ isOpen: true });*/}
                {/*            } else {*/}
                {/*                this.setState({ isOpen: false });*/}
                {/*            }*/}
                {/*        }}*/}
                {/*        onPanelChange={date => {*/}
                {/*            this.setState({*/}
                {/*                year: moment(date).format('YYYY'),*/}
                {/*                isOpen: false,*/}
                {/*            });*/}
                {/*        }}*/}
                {/*        onChange={() => {*/}
                {/*            this.setState({ year: null });*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</FormItem>*/}
            </>
        ) : null;
        const totalPrice = () => {
            let flag = this.state.totalTF ? false : true;
            this.setState({ totalTF: flag });
            if (!flag) {
                setTimeout(()=> {
                    this.setState({ totalTFs: flag });
                },510)
            } else {
                this.setState({ totalTFs: flag });
            }
        };
        let addbutton = this.state.selectedRowKeys.length ? '编辑' : '新增';
        const addOrEdit = powers.powerFilter('add') ? (
            <Button style={{ marginLeft: 8 }} onClick={() => this.handleModalVisible(true)}>
                {addbutton}
            </Button>
        ) : null;

        const view = powers.powerFilter('view') ? (
            <Button style={{ marginLeft: 8 }} onClick={() => this.handleView()}>
                查看
            </Button>
        ) : null;
        const del = powers.powerFilter('del') ? (
            <Button style={{ marginLeft: 8 }} onClick={() =>this.handleDelete()}>
                删除
            </Button>
        ) : null;
        const deriveExcel = powers.powerFilter('upload') ? (
            <Button style={{ marginLeft: 8 }} type="submit" onClick={this.handleDeriveExcel}>
                导出
            </Button>
        ) : null;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={12}>
                        <FormItem label="年份">
                            {getFieldDecorator('year')(
                                <Select style={{width: '100%'}}>
                                    {option}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="月份">
                            {getFieldDecorator('month')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="客户">
                            {getFieldDecorator('customer')(<Input placeholder="请输入" allowClear/>)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="机种">
                            {getFieldDecorator('typeOfMachine')(<Input placeholder="请输入" allowClear/>)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="供应商">
                            {getFieldDecorator('companyName')(<Input placeholder="请输入" allowClear/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={18} sm={12} style={{ marginBottom: 8 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
                        </Button>
                        {view}
                        {addOrEdit}
                        {del}
                        <Button style={{ marginLeft: 8 }} onClick={this.fileDown}>
                            下载模板
                        </Button>
                        {deriveExcel}
                        {upload}
                    </Col>
                    <Col md={6} sm={12}>
                        <Button style={{ float: 'right' }} onClick={totalPrice}>
                            查看总金额
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
    renderForm() {
        return this.renderSimpleForm();
    }

    onSelectChange = selectedRowKeys => {
        //勾选触发
        this.setState({ selectedRowKeys });
    };

    bindRef (ref) {
        this.child = ref;
    };

    render() {
        const { result,modalVisible,formVals,
            resultTotal, selectedRowKeys,title,
            winWidth, viewTF} = this.state;

        const list = result && result.list?[...result.list]:[];
        const listTotal = resultTotal?[...resultTotal]:[];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: result && result.total,
            current: result&&result.pageNum,
        };
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            firstLoad:this.firstLoad,
        };
        const rowSelection = {
            fixed: true,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const table = listTotal.length&&listTotal[0]!==null?(
            <Table
                style={{
                    visibility: this.state.totalTF? 'visible' : 'hidden',
                    opacity:  this.state.totalTF? 1 : 0,
                    transition: this.state.totalTF? 'opacity 0.5s linear' : 'visibility 0s 0.5s, opacity 0.5s linear',
                    height: this.state.totalTFs? '9.5rem' : '0px',
                }}
                loading={false}
                dataSource={listTotal}
                columns={this.columnsTotal}
                pagination={false}
            />
        ):null;
        return (
            <PageHeaderWrapper title="管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            {table}
                            <Table
                                bordered
                                rowSelection={rowSelection}
                                loading={false}
                                rowKey={record => record.id}
                                dataSource={list}
                                columns={this.columns}
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                                scroll={{ x: 2500 }}
                            />
                        </div>
                    </div>
                </Card>
                <CreateForm {...parentMethods}title={title} onRef={this.bindRef.bind(this)}
                            values={formVals} modalVisible={modalVisible}
                            viewTF={viewTF} winWidth={winWidth} />
            </PageHeaderWrapper>
        );
    }
}

export default Reconciliation;
