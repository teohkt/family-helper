import React from 'react'
import { Icon, Item } from 'semantic-ui-react'

function List({ id, title, description, createdAt, dispatch }) {
  return (
    <Item>
      <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png'></Item.Image>
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Description>{description}</Item.Description>
        <Item.Extra>
          {new Date(createdAt).toDateString()}
          <Icon name="trash" className="ml-3" onClick={() => dispatch({ type: 'DELETE_LIST', value: id })}/>  
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default List
