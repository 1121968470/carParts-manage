import {Button, Card, Col, Form, Icon, Input, Message, Row, Table, DatePicker, Select} from 'antd';
import {connect} from 'dva';
import React, {PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

const {RangePicker} = DatePicker;
import {exportList} from '@/services/check';


import styles from './Attend.less';

const {TextArea} = Input;

const FormItem = Form.Item;
const {Column, ColumnGroup} = Table;

const iconSpanStyle = {marginLeft: 5};

@connect(({check, loading}) => ({
  check,
  dataLoading: loading.effects['check/fetchList'],
}))
class ListPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      timeType: 'day',
      activeKey: "1"
    };
  }

  columns = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => (index + 1)
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'name',
      align: 'center',
      width: 150
    },
    {
      title: '部门',
      key: 'count',
      align: 'center',
      dataIndex: 'orgName',
      width: 150,
    },
    {
      title: '考勤组',
      key: 'manager',
      align: 'center',
      dataIndex: 'groupName',
      width: 150,
    },
    {
      title: '班次',
      key: 'shiftName',
      align: 'center',
      dataIndex: 'shiftName',
    },
    {
      title: '考勤日期',
      key: 'time',
      align: 'center',
      dataIndex: 'checkDateStr',
      render: (text, record) => {
        if (text) {
          return moment(text).format("YYYY-MM-DD");
        }
        return '';
      }
    },
    {
      title: '考勤时间',
      key: 'attendanceTime',
      align: 'center',
      dataIndex: 'attendanceTime',
      render: (text, record) => {
        if (text) {
          return moment(text).format("HH:mm");
        }
        return '';
      }
    },
    {
      title: '打卡时间',
      key: 'clockTime',
      align: 'center',
      dataIndex: 'clockTime',
      render: (text, record) => {
        if (text) {
          return moment(text).format("HH:mm");
        }
        return '';
      }
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      dataIndex: 'dealResultName',
    }
  ];


  handleOps = ({key}) => {
    switch (key) {
      case 'export':

        exportList({}).then((response) => {
          response.blob().then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            //无法从返回的文件流中获取文件名
            let filename = response.headers.get('Content-Disposition');
            a.href = blobUrl;
            a.download = filename ? filename : '考勤记录.xls';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          });
        }).catch((error) => {
          Message.error("导出失败");
        });
        break;
    }
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let _values = Object.assign({}, values);
      if (values.rangeDate && values.rangeDate.length > 1) {
        _values.beginDate = values.rangeDate[0].format("YYYY-MM-DD");
        _values.endDate = values.rangeDate[1].format("YYYY-MM-DD");
      }
      delete _values.rangeDate;

      this.loadData(_values);
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }


  renderSimpleForm = () => {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {attendStatusList = [], groupList = [], shiftList = []} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{md: 8, lg: 24, xl: 48}} type="flex" justify="end">
              <Col span={16}>
        <FormItem label="考勤组">
          {getFieldDecorator('groupId', {})(
            <Select
              style={{width: 120}}
              key="groupId"
              placeholder="请选择"
            >
              {groupList && groupList.map(item => <Option key={item.id} value={item.id}>{item.groupName}</Option>)}
            </Select>
          )}
        </FormItem>

        <FormItem label="班次">
          {getFieldDecorator('shiftId', {})(
            <Select
              style={{width: 120}}
              key="shiftId"
              placeholder="请选择"
            >
              {shiftList && shiftList.map(item => <Option key={item.id} value={item.id}>{item.shiftName}</Option>)}

            </Select>
          )}
        </FormItem>

        <FormItem label="考勤状态">
          {getFieldDecorator('dealResult', {})(
            <Select
              style={{width: 120}}
              key="dealResult"
              placeholder="请选择"
            >
              {attendStatusList && attendStatusList.map(item => <Option key={item.id} value={item.name}>{item.title}</Option>)}
            </Select>
          )}
        </FormItem>

        <Form.Item
          label="考勤时间"
          style={{marginBottom: 0}}
        >
          {getFieldDecorator('rangeDate', {})(
            <RangePicker key="rangeDate" />
          )}
        </Form.Item>
              </Col>
              <Col span={3}>
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


  handlePaginationChange = (page, pageSize) => {
    this.loadData({
      page,
      limit: pageSize,
    });
  };


  componentDidMount() {
    this.loadData();
    this.props.dispatch({
      type: 'check/basic',
      payload: {},
      callback: result => {
        if (result && result.datas) {
          this.setState({
            attendStatusList: result.datas.attendStatusList,
            groupList: result.datas.groupList,
            shiftList: result.datas.shiftList
          });
        }
      }
    });
  }

  loadData = param => {
    const {dispatch} = this.props;
    dispatch({
      type: 'check/fetchList',
      payload: param,
    });
  };

  getPagination = page => ({
    total: page && page.count ? page.count : 0,
    current: page && page.curPage ? page.curPage : 0,
    pageSize: page && page.limit ? page.limit : 10,
    position: 'bottom',
    showSizeChanger: true,
    onChange: this.handlePaginationChange,
    onShowSizeChange: this.handlePaginationChange,
  });

  render() {
    const {check: {page}} = this.props;

    // demo pagination.
    const restProps = {
      loading: false,
      size: 'small',
      showHeader: true,
    };


    return (
      <PageHeaderWrapper>
        <div className={styles.content}>
            <Card bordered={false}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              {...restProps}
              pagination={this.getPagination(page)}
              columns={this.columns}
              loading={this.props.dataLoading}
              dataSource={(page && page.data) ? page.data : null}
              rowKey="id"
            />
          </Card>
        </div>


      </PageHeaderWrapper>
    )
  }
}

const WrappedListPage = Form.create({name: 'user'})(ListPage);
export default WrappedListPage;
