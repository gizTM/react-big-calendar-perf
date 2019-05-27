import React, { Component } from 'react'
import styled from 'styled-components'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import _ from 'lodash'
import { Layout } from 'antd'

import 'react-big-calendar/lib/css/react-big-calendar.css'

// const Profiler = React.unstable_Profiler;

const { Content } = Layout
const startTime = { hour: 9, minute: 0 }
const endTime = { hour: 21, minute: 0 }

const StyledLayout = styled(Layout)`
  background: #bbb;
  height: 100%;
`

const StyledCalendarContainer = styled(Content)`
  display: flex;
  flex-direction: column;
  padding: 8px 14px;
  background: #FFFFFF;
  border-radius: 8px;
  margin: 0;
`

const StyledTitle = styled.div`
  /* font-size: 24px; */
  font-size: 30px;
  font-weight: bold;
  /* padding: 8px 0; */
  padding-bottom: 8px;
  border-bottom: 1px solid #CCCCCC;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledBigCalendar = styled(BigCalendar)`
  flex-grow: 1;
  padding: 10px 0;
  /* height: 100vh; */
  min-height: 200vh;
  height: auto;
  
  & .rbc-time-content {
    overflow: hidden;
  }
  & .rbc-time-gutter {
    & .rbc-timeslot-group {
      border-bottom: none;
    }
  }
  & .rbc-time-gutter .rbc-timeslot-group .rbc-time-slot { 
    & .rbc-label {
      margin-top: 0;
    }
  }
  & .rbc-time-gutter > .rbc-timeslot-group ~ .rbc-timeslot-group .rbc-time-slot {
    & .rbc-label {
      margin-top: -10px;
    }
  }

  & .rbc-current-time-indicator {
    display: ${props => props.isshowcurrenttime === 'true' ? 'block' : 'none'};
    background: #ff0000 !important;
    left: ${props => {
      const offset = props.slotwidth * props.currentday
      return props.currentview === 'day' ? 
      '0px !important' : 
      `-${offset}px !important`
    }}; 
    height: 2px !important;
    width: 5000px !important;
    &::after {
      content: '';    
      width: 10px;
      height: 10px;
      background: #ff0000;
      display: block;
      border-radius: 5px;
      position: absolute;
      top: -3px;
      left: ${props => {
        const offset = props.slotwidth * 3.5//props.currentday
        return props.currentview === 'day' ? 
          '350px' : 
          `${offset}px`
      }};
    }
    &::before {
      content: ${props => `'${props.currenttime}'`};
      color: #ff0000;
      position: absolute;
      top: -10px;
      left: -50px;
    }
  }
`

const StyledFloatRight = styled.div`
  display: flex;
  align-items: center;
`

const StyledLabel = styled.div`
  margin: 0 5px;
  font-size: 16px;
  font-weight: normal;
`

const formats = {
  timeGutterFormat: 'HH:mm',
  eventTimeRangeFormat: (event, culture, local) => 
    `${local.format(event.start, 'HH:mm', culture)}-${local.format(event.end, 'HH:mm', culture)}`,
  dayFormat: 'DD ddd',
  agendaTimeRangeFormat: ({ start, end }, culture, local) =>
    `${local.format(start, 'HH:mm', culture)}-${local.format(end, 'HH:mm', culture)}`,
  agendaDateFormat: 'DD ddd',
}

class Reservation extends Component {
  state = {
    currentView: 'month',
    currentDisplayDate: new Date(),
    eventList: []
  }

  componentDidMount() {
    setInterval(() => this.forceUpdate(), 1000)

    let id = 0
    for (let i = 0; i < 1600; i++) {
      // const now = Date.now() + (id * 1800000)
      const now = Number(moment().startOf('month').format('x')) + (id * 1800000)
      const nowMoment = moment(now)
      const endMoment = moment(now + 1800000)
      if (nowMoment.hours() > 9 && nowMoment.hours() < 21 && endMoment.hours() < 21) {
        this.setState(prevState => ({
          eventList: [...prevState.eventList, {
              id: `test-${i}`,
              title: `test-${i}`,
              start: new Date(now),
              end: new Date(now + 1800000)
            }]
        }))
      } else id += 2
      id++
    }
    
    // mock
    // let id = 0
    // setInterval(() => {
    //   const now = Date.now() + (id * 1800000)
    //   const nowMoment = moment(now)
    //   const endMoment = moment(now + 1800000)
    //   if (nowMoment.hours() > 11 && nowMoment.hours() < 19 && endMoment.hours() < 19) {
    //     this.handleSetupData({
    //       data: { id, name: `test ${id}`, creator: 'xxx', start: now, end: now + 1800000 },
    //       method: 'create'
    //     })
    //   } else id += 2
    //   id++
    // }, 1000)
    // end mock
  }

  view = event => {
    this.setState({ currentView: event}, () => {
      console.log('events', this.state.eventList.length);
      // this.getEventList()
    })
    
  }
  onNavigate = event => {
    this.setState({ currentDisplayDate: event}, () => {
      // this.getEventList()
    })
  }

  logProfile = (id, phase, actualTime, baseTime) => {
    console.log('id', id);
    console.log('phase', phase);
    // console.log('actualTime', actualTime);
    console.log('time', baseTime);
    console.log('==========================');
  }

  showMoreEventInMonthView = (allEvents, date) => {
    
  }

  render() {
    const { eventList, currentView } = this.state
    const localizer = BigCalendar.momentLocalizer(moment)

    // ================== Todo: may need more review ==================
    const timeLabels = document.getElementsByClassName('rbc-label')
    const daySlot = document.getElementsByClassName('rbc-day-slot')
    const slotWidth = daySlot.length > 0 && daySlot[0].offsetWidth

    const currentMoment = moment()
    const currentHour = currentMoment.hours()
    const currentMinute = currentMoment.minutes()
    const index = currentHour - startTime.hour + 1

    if (currentMinute < 15 && timeLabels && timeLabels[index]) {
      timeLabels[index].style.color = '#fff'      
    } else if (currentMinute > 45 && timeLabels && timeLabels[index] && timeLabels[index + 1]) {
      timeLabels[index + 1].style.color = '#fff'
    } else if (timeLabels && _.isArray(timeLabels)) timeLabels.forEach(label => label.style.color = '#000')

    let nowIsInRange = true
    if (currentHour < startTime.hour) nowIsInRange = false
    if (currentHour > endTime.hour) nowIsInRange = false
    if (currentHour === endTime.hour && currentMinute !== 0) nowIsInRange = false
    // ================== Todo: may need more review ==================

    return (
      // <Profiler id="some identifier" onRender={this.logProfile}>
      <StyledLayout>
        <StyledCalendarContainer>
          <StyledTitle>
            Reservations
          </StyledTitle>
          <StyledBigCalendar
            isshowcurrenttime={nowIsInRange.toString()}
            slotwidth={slotWidth}
            currenttime={currentMoment.format('HH:mm')}
            currentview={'week'}
            currentday={currentMoment.days()}
            localizer={localizer}
            events={eventList}
            onShowMore={this.showMoreEventInMonthView}
            defaultDate={new Date()}
            defaultView={currentView}
            views={['month', 'week', 'day']}
            onView={this.view}
            eventPropGetter={this.getEventColor}
            // onSelectSlot={this.mockData}
            // onSelectEvent={this.mockUpdateData}
            // selectable={false}
            onNavigate={this.onNavigate}
            min={new Date(2019, 1, 1, startTime.hour, startTime.minute, 0)}
            max={new Date(2019, 12, 31, endTime.hour, endTime.minute, 0)}
            formats={formats}
          />
        </StyledCalendarContainer>
      </StyledLayout>
      // </Profiler>
    )
  }
}

export default Reservation
