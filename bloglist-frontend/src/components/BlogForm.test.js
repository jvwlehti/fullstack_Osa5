import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const blog = jest.fn()

  render(<BlogForm createBlog={blog} />)

  const title  = screen.getByPlaceholderText('Title')
  const author = screen.getByPlaceholderText('Author')
  const url    = screen.getByPlaceholderText('URL')
  const sendButton = screen.getByText('create')

  userEvent.type(title, 'Pekka kalassa')
  userEvent.type(author, 'Pekka Kalastaja')
  userEvent.type(url, 'www.kalajutut.org')
  userEvent.click(sendButton)

  expect(blog.mock.calls).toHaveLength(1)
  expect(blog.mock.calls[0][0].title).toBe('Pekka kalassa')
  expect(blog.mock.calls[0][0].author).toBe('Pekka Kalastaja')
  expect(blog.mock.calls[0][0].url).toBe('www.kalajutut.org')
})