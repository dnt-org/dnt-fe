import { useState, useRef } from "react"
import PropTypes from "prop-types"
import { QrCode, Download, ScanLine } from "lucide-react"
import QRModalComponent from "../QRModalComponent"

// Shared QR flow for both "add friend" (#C-06) and "join group" (#C-09):
// toggle between scanning someone else's QR and showing/downloading your own.
export default function ContactQrModal({ isOpen, onClose, onScanResult, myQrLabel }) {
  const [mode, setMode] = useState("scan") // 'scan' | 'mine'
  const canvasRef = useRef(null)

  if (!isOpen) return null

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "my-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleClose = () => {
    setMode("scan")
    onClose()
  }

  return (
    <>
      {/* Mode toggle — always on top so it's reachable regardless of which view is showing */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100002] flex gap-2 bg-white rounded-full shadow-lg p-1">
        <button
          onClick={() => setMode("scan")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === "scan" ? "bg-blue-700 text-white" : "text-blue-700 hover:bg-blue-50"}`}
        >
          <ScanLine size={15} /> Quét QR
        </button>
        <button
          onClick={() => setMode("mine")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === "mine" ? "bg-blue-700 text-white" : "text-blue-700 hover:bg-blue-50"}`}
        >
          <QrCode size={15} /> QR của tôi
        </button>
      </div>

      {mode === "scan" ? (
        <QRModalComponent isOpen={isOpen} onClose={handleClose} onScanResult={onScanResult} />
      ) : (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md flex flex-col items-center">
            <button className="absolute top-1 right-2 text-gray-600 hover:text-black" onClick={handleClose}>✕</button>
            <p className="text-sm text-gray-600 mb-3 mt-4 text-center">{myQrLabel}</p>
            {/* Placeholder QR pattern — no backend identity payload to encode yet */}
            <MockQrCanvas canvasRef={canvasRef} />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download size={16} /> Tải ảnh QR
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function MockQrCanvas({ canvasRef }) {
  const size = 220
  const cells = 14
  const cellSize = size / cells
  // Deterministic pseudo-random pattern so it looks like a QR code without encoding real data
  const pattern = Array.from({ length: cells * cells }, (_, i) => (i * 37 + 11) % 7 < 3)

  const draw = (canvas) => {
    if (!canvas) return
    canvasRef.current = canvas
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = "#1e3a8a"
    pattern.forEach((on, i) => {
      if (!on) return
      const x = (i % cells) * cellSize
      const y = Math.floor(i / cells) * cellSize
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  return <canvas ref={draw} width={size} height={size} className="border rounded" />
}

MockQrCanvas.propTypes = {
  canvasRef: PropTypes.object.isRequired,
}

ContactQrModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onScanResult: PropTypes.func.isRequired,
  myQrLabel: PropTypes.string,
}

ContactQrModal.defaultProps = {
  myQrLabel: "Mã QR của bạn — cho người khác quét để kết bạn",
}
