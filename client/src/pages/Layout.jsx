import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <h1>Layout</h1>
        <Outlet />       {/* Layout routing childs will render here e.g. :- /ai/write-article */}
    </div>
    
  )
}

export default Layout