import React, {useRef, useState, useEffect} from 'react'
import { Button, Header, Image } from 'semantic-ui-react'

const UploadImage = ({ getSelectedFile }) => {
  const inputRef = useRef()
  const [image, setImage] = useState('https://react.semantic-ui.com/images/wireframe/image.png')
  
  function handleInput(e){
    const fileToUpload = e.target.files[0]
    if (!fileToUpload) return
    const fileSampleUrl = URL.createObjectURL(fileToUpload)
    setImage(fileSampleUrl)
    getSelectedFile(fileToUpload)
  } 


  return (
    <>
    <Header as="h4">Upload your image</Header>
      <Image src={image} size="large"/>
      <input ref={inputRef} type='file' onChange={handleInput} className='hide' />
      <Button onClick={()=> inputRef.current.click()} className='mt-1'>Upload Image</Button>
    </>

  )
}

export default UploadImage
