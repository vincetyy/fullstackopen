import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user
    })

    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input id='title' value={newTitle} onChange={event => setNewTitle(event.target.value)} />
        </div>
        <div>
          Author:
          <input id='author' value={newAuthor} onChange={event => setNewAuthor(event.target.value)} />
        </div>
        <div>
          URL:
          <input id='url' value={newUrl} onChange={event => setNewUrl(event.target.value)} />
        </div>
        <button id='create' type="submit">Create</button>
      </form>

    </div>
  )
}

export default BlogForm