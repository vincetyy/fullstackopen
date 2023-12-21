import { useState } from 'react'

const Blog = ({ blog , updateBlog, removeBlog, user }) => {

  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const addLikes = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.title,
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
    display: showDetails ? 'none' : ''
  }

  const blogStyleDetails = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: showDetails ? '' : 'none'
  }

  return (
    <div>
      <div style={blogStyle} >
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>Show</button>
      </div>
      <div style={blogStyleDetails} >
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>Hide</button>
        <br></br>
        {blog.url}
        <br></br>
        Likes {blog.likes}
        <button onClick={addLikes}>Like</button>
        <br></br>
        {blog.user.name}
        { blog.user.username === user.username && <button onClick={deleteBlog}>Delete</button> }
      </div>
    </div>

  )
}

export default Blog