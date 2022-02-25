import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { Deck } from './models/Deck.js'
import { User } from './models/User.js'

const app = express()
const port = 8000

// Connect to MongoDB

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9pszz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

const exampleMiddleware = (req, res, next) => {
  console.log('example middleware')
  next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

// Routes

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// get all cards for a deck, with the option to paginate results
app.get('/decks/:id/cards', async (req, res) => {
  console.log ('request id',req.params.id)
  const limit = req.query.limit
  console.log('query param limit ', limit)
  const deck = await Deck.findById(req.params.id)
  if(deck){  
  console.log('found num of cards ', deck.cards.length)
  res.send(deck.cards.slice(0,5))
  } else {
    res.sendStatus(404)
  }
})
const cardsById = async (req, res) => {
  const card = await Deck.findOne({
    'cards._id': req.params.id
  })
  res.status(200).send(card)
}

// get individual card by id
app.get('/cards/:id', cardsById)
const cardById = async (req, res) => {
  const card = await Deck.findOne({
    'cards._id': req.params.id
  })
  res.status(200).send(card)
}
const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}


// get a deck by user
app.get("/getDeckByUser/:id", async (req, res) => {
  try {
    const deck = await Deck.find({
      userId: req.params.id
    })
    if(deck) {
      return res.status(201).json({
        msg: deck
      })

    } else {
      return res.status(404).json({
        error: "deck does not exists"
      })
    }
  } catch (error) {
    return res.status(404).json({
      error: "deck does not exists"
    })
  }
})



// create card
app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  console.log('request body ', cardRequest)
  if (cardRequest.deckID){
    const deck = await Deck.findById(cardRequest.deckID)
    if (deck){
      deck.cards.push({
        frontImage:cardRequest.frontImage,
        frontText:cardRequest.frontText,
        backImage:cardRequest.backImage,
        backText: cardRequest.backText
      })
      deck.save()
    }
  }
  res.sendStatus(503)
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((frontImage && !isUrl(frontImage)) || (backImage && !isUrl(backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.push({
        frontImage: cardRequest.frontImage,
        frontText: cardRequest.frontText,
        backImage: cardRequest.backImage,
        backText: cardRequest.backText
      })
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

//update card
app.put('/updatecard/:cardId', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((cardRequest.frontImage && !isUrl(cardRequest.frontImage)) || (cardRequest.backImage && !isUrl(cardRequest.backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.forEach(card => {
        if(card._id == req.params.cardId) {
          card.frontImage = cardRequest.frontImage,
          card.frontText = cardRequest.frontText,
          card.backImage = cardRequest.backImage,
          card.backText = cardRequest.backText
        }
      });
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

// create a deck by user
app.get("/getDeckByUser/:id", async (req, res) => {
  try {
    const deck = await Deck.find({
      userId: req.params.id
    })
    if(deck) {
      return res.status(201).json({
        msg: deck
      })

    } else {
      return res.status(404).json({
        error: "deck does not exists"
      })
    }
  } catch (error) {
    return res.status(404).json({
      error: "deck does not exists"
    })
  }
})

// Create Deck
app.post("/createDeck", async (req, res) => {
  try {
    const deck = await Deck.create(req.body)
    const result = await deck.save()
    return res.status(201).json({
      msg: result
  })
  } catch (error) {
    console.log(error)
  }
})

// create card
app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((cardRequest.frontImage && !isUrl(cardRequest.frontImage)) || (cardRequest.backImage && !isUrl(cardRequest.backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.push({
        frontImage: cardRequest.frontImage,
        frontText: cardRequest.frontText,
        backImage: cardRequest.backImage,
        backText: cardRequest.backText
      })
      deck.size += 1
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})


// Create user
app.post("/createUser", async (req, res) => {
  try {
    const user = await User.create(req.body)
    const result = await user.save()
    return res.status(201).json({
      msg: "created"
  })
  } catch (error) {
    console.log(error)
  }
})

// update card
app.put('/decks/:deck_id/:card_Id', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((cardRequest.frontImage && !isUrl(cardRequest.frontImage)) || (cardRequest.backImage && !isUrl(cardRequest.backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.forEach(card => {
        if(card._id == req.params.cardId) {
          card.frontImage = cardRequest.frontImage,
          card.frontText = cardRequest.frontText,
          card.backImage = cardRequest.backImage,
          card.backText = cardRequest.backText
        }
      });
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})


// update Deck
app.put("/updateDeck/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
    if(deck) {
      deck.name = req.body.name
      if(req.body.cards) {
        deck.cards = req.body.cards
        deck.cards = req.body.size
      }
      if(req.body.userId) {
        deck.userId = req.body.userId
      }
    } else {
      return res.status(404).json({
        error: "deck does not exists"
      })
    }
    const result = await deck.save()
    return res.status(201).json({
      msg: result
  })
  } catch (error) {
    console.log(error)
  }
})

// update user
app.put("/updateUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(user) {
      user.name = req.body.name
    } else {
      return res.status(404).json({
        error: "User does not exists"
      })
    }
    const result = await user.save()
    return res.status(201).json({
      msg: result
    })
  } catch (error) {
    console.log(error)
  }
})

// delete card
app.delete('/deletecard/:deckId/:cardId', async (req, res) => {
  if (!req.params.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(req.params.deckId)
    if (deck) {
      deck.cards.forEach(card => {
        if(card._id == req.params.cardId) {
          card.remove()
        }
      });
      deck.size -= 1
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

// delete a Deck and all asscociated cards
app.delete("/deleteDeck/:id", async (req, res) => {
  console.log("delete deck")
  try {
    const deck = await Deck.findById(req.params.id)
    if(deck) {
      await deck.remove()
    } else {
      return res.status(404).json({
        error: "deck does not exists"
      })
    }
    return res.status(200).json({
      msg: "deck deleted"
    })
  } catch (error) {
    console.log(error)
  }
})

// delete user
app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(user) {
      await user.remove()
    } else {
      return res.status(404).json({
        error: "user does not exists"
      })
    }
    return res.status(201).json({
      msg: "user deleted"
    })
  } catch (error) {
    return res.status(404).json({
      error: "user does not exists"
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})