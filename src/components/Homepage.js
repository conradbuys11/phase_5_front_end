import React, {useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Header from './Header'
import CreateNewEvent from './CreateNewEvent'
import { Container } from 'semantic-ui-react'
// import { Dropdown, Menu, Input, Form, Accordion } from 'semantic-ui-react'

const InlineStyle = () => (
    //https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/GridLayout.js
    <style>
      {`
      .grid {
        position: relative;
      }
      .grid:before {
        background-color: #F0F0F0;
        box-shadow: 0px 0px 0px 1px #DDDDDD inset;
        content: '';
        height: calc(100% - 2rem);
        left: 1rem;
        top: 1rem;
        position: absolute;
        width: calc(100% - 2rem);
       }
      .ui.divided.grid:before, .celled.grid:before {
        display: none;
      }
      .ui.aligned .column:after {
        display: none !important;
      }
      .grid .column:not(.row):not(.grid):after {
        background-color: rgba(86, 61, 124, .15);
        box-shadow: 0px 0px 0px 1px rgba(86, 61, 124, 0.2) inset;
        content: '';
        display: block;
        min-height: 50px;
      }
      @media only screen and (max-width: 768px) {
        .stackable.grid:before {
          width: 100%;
          left: 0em;
        }
      }
    `}
    </style>
  )

const HomePage = props => {

    //const [user, setUser] = useState(undefined) ????
    const [events, setEvents] = useState([
        {title: 'test event', start: '2020-11-18T10:45:00', end: '2020-11-18T13:00:00'}
    ])

    useEffect(() => {

      fetch('http://localhost:3001/events_and_to_dos')
      .then(rsp => rsp.json())
      .then(parseEventsFromBackEnd)
      .catch()
    }, [])

    const parseEventsFromBackEnd = _events => {
      let myEvents = _events.map(event => {
        if(event.urgency == null){
          return {
            id: event.id,
            title: event.title,
            start: event.date
          }
        }
        else{
          return{
            title: event.title,
            allDay: true,
            backgroundColor: parseUrgency(event.urgency),
            textColor: 'black',
            classNames: ['toDo'],
            start: new Date((Date.now())).toISOString()
          }
        }
      })
      setEvents(events.concat(myEvents))
    }

    // const parseToDosFromBackEnd = toDos => {
    //   let myToDos = toDos.map(toDo => {
    //     return{
    //       title: toDo.title,
    //       allDay: true,
    //       backgroundColor: parseUrgency(toDo.urgency),
    //       textColor: 'black',
    //       classNames: ['toDo'],
    //       start: new Date((Date.now())).toISOString()
    //     }
    //   })
    //   setEvents(events.concat(myToDos))
    // }

    const makeNewEvent = event => {
      let parsedEvent = {
        title: event.title,
        start: event.date
      }
      setEvents([...events, parsedEvent])
      fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: parsedEvent.title, date: parsedEvent.start, calendar_id: 1
        })
      }).then(resp => resp.json())
      .then()
        // setEvents([...events, event])
    }

    const makeNewToDo = todo => {
      let parsedToDo = {
        title: todo.title,
        //display: 'background',
        allDay: true,
        backgroundColor: parseUrgency(todo.urgency),
        textColor: 'black',
        classNames: ['toDo'],
        start: new Date((Date.now())).toISOString()
      }
      setEvents([...events, parsedToDo])
      fetch('http://localhost:3001/to_dos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: parsedToDo.title, urgency: todo.urgency, calendar_id: 1
        })
      }).then(resp => resp.json())
      .then()
    }

    const parseUrgency = urgency => {
      switch(urgency){
        case 'High':
          return 'red'
        case 'Medium':
          return 'yellow'
        case 'Low':
          return 'green'
        default:
          return 'white'
      }
    }

    return(
        <div className='hehe-conrad'>
            <InlineStyle />
            <Container text>
                <Header />
                <CreateNewEvent makeNewEvent={makeNewEvent} makeNewToDo={makeNewToDo}/>
            </Container>
            <Container>
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    events={events}
                />
            </Container>
        </div>
    )
}

export default HomePage