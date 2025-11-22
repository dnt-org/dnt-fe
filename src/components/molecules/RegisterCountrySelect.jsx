import React from "react"
import PropTypes from "prop-types"
import Select from "react-select"

export default function RegisterCountrySelect({ countries, selectedCountry, onChange, placeholder, error }) {
  return (
    <div className="grid grid-cols-1 items-center gap-4">
      <div className="relative w-full flex items-center">
        <Select options={countries} onChange={onChange} value={selectedCountry} placeholder={placeholder} className="w-full" />
        <span className="text-red-500 ml-2">*</span>
      </div>
      {error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null}
    </div>
  )
}

RegisterCountrySelect.propTypes = {
  countries: PropTypes.array.isRequired,
  selectedCountry: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
}