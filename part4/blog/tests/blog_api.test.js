const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs has property id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'CS (Full Stack)',
      author: 'VTYY',
      url: 'http://google.com',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
      'CS (Full Stack)'
    )
  })

  test('succeeds with likes defaulting to 0', async () => {

    const newBlog = {
      title: 'CS (Full Stack)',
      author: 'VTYY',
      url: 'http://google.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd[helper.initialBlogs.length]

    expect(addedBlog.likes).toBe(0)
  })

  test('fails with status code 400 if no title', async () => {

    const newBlog = {
      author: 'VTYY',
      url: 'http://google.com',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })

  test('fails with status code 400 if no url', async () => {

    const newBlog = {
      title: 'CS (Full Stack)',
      author: 'VTYY',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })

  test('fails with status code 401 if no token', async () => {
    const newBlog = {
      title: 'CS (Full Stack)',
      author: 'VTYY',
      url: 'http://google.com',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    
    const blogsAtEnd =  await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      .set('Authorization', `Bearer ${token}`)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('updating of a blog', () => {
  test('succeeds in changing likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 100
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set('Authorization', `Bearer ${token}`)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    expect(updatedBlog.likes).toBe(100)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})