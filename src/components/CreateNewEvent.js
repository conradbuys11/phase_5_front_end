import React, {useEffect, useState} from 'react'
import { Button, Form, Accordion } from 'semantic-ui-react'

const CreateNewEvent = props => {

    const [activeIndex, setActiveIndex] = useState(-1)
    const [newEvent, setNewEvent] = useState({})
    const [eventSubmit, setEventSubmit] = useState('disabled')
    const [newToDo, setNewToDo] = useState({})
    const [toDoSubmit, setToDoSubmit] = useState('disabled')

    const handleClick = (e, titleProps) => {
        e.preventDefault()
        //nani??
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index
    
        setActiveIndex(newIndex)
    }

    const customTruthy = field => {
        return field == undefined || field == ''
    }

    useEffect(() => {
        //if newevent has a name & a date
        if(!customTruthy(newEvent.title) && !customTruthy(newEvent.date) && eventSubmit !== ''){
            setEventSubmit('')
        }
        else if((customTruthy(newEvent.title) || customTruthy(newEvent.date)) && eventSubmit !== 'disabled'){
            setEventSubmit('disabled')
        }
    },[newEvent])

    useEffect(() => {
        if(!customTruthy(newToDo.title) && !customTruthy(newToDo.urgency) && toDoSubmit !== ''){
            setToDoSubmit('')
        }
        else if((customTruthy(newToDo.title) || customTruthy(newToDo.urgency)) && toDoSubmit !== 'disabled'){
            setToDoSubmit('disabled')
        }
    },[newToDo])

    const handleChange = e => {
        switch(activeIndex){
            case 0:
                //console.log(e)
                if(e.target.attributes.type.value === 'text'){
                    setNewEvent({...newEvent, title: e.target.value})
                }
                else if(e.target.attributes.type.value === 'datetime-local'){
                    setNewEvent({...newEvent, date: e.target.value})
                    //console.log('woohoo!')
                }
                break;
            case 1:
                console.log(e)
                if(e.type === 'change'){
                    setNewToDo({...newToDo, title: e.target.value})
                }
                else if(e.type === 'click'){
                    setNewToDo({...newToDo, urgency: e.target.innerText})
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e, type) => {
        e.preventDefault()
        switch(type){
            case 'event':
                props.makeNewEvent(newEvent)
                break;
            case 'todo':
                props.makeNewToDo(newToDo)
                break;
            default:
                console.log('submitting event/todo failed')
                break;
        }
    }

    const urgencyOptions = [
        {key: 'Low', text: 'Low', value: 'low'},
        {key: 'Medium', text: 'Medium', value: 'medium'},
        {key: 'High', text: 'High', value: 'high'}
    ]

    return(
        <Accordion>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
                Create New Event
            </Accordion.Title>
            
            <Accordion.Content active={activeIndex === 0}>
                <Form>
                    <Form.Input label='Name' placeholder='My New Event' onChange={handleChange}/>
                    <Form.Field label='Date' control='input' type='datetime-local' onChange={handleChange}/>
                    <Button type='submit' className={eventSubmit} onClick={e => handleSubmit(e, 'event')}>Submit</Button>
                </Form>
            </Accordion.Content>

            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
                Create New To-Do
            </Accordion.Title>
            
            <Accordion.Content active={activeIndex === 1}>
                <Form>
                    <Form.Input label='Name' placeholder='My New To-Do' onChange={handleChange}/>
                    <Form.Select label='Urgency' options={urgencyOptions} placeholder='Urgency' onChange={handleChange}/>
                    <Button type='submit' className={toDoSubmit} onClick={e => handleSubmit(e, 'todo')}>Submit</Button>
                </Form>
            </Accordion.Content>
        </Accordion>
    )
}

export default CreateNewEvent