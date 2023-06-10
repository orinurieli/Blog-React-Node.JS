import axios from 'axios'
import './App.css'
import Home from './pages/Home'
import AddNewPost from './pages/AddNewPost'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  ButtonGroup,
  Alert,
  Snackbar,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import HomeIcon from '@mui/icons-material/Home'
import FloatingMenu from './components/FloatingMenu'
import debounce from 'lodash/debounce';


function App() {
  const baseURL = 'http://localhost:3080'
  const popularityOptions = [-1, 1, 5, 20, 100]
  const requiredMsg = 'Please Fill Required Fields'
  const limitMsg = 'Max title lenght is 100 chars!'

  const [userId, setUserId] = useState('')

  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('')
  const [selectedTagQuery, setSelectedTagQuery] = useState('')

  const [allPosts, setAllPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])

  const [tags, setTags] = useState({})
  const [tagsList, setTagsList] = useState([])
  const [selectedTagId, setSelectedTagId] = useState('')

  const [anchorEl, setAnchorEl] = useState(null)

  const [alertMsg, setAlertMsg] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [showMyClaps, setShowMyClaps] = useState(true)
  const [alertType, setAlertType] = useState('')

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        handleAlert('', false, '')
      }, 1500)
    }
  }, [showAlert])

  const handleAlert = (message, isShow, type) => {
    setAlertMsg(message)
    setShowAlert(isShow)
    setAlertType(type)
  }

  ///////////////////////////////////// data request /////////////////////////////////////
  axios.defaults.withCredentials = true
  ///////////////////// get request /////////////////////

  // sets a userId cookie
  const getUser = useCallback(() => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {
        setUserId(response.data.id)
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error')
      })
  }, [])

  const getPosts = useCallback(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        setAllPosts([...response.data['Posts']])
        setFilteredPosts([...response.data['Posts']])
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error')
      })
  }, [])

  const getFilteredPosts = (popularity, tag) => {
    const url = popularity !== '' ? `popularity=${popularity}` : ''
    axios
      .get(`${baseURL}/posts?${url}`)
      .then((response) => {
        setFilteredPosts([...response.data['filteredPosts']])
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error')
      })
  }

  const getTags = useCallback(() => {
    axios
      .get(`${baseURL}/tags`)
      .then((response) => {
        setTags({ ...response.data['Tags'] })
        const tagsList = []
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName)
        }
        setTagsList(tagsList)
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error')
      })
  }, [])

  useEffect(() => {
    getPosts()
    getTags()
    getUser()
  }, [getPosts, getTags, getUser])

  ///////////////////// post request /////////////////////
  const addPost = (id, title, content, tag) => {
    if (!id || !title || !content) {
      handleAlert(requiredMsg, true, 'error')
      return
    }

    if (title.length > 100) {
      handleAlert(limitMsg, true, 'error')
      return
    }

    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            id,
            title,
            content,
            tag,
          },
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        window.location.href = 'http://localhost:3000/'
      }) // navigate doesnt work :(

    getPosts()
  }

  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] })
        const tagsList = []
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName)
        }
        setTagsList(tagsList)
        handleAlert('Tag was added successfully', true, 'success')
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error')
      })
  }

  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null)
    filterPostsByPopularity(selectedOption) 
  }

  const handleHomeClick = () => {
    setFilteredPosts(allPosts)
    setSelectedPopularityQuery('')
    setSelectedTagId('')
  }

  const handleFilterByTag = (postsByTag) =>{
    setFilteredPosts(postsByTag);
  }

  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minClapsNum) => {
    setSelectedPopularityQuery(`${minClapsNum}`)
    getFilteredPosts(minClapsNum, selectedTagQuery)
  }

  const handleFilterMyClaps = debounce(() => {
    filterMyClaps();
  }, 500);
  
  const filterMyClaps = () => {
    // toggle click for display claps
    setShowMyClaps(!showMyClaps)
    const showClaps = showMyClaps ? 0 : -1;
    
    // send request to filter according to Posts
    // return only posts with claps > 0
    filterPostsByPopularity(showClaps)     
  }

  ///////////////////////////////////// render components /////////////////////////////////////
  const renderToolBar = () => {
    return (
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              href='/'
              size='medium'
              onClick={handleHomeClick}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              href='/add-new-post'
              size='medium'
              startIcon={<AddCircleIcon />}
            >
              Add A New Post
            </Button>
             <Button
              size='medium'
              startIcon={<FilterAltIcon />}
  onClick={handleFilterMyClaps}
              data-testid='myClapsBtn'
              color='secondary'
              className={
                window.location.href !== 'http://localhost:3000/add-new-post'
                  ? ''
                  : 'visibilityHidden'
              }
            >
              My Claps
            </Button>
          </ButtonGroup>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Enter 2023 Blog Exam
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              size='medium'
              startIcon={<FilterAltIcon />}
              onClick={(e) => handlePopularityClick(e)}
              data-testid='popularityBtn'
              className={
                window.location.href !== 'http://localhost:3000/add-new-post'
                  ? ''
                  : 'visibilityHidden'
              }
            >
              filter by Popularity
            </Button>
          </ButtonGroup>
          <FloatingMenu
            menuOptions={popularityOptions}
            anchorElement={anchorEl}
            handleMenuClose={handleMenuClose}
          />
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <div className='App'>
      {renderToolBar()}
      {showAlert && (
        <Snackbar open={true} data-testid='alert-snackbar'>
          <Alert severity={alertType} data-testid='alert'>
            {alertMsg}
          </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route
            path='/add-new-post'
            element={<AddNewPost handleAddPost={addPost} Tags={tags} />}
          />
          <Route
            path='/'
            element={
              <Home
                Posts={filteredPosts}
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                userId={userId}
                getTags={getTags}
                getPosts={getPosts}
                handleFilterByTag={handleFilterByTag}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
