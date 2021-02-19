import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import {Icon, message} from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';

const copyright = (
    <Fragment>
        Copyright <Icon type="copyright" />  汽车零部件管理系统
    </Fragment>
);

class UserLayout extends React.PureComponent {

    getPageTitle() {
        const {
            route: { routes },
            location,
        } = this.props;
        const { pathname } = location;
        let title = '信息管理系统';
        const tRoute = routes.filter(item => item.path && item.path.startsWith(pathname));
        // if (tRoute && tRoute[0].name) {
        //   title = `${tRoute[0].name} - 信息管理系统`;
        // }
        return title;
    };

    render() {
        const {
            children,
            location: { pathname },
        } = this.props;

        const check =()=>{
            if (location.pathname != "/" && location.pathname != "/user/login") {
                message.warn("请先登录！");
                setTimeout(function () {
                    window.location.href = '/user/login';
                },1000)
            }
        }
        let filter = JSON.parse(localStorage.getItem("userMsg"));
        let urlFilter = localStorage.getItem("urlFilter");
        let loginIn = location.pathname == "/user/login" ? 'inline' : 'none';
        if (!filter) {
            check();
        } else {
            if (!filter.loginStatus) {
                check();
            } else {
                const urlFilters = urlFilter ? urlFilter.split(','): null;
                if (location.pathname == "/" || location.pathname == "/user/login") {
                    window.location.href = '/home/home';
                } else {
                    let count = 0;
                    if (!urlFilters) {
                        count++;
                    }
                    for (let i in urlFilters) {//用户权限的过滤
                        if (location.pathname == urlFilters[i]) {
                            count++;
                        }
                    }
                    if (!count) {
                        // window.location.href = '/home/home';
                    }
                }
            }
        }
        return (
            <DocumentTitle title={this.getPageTitle(pathname)}>
                <div className={styles.container}>
                    {/*<div className={styles.lang}>*/}
                    {/*  <SelectLang />*/}
                    {/*</div>*/}
                    <div className={styles.content}>
                        <div className={styles.top} style={{display : loginIn}}>
                            <div className={styles.header}>
                                <Link to="/">
                                    <img alt="logo" className={styles.logo} src={logo} />
                                    <span className={styles.title}>汽车零部件管理系统</span>
                                </Link>
                            </div>
                        <div className={styles.desc}>汽车零部件管理系统</div>
                        </div>
                        {children}
                    </div>
                    {/*<GlobalFooter copyright={copyright}/>*/}
                </div>
            </DocumentTitle>
        );
    };
}

export default UserLayout;
