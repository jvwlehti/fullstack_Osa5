import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog( {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
              Title
          <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='Title'
          />
        </div>
        <div>
              Author
          <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='Author'
          />
        </div>
        <div>
              Url
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder='URL'
          />
        </div>
        <button id='createButton' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm