import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async blog => {
  blog.likes += 1
  blog.user = blog.user._id

  const response = await axios.put(`${ baseUrl }/${blog.id}`, blog)
  return response.data
}

const remove = async blog => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${ baseUrl }/${blog.id}`, config)
  return response.data
}

export default {
  getAll,
  setToken,
  create,
  updateLikes,
  remove
}