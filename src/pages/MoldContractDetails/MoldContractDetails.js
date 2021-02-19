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
  Icon,
  Button,
  Select,
  Modal,
  message,
  Tabs,
  Switch,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './MoldContractDetails.less';
import LineWrap from '@/utils/LineWrap.js';

const FormItem = Form.Item;
import { host } from '@/utils/app.js';
import moment from 'moment';
const powers = require('@/utils/power.js');
const { Option } = Select;
const { TabPane } = Tabs;

@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    values: {},
  };

  state = {
    values: {},
    imgLength: 30,
  };

  constructor(props) {
    super(props);
  };

  okHandle = () => {
    //提交修改数据
    const { selectedRowKeys, form, handleAdd, fileList, fileList2, fileList3, fileList4 } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let contractImgUrl = '';
      let outContractImgUrl = '';
      let changeContractImgUrl = '';
      let dermatoglyphContractImgUrl = '';
      //处理上传图片返回的路径
      if (fileList && fileList.contractImg) {
        let imgList = fileList.contractImg;
        for (let i = 0; i < imgList.length; i++) {
          if (imgList[i].response) {
            contractImgUrl += imgList[i].response.data.url + ';';
          } else {
            let url = imgList[i].url.replace(/\\/, '/');
            contractImgUrl += '/upload'+url.substring(url.lastIndexOf('/'), url.length) + ';';
          }
        }
      }
      if (fileList2 && fileList2.outContractImg) {
        let imgList = fileList2.outContractImg;
        for (let i = 0; i < imgList.length; i++) {
          if (imgList[i].response) {
            outContractImgUrl += imgList[i].response.data.url + ';';
          } else {
            let url = imgList[i].url.replace(/\\/, '/');
            outContractImgUrl += '/upload'+url.substring(url.lastIndexOf('/'), url.length) + ';';
          }
        }
      }
      if (fileList3 && fileList3.changeContractImg) {
        let imgList = fileList3.changeContractImg;
        for (let i = 0; i < imgList.length; i++) {
          if (imgList[i].response) {
            changeContractImgUrl += imgList[i].response.data.url + ';';
          } else {
            let url = imgList[i].url.replace(/\\/, '/');
            changeContractImgUrl += '/upload'+url.substring(url.lastIndexOf('/'), url.length) + ';';
          }
        }
      }
      if (fileList4 && fileList4.dermatoglyphContractImg) {
        let imgList = fileList4.dermatoglyphContractImg;
        for (let i = 0; i < imgList.length; i++) {
          if (imgList[i].response) {
            dermatoglyphContractImgUrl += imgList[i].response.data.url + ';';
          } else {
            let url = imgList[i].url.replace(/\\/, '/');
            dermatoglyphContractImgUrl += '/upload'+url.substring(url.lastIndexOf('/'), url.length) + ';';
          }
        }
      }
      let ratio = '';
      if (fieldsValue.modelStallRatio) {
        //提交时比例格式的处理
        ratio = fieldsValue.modelStallRatio.substr(0, fieldsValue.modelStallRatio.length - 1) / 100;
      }
      form.resetFields();
      const { values } = this.props;

      let contractImg = contractImgUrl?{
        contractImg: contractImgUrl
      }:null;
      let outContractImg = outContractImgUrl?{
        outContractImg: outContractImgUrl
      }:null;
      let changeContractImg = changeContractImgUrl?{
        changeContractImg: changeContractImgUrl
      }:null;
      let dermatoglyphContractImg = dermatoglyphContractImgUrl?{
        dermatoglyphContractImg: dermatoglyphContractImgUrl
      }:null;

      let imgUrl = {
        ...contractImg,
        ...outContractImg,
        ...changeContractImg,
        ...dermatoglyphContractImg
      };
      fieldsValue = {
        ...fieldsValue,
        id: values.id,
        ...imgUrl,
        modelStallRatio: ratio,
      };
      if (selectedRowKeys.length > 1) {
        //勾选的数量是否大于1则提交勾选行的id和相应的数据
        let ids = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
          ids.push(selectedRowKeys[i]);
        }
        fieldsValue = {
          id: ids.toString(),
          ...imgUrl,
        };
        handleAdd(fieldsValue);
      } else {
        //勾选1个或者没有勾选则直接提交
        handleAdd(fieldsValue);
      }
    });
  };

  render() {
    const uploadButton = (
      <div>
        {/*<PlusOutlined />*/}
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
    const {
      editTF,
      fileList,
      fileList2,
      fileList3,
      fileList4,
      previewVisible,
      previewImage,
      previewTitle,
      modalVisible,
      form,
      handleModalVisible,
      values,
      handleChange,
      handleChange2,
      handleChange3,
      handleChange4,
      handlePreview,
      handleCancel,
      winWidth,
      title,
      viewTF,
    } = this.props;
    const {imgLength} = this.state;
    let flags = editTF ? '' : 'none';
    const contractImg = fileList && fileList.contractImg ? fileList.contractImg: [];
    const outContractImg = fileList2 && fileList2.outContractImg ? fileList2.outContractImg: [];
    const changeContractImg = fileList3 && fileList3.changeContractImg ? fileList3.changeContractImg: [];
    const dermatoglyphContractImg = fileList4 && fileList4.dermatoglyphContractImg ? fileList4.dermatoglyphContractImg: [];

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
        visible={modalVisible}
      >
        {/*<Search placeholder="请输入" onSearch={this.onSearch} style={{ width: 200, marginLeft: '30%'}} />*/}
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="年份"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('year', {
            initialValue: values.year,
          })(
            <Select style={{width: '100%',color: '#000'}} disabled={viewTF}>
              {option}
            </Select>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="客户"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('customer', {
            initialValue: values.customer,
          })(<Input placeholder={viewTF?"":"请输入"}  disabled={viewTF} style={{color: '#000'}}/>)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="合同签订时间"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('contractSigningTime', {
            initialValue: values.contractSigningTime,
          })(<Input placeholder={viewTF?"":"请输入"}  disabled={viewTF} style={{color: '#000'}}/>)}
        </FormItem>
        <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            label="合同文件"
        >
          {form.getFieldDecorator('contractImg', {
            initialValue: values.contractImg,
          })(
              <>
                  <Upload
                      action={host + '/api/v1/common/upload/file'}
                      listType="picture-card"
                      fileList={contractImg}
                      onPreview={handlePreview}
                      multiple={true}
                      onChange={!viewTF ? handleChange: null}
                      disabled={viewTF} style={{color: '#000'}}
                  >
                      {contractImg.length >= imgLength || viewTF ? null : uploadButton}
                  </Upload>
                  <Modal
                      visible={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancel}
                  >
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
              </>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="机种"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('typeOfMachine', {
            initialValue: values.typeOfMachine,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="模具付数"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('mouldPayment', {
            initialValue: values.mouldPayment,
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="有无模摊"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('tfModelStall', {
            initialValue: values.tfModelStall,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="模摊比例"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('modelStallRatio', {
            initialValue:
              parseFloat(values.modelStallRatio).toString() != 'NaN'
                ? values.modelStallRatio * 100 + '%'
                : values.modelStallRatio,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}}/>)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="收款名称"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('beneficiaryName', {
            initialValue: values.beneficiaryName,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="收款方式"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('paymentMethod', {
            initialValue: values.paymentMethod,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            label="模（检）具未税总金额"
            style={{ display: flags }}
        >
          {form.getFieldDecorator('totalAmountNotaxMould', {
            initialValue: values.totalAmountNotaxMould
                ? Math.round(values.totalAmountNotaxMould * 100) / 100
                : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="模（检）具总金额"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('totalAmountMould', {
            initialValue: values.totalAmountMould
              ? Math.round(values.totalAmountMould * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="除模摊部分-可收"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('moldRemovalAcceptable', {
            initialValue: values.moldRemovalAcceptable
              ? Math.round(values.moldRemovalAcceptable * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="除模摊部分-已收"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('moldRemovalReceived', {
            initialValue: values.moldRemovalReceived
              ? Math.round(values.moldRemovalReceived * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="模摊部分-可收"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('moldStallAcceptable', {
            initialValue: values.moldStallAcceptable
              ? Math.round(values.moldStallAcceptable * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="模摊部分-已收"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('moldStallReceived', {
            initialValue: values.moldStallReceived
              ? Math.round(values.moldStallReceived * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="未收总金额"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('totalAmountNotReceived', {
            initialValue: values.totalAmountNotReceived
              ? Math.round(values.totalAmountNotReceived * 100) / 100
              : '',
          })(<Input placeholder={viewTF?"":"请输入"} type='number'
                    disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          label="备注"
          style={{ display: flags }}
        >
          {form.getFieldDecorator('remarks', {
            initialValue: values.remarks,
          })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
        </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="量产时间"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('batchTime', {
                  initialValue: values.batchTime,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="件号"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('partNumber', {
                  initialValue: values.partNumber,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="制品单价"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('productsPrice', {
                  initialValue: values.productsPrice,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="模具编号"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dieNumber', {
                  initialValue: values.dieNumber,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹费"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphPaid', {
                  initialValue: values.dermatoglyphPaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>

          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-厂商"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outManufacturer', {
                  initialValue: values.outManufacturer,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-合同签订时间"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outContractSigningTime', {
                  initialValue: values.outContractSigningTime,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-合同文件">
              {form.getFieldDecorator('outContractImg', {
                  initialValue: values.outContractImg,
              })(
                  <>
                      <Upload
                          action={host + '/api/v1/common/upload/file'}
                          listType="picture-card"
                          fileList={outContractImg}
                          onPreview={handlePreview}
                          multiple={true}
                          onChange={!viewTF ? handleChange2: null}
                          disabled={viewTF} style={{color: '#000'}}
                      >
                          {outContractImg.length >= imgLength || viewTF ? null : uploadButton}
                      </Upload>
                      <Modal
                          visible={previewVisible}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancel}
                      >
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                  </>
              )}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-含税总额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outTotalTaxIncluded', {
                  initialValue: values.outTotalTaxIncluded,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-已付金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outAmountPaid', {
                  initialValue: values.outAmountPaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-未付余额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outAmountUnpaid', {
                  initialValue: values.outAmountUnpaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="委外-备注"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('outRemarks', {
                  initialValue: values.outRemarks,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-合同签订时间"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeContractSigningTime', {
                  initialValue: values.changeContractSigningTime,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-合同文件">
              {form.getFieldDecorator('changeContractImg', {
                  initialValue: values.changeContractImg,
              })(
                  <>
                      <Upload
                          action={host + '/api/v1/common/upload/file'}
                          listType="picture-card"
                          fileList={changeContractImg}
                          onPreview={handlePreview}
                          multiple={true}
                          onChange={!viewTF ? handleChange3: null}
                          disabled={viewTF} style={{color: '#000'}}
                      >
                          {changeContractImg.length >= imgLength || viewTF ? null : uploadButton}
                      </Upload>
                      <Modal
                          visible={previewVisible}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancel}
                      >
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                  </>
              )}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-件号"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changePartNumber', {
                  initialValue: values.changePartNumber,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-设变内容"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeContent', {
                  initialValue: values.changeContent,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-含税金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeTaxIncluded', {
                  initialValue: values.changeTaxIncluded,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-已收金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeAmountPaid', {
                  initialValue: values.changeAmountPaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-未收金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeAmountUnpaid', {
                  initialValue: values.changeAmountUnpaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="设变-备注"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('changeRemarks', {
                  initialValue: values.changeRemarks,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>

          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-合同签订时间"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphContractSigningTime', {
                  initialValue: values.dermatoglyphContractSigningTime,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-合同文件">
              {form.getFieldDecorator('dermatoglyphContractImg', {
                  initialValue: values.dermatoglyphContractImg,
              })(
                  <>
                      <Upload
                          action={host + '/api/v1/common/upload/file'}
                          listType="picture-card"
                          fileList={dermatoglyphContractImg}
                          onPreview={handlePreview}
                          multiple={true}
                          onChange={!viewTF ? handleChange4: null}
                          disabled={viewTF} style={{color: '#000'}}
                      >
                          {dermatoglyphContractImg.length >= imgLength || viewTF ? null : uploadButton}
                      </Upload>
                      <Modal
                          visible={previewVisible}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancel}
                      >
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                      </Modal>
                  </>
              )}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-件号"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphPartNumber', {
                  initialValue: values.dermatoglyphPartNumber,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-设变内容"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphContent', {
                  initialValue: values.dermatoglyphContent,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-含税金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphTaxIncluded', {
                  initialValue: values.dermatoglyphPaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-已收金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphAmountPaid', {
                  initialValue: values.dermatoglyphAmountPaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-未收金额"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphAmountUnpaid', {
                  initialValue: values.dermatoglyphAmountUnpaid,
              })(<Input placeholder={viewTF?"":"请输入"} type='number'
                        disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
          <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 15 }}
              label="皮纹-备注"
              style={{ display: flags }}
          >
              {form.getFieldDecorator('dermatoglyphRemarks', {
                  initialValue: values.dermatoglyphRemarks,
              })(<Input placeholder={viewTF?"":"请输入"} disabled={viewTF} style={{color: '#000'}} />)}
          </FormItem>
        <br />
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
          <Button style={{ marginRight: 8 }} onClick={() => handleModalVisible(false)}>
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
@connect(({ moldContractDetails, loading }) => ({
  moldContractDetails,
  loading: loading.models.moldContractDetails,
}))
@Form.create()
class MoldContractDetails extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    flag: true,
    fileList: {},
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    isModalVisible: false,
    selectedRowKeys: [],
    editTF: true,
    totalTF: false,
    isOpen: false,
    year: null,
    winWidth: window.innerWidth,//浏览器宽度
    title: '新增/编辑菜单',
    viewTF: false,
    uploadState: true,//是否可以上传
    modalVisibleTotal: false,//汇总弹窗
    titleTotal: '收款汇总',//汇总弹窗标题
    key: 1,//tabs的key
    checked: false,//开关的默认状态
    searchParam: {},//搜索参数
    userMsg: JSON.parse(localStorage.getItem('userMsg')),
  };

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({fileList}) => {
    let imgList = {contractImg: fileList};
    this.setState({ fileList: imgList });
  };
  handleChange2 = ({fileList}) => {
    let imgList = {outContractImg: fileList};
    this.setState({ fileList2: imgList });
  };
  handleChange3 = ({ fileList }) => {
    let imgList = {changeContractImg: fileList};
    this.setState({ fileList3: imgList });
  };
  handleChange4 = ({ fileList }) => {
    let imgList = {dermatoglyphContractImg: fileList};
    this.setState({ fileList4: imgList });
  };

  columns = [
    // {
    //     title: '操作',
    //     render: (text, record) => (
    //         <Fragment>
    //             {/*<Button type="dashed" size="small"  onClick={() => this.handleModalVisible(true, record)}>编辑</Button>*/}
    //             <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
    //             {/*<Divider type="vertical" />*/}
    //             {/*<Popconfirm title={'确认删除['+record.customer+']吗？'}*/}
    //             {/*            onConfirm={() => this.handleDelete( record.id)}*/}
    //             {/*            okText='确认'*/}
    //             {/*            cancelText='取消'>*/}
    //             {/*    <a>删除</a>*/}
    //             {/*    /!*<Button type="dashed" size="small" danger>删除</Button>*!/*/}
    //             {/*</Popconfirm>*/}
    //         </Fragment>
    //     ),
    //     fixed: 'left',
    //     key: 'operation',
    //     width: 120,
    //     align: 'center',
    //     filterType: this.state.editTF,
    // },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 80,
      align: 'center',
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
      title: '合同签订时间',
      dataIndex: 'contractSigningTime',
      key: 'contractSigningTime',
      width: 150,
      align: 'center',
      render: (val, record) => (
        <div>
          {
            isNaN(val) && Date.parse(val) ?
              (
                <a
                  style={{ color:'#1890FF'}}
                  onClick={() => this.showModal(1, true, record)}
                >
                    {moment(val).format("YYYY-MM-DD") instanceof Date &&
                    !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                        moment(val).format("YYYY-MM-DD") : val}
                </a>
              ):(
                <span style={{ color: 'red' }} className={styles.smileDark} title={val}>
                  <LineWrap title={val} lineClampNum={2} />
                </span>
              )
          }
          {/*isNaN(val)&&!isNaN(Date.parse(val)),*/}
        </div>
      ),
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '模具付数',
      dataIndex: 'mouldPayment',
      width: 150,
      align: 'center',
    },
    {
      title: '件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '模摊比例',
      dataIndex: 'modelStallRatio',
      width: 150,
      align: 'center',
      render: val => <div>{parseFloat(val).toString() != "NaN" ? val*100 + '%' : val}</div>,
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      width: 250,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '收款方式',
      dataIndex: 'paymentMethod',
      width: 250,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '模（检）具未税总金额',
      dataIndex: 'totalAmountNotaxMould',
      key: 'totalAmountNotaxMould',
      width: 200,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '模（检）具总金额',
      dataIndex: 'totalAmountMould',
      key: 'totalAmountMould',
      width: 200,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '除模摊部分-可收',
      dataIndex: 'moldRemovalAcceptable',
      key: 'moldRemovalAcceptable',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '除模摊部分-已收',
      dataIndex: 'moldRemovalReceived',
      key: 'moldRemovalReceived',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '模摊部分-可收',
      dataIndex: 'moldStallAcceptable',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '模摊部分-已收',
      dataIndex: 'moldStallReceived',
      key: 'moldStallReceived',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '未收总金额',
      dataIndex: 'totalAmountNotReceived',
      key: 'totalAmountNotReceived',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 250,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '委外-厂商',
      dataIndex: 'outManufacturer',
      key: 'outManufacturer',
      width: 150,
      align: 'center',
    },
    {
      title: '委外-含税总额',
      dataIndex: 'outTotalTaxIncluded',
      key: 'outTotalTaxIncluded',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '委外-已付金额',
      dataIndex: 'outAmountPaid',
      key: 'outAmountPaid',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '委外-未付余额',
      dataIndex: 'outAmountUnpaid',
      key: 'outAmountUnpaid',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-含税金额',
      dataIndex: 'changeTaxIncluded',
      key: 'changeTaxIncluded',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-已付金额',
      dataIndex: 'changeAmountPaid',
      key: 'changeAmountPaid',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-未付金额',
      dataIndex: 'changeAmountUnpaid',
      key: 'changeAmountUnpaid',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-含税金额',
      dataIndex: 'dermatoglyphTaxIncluded',
      key: 'dermatoglyphTaxIncluded',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-已付金额',
      dataIndex: 'dermatoglyphAmountPaid',
      key: 'dermatoglyphAmountPaid',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-未付金额',
      dataIndex: 'dermatoglyphAmountUnpaid',
      key: 'dermatoglyphAmountUnpaid',
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

  columnsTotal = [
    {
      title: '模（检）具总金额',
      dataIndex: 'totalAmountMould',
      key: 'totalAmountMould1',
      width: 200,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '除模摊部分-总可收',
      dataIndex: 'moldRemovalAcceptable',
      key: 'moldRemovalAcceptable1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '除模摊部分-总已收',
      dataIndex: 'moldRemovalReceived',
      key: 'moldRemovalReceived1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '模摊部分-总可收',
      dataIndex: 'moldStallAcceptable',
      key: 'moldStallAcceptable1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '模摊部分-总已收',
      dataIndex: 'moldStallReceived',
      key: 'moldStallReceived1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '未收总金额',
      dataIndex: 'totalAmountNotReceived',
      key: 'totalAmountNotReceived1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '委外-含税总额',
      dataIndex: 'outTotalTaxIncluded',
      key: 'outTotalTaxIncluded1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '委外-已付总金额',
      dataIndex: 'outAmountPaid',
      key: 'outAmountPaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '委外-未付总余额',
      dataIndex: 'outAmountUnpaid',
      key: 'outAmountUnpaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-含税总金额',
      dataIndex: 'changeTaxIncluded',
      key: 'changeTaxIncluded1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-已付总金额',
      dataIndex: 'changeAmountPaid',
      key: 'changeAmountPaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '设变-未付总金额',
      dataIndex: 'changeAmountUnpaid',
      key: 'changeAmountUnpaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-含税总金额',
      dataIndex: 'dermatoglyphTaxIncluded',
      key: 'dermatoglyphTaxIncluded',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-已付总金额',
      dataIndex: 'dermatoglyphAmountPaid',
      key: 'dermatoglyphAmountPaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '皮纹-未付总金额',
      dataIndex: 'dermatoglyphAmountUnpaid',
      key: 'dermatoglyphAmountUnpaid1',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
  ];

  columnsDS = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'center',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      align: 'center',
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '模具总金额',
      dataIndex: 'totalAmountMould',
      key: 'totalAmountMould',
      width: 150,
      align: 'center',
      render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
    },
    {
      title: '除模摊部分',
      children: [
        {
          title: '可收',
          dataIndex: 'moldRemovalAcceptable',
          key: 'moldRemovalAcceptable',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '已收',
          dataIndex: 'moldRemovalReceived',
          key: 'moldRemovalReceived',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
      ],
    },
    {
      title: '未收总金额',
      dataIndex: 'totalAmountNotReceived',
      key: 'totalAmountNotReceived',
      width: 150,
      align: 'center',
      render: (val, row, index) => {
        const obj = {
          children: val ? Math.round(val * 100) / 100 : '',
          props: {},
        };
        if (row.rowSpan) {
          obj.props.rowSpan = row.rowSpan;
        }
        if (row.colSpan === 0) {
          obj.props.colSpan = row.colSpan;
        }
        return obj;
      },
    },
    {
      title: '合同签订时间',
      dataIndex: 'contractSigningTime',
      key: 'contractSigningTime',
      width: 150,
      align: 'center',
      render: (val, record) => (
        <div>
          {
            isNaN(val) && !new RegExp("/\\d/").test(val)?
              (
                <a
                  style={{ color:'#1890FF'}}
                  onClick={() => this.showModal(1,true, record)}
                >
                    {moment(val).format("YYYY-MM-DD") instanceof Date &&
                    !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                        moment(val).format("YYYY-MM-DD") : val}
                </a>
              ):(
                <span style={{ color: 'red' }}>
                  {val}
                </span>
                )
          }
          {/*isNaN(val)&&!isNaN(Date.parse(val)),*/}
        </div>
      ),
    },
    {
      title: '件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
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
      dataIndex: 'dieNumber',
      key: 'dieNumber',
      width: 150,
      align: 'center',
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
      width: 200,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '收款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 250,
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
      width: 250,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
  ];

  columnsDS2 = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'center',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      align: 'center',
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '模摊部分',
      children: [
        {
          title: '可收',
          dataIndex: 'moldStallAcceptable',
          key: 'moldStallAcceptable',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '已收',
          dataIndex: 'moldStallReceived',
          key: 'moldStallReceived',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
      ]
    },
    {
      title: '未收总金额',
      dataIndex: 'totalAmountNotReceived',
      key: 'totalAmountNotReceived',
      width: 150,
      align: 'center',
      render: (val, row, index) => {
        const obj = {
          children: val ? Math.round(val * 100) / 100 : '',
          props: {},
        };
        if (row.rowSpan) {
          obj.props.rowSpan = row.rowSpan;
        }
        if (row.colSpan === 0) {
          obj.props.colSpan = row.colSpan;
        }
        return obj;
      },
    },
    {
      title: '合同签订时间',
      dataIndex: 'contractSigningTime',
      key: 'contractSigningTime',
      width: 150,
      align: 'center',
      render: (val, record) => (
        <div>
          {
            isNaN(val) && Date.parse(val) ?
              (
                <a
                  style={{ color:'#1890FF'}}
                  onClick={() => this.showModal(1,true, record)}
                >
                    {moment(val).format("YYYY-MM-DD") instanceof Date &&
                    !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                        moment(val).format("YYYY-MM-DD") : val}
                </a>
            ):(
              <span style={{ color: 'red' }}>
                {val}
              </span>
            )
          }
        </div>
      ),
    },
    {
      title: '量产时间',
      dataIndex: 'batchTime',
      key: 'batchTime',
      width: 150,
      align: 'center',
    },
    {
      title: '模具付数',
      dataIndex: 'mouldPayment',
      key: 'mouldPayment',
      width: 150,
      align: 'center',
    },
    {
      title: '模摊比例',
      dataIndex: 'modelStallRatio',
      width: 150,
      align: 'center',
      render: val => <div>{parseFloat(val).toString() != "NaN" ? val*100 + '%' : val}</div>,
    },
    {
      title: '件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
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
      dataIndex: 'dieNumber',
      key: 'dieNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
      width: 200,
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
      width: 250,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
  ];

  columnsOut = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'center',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      align: 'center',
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '委外',
      children: [
        {
          title: '厂商',
          dataIndex: 'outManufacturer',
          key: 'outManufacturer',
          width: 150,
          align: 'center',
        },
        {
          title: '含税总额',
          dataIndex: 'outTotalTaxIncluded',
          key: 'outTotalTaxIncluded',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '已付金额',
          dataIndex: 'outAmountPaid',
          key: 'outAmountPaid',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '未付余额',
          dataIndex: 'outAmountUnpaid',
          key: 'outAmountUnpaid',
          width: 150,
          align: 'center',
          render: (val, row, index) => {
            const obj = {
              children: val ? Math.round(val * 100) / 100 : '',
              props: {},
            };
            if (row.rowSpan) {
              obj.props.rowSpan = row.rowSpan;
            }
            if (row.colSpan === 0) {
              obj.props.colSpan = row.colSpan;
            }
            return obj;
          },
        },
        {
          title: '合同签订时间',
          dataIndex: 'outContractSigningTime',
          key: 'outContractSigningTime',
          width: 150,
          align: 'center',
          render: (val, record) => (
            <div>
              {
                isNaN(val) && Date.parse(val) ?
                  (
                    <a
                      style={{ color:'#1890FF'}}
                      onClick={() => this.showModal(2,true, record)}
                    >
                        {moment(val).format("YYYY-MM-DD") instanceof Date &&
                        !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                            moment(val).format("YYYY-MM-DD") : val}
                    </a>
                  ):(
                    <span style={{ color: 'red' }}>
                      {val}
                    </span>
                  )
              }
            </div>
          ),
        },
        {
          title: '备注',
          dataIndex: 'outRemarks',
          key: 'outRemarks',
          width: 250,
          align: 'center',
          render: text => (
            <div className={styles.smileDark} title={text}>
              <LineWrap title={text} lineClampNum={2} />
            </div>
          ),
        },
      ]
    },
    {
      title: '模具付数',
      dataIndex: 'mouldPayment',
      key: 'mouldPayment',
      width: 150,
      align: 'center',
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
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
      dataIndex: 'partNumber',
      key: 'partNumber',
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
      dataIndex: 'dieNumber',
      key: 'dieNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
  ];

  columnsC = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'center',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      align: 'center',
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '设变',
      children: [
        {
          title: '含税金额',
          dataIndex: 'changeTaxIncluded',
          key: 'changeTaxIncluded',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '已付金额',
          dataIndex: 'changeAmountPaid',
          key: 'changeAmountPaid',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '未收金额',
          dataIndex: 'changeAmountUnpaid',
          key: 'changeAmountUnpaid',
          width: 150,
          align: 'center',
          render: (val, row, index) => {
            const obj = {
              children: val ? Math.round(val * 100) / 100 : '',
              props: {},
            };
            if (row.rowSpan) {
              obj.props.rowSpan = row.rowSpan;
            }
            if (row.colSpan === 0) {
              obj.props.colSpan = row.colSpan;
            }
            return obj;
          },
        },
        {
          title: '合同签订时间',
          dataIndex: 'changeContractSigningTime',
          key: 'changeContractSigningTime',
          width: 200,
          align: 'center',
          render: (val, record) => (
            <div>
              {
                isNaN(val) && Date.parse(val) ?
                  (
                    <a
                      style={{ color:'#1890FF'}}
                      onClick={() => this.showModal(3,true, record)}
                    >
                        {moment(val).format("YYYY-MM-DD") instanceof Date &&
                        !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                            moment(val).format("YYYY-MM-DD") : val}
                    </a>
                  ):(
                    <span style={{ color: 'red' }}>
                      {val}
                    </span>
                  )
              }
            </div>
          ),
        },
        {
          title: '设变-件号',
          dataIndex: 'changePartNumber',
          key: 'changePartNumber',
          width: 150,
          align: 'center',
          render: text => (
            <div className={styles.smileDark} title={text}>
              <LineWrap title={text} lineClampNum={2} />
            </div>
          ),
        },
        {
          title: '设变-设变内容',
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
          dataIndex: 'changeRemarks',
          key: 'changeRemarks',
          width: 250,
          align: 'center',
          render: text => (
            <div className={styles.smileDark} title={text}>
              <LineWrap title={text} lineClampNum={2} />
            </div>
          ),
        },
      ]
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
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
      dataIndex: 'dieNumber',
      key: 'dieNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
  ];

  columnsDer = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'center',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
      align: 'center',
    },
    {
      title: '机种',
      dataIndex: 'typeOfMachine',
      key: 'typeOfMachine',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
      width: 150,
      align: 'center',
      render: text => (
        <div className={styles.smileDark} title={text}>
          <LineWrap title={text} lineClampNum={2} />
        </div>
      ),
    },
    {
      title: '皮纹',
      children: [
        {
          title: '含税金额',
          dataIndex: 'dermatoglyphTaxIncluded',
          key: 'dermatoglyphTaxIncluded',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '已付金额',
          dataIndex: 'dermatoglyphAmountPaid',
          key: 'dermatoglyphAmountPaid',
          width: 150,
          align: 'center',
          render: val => <div>{val ? Math.round(val * 100) / 100 : ''}</div>,
        },
        {
          title: '未收金额',
          dataIndex: 'dermatoglyphAmountUnpaid',
          key: 'dermatoglyphAmountUnpaid',
          width: 150,
          align: 'center',
          render: (val, row, index) => {
            const obj = {
              children: val ? Math.round(val * 100) / 100 : '',
              props: {},
            };
            if (row.rowSpan) {
              obj.props.rowSpan = row.rowSpan;
            }
            if (row.colSpan === 0) {
              obj.props.colSpan = row.colSpan;
            }
            return obj;
          },
        },
        {
          title: '合同签订时间',
          dataIndex: 'dermatoglyphContractSigningTime',
          key: 'dermatoglyphContractSigningTime',
          width: 150,
          align: 'center',
          render: (val, record) => (
            <div>
              {
                isNaN(val) && !/\\d/.test(val)?
                  (
                    <a
                      style={{ color:'#1890FF'}}
                      onClick={() => this.showModal(4,true, record)}
                    >
                      {moment(val).format("YYYY-MM-DD") instanceof Date &&
                      !isNaN(moment(val).format("YYYY-MM-DD").getTime()) ?
                          moment(val).format("YYYY-MM-DD") : val}
                    </a>
                  ):(
                    <span style={{ color: 'red' }}>
                      {val}
                    </span>
                  )
              }
            </div>
          ),
        },
        {
          title: '件号',
          dataIndex: 'dermatoglyphPartNumber',
          key: 'dermatoglyphPartNumber',
          width: 150,
          align: 'center',
          render: text => (
            <div className={styles.smileDark} title={text}>
              <LineWrap title={text} lineClampNum={2} />
            </div>
          ),
        },
        {
          title: '设变内容',
          dataIndex: 'dermatoglyphContent',
          key: 'dermatoglyphContent',
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
          dataIndex: 'dermatoglyphRemarks',
          key: 'dermatoglyphRemarks',
          width: 250,
          align: 'center',
          render: text => (
            <div className={styles.smileDark} title={text}>
              <LineWrap title={text} lineClampNum={2} />
            </div>
          ),
        },
      ]
    },
    {
      title: '收款名称',
      dataIndex: 'beneficiaryName',
      key: 'beneficiaryName',
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
      dataIndex: 'dieNumber',
      key: 'dieNumber',
      width: 150,
      align: 'center',
    },
  ];

  componentWillMount() {
    this.firstLoad();
  }

  firstLoad = () => {
    //初始数据
    const { dispatch } = this.props;
    dispatch({
      type: 'moldContractDetails/list',
      payload: {
        pageNum: 0,
        pageSize: 20,
        callback: result => {
          this.setState({ result: result });
          this.state.selectedRowKeys = [];
        },
      },
    });
    let values = {
      pageNum: 0,
      pageSize: 20,
      year: '',
      typeOfMachine: '',
      partNumber: '',
      customer: '',
    };
    this.state.selectedRowKeys = [];
    this.handleTotalPrice(values);
  };

  getId = (flag, id) => {//获取Id
    if (!flag) {
      let imgList = {};
      this.setState({
        fileList: imgList ? imgList : {},
        fileList2: imgList ? imgList : {},
        fileList3: imgList ? imgList : {},
        fileList4: imgList ? imgList : {},
        modalVisible: !!flag,
      });
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'moldContractDetails/getId',
      payload: {
        id: id.toString(),
        callback: result => {
          let record = result.data;
          let imgList = {};
          imgList = this.imgListSet(record);
          this.setState({
            fileList: imgList ? imgList : {},
            fileList2: imgList ? imgList : {},
            fileList3: imgList ? imgList : {},
            fileList4: imgList ? imgList : {},
            modalVisible: !!flag,
            formValues: record || {},
          });
        },
      },
    });
  };

  handleFormReset = () => {
    //重置查询
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchParam: {},
      checked: false,
      remarks: '',
    });
    this.firstLoad();
    let values = {
      pageNum: 0,
      pageSize: 20,
      year: '',
      typeOfMachine: '',
      partNumber: '',
      customer: '',
      remarks: '',
    };
    this.state.selectedRowKeys = [];
    this.handleTotalPrice(values);
  };

  handleModalVisible = flag => {//新增/编辑菜单界面
    if (this.state.selectedRowKeys.length == 1) {
      this.setState({
        title: '新增/编辑菜单',
        viewTF: false,
      });
      this.getId(flag, this.state.selectedRowKeys[0]);
    } else {
      let imgList = {};
      this.setState({
        title: '新增/编辑菜单',
        viewTF: false,
        fileList: imgList ? imgList : {},
        fileList2: imgList ? imgList : {},
        fileList3: imgList ? imgList : {},
        fileList4: imgList ? imgList : {},
        modalVisible: !!flag,
        formValues: {},
      });
    }
  };

  handleSearch = e => {
    //搜索
    e?e.preventDefault():null;
    const { dispatch, form } = this.props;
    const { remarks, searchParam } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      let year = values.year ? values.year : undefined;
      let customer = values.customer ? values.customer : undefined;
      let pages = e? {
        pageNum: 0,
        pageSize: searchParam.pageSize || 20,
      }:{
        pageNum: searchParam.pageNum,
        pageSize: searchParam.pageSize
      };
      const valueParam = JSON.stringify(searchParam) === '{}' || e? {
        ...pages,
        year: year,
        typeOfMachine: values.typeOfMachine,
        partNumber: values.partNumber,
        customer: customer,
        contractSigningTime: values.contractSigningTime,
        remarks: remarks,
      } : searchParam;
      dispatch({
        type: 'moldContractDetails/list',
        payload: {
          ...valueParam,
          callback: result => {
            this.setState({ result, searchParam: valueParam });
          },
        },
      });
      this.state.selectedRowKeys = [];
      this.handleTotalPrice(valueParam);
    });
  };

  handleTotalPrice = values => {
    //查询初始总金额数据
    const { dispatch } = this.props;
    dispatch({
      type: 'moldContractDetails/listTotal',
      payload: {
        pageNum: 0,
        pageSize: 20,
        year: values.year,
        typeOfMachine: values.typeOfMachine,
        partNumber: values.partNumber,
        customer: values.customer,
        callback: result => {
          let resultTotal = result ? result.list : [];
          this.setState({ resultTotal: resultTotal });
        },
      },
    });
  };

  handleTableChange = pagination => {//页数的变更
    const { dispatch } = this.props;
    const { searchParam } = this.state;
    let pages = {
      ...searchParam,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    searchParam.pageNum = pagination.current;
    searchParam.pageSize = pagination.pageSize;

    this.setState({searchParam: pages});

    dispatch({
      type: 'moldContractDetails/list',
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParam,
        callback: result => {
          this.setState({ result: result });
        },
      },
    });
    this.state.selectedRowKeys = [];
  };

  handleAdd = fields => {//添加或修改数据
    const { userMsg } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'moldContractDetails/save',
      payload: {
        ...fields,
        operator: userMsg ? userMsg.userName : '',
      },
      callback: result => {
        if (result.succee) {
          message.success(result.msg);
          this.handleSearch();
        } else {
          message.warn(result.msg);
        }
      },
    });
    this.state.editTF = true;
    this.handleModalVisible();
  };

  imgListSet =(record)=> {
      let imgList = {};
      let imgData = null;
      if (record) {
          if (record.contractImg) {//判断合同图片的类型
              let contractImg = [];
              imgData = record.contractImg.split(';');
              for (let keys in imgData) {
                  if (imgData[keys]) {
                      contractImg.push({ uid: keys, status: 'done', url: host + imgData[keys] });
                  }
              }
              imgList["contractImg"] = contractImg;
          }
          if (record.outContractImg) {
              let outContractImg = [];
              imgData = record.outContractImg.split(';');
              for (let keys in imgData) {
                  if (imgData[keys]) {
                      outContractImg.push({ uid: keys, status: 'done', url: host + imgData[keys] });
                  }
              }
              imgList["outContractImg"] = outContractImg;
          }
          if (record.changeContractImg) {
              let changeContractImg = [];
              imgData = record.changeContractImg.split(';');
              for (let keys in imgData) {
                  if (imgData[keys]) {
                      changeContractImg.push({ uid: keys, status: 'done', url: host + imgData[keys] });
                  }
              }
              imgList["changeContractImg"] = changeContractImg;
          }
          if (record.dermatoglyphContractImg) {
              let dermatoglyphContractImg = [];
              imgData = record.dermatoglyphContractImg.split(';');
              for (let keys in imgData) {
                  if (imgData[keys]) {
                      dermatoglyphContractImg.push({ uid: keys, status: 'done', url: host + imgData[keys] });
                  }
              }
              imgList["dermatoglyphContractImg"] = dermatoglyphContractImg;
          }
      }
      return imgList;
  };

  showModal(type, flag, record) {
      //图片弹窗
      let imgList = {};
      imgList = this.imgListSet(record);
      this.setState({
        isModalVisible: flag,
        type: type,
        fileList: imgList ? imgList : {},
      });
  }

  fileDown() {//下载模板
    window.location.href = host + '/upload/template/模具合同明细模板.xlsx';
  }

  handleGO = () =>{//批量删除
    const {selectedRowKeys, userMsg} = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'moldContractDetails/del',
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

  handleDelete = () => {//批量删除
    const {selectedRowKeys} = this.state;
    if (!selectedRowKeys.length) {
      message.warn("请至少选择一行");
      return;
    }
    Modal.confirm(this.config);
  };

  handleView = () => {//查看选中数据详情
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

  handleTableChangeDS = pagination => {
    //页数的变更
    const { dispatch } = this.props;
    const { searchParam, key } = this.state;
    let url = this.urlCheck(key);
    dispatch({
      type: url,
      payload: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParam,
        callback: result => {
          this.setResult(key, result);
        },
      },
    });
  };

  urlCheck = (key) => {//汇总查询路径判断
    let url = 'moldContractDetails/directSummarize';
    switch (key-0) {
      case 1:
        url = 'moldContractDetails/directSummarize';
        break;
      case 2:
        url = 'moldContractDetails/dieStall';
        break;
      case 3:
        url = 'moldContractDetails/outProcess';
        break;
      case 4:
        url = 'moldContractDetails/assumedChange';
        break;
      case 5:
        url = 'moldContractDetails/dermatoglyph';
        break;
    }
    return url;
  };

  setResult = (key, result) =>{
    let count = {};
    let list = result && result.list;
    let total = 0;
    let n = 0;
    let rowSpan = 1;
    let colSpan = 0;
    switch (key-0) {
      case 1:
        for (let i in list) {
          if (count["customer"] == list[i].customer &&
              count["typeOfMachine"] == list[i].typeOfMachine &&
              count["contractSigningTime"] == list[i].contractSigningTime) {
            total += (count["totalAmountNotReceived"]-0) + (list[i].totalAmountNotReceived-0);
            list[n].totalAmountNotReceived = total;
            rowSpan++;
            list[n]["rowSpan"] = rowSpan;
            list[i]["colSpan"] = colSpan;
            list[i].totalAmountNotReceived = 0;
          } else {
            n = i;
            total = 0;
            rowSpan = 1;
          }
          count["customer"] = list[i].customer;
          count["typeOfMachine"] = list[i].typeOfMachine;
          count["contractSigningTime"] = list[i].contractSigningTime;
          count["totalAmountNotReceived"] = list[i].totalAmountNotReceived;
        }
        result.list = list;
        this.setState({ resultSummarize: result });
        break;
      case 2:
        for (let i in list) {
          if (count["customer"] == list[i].customer &&
              count["typeOfMachine"] == list[i].typeOfMachine &&
              count["contractSigningTime"] == list[i].contractSigningTime) {
            total += (count["totalAmountNotReceived"]-0) + (list[i].totalAmountNotReceived-0);
            list[n].totalAmountNotReceived = total;
            rowSpan++;
            list[n]["rowSpan"] = rowSpan;
            list[i]["colSpan"] = colSpan;
            list[i].totalAmountNotReceived = 0;
          } else {
            n = i;
            total = 0;
            rowSpan = 1;
          }
          count["customer"] = list[i].customer;
          count["typeOfMachine"] = list[i].typeOfMachine;
          count["contractSigningTime"] = list[i].contractSigningTime;
          count["totalAmountNotReceived"] = list[i].totalAmountNotReceived;
        }
        result.list = list;
        this.setState({ resultStall: result });
        break;
      case 3:
        for (let i in list) {
          if (count["customer"] == list[i].customer &&
              count["typeOfMachine"] == list[i].typeOfMachine &&
              count["outManufacturer"] == list[i].outManufacturer &&
              count["outContractSigningTime"] == list[i].outContractSigningTime) {
            total += (count["outAmountUnpaid"]-0) + (list[i].outAmountUnpaid-0);
            list[n].outAmountUnpaid = total;
            rowSpan++;
            list[n]["rowSpan"] = rowSpan;
            list[i]["colSpan"] = colSpan;
            list[i].outAmountUnpaid = 0;
          } else {
            n = i;
            total = 0;
            rowSpan = 1;
          }
          count["customer"] = list[i].customer;
          count["typeOfMachine"] = list[i].typeOfMachine;
          count["outManufacturer"] = list[i].outManufacturer;
          count["outContractSigningTime"] = list[i].outContractSigningTime;
          count["outAmountUnpaid"] = list[i].outAmountUnpaid;
        }
        result.list = list;
        this.setState({ resultOut: result });
        break;
      case 4:
        for (let i in list) {
          if (count["customer"] == list[i].customer &&
              count["typeOfMachine"] == list[i].typeOfMachine &&
              count["changeContractSigningTime"] == list[i].changeContractSigningTime) {
            total += (count["changeAmountUnpaid"]-0) + (list[i].changeAmountUnpaid-0);
            list[n].changeAmountUnpaid = total;
            rowSpan++;
            list[n]["rowSpan"] = rowSpan;
            list[i]["colSpan"] = colSpan;
            list[i].changeAmountUnpaid = 0;
          } else {
            n = i;
            total = 0;
            rowSpan = 1;
          }
          count["customer"] = list[i].customer;
          count["typeOfMachine"] = list[i].typeOfMachine;
          count["changeContractSigningTime"] = list[i].changeContractSigningTime;
          count["changeAmountUnpaid"] = list[i].changeAmountUnpaid;
        }
        result.list = list;
        this.setState({ resultChange: result });
        break;
      case 5:
        for (let i in list) {
          if (count["year"] == list[i].year &&
              count["customer"] == list[i].customer &&
              count["typeOfMachine"] == list[i].typeOfMachine &&
              count["dermatoglyphContractSigningTime"] == list[i].dermatoglyphContractSigningTime) {
            total += (count["dermatoglyphAmountUnpaid"]-0) + (list[i].dermatoglyphAmountUnpaid-0);
            list[n].dermatoglyphAmountUnpaid = total;
            rowSpan++;
            list[n]["rowSpan"] = rowSpan;
            list[i]["colSpan"] = colSpan;
            list[i].dermatoglyphAmountUnpaid = 0;
          } else {
            n = i;
            total = 0;
            rowSpan = 1;
          }
          count["year"] = list[i].year;
          count["customer"] = list[i].customer;
          count["typeOfMachine"] = list[i].typeOfMachine;
          count["dermatoglyphContractSigningTime"] = list[i].dermatoglyphContractSigningTime;
          count["dermatoglyphAmountUnpaid"] = list[i].dermatoglyphAmountUnpaid;
        }
        result.list = list;
        this.setState({ resultDer: result });
        break;
    }
  };

  handleDirectSummarize = (key) =>{
    //获取汇总数据
    const { dispatch } = this.props;
    let url = this.urlCheck(key);
    dispatch({
      type: url,
      payload: {
        pageNum: 0,
        pageSize: 20,
        callback: result => {
          this.setResult(key, result);
        },
      },
    });
  };

  handleSearchDS = e => {
    const { key } = this.state;
    //搜索
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        searchParam: values,
      });
      let year = values.year ? values.year : undefined;
      let customer = values.customer ? values.customer : undefined;
      let url = this.urlCheck(key);
      dispatch({
        type: url,
        payload: {
          pageNum: 0,
          pageSize: 20,
          year: year,
          typeOfMachine: values.typeOfMachine,
          partNumber: values.partNumber,
          customer: customer,
          callback: result => {
            this.setResult(key, result);
          },
        },
      });
    });
  };

  handleFormResetDS = () => {//汇总重置查询
    const { key } = this.state;
    const { form } = this.props;
    form.resetFields();
    this.setState({
      searchParam: {},
    });
    this.handleDirectSummarize(key);
  };

  renderSimpleForm() {
    const onChange = info => {
      //上传后回调的方法
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        var str = info.file.response;
        if (str.succee) {
          message.success(`${info.file.name} 文件上传成功`);
          this.firstLoad();
        } else {
          message.error(`${info.file.name} 的表头字段：“${str.msg}” 格式或内容不正确`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
      this.setState({year: null,uploadState: true});
    };
    const {
      isModalVisible,
      fileList,
      previewVisible,
      previewImage,
      previewTitle,
      userMsg,
      winWidth,
      year,
      modalVisibleTotal,
      uploadState,
      titleTotal,
      resultSummarize,
      resultStall,
      resultOut,
      resultChange,
      resultDer,
      key,
      type,
      checked,
    } = this.state;
    let imgList = [];
    switch (type-0) {
      case 1:
        imgList = fileList && fileList.contractImg ? fileList.contractImg: [];
        break;
      case 2:
        imgList = fileList && fileList.outContractImg ? fileList.outContractImg: [];
        break;
      case 3:
        imgList = fileList && fileList.changeContractImg ? fileList.changeContractImg: [];
        break;
      case 4:
        imgList = fileList && fileList.dermatoglyphContractImg ? fileList.dermatoglyphContractImg: [];
        break;
    }

    const handleCourseChange = (value)=>{
      this.setState({
        year: value
      });
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
              let year = this.state.year?this.state.year:'';
              if (year) {
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
    const userName = userMsg ? userMsg.userName : '';
    const props = {
      //excel文件上传路径、格式筛选
      name: 'file',
      accept: '.xlsx, .xls',
      action: host + '/api/v1/web/contractdetails/excelExports/',
      data: { operator: userName, year: year},
      onChange,
      beforeUpload
    };
    const {
      form: { getFieldDecorator },
    } = this.props;
    const handleOk = () => {
      this.setState({ isModalVisible: false });
    };
    const handleCan = () => {
      this.setState({ isModalVisible: false });
    };

    const handleOkT = () => {
      this.setState({ modalVisibleTotal: false });
    };
    const handleCanT = () => {
      this.setState({ modalVisibleTotal: false });
    };
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
    const totalPriceType = () => {
      this.handleDirectSummarize(this.state.key);
      this.setState({modalVisibleTotal:true});
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
      <>
        <Upload {...props}>
          <Button style={{ marginLeft: 8 }}>
            <Icon type="upload" />
            上传
          </Button>
        </Upload>
      </>
    ) : null;

    const callback =(key) =>{//tab页变更
      this.setState({key: key});
      this.handleDirectSummarize(key);
      tabsResult(key);
    };

    const tabsResult = (key) =>{//tab页界面分页数据传递判断
      let result = null;
      switch (key-0) {
        case 1:
          result = resultSummarize;
          break;
        case 2:
          result = resultStall;
          break;
        case 3:
          result = resultOut;
          break;
        case 4:
          result = resultChange;
          break;
        case 5:
          result = resultDer;
          break;
      }
      return {total: result && result.total,
          current: result && result.pageNum}
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...tabsResult(key),
    };

    const options = [];
    options.push(<Option key="null" value="">全部</Option>);
    options.push(<Option key="1" value="未议">未议价</Option>);

    const result =(result)=> {
      return result && result.list?[...result.list]:[]
    };
    const onChangeSw = (checked)=>{
      this.setState({remarks: checked?'烂账':'',checked:checked})
    }

    const list = result(resultSummarize);
    const listStall = result(resultStall);
    const listOut = result(resultOut);
    const listChange = result(resultChange);
    const listDer = result(resultDer);
    return (
      <>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={12}>
              <FormItem label="年份">
                {getFieldDecorator('year')(
                  <Select style={{width: '100%'}}>
                    {option}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={5} sm={12}>
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
              <FormItem label="件号">
                {getFieldDecorator('partNumber')(<Input.TextArea placeholder="请输入"
                                                                 style={{height:'32px'}} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={12}>
              <FormItem label="合同状态">
                {getFieldDecorator('contractSigningTime')(
                  <Select placeholder={"全部"} style={{width: '100%'}}>
                    {options}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="烂账">
                {getFieldDecorator('remarks')(
                    <Switch checked={checked} onChange={onChangeSw}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={15} sm={12} style={{ marginBottom: 8 }}>
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
            <Col md={9} sm={12}>
              <Button style={{ marginLeft: 8, float: 'right' }} onClick={totalPrice}>
                查看总金额
              </Button>
              <Button style={{ marginLeft: 8, float: 'right' }} onClick={totalPriceType}>
                查看未收明细汇总
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal
          zIndex={22}
          title={titleTotal}
          onOk={handleOkT}
          onCancel={handleCanT}
          width={winWidth>960?(winWidth*3)/4+'px':winWidth*0.66+'px'}
          visible={modalVisibleTotal}
          footer={null}
        >
          <Form onSubmit={this.handleSearchDS} layout="inline">
            <Row>
              <Col md={6} sm={12} >
                <FormItem
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 15 }}
                    style={{width: '100%'}}
                    label="年份" >
                  {getFieldDecorator('year')(
                    <Select style={{width: '100%'}}>
                      {option}
                    </Select>
                  )}
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
                <FormItem label="件号">
                  {getFieldDecorator('partNumber')(<Input.TextArea placeholder="请输入"
                                                                   style={{height:'32px'}} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormResetDS}>
                  重置
                </Button>
              </Col>
            </Row>
          </Form>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="集团直接收款" key="1">
              <Table
                bordered
                loading={false}
                rowKey={record => record.id}
                dataSource={list}
                columns={this.columnsDS}
                pagination={paginationProps}
                onChange={this.handleTableChangeDS}
                scroll={{ x: 2000 }}
              />
            </TabPane>
            <TabPane tab="集团模摊收款" key="2">
              <Table
                bordered
                loading={false}
                rowKey={record => record.id}
                dataSource={listStall}
                columns={this.columnsDS2}
                pagination={paginationProps}
                onChange={this.handleTableChangeDS}
                scroll={{ x: 2000 }}
              />
            </TabPane>
            <TabPane tab="模具委外加工" key="3">
              <Table
                bordered
                loading={false}
                rowKey={record => record.id}
                dataSource={listOut}
                columns={this.columnsOut}
                pagination={paginationProps}
                onChange={this.handleTableChangeDS}
                scroll={{ x: 2000 }}
              />
            </TabPane>
            <TabPane tab="模具设变收款" key="4">
              <Table
                bordered
                loading={false}
                rowKey={record => record.id}
                dataSource={listChange}
                columns={this.columnsC}
                pagination={paginationProps}
                onChange={this.handleTableChangeDS}
                scroll={{ x: 2000 }}
              />
            </TabPane>
              <TabPane tab="模具皮纹收款" key="5">
                <Table
                  bordered
                  loading={false}
                  rowKey={record => record.id}
                  dataSource={listDer}
                  columns={this.columnsDer}
                  pagination={paginationProps}
                  onChange={this.handleTableChangeDS}
                  scroll={{ x: 2000 }}
                />
              </TabPane>
          </Tabs>
        </Modal>
        <Modal
          bodyStyle={{height:Math.ceil((imgList.length)/4)*112+30+'px'}}
          zIndex={99}
          title="合同图片"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCan}
          footer={null}
        >
          <Upload
            disabled
            listType="picture-card"
            fileList={imgList}
            onPreview={this.handlePreview}
          >
            {null}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Modal>
      </>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  onSelectChange = selectedRowKeys => {
    //勾选触发
    this.state.editTF = selectedRowKeys.length > 1 ? false : true;
    this.setState({ selectedRowKeys });
  };

  render() {
    const {
      selectedRowKeys,
      editTF,
      result,
      modalVisible,
      formValues,
      resultTotal,
      fileList,
      fileList2,
      fileList3,
      fileList4,
      previewVisible,
      previewImage,
      previewTitle,
      winWidth,
      title,
      viewTF,
    } = this.state;

    const list = result && result.list?[...result.list]:[];
    const listTotal = resultTotal?[...resultTotal]:[];

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
      handlePreview: this.handlePreview,
      handleCancel: this.handleCancel,
      handleChange: this.handleChange,
      handleChange2: this.handleChange2,
      handleChange3: this.handleChange3,
      handleChange4: this.handleChange4,
    };
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const table = listTotal.length&&listTotal[0]!==null?(
    <Table
      bordered
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
      scroll={{ x: 4500 }}
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
                scroll={{ x: 4500 }}
              />
            </div>
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          editTF={editTF}
          selectedRowKeys={selectedRowKeys}
          values={formValues}
          previewVisible={previewVisible}
          previewImage={previewImage}
          previewTitle={previewTitle}
          fileList={fileList}
          fileList2={fileList2}
          fileList3={fileList3}
          fileList4={fileList4}
          modalVisible={modalVisible}
          winWidth={winWidth}
          title={title}
          viewTF={viewTF}
        />
      </PageHeaderWrapper>
    );
  }
}

export default MoldContractDetails;
