const express = require("express")
const app = express()
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require("mongodb")

//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// importing external routes
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

const port = process.env.PORT || 4000

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

async function run() {
  try {
    await client.connect()
    console.log("db connected")
    const database = client.db("mall")
  } finally {
  }
}

run().catch(console.dir)

//   route
app.get("/", async (req, res) => {
  res.send("Welcome")
})

// external routes//
app.use("/", userRoute)
app.use("/", authRoute)

app.listen(port, () => {
  console.log("running", port)
})

module.exports = client