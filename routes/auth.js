const router = require("express").Router()
const User = require("../models/User")
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require("mongodb")
const jwt = require("jsonwebtoken")

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})
const database = client.db("mall")
const user = database.collection("user")

// ===========Register========//

// ==== post new user data =====/
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    const savedUser = await user.insertOne(newUser)
    res.status(201).send(savedUser)
    console.log(savedUser)
  } catch (error) {
    res.status(500).json(error)
    console.log(error.message)
  } finally {
  }
})

// ================ Login ==================//
router.post("/login", async (req, res) => {
  try {
    const Luser = await user.findOne({ username: req.body.username })
    !Luser && res.status(401).json("no user found")

    const password = await Luser.password
    password !== req.body.password && res.status(401).json("no user found")

    // ============= jwt ===============//

    const accessToken = jwt.sign(
      {
        id: Luser._id,
        isAdmin: Luser.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    // console.log(Luser)
    res.status(200).json({ ...Luser, accessToken })
  } catch (error) {
    res.status(500).send(error)
  }
})

//======= get all user data ==========//
router.get("/users", async (req, res) => {
  const query = {}
  const cursor = user.find(query)
  const users = await cursor.toArray()
  res.send(users)
})

module.exports = router
