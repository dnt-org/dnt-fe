import React from "react"
import PropTypes from "prop-types"

export default function AppPageLayout({ children }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-1 rounded-lg shadow-lg w-full mx-auto">
        {children}
      </div>
    </div>
  )
}

AppPageLayout.propTypes = {
  children: PropTypes.node,
}