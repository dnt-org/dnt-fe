import React from "react"
import PropTypes from "prop-types"

export default function FileInput({ name, onChange, className = "", label }) {
  return (
    <div className={className}>
      {label ? <label htmlFor={name} className="block cursor-pointer-label">{label}</label> : null}
      <input hidden={!!label} type="file" name={name} id={name} onChange={onChange} className="w-full border-gray-300 p-1" />
    </div>
  )
}

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.node,
}