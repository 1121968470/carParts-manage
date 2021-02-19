import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
    Modal,
    message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ChangeDevelopmentChecklist.less';
import {host}from '@/utils/app.js';
import LineWrap from '@/utils/LineWrap.js';
import moment from 'moment';

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
    }
    componentDidMount () {
        this.props.onRef(this)
    };
    clearForm = () => {//清除表单数据
        this.setState({ values: {} });
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
            }
            handleAdd(fieldsValue);
        });
    };

    render() {
        const { modalVisible, form,
            handleModalVisible,values,
            winWidth, viewTF,title} = this.props;

        const option = [];
        option.push(<Option key="true" value="true">设变</Option>)
        option.push(<Option key="false" value="false">修模</Option>)

        const { setFieldsValue } = this.props.form;

        const onGenderChange = e => {
            const valuesChild = this.state.values;

            let value = e.target.value;
            let names = e.target.id;

            valuesChild[names] = value;
            let totals = 0;
            let materialFormwork = (valuesChild.materialFormwork? valuesChild.materialFormwork: (values.materialFormwork||0));
            let materialInternalModule = (valuesChild.materialInternalModule? valuesChild.materialInternalModule:
                (values.materialInternalModule||0));
            let cnc = (valuesChild.cnc?valuesChild.cnc:(values.cnc||0));
            let cncMaterial = (valuesChild.cncMaterial?valuesChild.cncMaterial:(values.cncMaterial||0));
            let electricSpark = (valuesChild.electricSpark?valuesChild.electricSpark:(values.electricSpark||0));
            let threadCutting = (valuesChild.threadCutting?valuesChild.threadCutting:(values.threadCutting||0));
            let polishingHotrunnerLettering = (valuesChild.polishingHotrunnerLettering?valuesChild.polishingHotrunnerLettering:
                (values.polishingHotrunnerLettering||0));
            let parts = (valuesChild.parts?valuesChild.parts:(values.parts||0));
            let bitingFlowers = (valuesChild.bitingFlowers?valuesChild.bitingFlowers:(values.bitingFlowers||0));
            let otherProcessing = (valuesChild.otherProcessing?valuesChild.otherProcessing:(values.otherProcessing||0));
            totals = parseFloat(materialFormwork) +
                parseFloat(materialInternalModule) +
                parseFloat(cnc) +
                parseFloat(cncMaterial) +
                parseFloat(electricSpark) +
                parseFloat(threadCutting) +
                parseFloat(polishingHotrunnerLettering) +
                parseFloat(parts) +
                parseFloat(bitingFlowers) +
                parseFloat(otherProcessing);

            setTimeout(()=>{
                setFieldsValue({"total": Math.round(totals*100)/100});
            },0);
        };

        const options = [];
        for(let i=2000; i<2050;i++){
            options.push(<Option key={i} value={i}>{i}</Option>);
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
                <Form >
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="类型">
                        {form.getFieldDecorator('repairOrChange', {
                            initialValue: values.repairOrChange,
                        })(
                            <Select style={{width: '100%',color: '#000'}} disabled={viewTF}>
                                {option}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="客户">
                        {form.getFieldDecorator('customer', {
                            initialValue: values.customer,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="年份">
                        {form.getFieldDecorator('year', {
                            initialValue: values.year,
                        })(
                            <Select style={{width: '100%',color: '#000'}} disabled={viewTF}>
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="机种">
                        {form.getFieldDecorator('model', {
                            initialValue: values.model,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="名称">
                        {form.getFieldDecorator('modelName', {
                            initialValue: values.modelName,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="件号">
                        {form.getFieldDecorator('itemId', {
                            initialValue: values.itemId,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="模具编号">
                        {form.getFieldDecorator('mouldId', {
                            initialValue: values.mouldId,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="设变开始加工时间">
                        {form.getFieldDecorator('changeTimeOfProcessing', {
                            initialValue: values.changeTimeOfProcessing,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="设变单号">
                        {form.getFieldDecorator('changeOrderNumber', {
                            initialValue: values.changeOrderNumber,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="设变内容">
                        {form.getFieldDecorator('changeContent', {
                            initialValue: values.changeContent,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="备注">
                        {form.getFieldDecorator('remarks', {
                            initialValue: values.remarks,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="负责人">
                        {form.getFieldDecorator('mouldDirector', {
                            initialValue: values.mouldDirector,
                        })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="材料-模架">
                        {form.getFieldDecorator('materialFormwork', {
                            initialValue: values.materialFormwork,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="材料-内模件">
                        {form.getFieldDecorator('materialInternalModule', {
                            initialValue: values.materialInternalModule,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="CNC">
                        {form.getFieldDecorator('cnc', {
                            initialValue: values.cnc,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="CNC-电极材料">
                        {form.getFieldDecorator('cncMaterial', {
                            initialValue: values.cncMaterial,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="电火花">
                        {form.getFieldDecorator('electricSpark', {
                            initialValue: values.electricSpark,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="线割">
                        {form.getFieldDecorator('threadCutting', {
                            initialValue: values.threadCutting,
                        })(<Input type='number' onChange={onGenderChange}
                                   placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="抛光/热流道/刻字">
                        {form.getFieldDecorator('polishingHotrunnerLettering', {
                            initialValue: values.polishingHotrunnerLettering,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="配件">
                        {form.getFieldDecorator('parts', {
                            initialValue: values.parts,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="咬花">
                        {form.getFieldDecorator('bitingFlowers', {
                            initialValue: values.bitingFlowers,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="其它加工">
                        {form.getFieldDecorator('otherProcessing', {
                            initialValue: values.otherProcessing,
                        })(<Input type='number' onChange={onGenderChange}
                                  placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
                    </FormItem>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="合计">
                        {form.getFieldDecorator('total', {
                            initialValue: values.total,
                        })(<Input disabled={true} style={{color: '#000'}}/>)}
                    </FormItem>
                </Form>
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
        );}
};

/* eslint react/no-multi-comp:0 */
@connect(({ developmentchecklist, loading }) => ({
    developmentchecklist,
    loading: loading.models.developmentchecklist,
}))
@Form.create()
class ChangeDevelopmentChecklist extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        list:[],
        allMenu:[],
        winWidth: window.innerWidth,
        selectedRowKeys:[],
        title: '新增/编辑菜单',
        viewTF: false,
        uploadState: true,//是否可以上传
        userMsg: JSON.parse(localStorage.getItem("userMsg")),
    };

    columns = [
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
            width: 150,
            align: 'center',
        },
        {
            title: '机种',
            dataIndex: 'model',
            key: 'model',
            align: 'center',
            width: 200,
        },
        {
            title: '名称',
            dataIndex: 'modelName',
            key: 'modelName',
            width: 200,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '件号',
            dataIndex: 'itemId',
            key: 'itemId',
            width: 200,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
        },
        {
            title: '模具编号',
            dataIndex: 'mouldId',
            key: 'mouldId',
            width: 150,
            align: 'center',
        },
        {
            title: '设变开始加工时间',
            dataIndex: 'changeTimeOfProcessing',
            key: 'changeTimeOfProcessing',
            width: 250,
            align: 'center',
            render: val => {
                <div>
                    {isNaN(val)&&!isNaN(Date.parse(val)) ?
                        moment(val).format("YYYY-MM-DD") : val}
                </div>
            },
        },
        {
            title: '设变单号',
            dataIndex: 'changeOrderNumber',
            key: 'changeOrderNumber',
            width: 150,
            align: 'center',
        },
        {
            title: '设变内容',
            dataIndex: 'changeContent',
            key: 'changeContent',
            width: 150,
            align: 'center',
            render: text => (
                <div className={styles.smileDark} title={text}>
                    <LineWrap title={text} lineClampNum={2} />
                </div>
            ),
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
            title: '负责人',
            dataIndex: 'mouldDirector',
            key: 'mouldDirector',
            width: 150,
            align: 'center',
        },
        {
            title: '材料-模架',
            dataIndex: 'materialFormwork',
            key: 'materialFormwork',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '材料-内模件',
            dataIndex: 'materialInternalModule',
            key: 'materialInternalModule',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: 'CNC',
            dataIndex: 'cnc',
            key: 'cnc',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '电火花',
            dataIndex: 'electricSpark',
            key: 'electricSpark',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '线割',
            dataIndex: 'threadCutting',
            key: 'threadCutting',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '抛光/热流道/刻字',
            dataIndex: 'polishingHotrunnerLettering',
            key: 'polishingHotrunnerLettering',
            width: 250,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '配件',
            dataIndex: 'parts',
            key: 'parts',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '咬花',
            dataIndex: 'bitingFlowers',
            key: 'bitingFlowers',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '其它加工',
            dataIndex: 'otherProcessing',
            key: 'otherProcessing',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
            title: '合计',
            dataIndex: 'total',
            key: 'total',
            width: 150,
            align: 'center',
            render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
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

    componentDidMount() {
        this.firstLoad();
    }

    firstLoad=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'developmentchecklist/changeList',
            payload:{
                pageNum: 0,
                pageSize: 20,
                callback:(result)=>{
                    this.setState({result:result});
                    this.state.selectedRowKeys = [];
                }
            }
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.firstLoad();
    };

    handleModalVisible = (flag) => {
        if (this.state.selectedRowKeys.length == 1) {
            this.setState({
                title: '新增/编辑菜单',
                viewTF: false,
            })
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
            type: 'developmentchecklist/getIdChange',
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
    }

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
                model: values.model,
                itemId: values.itemId,
                repairOrChange: values.repairOrChange,
                customer: values.customer
            } : formValues;
            dispatch({
                type: 'developmentchecklist/changeList',
                payload: {
                    ...valueParam,
                    callback:(result)=>{
                        this.setState({result, formValues: values});
                    }
                },
            });
        });
    };

    handleTableChange=(pagination)=>{
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
            type: 'developmentchecklist/changeList',
            payload:{
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                callback:(result)=>{
                    this.setState({result:result});
                }
            }
        });

    }

    fileDown() {
        //下载模板
        window.location.href = host + '/upload/template/模具设变加工费模板.xlsx';
    }

    //删除
    handleGO = () =>{
        const {selectedRowKeys, userMsg} = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'developmentchecklist/delChange',
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

    //添加
    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
            type: 'developmentchecklist/saveChange',
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
        const {userMsg, year, winWidth, repairOrChange, uploadState} = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
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

        const option = [];
        option.push(<Option key="true" value="true">设变</Option>);
        option.push(<Option key="false" value="false">修模</Option>);

        const options = [];
        options.push(<Option key="null" value="">全部</Option>);
        options.push(<Option key="true" value="true">设变</Option>);
        options.push(<Option key="false" value="false">修模</Option>);

        const optionY = [];
        for(let i=2000; i<2050;i++){
            optionY.push(<Option key={i} value={i}>{i}</Option>);
        }
        const handleCourseChange = (value)=>{
            this.setState({
                repairOrChange: value
            })
        };
        const handleCourseChangeYear = (value)=>{
            this.setState({
                year: value
            });
        };

        const option1 = [];
        for(let i=2000; i<2050;i++){
            option1.push(<Option key={i} value={i}>{i}</Option>);
        }
        const beforeUpload = (file, fileList) => {    //选择文件后，上传文件前的操作
            return new Promise(                 //返回一个Promise对象
                (resolve, reject) => {
                    /*应该跳出的弹窗，图在下面，因为antd的Modal.confirm自带两个按钮，对应onOk操作和onCancel操作。
                    当时我想有三种情况，就在弹窗中加了个按钮*/

                    Modal.confirm({
                        // title: '是否使用损耗比',
                        width: winWidth>960 ? winWidth*0.3 : winWidth*0.5,
                        content:
                            /*点击‘取消上传‘，触发reject(),用来取消上传，（我试了试，不加这个reject()好像也可以）
                            Modal. destroyAll()是用来注销所有弹窗的。
                            前面说了，Modal.confirm自带两个按钮，这两个按钮都会让弹窗关闭，
                            但是当时我想加入第三种情况的时候，我需要手动触发注销函数。*/
                            <>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="年份" style={{width: '90%'}}>
                                    {/*<Input type='number' id={"years"} placeholder="请输入" />*/}
                                    <Select onChange={handleCourseChangeYear} id={"years"} style={{width: '100%'}}>
                                        {option1}
                                    </Select>
                                </FormItem>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="选择类型" style={{width: '90%'}}>
                                    <Select onChange={handleCourseChange} id={"type"} style={{width: '100%'}}>
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
                            let year = this.state.year?this.state.year:'';
                            // let year = document.getElementById("years") || '';
                            // year = year?year.value:'';
                            let type = this.state.repairOrChange;
                            this.setState({
                                year: year,
                            })
                            if (year && type) {
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
            action: host + '/api/v1/web/developmentlist/changeExports/',
            data: {operator: userName, year: year, repairOrChange: repairOrChange},
            accept: '.xlsx, .xls',
            onChange,
            beforeUpload
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
        const upload = powers.powerFilter('upload') ? (
            <Upload {...props}>
                <Button  style={{ marginLeft: 8}}>
                    <Icon type="upload"/>
                    上传
                </Button>
            </Upload>
        ) : null;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={12}>
                        <FormItem label="年份">
                            {getFieldDecorator('year')(
                                <Select style={{width: '100%'}}>
                                    {optionY}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="机种">
                            {getFieldDecorator('model')(<Input placeholder="请输入" allowClear/>)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="件号">
                            {getFieldDecorator('itemId')(<Input.TextArea placeholder="请输入"
                                                                         style={{height:'32px'}} />)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="客户">
                            {getFieldDecorator('customer')(<Input placeholder="请输入" allowClear/>)}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={12}>
                        <FormItem label="选择类型">
                            {getFieldDecorator('repairOrChange')(
                                <Select placeholder={"全部"} style={{width: '100%'}}>
                                    {options}
                                </Select>
                            )}
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
                        {upload}
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
            selectedRowKeys,winWidth,viewTF,title} = this.state;
        const list = result&&result.list;
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

        return (
            <PageHeaderWrapper title="管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Table
                                bordered
                                rowSelection={rowSelection}
                                loading={false}
                                rowKey={record => record.id}
                                dataSource={list}
                                columns={this.columns}
                                pagination={paginationProps}
                                onChange={this.handleTableChange}
                                scroll={{ x: 3000 }}
                            />
                        </div>
                    </div>
                </Card>
                <CreateForm {...parentMethods} viewTF={viewTF} title={title}
                            values={formVals} modalVisible={modalVisible}
                            winWidth={winWidth} onRef={this.bindRef.bind(this)}/>
            </PageHeaderWrapper>
        );
    }
}

export default ChangeDevelopmentChecklist;
