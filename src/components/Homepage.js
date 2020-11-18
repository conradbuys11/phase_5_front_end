import React, {useState} from 'react'
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

    const makeNewEvent = event => {
        setEvents([...events, event])
    }

    return(
        <div className='hehe-conrad'>
            <InlineStyle />
            <Container text>
                <Header />
                <CreateNewEvent makeNewEvent={makeNewEvent}/>
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