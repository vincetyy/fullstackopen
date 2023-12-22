import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author (step 1)', () => {
  const blog = {
    title: 'This is a title',
    author: 'vtyy',
    url: 'www.google.com',
    likes: 117,
    user: {
      name: 'vince',
      username: 'v'
    }
  }

  const blogUser = {
    name: 'vince',
    username: 'v'
  }

  const { container } = render(<Blog blog={blog} user={blogUser} />)

  const titleAndAuthor = container.querySelector('#titleAndAuthor')
  expect(titleAndAuthor).toBeDefined()

  const url = container.querySelector('#url')
  expect(url).toBeNull()

  const likes = container.querySelector('#likes')
  expect(likes).toBeNull()
})

test('renders url and likes (step 2)', async () => {
  const blog = {
    title: 'This is a title',
    author: 'vtyy',
    url: 'www.google.com',
    likes: 117,
    user: {
      name: 'vince',
      username: 'v'
    }
  }

  const blogUser = {
    name: 'vince',
    username: 'v'
  }

  const { container } = render(<Blog blog={blog} user={blogUser} />)

  const user = userEvent.setup()
  const show = screen.getByText('Show')
  await user.click(show)

  const url = container.querySelector('#url')
  expect(url).toBeDefined()

  const likes = container.querySelector('#likes')
  expect(likes).toBeDefined()
})

test('receives likes (step 3)', async () => {
  const blog = {
    title: 'This is a title',
    author: 'vtyy',
    url: 'www.google.com',
    likes: 117,
    user: {
      name: 'vince',
      username: 'v'
    }
  }

  const blogUser = {
    name: 'vince',
    username: 'v'
  }

  const mockHandler = jest.fn()

  const { container } = render(<Blog blog={blog} user={blogUser} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const show = screen.getByText('Show')
  await user.click(show)

  const like = screen.getByText('Like')
  await user.click(like)
  await user.click(like)

  expect(mockHandler.mock.calls).toHaveLength(2)
})