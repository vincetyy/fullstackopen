import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const addLikes = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    })
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className='blog'>
      {!showDetails && <div style={blogStyle} >
        <div id='titleAndAuthor'>
          {blog.title}
          &nbsp;
          {blog.author}
          <button id='toggleDetails' onClick={toggleDetails}>Show</button>
        </div>
      </div>
      }

      {showDetails && <div style={blogStyle} >
        <div id='titleAndAuthor'>
          {blog.title}
          &nbsp;
          {blog.author}
          <button id='toggleDetails' onClick={toggleDetails}>Hide</button>
        </div>
        <div id='url'>
          {blog.url}
        </div>
        <div id='likes'>
          Likes {blog.likes}
          <button onClick={addLikes}>Like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        {blog.user.username === user.username && <button id='delete' onClick={deleteBlog}>Delete</button>}
      </div>
      }
    </div>

  )
}

export default Blog