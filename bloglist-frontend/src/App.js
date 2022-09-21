import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import ErrorNotification from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [effectMessage, setEffectMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogRef = useRef()

  //hakee blogit
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  //hakee kirjautuneet käyttäjät
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  //lisää blogin listaan
  const addBlog = async (blogObject) => {
    blogRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setEffectMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    setTimeout(() => {
      setEffectMessage(null)
    }, 5000)
  }

  //lisää tykkäyksen
  const handleLike = async blog => {
    await blogService.updateLikes(blog)
    sortBlogs()
  }

  //lataa ja järjestää blogit suuruusjärjestykseen
  const sortBlogs = () => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((first, second) =>
        (first.likes > second.likes) ? -1 : 1))
    })
  }

  const removeBlog = async blog => {
    if (window.confirm(`Remove ${blog.title} from the blogs?`)) {
      await blogService.remove(blog)
      sortBlogs()
    }
  }

  //kirjautumisen hoitava komponentti
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createNewForm = () => (
    <div>
      <Togglable buttonLabel='create new blog' ref={blogRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable >
    </div >

  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={effectMessage} />
      <p>
        <b>{user.name}</b> logged in
        <button onClick={logout}>logout</button>
      </p>
      {createNewForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App