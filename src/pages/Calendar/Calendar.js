import * as React from 'react';
import styles from './Calendar.less';
import { Calendar } from 'antd';

export default class Calendars extends React.Component {
    constructor(props) {
        super(props);
    };


    onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    }

    render() {
        return (
            <div className={styles.calendar}>
                <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
            </div>
        );
    };
}
