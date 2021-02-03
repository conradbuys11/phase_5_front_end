import React, {useEffect, useState} from 'react'
import { Button, Form, Accordion } from 'semantic-ui-react'

const EditEvent = props => {
    /*
    / props.event has all the info
    */
   const [event, setEvent] = useState(props.event)

    const eventForm = () => {
        return(
        <Form>
            { nameForm() }
            <Form.Field required label='Date' control='input' type='datetime-local' value={event.start.replace('Z','')} onChange={handleChange}/>
            {submitButton()}
            {deleteButton()}
            {cancelButton()}
        </Form>
        )

    }

    const toDoForm = () => {
        return(
        <Form>
            { nameForm() }
            <Form.Select required label='Urgency' options={urgencyOptions} placeholder='Urgency' value={checkUrgency()} onChange={handleChange}/>
            {submitButton()}
            {deleteButton()}
            {cancelButton()}
        </Form>
        )

    }

    const nameForm = () => {
        return(
        <Form.Input required label='Name' placeholder={props.event.title} value={event.title} onChange={handleChange}/>
        )
    }

    const submitButton = () => {
        return(
        <Button color='green' type='submit' onClick={e => handleSubmit(e)}>Submit</Button>
        )
    }

    const deleteButton = () => {
        return(
            <Button color='red' onClick={e => handleDelete(e)}>Delete</Button>
        )
    }

    const cancelButton = () => {
        return(
            <Button color='grey' onClick={e => props.cancel()}>Cancel</Button>
        )
    }

    const urgencyOptions = [
        {key: 'Low', text: 'Low', value: 'Low'},
        {key: 'Medium', text: 'Medium', value: 'Medium'},
        {key: 'High', text: 'High', value: 'High'}
    ]

    const checkUrgency = () => {
        switch(event.backgroundColor){
            case 'yellow':
                return 'Medium'
            case 'red':
                return 'High'
            case 'green':
                return 'Low'
        }
    }

    const reverseCheckUrgency = value => {
        switch(value){
            case 'Low':
                return 'green'
            case 'Medium':
                return 'yellow'
            case 'High':
                return 'red'
        }
    }

    const handleChange = e => {
        if(e.type === 'click'){
            setEvent({...event, backgroundColor: reverseCheckUrgency(e.target.innerText)})
        }
        else if(e.target.attributes.type.value === 'text'){
            setEvent({...event, title: e.target.value})
        }
        else if(e.target.attributes.type.value === 'datetime-local'){
            setEvent({...event, start: e.target.value})
            //console.log('woohoo!')
        }
    }

    const handleDelete = e => {
        let isToDo = event.classNames.includes("event") ? false : true
        let url = !isToDo ? `http://localhost:3001/events/${event.id}` : `http://localhost:3001/to_dos/${event.id}`
        fetch(url, {
            method: 'DELETE'
          }).then(resp => resp.json())
          .then(() => {
            props.deleteEvent(event, isToDo)
        })
    }

    const handleSubmit = e => {
        let isToDo = event.classNames.includes("event") ? false : true
        let _event = {title: event.title}
        if(isToDo){
            _event.urgency = checkUrgency()
        }
        else{
            _event.date = event.start
        }
        let url = !isToDo ? `http://localhost:3001/events/${event.id}` : `http://localhost:3001/to_dos/${event.id}`
        fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(_event)
          }).then(resp => resp.json())
          .then(() => props.editEvent(event, isToDo))
    }

    return(
        <div style={{marginLeft: '15%', marginRight: '15%'}}>
            {event.classNames.includes("event") ? eventForm() : toDoForm()}
        </div>
    )
}

export default EditEvent