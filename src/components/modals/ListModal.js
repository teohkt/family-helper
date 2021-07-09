import React, { useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { Button, Form, Modal } from 'semantic-ui-react'
import { createList, updateList } from '../../graphql/mutations'
import UploadImage from '../HandleImages/UploadImage'
import { useS3 } from '../../hooks/useS3'

function ListModal({ state, dispatch }) {
  const [saveToS3] = useS3()
  const [fileToUpload, setFileToUpload] = useState()

  async function saveList() {
    const imageKey = saveToS3(fileToUpload)
    console.log('imagekey: ', imageKey)
    const { title, description } = state
    await API.graphql(graphqlOperation(createList, { input: { title, description, imageKey } }))
    dispatch({ type: 'MODAL_CLOSE' })
  }
  async function editList() {
    const { id, title, description } = state
    await API.graphql(graphqlOperation(updateList, { input: { id, title, description } }))
    dispatch({ type: 'MODAL_CLOSE' })
  }

  function getSelectedFile(fileName) {
    setFileToUpload(fileName)
  }

  return (
    <Modal open={state.isModalOpen} dimmer='inverted'>
      <Modal.Header>{state.modalType === 'add' ? 'Create list' : 'Edit List'}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label='Title'
            placeholder='My Story'
            value={state.title}
            onChange={(e) => dispatch({ type: 'TITLE_CHANGED', value: e.target.value })}
            error={true ? false : { content: 'Please add a name to your list' }}
          ></Form.Input>
          <Form.TextArea
            label='Description'
            placeholder='The Recording'
            value={state.description}
            onChange={(e) => dispatch({ type: 'DESCRIPTION_CHANGED', value: e.target.value })}
          ></Form.TextArea>
          <UploadImage getSelectedFile={getSelectedFile}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => dispatch({ type: 'MODAL_CLOSE' })}>
          Cancel
        </Button>
        <Button positive onClick={state.modalType === 'add' ? saveList : editList}>
          {state.modalType === 'add' ? 'Save' : 'Update'}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ListModal
