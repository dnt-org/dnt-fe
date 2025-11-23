import React from "react"
import PropTypes from "prop-types"
import { Eye } from "lucide-react"

export default function VideoCard({ index, name, productId, viewers, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border ${selected ? "border-green-500" : "border-black"} rounded-sm w-full h-full px-3 py-2 text-center hover:bg-yellow-50`}
    >
      <div className="font-extrabold text-2xl">VIDEO</div>
      <div className="font-extrabold text-2xl">{index}</div>
      <div className="text-xs italic">(slide cập nhật)</div>
      <div className="mt-2 border border-black inline-block text-left px-2 py-1">
        <div className="text-xs">AVT - TÊN - ID</div>
        <div className="flex items-center gap-1 text-xs">
          <Eye size={14} />
          <span>{viewers} đang xem</span>
        </div>
      </div>
      {name ? (
        <div className="mt-2 text-[11px] truncate">{name}{productId ? ` • ${productId}` : ""}</div>
      ) : null}
    </button>
  )
}

VideoCard.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

VideoCard.defaultProps = {
  name: "",
  productId: "",
  viewers: 0,
  selected: false,
  onClick: () => {},
}