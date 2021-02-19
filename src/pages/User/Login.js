import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {message, Input, Button, Form, Icon} from 'antd';
import styles from './Login.less';
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
    static defaultProps = {

    };
    constructor(props) {
        super(props);
    }

  state = {
    type: 'account',
    autoLogin: true,
  };
  componentDidMount(){
    document.body.addEventListener("keyup",(e)=>{
       if(window.event){
         e=window.event;
       }
       let code=e.charCode||e.keyCode;
       if(code==13){
         this.handleSubmit(e);
       }
    })
  }

  componentWillMount(){
      document.body.removeEventListener("keyup",()=>{})
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          if (!err) {
              const {dispatch} = this.props;
              dispatch({
                  type: 'login/login',
                  payload: values,
                  callback: (result) => {
                      // console.log("login.result",result);
                      if (result&&!result.succee) {
                          message.warn(result.msg);
                      }
                  }
              });
          }
      })
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting,form } = this.props;
    const {getFieldDecorator}=this.props.form;
    return (
      <div className={styles.main} style={{marginTop:"10%"}}>
          <Form onSubmit={this.handleSubmit} style={{maxWidth: 300}} >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {getFieldDecorator('userId', {
                  rules: [{ required: true, message: '请输入账号！'}],
              })(<Input  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}  style={{width:400,height:40}} placeholder="账号" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} >
              {getFieldDecorator('password',
                  {rules: [{ required: true, message: '输入密码！'}]}
                )
                   (
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  style={{width:400,height:40}}  type='password' placeholder="密码"/>
                  )}
            </FormItem>
            <Button size="large" style={{width:400}} loading={submitting} type="primary" htmlType="submit">登录</Button>
          </Form>
      </div>
    );
  }
}

export default LoginPage;
