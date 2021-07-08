import Storage from '@aws-amplify/storage'
import React, {useRef, useState, useEffect} from 'react'
import { Button, Header, Image } from 'semantic-ui-react'

const UploadImage = () => {
  const inputRef = useRef()
  const [image, setImage] = useState('https://react.semantic-ui.com/images/wireframe/image.png')
  const [fileName, setFileName] = useState()

  useEffect(()=>{
    if(!fileName) return
    const [file, extension] = fileName.name.split(".")
    const mimeType = fileName.type
    const key = `images/lists/${file}.${extension}`
    const result = Storage.put(key, fileName, {
      contentType: mimeType,
      metadata:{
        app: 'family helper',
      }
    })
    console.log("result: ", result)
  }, [fileName])

  function handleInput(e){
    const fileToUpload = e.target.files[0]
    if (!fileToUpload) return
    const fileSampleUrl = URL.createObjectURL(fileToUpload)
    setImage(fileSampleUrl)
    setFileName(fileToUpload)
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
