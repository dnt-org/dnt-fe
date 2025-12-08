import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

export default function FileInput({ name, onChange, className = "", label }) {
  const { t } = useTranslation()
  const defaultLabel = (
    <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
      {t("productGrid.uploadFile")}
    </span>
  )

  return (
    <div className={className}>
      {/* Always hide native input to avoid showing default "No file chosen" text */}
      <input type="file" name={name} id={name} onChange={onChange} className="sr-only" />
      <label htmlFor={name} className="block cursor-pointer-label">
        {label ?? defaultLabel}
      </label>
    </div>
  )
}

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.node,
}
