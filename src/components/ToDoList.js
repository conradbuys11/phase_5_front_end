import React, {useState} from 'react'
import {Divider, Container, Header, List, Button} from 'semantic-ui-react'

const ToDoList = props => {

    const [howMany, setHowMany] = useState(3)

    const listRender = index => {
        return(
            <List.Item>
                <List.Content verticalAlign='middle'>{props.toDos[index].title} <Button onClick={() => props.completeToDo(props.toDos[index].id)} color='green'>✅</Button></List.Content>
            </List.Item>
        )
    }

    const toDoList = () => {
        let toDos = []
        for(let i = 0; i < howMany; i++){
            if(props.toDos[i]){
                toDos.push(listRender(i))
            }
        }
        // console.log(toDos)
        return(
            <List>
                { toDos.map(toDo => toDo) }
            </List>
        )
    }

    return(
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
            <Divider horizontal>
                <Header>To-Do</Header>
            </Divider>
            {/* insert completion button here */}
            { toDoList() }
            {/* <List>
                { props.toDos[0] ? listRender(0) : null } 
                { props.toDos[1] ? listRender(1) : null }
                { props.toDos[2] ? listRender(2) : null }
            </List> */}
        </div>

    )

}

export default ToDoList