import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import List from './List'
import Main from './Main'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact><Main /></Route>
        <Route path="/list/:slug" render={(props)=>{return <List {...props} />}} />
      </Switch>
    </BrowserRouter>
  )
}

export default App