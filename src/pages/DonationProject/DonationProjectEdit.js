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
import {host}from '@/utils/app.js';
import { getBase64, beforeUpload }from '@/utils/upLoad.js';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
@Form.create()
class CreateForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {return (<div/>);}
}

/* eslint react/no-multi-comp:0 */
@connect(({ donationProjectEdit, loading }) => ({
    donationProjectEdit,
    loading: loading.models.donationProjectEdit,
}))
@Form.create()
class DonationProjectEdit extends PureComponent {
    state = {
        formValues: {},
        loading: false,
    };

    static defaultProps = {
        values: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            editorState: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { location: { query, params } } = this.props;//接收参数
        var paramData = params&&params.data;
        this.setState({Id:paramData&&paramData.id});
        if (paramData&&paramData.id){
            this.setState({typeCopy : paramData&&paramData.type});
            this.setState({coverCopy : paramData&&paramData.cover});
        }
        if (nextProps.values && nextProps.values.content) {
            const contentBlock = BraftEditor.createEditorState(nextProps.values.content);
            if (contentBlock) {
                this.setState({ editorState: contentBlock });
            }
        }else{
            this.setState({ editorState: null });
        }
    }

    componentDidMount() {
        this.getSelectType();
    }

    //获取标签
    getSelectType=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'donationProject/get',
            payload:{
                callback:(result)=>{
                   this.setState({typeData:result});
                }
            }
        });
    };

    //提交
    handleSubmit = () => {
        const { form, handleAdd } = this.props;
        const formData = form.getFieldsValue();
        const editorState = formData.content;
        if(editorState == null){
            message.error("内容不能为空");
            return;
        }
        var editorContent = editorState.toHTML();
        var editorContentCheck = editorContent.replace(/<[^<>]+?>/g,'').trim();
        if(editorContentCheck == ''){
            message.error("内容不能为空");
            return;
        }
        var typeParam = null;
        const { type } = this.state;
        const { typeCopy } = this.state;
        if(type != null){
            typeParam = type;
        }
        if(type == null && typeCopy == null){
            message.error("捐赠类型未选择");
            return;
        }
        const { cover } = this.state;
        const { coverCopy } = this.state;
        if (cover == null && coverCopy == null) {
            message.error("封面未上传");
            return;
        }
        form.validateFields((err, fieldsValue) => {
            if (err) { return; }
            form.resetFields();
            const { Id } = this.state;
            fieldsValue = {
                ...fieldsValue,
                id: Id,
                type: typeParam,
                cover: cover,
                content: editorContent,
            };
            this.handleAdd(fieldsValue);
        });
    };

    //添加
    handleAdd = fields => {
        const { dispatch } = this.props;
        fields = {
            ...fields,
            startTime: moment(fields.startTime._d).format('YYYY-MM-DD'),
            endTime: moment(fields.endTime._d).format('YYYY-MM-DD'),
        }
        dispatch({
            type: 'donationProject/save',
            payload: fields,
            callback:(result)=>{
                if(result.succee){
                    if(fields.id){
                        message.success('修改成功');
                        history.back();
                    }else{
                        message.success('添加成功');
                        history.back();
                    }
                }else{
                    message.warn(result.msg)
                }
            }
        });
    };

    handleEditorChange = (editorState) => {
        this.setState({ editorState });
    };

    onEditorStateChange = editorState => {
        this.setState({
            editorState,
        });
    };

    onContentStateChange = contentState => {
        this.setState({
            contentState,
        });
    };

    handleChange = (value) => {
        this.setState({type : value});
    }

    handleChangeImg = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.response) {
            var url = info.file.response.data.url;
            this.setState({cover : url});
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { location: { query, params } } = this.props;//接收参数
        var paramData = params&&params.data;
        const { type } = this.state;
        const  myUploadFn = param => {
            const serverURL = host+'/api/v1/common/upload/file';
            const xhr = new XMLHttpRequest();
            const fd = new FormData();
            const successFn = response => {
                // 假设服务端直接返回文件上传后的地址
                // 上传成功后调用param.success并传入上传后的文件地址
                const result = JSON.parse(xhr.responseText);
                param.success({
                    url:  result.datas.url,
                    meta: {
                        id: result.datas.id,
                    }
                });
            };

            const progressFn = event => {
                param.progress((event.loaded / event.total) * 100);
            };

            const errorFn = response => {
                // 上传发生错误时调用param.error
                param.error({
                    msg: 'unable to upload.',
                });
            };
            xhr.upload.addEventListener('progress', progressFn, false);
            xhr.addEventListener('load', successFn, false);
            xhr.addEventListener('error', errorFn, false);
            xhr.addEventListener('abort', errorFn, false);
            fd.append('file', param.file);
            xhr.open('POST', serverURL, true);
            xhr.send(fd);
        };
        const toolbar = [
            'undo',
            'redo',
            'separator',
            'font-size',
            'line-height',
            'letter-spacing',
            'separator',
            'text-color',
            'bold',
            'italic',
            'underline',
            'strike-through',
            'separator',
            'superscript',
            'subscript',
            'remove-styles',
            'separator',
            'text-indent',
            'text-align',
            'separator',
            'headings',
            'list-ul',
            'list-ol',
            'separator',
            'separator',
            'hr',
            'separator',
            'media',
            'separator',
            'clear',];
        const { form, handleAdd } = this.props;

        const mediaSet = {
            uploadFn: myUploadFn,
        };

        const parentMethods = {
            handleAdd: this.handleAdd,
        };
        const { typeData } = this.state
        const TypeData = typeData&&typeData.data;

        const { getFieldDecorator } = this.props.form;
        const buttonStyle = {
            float: 'right',
            'zIndex': '999',
            marginTop: '10px',
            marginRight: '10px',
        };
        var selectStyle = {
             display: 'block',
        };
        var selectStyleEdit = {
             display: 'none',
        };
        if(paramData&&paramData.id){
            selectStyle = {
                 display: 'none',
            };
            selectStyleEdit = {
                 display: 'block',
            };
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;

        return (
            <PageHeaderWrapper title="捐赠管理">
                <Form layout="inline">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card bordered={false}>
                                <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="捐赠标题">
                                    {getFieldDecorator('name', {
                                        initialValue: paramData&&paramData.name,
                                        rules: [{ required: true, message: '请输入标题！' },{max:50,message:'标题最长50个字'}],
                                    })(<Input placeholder="请输入" />)}
                                </FormItem>
                                <br/>
                                <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="开始日期">
                                    {getFieldDecorator('startTime', {
                                        initialValue: moment(paramData&&paramData.startTime),
                                        rules: [{ required: true, message: '请选择捐赠开始日期！' }],
                                    })(<DatePicker/>)}
                                </FormItem>
                                <br/>
                                <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="结束日期">
                                    {getFieldDecorator('endTime', {
                                        initialValue: moment(paramData&&paramData.endTime),
                                        rules: [{ required: true, message: '请选择捐赠结束日期！' }],
                                    })(<DatePicker/>)}
                                </FormItem>
                                <br/>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="目标金额">
                                    {getFieldDecorator('targetAmount', {
                                        initialValue: paramData&&paramData.targetAmount,
                                        rules: [{ required: true, message: '请输入目标金额！' }],
                                    })(<InputNumber placeholder="请输入" />)}
                                </FormItem>
                            </Card>
                            <Card style={selectStyleEdit} title="捐赠类型">
                                <Select defaultValue={paramData&&paramData.type} style={{ width: '50%' }} onChange={this.handleChange}>
                                    {(TypeData || []).map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                      ))}
                                </Select>
                            </Card>
                            <Card style={selectStyle} title="捐赠类型">
                                <Select defaultValue="请选择" style={{ width: '50%' }} onChange={this.handleChange}>
                                    {(TypeData || []).map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                      ))}
                                </Select>
                            </Card>
                            <Card title="封面">
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action={host+"/api/v1/common/upload/file"}
                                    beforeUpload={beforeUpload}
                                    onChange={this.handleChangeImg}
                                >
                                    {paramData&&paramData.cover || imageUrl ? <img src={imageUrl ||　paramData&&paramData.cover} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Button type="primary" style={buttonStyle} onClick={this.handleSubmit} >提交</Button>
                            <Card bordered={false} title="捐赠内容">
                                <FormItem wrapperCol={{ span: 24 }} label="">
                                    {getFieldDecorator('content', {
                                        initialValue: BraftEditor.createEditorState(paramData&&paramData.content) || '',
                                        rules: [{ required: true }],
                                    })(
                                        <BraftEditor
                                            media={{uploadFn: myUploadFn,externals:{image:false,video:false,audio:false,embed:false}}}
                                            controls={toolbar}
                                            onChange={this.handleEditorChange}
                                        />
                                    )}
                                </FormItem>
                            </Card>
                        </Col>
                    </Row>
                </Form>
                <CreateForm {...parentMethods} />
            </PageHeaderWrapper>
        );
    }
}

export default DonationProjectEdit;
