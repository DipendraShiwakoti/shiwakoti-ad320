import React, { useEffect, useState } from "react"
import { useAuth } from "../Auth/AuthProvider"
import axios from "axios"
import { MenuItem, Container } from "@mui/material"

const User = ({firstName, lastName}) => {
  const { auth } = useAuth()
  const [decks, setDecks] = useState(null)
  useEffect(() => {
    if (auth) {
      axios
        .get(`http://localhost:8000/users/${auth.user}`, {
          headers: { authorization: `Bearer ${auth.token}` },
        })
        .then((response) => {
          const userDecks = response.decks.map((deck) => {
            return{
              id: deck._id,
              name:deck.name,
            }
          })
          setDecks(userDecks)
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
          {auth.firstName} {auth.lastName}
        </div>
          <MenuItem>{decks?.map((deck) => deck.id)}
          </MenuItem> 
      </Container>
    </React.Fragment>
  )
}

export default User
