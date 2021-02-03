import React, {useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import EasyHeader from './EasyHeader'
import CreateNewEvent from './CreateNewEvent'
import EditEvent from './EditEvent'
import { Container, Grid, Divider } from 'semantic-ui-react'
import ToDoList from './ToDoList'
import UpcomingEventList from './UpcomingEventList'
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
    const [events, setEvents] = useState([])
    const [editingEvent, setEditing] = useState(null)

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
            start: event.date.replace('Z',''),
            classNames: ['event']
          }
        }
        else if(!event.is_completed){
            return {
              id: event.id,
              title: event.title,
              allDay: true,
              backgroundColor: parseUrgency(event.urgency),
              textColor: 'black',
              classNames: ['toDo'],
              start: new Date((Date.now())).toISOString()
            }
        }
        else{
          return null
        }
      })
      setEvents(events.concat(myEvents.filter(element => element !== null)))
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
      // let parsedEvent = {
      //   title: event.title,
      //   start: event.date,
      //   classNames: ['event']
      // }
      // setEvents([...events, parsedEvent])
      fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: event.title, date: event.date, calendar_id: 1
        })
      }).then(resp => resp.json())
      .then(data => {
        console.log(data)
        let parsedEvent = {
          id: data.id,
          title: event.title,
          start: event.date,
          classNames: ['event']
        }
        setEvents([...events, parsedEvent])
      })
        // setEvents([...events, event])
    }

    const cancel = () => {
      setEditing(null)
      listOfEventsSorted()
    }

    const makeNewToDo = todo => {
      // let parsedToDo = {
      //   title: todo.title,
      //   //display: 'background',
      //   allDay: true,
      //   backgroundColor: parseUrgency(todo.urgency),
      //   textColor: 'black',
      //   classNames: ['toDo'],
      //   start: new Date((Date.now())).toISOString()
      // }
      // setEvents([...events, parsedToDo])
      fetch('http://localhost:3001/to_dos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: todo.title, urgency: todo.urgency, calendar_id: 1
        })
      }).then(resp => resp.json())
      .then(data => {
        console.log(data)
        let parsedToDo = {
          id: data.id,
          title: todo.title,
          //display: 'background',
          allDay: true,
          backgroundColor: parseUrgency(todo.urgency),
          textColor: 'black',
          classNames: ['toDo'],
          start: new Date((Date.now())).toISOString()
        }
        setEvents([...events, parsedToDo])
      })
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

    const getAllToDos = () => {
      // console.log(events)
      // console.log(events.length > 0)
      if(events.length > 0){
        // console.log(events[0].classNames)
        let toDos = events.filter(event => event.classNames.includes("toDo"))
        return toDos
      }
      else{
        return []
      }
    }

    const getAllEvents = () => {
      if(events.length > 0){
        let _events = events.filter(event => event.classNames.includes("event"))
        return _events
      }
      else{
        return []
      }
    }

    const completeToDo = index => {
      fetch(`http://localhost:3001/to_dos/${index}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_completed: true
        })
      }).then(resp => resp.json())
      .then(setEvents(events.filter(event => !(event.id === index && event.classNames.find(name => name === 'toDo')))))
    }

    const eventEditPopup = event => {
      
      let _event
      event.classNames.includes("event") ? _event = events.find(element => element.id == event._def.publicId && element.classNames.includes("event")) : _event = events.find(element => element.id == event._def.publicId && element.classNames.includes("toDo"))
      setEditing(null)
      setEditing(_event)
    }

    const editEventOrToDo = (event, isToDo) => {
      let newEvents = events.map(element => {
        if(element.id !== event.id){
          return element
        }
        else{
          if(isToDo && element.classNames.includes("toDo")){ //if the thing we're replacing is a to-do, and the element we're looking at is a to-do, then replace it
            return event
          }
          else if(!isToDo && element.classNames.includes("event")){ //if the thing we're replacing is an event, and the element we're looking at is an event, then replace it
            return event
          }
          else{
            return element
          }
        }
      })
      setEvents(newEvents)
      setEditing(null)
    }

    const deleteEventOrToDo = (event, isToDo) => {
      let newEvents
      if(isToDo){
        newEvents = events.filter(element => !(event.id == element.id && element.classNames.includes("toDo")))
      }
      else{
        newEvents = events.filter(element => !(event.id == element.id && element.classNames.includes("event")))
      }
      setEvents(newEvents)
      setEditing(null)
    }

    const listOfEventsSorted = () => {
      let datesQuestionMark = events.filter(event => event.classNames.includes("event"))
      // console.log(Date.now())
      // console.log(Date.parse(new Date(datesQuestionMark[0].start)) - Date.now())
      // for(let i = 0; i < datesQuestionMark.length; i++){
      //   console.log(datesQuestionMark[i].start)
      // }
      datesQuestionMark.sort((a, b) => Date.parse(new Date(a.start)) - Date.parse(new Date(b.start)))
      datesQuestionMark = datesQuestionMark.filter(element => Date.parse(new Date(element.start)) - Date.now() > 0)
      console.log(datesQuestionMark)
      return datesQuestionMark
    }

    return(
        <div className='hehe-conrad'>
            {/* <InlineStyle /> */}
            <EasyHeader />
            <Divider />
            { editingEvent !== null ? <EditEvent event={editingEvent} editEvent={editEventOrToDo} deleteEvent={deleteEventOrToDo} cancel={cancel} /> : null}
            <Container>
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    events={events}
                    height={500}
                    eventClick={info => {eventEditPopup(info.event)}}
                />
            </Container>
            <div style={{marginTop:'5%'}}>
                <Grid columns={3} divided>
                  <Grid.Column>
                    {events !== [] ? <ToDoList toDos={getAllToDos()} completeToDo={completeToDo}/> : 'loading...'}
                  </Grid.Column>
                  <Grid.Column>
                    <CreateNewEvent makeNewEvent={makeNewEvent} makeNewToDo={makeNewToDo}/>
                  </Grid.Column>
                  <Grid.Column>
                    {events !== [] ? <UpcomingEventList events={listOfEventsSorted()} /> : 'loading...'}
                  </Grid.Column>
                </Grid>
            </div>
        </div>
    )
}

export default HomePage