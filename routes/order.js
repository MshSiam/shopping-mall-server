const router = require("express").Router()
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
const order = database.collection("order")

// ==========create  a order ============
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await order.insertOne(newOrder)
    res.status(201).json(savedOrder)
  } catch (error) {
    res.send(400).json(error.message)
  }
})

// ============== get user order ==============
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await order.findOne({ userId: req.params.userId })

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
// // ============== get all order ==============
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const query = {}
    console.log(query)

    const cursor = await order.findOne(query)

    res.status(200).json(cursor)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// update a order

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const filter = { id: order._id }
    const option = { upsert: false }

    const updateOrder = {
      $set: req.body
    }

    const result = await order.updateOne(filter, updateOrder, option)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// ============ delete ==========//
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: ObjectId(id) }
    console.log(query)

    const result = await order.deleteOne(query)
    res.status(200).json("order deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth()) - 1)
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth()) - 1)

  try {
    const income = await order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount"
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" }
        }
      }
    ])
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
