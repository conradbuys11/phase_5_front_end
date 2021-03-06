import React, {useState, useContext, useEffect} from 'react'
import ButtonHomepage from './ButtonHomepage'
import ButtonUserIcon from './ButtonUserIcon'
import { Header } from 'semantic-ui-react'
// import { MyContext } from '../App'

const EasyHeader = props => {
    // const user = useContext(MyContext)
    const [user, setUser] = useState({})

    useEffect(() => {
        fetch('http://localhost:3001/users/1')
        .then(rsp => rsp.json())
        .then(usr => setUser(usr))
    }, [])


    return(
        // <div>
        //     User's name: {user.full_name}
        //     <ButtonHomepage />
        //     <ButtonUserIcon />
        // </div>
        <Header as='h1' textAlign='center' content='Easy Schedule' style={{paddingTop: '20px'}}/>
    )
}

export default EasyHeader