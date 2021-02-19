import React, { PureComponent } from 'react';
import Calendars  from '../Calendar/Calendar.js'

export default class Home extends PureComponent {
    state = {
        winWidth: window.innerWidth,
    }

    render() {
        // const { winWidth } = this.state
        return (
            <div>
                <div style={{ float: 'right'}}>
                    <Calendars></Calendars>
                </div>
            </div>
        );
    }
}
