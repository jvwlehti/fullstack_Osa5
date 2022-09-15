import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'



const blog = {
  title: 'Testiblogi',
  author: 'Teppo Testaaja',
  url: 'www.testitesti.fi',
  likes: 16,
  user: {
    username: 'testaaja1',
    name: 'T. Testaaja'
  }
}

const mockRemover = jest.fn()
const mockLike    = jest.fn()

beforeEach(() => {
  render(<Blog blog={blog} removeBlog={mockRemover} handleLike = {mockLike}/>)
})

test('renders blog when likes hidden', () => {
  const content = screen.getByText('Testiblogi Teppo Testaaja')
  expect(content).toBeDefined()
})

test('Check url and likes', async () => {
  const button = await screen.getByText('view')
  await userEvent.click(button)

  const url = await screen.findByText('www.testitesti.fi')
  const likes = screen.findByText('16')

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('Like button should be pressed twice', async () => {
  const viewButton = await screen.getByText('view')
  await userEvent.click(viewButton)

  const likeButton = await screen.getByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)


  expect(mockLike.mock.calls).toHaveLength(2)
})
