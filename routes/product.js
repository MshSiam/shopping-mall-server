const router = require("express").Router()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const Product = require("../models/Product")
const { verifyTokenAndAdmin } = require("./verifyToken")

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
const products = database.collection("products")

// ==========create  a product ============
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    const savedProducts = await products.insertOne(newProduct)
    res.status(201).json(savedProducts)
  } catch (error) {
    res.send(400).json(error.message)
  }
})

// update a product

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: ObjectId(id) }
    const filter = { id: products._id }
    const option = { upsert: false }

    const updateProduct = {
      $set: req.body
    }

    const result = await products.updateOne(filter, updateProduct, option)
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

    const result = await products.deleteOne(query)
    res.status(200).json("product deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
