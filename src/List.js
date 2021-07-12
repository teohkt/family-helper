import React from 'react'
import ListHeader from './components/headers/ListHeader'

function List(props) {
  console.log("props received by List.js: ", props)
  return (
    <>
      <ListHeader />
    </>
  )
}

export default List
