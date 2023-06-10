const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const cors = require('cors')

const { baseUrl, maxNumOfClapsPerUserPerPost } = require('../constants')
const { Posts } = require('./model/Posts')
const { Tags } = require('./model/Tags')

const app = express()
const port = 3080

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

const corsOptions = {
  origin: `${baseUrl.client}`,
  credentials: true,
}

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!')
})

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4()
  res.cookie('userId', userId).send({ id: userId })
})

///////////////////////////////////// Posts /////////////////////////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  if (req.query.popularity) {
    const popularity = Number(req.query.popularity)
    filteredPosts = Posts.filter((post) => post.claps > popularity)
    res.send({ filteredPosts })
    return
  }
  res.send({ Posts })
})

app.post('/posts', cors(corsOptions), (req, res) => {
  const { id, title, content } = req.body.post

  // creating new post object
  let postObject = { id, title, content, claps: 0 }

  Posts.push(postObject)

  res.send({ Posts }).status(200).end()
})

///////////////////////////////////// Tags /////////////////////////////////////
app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags })
})

app.post('/tags/tagName/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId
  if (!userId) {
    res.status(403).end()
    return
  }
  const { tagName } = req.params
  if (Tags[tagName]) {
    res.status(400).end()
    return
  }
  Tags[tagName] = {}
  res.send({ Tags }).status(200).end()
})

// endpoint for recieving post id and tag name to update Tags array
app.post('/post/tagName', cors(corsOptions), (req, res) => {
  // get the request body
  const { newId, tag } = req.body.post

  // add the id to the correct tag field with bool:true
  for (const [key, value] of Object.entries(Tags)) {
    if (key === tag) {
      Tags[key][newId] = true
    }
  }

  res.send({ Tags }).status(200).end()
})

// endpoint for adding clap to a post
app.post('/post/claps', cors(corsOptions), (req, res) => {
  // get the request body
  const { postId } = req.body.post

  Posts.forEach((element) => {
    if (element.id === postId) element.claps++
  })
  res.send({ Posts }).status(200).end()
})

app.post('/posts/byTag', cors(corsOptions), (req, res) => {
  const filteredPosts = []
  const { tagId, tagName } = req.body.tag

  console.log({ tagId, tagName })

  for (const [key, value] of Object.entries(Tags)) {
    Posts.map((post) => {
      if (Object.keys(Tags[key]).includes(post.id)) {
        console.log('success')
        filteredPosts.push(post)
      }
    })
  }

  console.log(filteredPosts)
  res.send({ filteredPosts }).status(200).end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
