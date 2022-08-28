const router = require("express").Router()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const Order = require("../models/Order")
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken")

// connecting to mondodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  }
  // { autoIndex: false }
)

const database = client.db("mall")
const payment = database.collection("payment")

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd"
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr)
      } else {
        res.status(200).json(stripeRes)
      }
    }
  )
})

module.exports = router
