const Notification = ({ message }) => {
  if (message === null) {
    return null
  }


  return (
    <div className="effect">
      {message}
    </div>
  )
}

export default Notification