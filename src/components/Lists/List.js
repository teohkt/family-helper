import Storage from '@aws-amplify/storage'
import React, { useEffect, useState } from 'react'
import { Dimmer, Icon, Image, Item, Loader } from 'semantic-ui-react'

function List(props) {
  const { id, title, description, imageKey, createdAt, dispatch } = props
  const [imageUrl, setImageUrl] = useState('https://react.semantic-ui.com/images/wireframe/image.png')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchImageUrl(){
      const imgUrl = await Storage.get(imageKey)
      setImageUrl(imgUrl)
      setIsLoading(false)
    }

    if(imageKey){
      return fetchImageUrl()
    } 
    setIsLoading(false)
  }, [imageKey])

  const content = <Loader />

  return (
    <Item>
      <Dimmer.Dimmable dimmed={isLoading} dimmer={{ active:isLoading, content}} as={Image} size="tiny" src={imageUrl} />
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Description>{description}</Item.Description>
        <Item.Extra>
          {new Date(createdAt).toDateString()}
          <Icon name="edit" className="ml-3" onClick={() => dispatch({ type: 'EDIT_LIST', value: props })}/> 
          <Icon name="trash" onClick={() => dispatch({ type: 'DELETE_LIST', value: id })}/> 
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default List
