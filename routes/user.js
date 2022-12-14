const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

const router = require("express").Router()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})
const database = client.db("mall")
const user = database.collection("user")

// update a user//

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const filter = { id: user._id }
    const option = { upsert: false }

    const updateUser = {
      $set: req.body
    }

    const result = await user.updateOne(filter, updateUser, option)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// ============ delete ==========//
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const filter = { id: user._id }
    const option = { upsert: false }

    const result = await user.deleteOne(filter, option)
    res.status(200).json("user deleted")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//GET a USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: ObjectId(id) }
    console.log(query)
    const Fuser = await user.findOne(query)
    res.status(200).json(Fuser)
  } catch (err) {
    res.status(500).json(err.message)
  }
})

module.exports = router
