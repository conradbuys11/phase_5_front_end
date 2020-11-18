import './App.css';
import React, {useEffect, useState} from 'react';
import HomePage from './components/Homepage';
import 'semantic-ui-css/semantic.min.css'

const MyContext = React.createContext({farts: 3})

const App = () => {
  // useEffect(() => {
  //   fetch('http://localhost:3001/users/1')
  //   .then(rsp => rsp.json())
  //   .then(user => MyContext.user = user)
  // },[])

  return (
    <div className="App">
      <MyContext.Provider>
        <HomePage />
      </MyContext.Provider>
    </div>
  );
}

export default App;
