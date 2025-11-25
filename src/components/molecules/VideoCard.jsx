import React from "react"
import PropTypes from "prop-types"
import { Eye } from "lucide-react"

export default function VideoCard({ index, name, productId, viewers, selected, onClick, avatar }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border ${selected ? "border-green-500" : "border-black"} rounded-sm flex flex-col items-center justify-start w-full h-full px-3 py-2 text-center hover:bg-blue-50`}
    >
      <div className="font-extrabold text-2xl">VIDEO</div>
      <div className="font-extrabold text-2xl">{index}</div>
      <div className="mt-2 border w-full h-full border-black inline-block text-left px-2 py-1"
        style={{ backgroundImage: selected ? "green-50" : "white" }}
      >
        <div className="text-xs flex  items-start justify-start">
          <img className="w-8 h-8 rounded-full" src={avatar} />
          <div className="font-bold ml-2">{name}</div>
          <div className="font-bold ml-2">{productId}</div>

        </div>
        <div className="flex items-center gap-1 text-xs">
          <Eye size={14} />
          <span>{viewers} đang xem</span>
        </div>
      </div>

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
  onClick: () => { },
}