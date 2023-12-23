import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .concat(returnedBlog)
          .sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)
        )
        notifyWith(`A new blog ${blogObject.title} by ${blogObject.author} added`, 'info')
      })
      .catch(error => {
        notifyWith('Title and Author is required', 'error')
      })
  }

  const updateBlog = (blogId, newBlogObject) => {
    blogService
      .update(blogId, newBlogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .map(blog => blog.id !== blogId ? blog : returnedBlog)
          .sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)
        )
        notifyWith(`Liked ${newBlogObject.title} by ${newBlogObject.author} added`, 'info')
      })
      .catch(error => {
        notifyWith('Unable to update, try again', 'error')
      })
  }

  const removeBlog = (blogObject) => {
    blogService
      .remove(blogObject.id)
      .then(() => {
        setBlogs(blogs
          .filter(blog => blog.id.toString() !== blogObject.id.toString())
          .sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)
        )
        notifyWith(`Removed ${blogObject.title} by ${blogObject.author}`, 'info')
      })
      .catch(error => {
        notifyWith('Unable to delete, try again', 'error')
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`Logged in as ${user.name}`, 'info')
    } catch (exception) {
      notifyWith('Wrong Username or Password', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      notifyWith('Logged out', 'info')
    } catch (exception) {
      notifyWith('Cannot log out, try again', 'info')
    }
  }

  const loginForm = () => (
    <form id='loginForm' onSubmit={handleLogin}>
      <div>
        Username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">Login</button>
    </form>

  )

  const blogFormRef = useRef()

  const blogForm = () => (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Log out</button>
      </p>
      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog} user={user} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
        )}
      </div>
    </div>
  )


  return (
    <div>
      {user === null ?
        <h2>Login to Application</h2> :
        <h2>Blogs</h2>
      }
      <Notification info={info} />
      {user === null && loginForm()}
      {user !== null && blogForm()}
    </div>
  )
}

export default App