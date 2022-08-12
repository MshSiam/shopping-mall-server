const { verifuTokenAndAuthorization } = require("./verifyToken")
const { MongoClient, ServerApiVersion } = require("mongodb")

const router = require("express").Router()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})
const database = client.db("mall")
const user = database.collection("user")

router.put("/:id", verifuTokenAndAuthorization, async (req, res) => {
  try {
    const filter = { id: user._id }
    const option = { upsert: false }

    const updateUser = {
      $set: req.body
    }

    const result = await user.updateOne(filter, updateUser, option)
    res.status(500).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
