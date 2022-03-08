import React, {useState, useEffect} from "react"
import { Button, Stack, TextField } from "@mui/material"
import axios from 'axios'

const CreateFlashcard = ({ userId, deckId }) => {
  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const initialValues = {frontImage: "", frontText: "", backImage: "", backText: ""}
  const [formValue, setFormValue] = useState({initialValues 
  })
  const[formErrors, setFormErrors] = useState({})
  const[isSubmit, setIsSubmit] = useState(false)
  
const validate = (values) => {
  const errors = {}
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

  if(!values.frontImage){
  errors.frontImage = "front Image is requred"
} else if (!re.test(values.frontImage)){
  errors.frontImage = "This is not a valid Image formmat"
}

if(!values.frontText){
  errors.frontText= "front Image is requred"
}

if(!values.backImage){
  errors.backImage = "front Image is requred"
} else if (!re.test(values.backImage)){
  errors.backImage = "This is not a valid Image formmat"
}

if(!values.backText){
  errors.backText = "front Image is requred"
}
return errors;
}

  const handleChange = (event) => {
    event.preventDefault()
    console.log("[CreateFlashcard] onChange ", event)
   const {name, value } = event.target
   setFormValue({ ...formValue, [name]: value})
   console.log(formValue)
  }

  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    setFormErrors(validate(formValue))
    setIsSubmit(true)
    try {
      const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
      //<pre>{JSON.stringify(formValue, undefined, 2)} </pre>
      console.log(`[createflashcard] response submit ${response.status}`)
    } catch (err) {
      console.log(`response error ${err.status}`)
    }
  }
  useEffect(() => {
    console.log(formErrors)
    if(Object.keys(formErrors).length === 0 && isSubmit){
      console.log(formValue)
    }
  }, [formErrors])

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <span>Form values: {formValue.frontText} &amp; {formValue.backText}</span>
      <TextField
        margin="normal"
        required
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
  )
}

export default CreateFlashcard
