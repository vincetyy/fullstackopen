import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'This is a test title')
  await user.type(authorInput, 'Vince')
  await user.type(urlInput, 'www.bing.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('This is a test title')
  expect(createBlog.mock.calls[0][0].author).toBe('Vince')
  expect(createBlog.mock.calls[0][0].url).toBe('www.bing.com')
})