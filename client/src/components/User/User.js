import React, { useEffect, useState } from "react"
import { useAuth } from "../Auth/AuthProvider"
import axios from "axios"
import { MenuItem, Container } from "@mui/material"

const User = ({firstName, lastName}) => {
  const { auth } = useAuth()
  const [decks, setDecks] = useState(null)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    if (auth) {
      axios
        .get(`http://localhost:8000/users/${auth.user}`, {
          headers: { authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          console.log(response)
          const userDecks = response.data.decks.map((deck) => {
            return{
              id: deck._id,
              name:deck.name,
            }
          })
          setDecks(userDecks)
          setUser(response.data)
        })
    }
  }, [auth])
  if (!decks) {
    return <span> Loading....</span>
  }
  console.log(auth.user)

  return (
    <React.Fragment>
      <Container width="lg" align="center">
        <div>
          {user?.firstName} {user?.lastName}
        </div>
        {decks.map((deck) =>
          <MenuItem key = {deck.id} value = {deck.id}>
          {deck.name}
          </MenuItem> 
        )}
      </Container>
    </React.Fragment>
  )
}

export default User
