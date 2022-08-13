const router = require("express").Router()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const Cart = require("../models/Cart")
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken")

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
const cart = database.collection("cart")

// ==========create  a cart ============
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedCart = await cart.insertOne(newCart)
    res.status(201).json(savedCart)
  } catch (error) {
    res.send(400).json(error.message)
  }
})

// ============== get user cart ==============
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await cart.findOne({ userId: req.params.userId })

    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
// // ============== get all cart ==============
// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id
//     const query = { _id: ObjectId(id) }
//     console.log(query)

//     const cursor = await products.findOne(query)

//     res.status(200).json(cursor)
//   } catch (error) {
//     res.status(500).json(error.message)
//   }
// })

// update a product

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const filter = { id: cart._id }
    const option = { upsert: false }

    const updateCart = {
      $set: req.body
    }

    const result = await cart.updateOne(filter, updateCart, option)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// ============ delete ==========//
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: ObjectId(id) }
    console.log(query)

    const result = await cart.deleteOne(query)
    res.status(200).json("cart deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
