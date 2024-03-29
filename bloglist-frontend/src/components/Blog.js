import { useState } from 'react'
import propTypes from 'prop-types'

const Blog = ({ blog, handleLike, removeBlog }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blogs' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button id='viewBlogs' onClick={() => setShow(previousShow => !previousShow)}>{show ? 'hide' : 'view'}</button>
      </div>
      <div>
        {show && (<div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button id='likeButton' onClick={() => handleLike(blog)}>like</button></div>
          <div>{blog.user.name}</div>
          <div>
            <button id='removeBlog' onClick={() => removeBlog(blog)}>Remove</button>
          </div>
        </div>)}
      </div>
    </div>)
}

Blog.propTypes = {
  handleLike: propTypes.func.isRequired,
  removeBlog: propTypes.func.isRequired,
  blog: propTypes.object.isRequired
}

export default Blog