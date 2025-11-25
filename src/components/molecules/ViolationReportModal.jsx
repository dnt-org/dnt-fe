import { useState } from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"

export default function ViolationReportModal({ open, onClose, onSubmit }) {
  const { t } = useTranslation()
  const [type, setType] = useState("")
  const [detail, setDetail] = useState("")
  const [time, setTime] = useState("")

  if (!open) return null

  const handleConfirm = () => {
    if (!type) return
    onSubmit({ type, detail, time })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[560px] border border-black rounded shadow-lg">
        <div className="px-4 py-3 font-bold border-b">{t("aiLiveVideo.report", "Báo cáo")}</div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`border px-3 py-2 ${type === "law" ? "bg-blue-100" : "bg-white"}`}
              onClick={() => setType("law")}
            >
              {t("aiLive.lawViolation", "Vi phạm pháp luật")}
            </button>
            <button
              className={`border px-3 py-2 ${type === "contact" ? "bg-blue-100" : "bg-white"}`}
              onClick={() => setType("contact")}
            >
              {t("aiLive.contactInfo", "Chứa liên lạc")}
            </button>
          </div>
          {type && (
            <div className="space-y-2">
              <div>
                <label className="text-xs">{t("aiLiveVideo.concreteContent", "Nội dung cụ thể")}</label>
                <textarea
                  className="w-full border px-2 py-1 mt-1"
                  rows={3}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs">{t("aiLiveVideo.violationTime", "Thời gian vi phạm")}</label>
                <input
                  type="datetime-local"
                  className="w-full border px-2 py-1 mt-1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button className="text-red-600 underline" onClick={onClose}>{t("common.close", "Đóng")}</button>
          <button className="border bg-gray-200 px-4 py-2" onClick={handleConfirm}>{t("aiLiveMovie.confirm", "Xác nhận")}</button>
        </div>
      </div>
    </div>
  )
}

ViolationReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}