import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [user, setUser] = useState(null)

  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user
    }

      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        notifyWith(`A new blog ${blogObject.title} by ${blogObject.author} added`, 'info')
        
      })
      .catch(error => {
        notifyWith('Title and Author is required', 'error')
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
      notifyWith(`Logged out`, 'info')
    } catch (exception) {
      notifyWith(`Cannot log out, try again`, 'info')
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>

  )

  const blogForm = () => (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Log out</button>
      </p>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          Author:
          <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          URL:
          <input value={newUrl} onChange={handleUrlChange} />
        </div>
        <button type="submit">Create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

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