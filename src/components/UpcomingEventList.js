import React, {useState} from 'react'
import {Divider, Container, Header, List} from 'semantic-ui-react'

const UpcomingEventList = props => {

    const [howMany, setHowMany] = useState(3)

    const listRender = index => {
        return(
            <List.Item>{props.events[index].title}</List.Item>
        )
    }

    const eventList = () => {
        let events = []
        for(let i = 0; i < howMany; i++){
            if(props.events[i]){
                events.push(listRender(i))
            }
        }
        return(
            <List>
                {events.map(event => event)}
            </List>
        )
    }

    return(
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
            <Divider horizontal>
                <Header>Upcoming Events</Header>
            </Divider>
            { eventList() }
            {/* insert completion button here */}
            {/* <List>
                { props.events[0] ? listRender(0) : null } 
                { props.events[1] ? listRender(1) : null }
                { props.events[2] ? listRender(2) : null }
            </List> */}
        </div>

    )

}

export default UpcomingEventList