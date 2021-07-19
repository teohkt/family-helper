import './App.css'
import { useEffect, useReducer } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import awsConfig from './aws-exports'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { listLists } from './graphql/queries'
import 'semantic-ui-css/semantic.min.css'
import { Button, Container, Icon } from 'semantic-ui-react'
import { deleteList } from './graphql/mutations'
import { onCreateList, onDeleteList, onUpdateList } from './graphql/subscriptions'

import MainHeader from './components/headers/MainHeader'
import ListModal from './components/modals/ListModal'
import Lists from './components/Lists/Lists'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ListItems from './ListItems'

Amplify.configure(awsConfig)

const initialState = {
  id: '',
  title: '',
  description: '',
  lists: [],
  isModalOpen: false,
  modalType: ''
}
let listReducer = (state = initialState, action) => {
  let newList
  switch (action.type) {
    case 'DESCRIPTION_CHANGED':
      return { ...state, description: action.value }
    case 'TITLE_CHANGED':
      return { ...state, title: action.value }
    case 'UPDATE_LISTS':
      return { ...state, lists: [...action.value, ...state.lists] }
    case 'MODAL_OPEN':
      return { ...state, isModalOpen: true, modalType: 'add'}
    case 'MODAL_CLOSE':
      return { ...state, isModalOpen: false, title: '', description: '', id:'' }
    case 'DELETE_LIST':
      deleteListById(action.value)
      return { ...state }
    case 'DELETE_LIST_RESULT':
      newList = state.lists.filter((item) => item.id !== action.value)
      return { ...state, lists: newList }
    case 'EDIT_LIST': {
      const newValue = {...action.value}
      delete newValue.children
      delete newValue.listItems
      delete newValue.dispatch
      return {...state, isModalOpen: true, modalType: 'edit', id:newValue.id, title:newValue.title, description: newValue.description}
    }
    case 'UPDATE_LIST_RESULT':
      const index = state.lists.findIndex(item => item.id === action.value.id)
      newList = [...state.lists]
      delete action.value.listItems
      newList[index] = action.value
      return { ...state, lists: newList }
    default:
      console.log('Default action for: ', action)
      return state
  }
}

async function deleteListById(id) {
  const result = await API.graphql(graphqlOperation(deleteList, { input: { id } }))
  console.log('deleted', result)
}

function Main() {
  const [state, dispatch] = useReducer(listReducer, initialState)

  async function fetchList() {
    const { data } = await API.graphql(graphqlOperation(listLists))
    dispatch({ type: 'UPDATE_LISTS', value: data.listLists.items })
  }

  useEffect(() => {
    fetchList()
  }, [])

  useEffect(() => {
    const createListSub = API.graphql(graphqlOperation(onCreateList)).subscribe({
      next: ({ _, value }) => {
        dispatch({ type: 'UPDATE_LISTS', value: [value.data.onCreateList] })
      },
      error: (error) => console.warn(error),
    })
    const deleteListSub = API.graphql(graphqlOperation(onDeleteList)).subscribe({
      next: ({ _, value }) => {
        dispatch({ type: 'DELETE_LIST_RESULT', value: value.data.onDeleteList.id })
      },
      error: (error) => console.warn(error),
    })
    const updateListSub = API.graphql(graphqlOperation(onUpdateList)).subscribe({
      next: ({ _, value }) => {
        dispatch({ type: 'UPDATE_LIST_RESULT', value: value.data.onUpdateList })
      },
      error: (error) => console.warn(error),
    })
    return () => {
      createListSub.unsubscribe()
      deleteListSub.unsubscribe()
      updateListSub.unsubscribe()
    }
  }, [])

  return (
    <AmplifyAuthenticator>
      <AmplifySignOut />
      <Button className='floatingButton' onClick={() => dispatch({ type: 'MODAL_OPEN' })}>
        <Icon name='plus' className='floatingButton_icon' />
      </Button>
      <Container>
        <div className='App'>
          <MainHeader />

          <BrowserRouter>
            <Switch>
              <Route path="/" exact><Lists lists={state.lists} dispatch={dispatch} /></Route>
              <Route path="/list/:slug" render={(props)=>{return <ListItems {...state.lists.filter(i => i.slug === props.match.params.slug)[0]} />}} />
            </Switch>
          </BrowserRouter>



        </div>
      </Container>
      <ListModal state={state} dispatch={dispatch}/>
    </AmplifyAuthenticator>
  )
}

export default Main
