const mongoose = require('mongoose')
const Card = mongoose.model('Card')
const User = mongoose.model('User')

var pokemonList = require('../models/pokemon.json')
var pokemonTypes = [
  "Bug",
  "Dragon",
  "Electric",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Water"
]

exports.getCardsAndPokemonList = function(req, res) {
  Card
    .find()
    .exec(function(err, cards) {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json({
          cards: cards,
          pokemonList: pokemonList,
          pokemonTypes: pokemonTypes
        })
      }
    })
}

exports.getUserCardsAndPokemonList = function(req, res) {
  Card.find({ owner: req.params.id }, function(err, data) {
    if (err) {
      res.status(500).json(err)
    } else {
      res.status(200).json({
        cards: data,
        pokemonList: pokemonList
      })
    }
  })
}

exports.getCard = function(req, res) {
  Card
    .findById(req.params.id)
    .exec(function(err, card) {
      if (err) {
        console.log(err)
      } else {
        User
        .findById(card.owner)
        .exec((err, user) => {
          console.log(card)
          console.log(user)
          res.status(200).json({
            card: card,
            user: user
          })
        })
        // res.status(200).json(card)
      }
    })
}

exports.addCard = function(req, res) {
  // var path = req.file.path
  // var imageName = req.file.originalname
  // console.log(req.file)
  req.body.types = req.body.types.split(",")
  req.body.imagePath = 'uploads/' + req.file.filename
  req.body.originalImageName = req.file.originalname
  req.body.tradable = req.body.tradable == 'true' ? true : false
  // console.log(req.body)
  Card.create(req.body, function(err, card) {
    if (err) {
      res.status(500).json(err)
    }
    res.status(200).json(card)
 })
  //
  // console.log('stuff')
  // console.log(path)
  // console.log(imageName)
  // console.log(req.body)
  // res.status(200).json({success: true})
}

exports.filterCards = function(req, res) {
  console.log('body')
  console.log(req.body)
  var filterObj = {}
  if (req.body.name != 'All')
    filterObj.name = req.body.name
  if (req.body.type != 'All')
    filterObj.type = req.body.type
  if (req.body.tradable)
    filterObj.tradable = true
  filterObj.condition = {
    $gt: req.body.minCondition ? req.body.minCondition : 0,
    $lt: req.body.maxCondition ? req.body.maxCondition : 11
  }
  filterObj.price = {
    $gt: req.body.minPrice ? req.body.minPrice : 0,
    $lt: req.body.maxPrice ? req.body.maxPrice : 9999
  }
  Card.find(filterObj).exec(function(err, cards) {
    if (err) {
      res.status(500).json(err)
    } else {
      console.log('cards')
      console.log(cards)
      res.status(200).json(cards)
    }
  })

}
