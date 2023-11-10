import React from 'react'
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div>
      <h1>Page Not Found :/ </h1>
      <h3>Go to home page:
        <Link to='/'>Home Page</Link>
      </h3>
    </div>
  )
}

export default PageNotFound
