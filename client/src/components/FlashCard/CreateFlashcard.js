import React, {useState} from "react"
import { Button, Stack, TextField } from "@mui/material"
import axios from 'axios'

const CreateFlashcard = ({ userId, deckId }) => {
  console.log(`[CreateFlashcard] deckId is ${deckId}`)
  const [formValue, setFormValue] = useState({ frontText:"",frontImage: "", backImage: "",backText: ""})
  const[formErrors, setFormErrors] = useState({
    frontImage: false,
    backImage: false,
    frontText: false,
    backText: false
  })
  
const validate = (name,value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  if (name.includes("Image")) {
    if (!re.test(value) || !value) {
      setFormErrors({ ...formErrors,[name]: value})
    } else {
      return true
    }
  } else {
    return null
  }
}

const handleChange = (event) => {
  event.preventDefault()
  console.log("[CreateFlashcard] onChange ", event)
  const { name, value } = event.target
  validate(name, value)
  setFormValue({ ...formValue, [name]: value})
  console.log(formValue)
}

  const handleSubmit = async (event) => {
    console.log("[CreateFlashcard] onSubmit ", event)
    event.preventDefault()
    if (formErrors.frontImage || formErrors.backImage || formErrors.frontText || formErrors.backText) {
    } else {
      alert("invalid entries")
      try {
        const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { user: userId } })
        //<pre>{JSON.stringify(formValue, undefined, 2)} </pre>
        console.log(`[createflashcard] response submit ${response.status}`)
      } catch (err) {
        console.log(`response error ${err.status}`)
      }
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
    <pre>{JSON.stringify(formValue,undefined, 2)} </pre>
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
        error={formErrors.frontImage}
        //label = {formErrors.frontImage}
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
