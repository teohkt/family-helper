import './App.css';
import {useEffect, useReducer} from "react";
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import awsConfig from './aws-exports';
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import {listLists} from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeader from './components/headers/MainHeader';
import Lists from './components/Lists/Lists';
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react';
import { createList } from './graphql/mutations';
import { onCreateList } from './graphql/subscriptions'
Amplify.configure(awsConfig);

const initialState = {
  title: '',
  description: '',
  lists: [],
  isModalOpen: false
}
let listReducer = (state = initialState, action) => {
  switch(action.type){
    case 'DESCRIPTION_CHANGED':
      return {...state, description: action.value}
    case 'TITLE_CHANGED':
      return {...state, title: action.value}
    case 'UPDATE_LISTS':
      return {...state, lists: [...action.value, ...state.lists]}
    case 'MODAL_OPEN':
      return {...state, isModalOpen: true}
    case 'MODAL_CLOSE':
      return {...state, isModalOpen: false, title: '', description: ''}
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(listReducer, initialState)

  async function fetchList(){
    const {data} = await API.graphql(graphqlOperation(listLists));
    dispatch({ type: 'UPDATE_LISTS', value: data.listLists.items })
  }

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(()=>{
    let subscription = API
      .graphql(graphqlOperation(onCreateList))
      .subscribe({
        next: ({provider, value}) => {
          dispatch({type: 'UPDATE_LISTS', value: [value.data.onCreateList]})
        },
        error: error => console.warn(error)
      })
    return () => subscription.unsubscribe()
  }, [])

  async function saveList() {
    const { title, description } = state;
    await API.graphql(graphqlOperation(createList, {input: {title, description}}));
    dispatch({type: 'MODAL_CLOSE'});
  }

  return (
    <AmplifyAuthenticator>
    <AmplifySignOut />
    <Button className="floatingButton" onClick={() => dispatch({type: 'MODAL_OPEN'})}>
      <Icon name="plus" className="floatingButton_icon"/>
    </Button>
    <Container>
      <div className="App">
        <MainHeader />
        <Lists lists={state.lists} />
      </div>
    </Container>
    <Modal open={state.isModalOpen} dimmer="inverted">
      <Modal.Header>Create your list</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input label="Title" placeholder="My Story" value={state.title} onChange={e => dispatch({type: 'TITLE_CHANGED', value: e.target.value})} error={true ? false : { content: "Please add a name to your list"}}></Form.Input>
          <Form.TextArea label="Description" placeholder="The Recording" value={state.description} onChange={e => dispatch({type: 'DESCRIPTION_CHANGED', value: e.target.value})}></Form.TextArea>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => dispatch({type: 'MODAL_CLOSE'})}>Cancel</Button>
        <Button positive onClick={saveList}>Save</Button>
      </Modal.Actions>
    </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
