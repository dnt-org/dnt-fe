import { useState } from "react"
import { useTranslation } from "react-i18next"
import ProductGridReadOnly from "../ProductGridReadOnly"
import OtpModal from "../molecules/OtpModal"

const numberValue = (value) => {
  const next = Number(value)
  return Number.isFinite(next) ? next : 0
}

const keyOf = (item, index) => item.documentId || item.id || item.rowIndex || index

/**
 * Bảng hàng hóa trong phiên live: hiển thị đủ các cột product item của phần
 * ĐĂNG BÀI (tái dùng ProductGridReadOnly) và gắn thêm 2 cột cuối:
 *  - HỒ SƠ ĐÁP ỨNG (tải lên)
 *  - XÁC NHẬN (2 nút ĐỒNG Ý / TỪ CHỐI)
 */
export default function LiveGoodsTable({ items = [], onConfirmBid, mode = "joiner" }) {
  const { t } = useTranslation()
  const [decisions, setDecisions] = useState({})
  const [otpItem, setOtpItem] = useState(null)

  const doConfirm = (item, index) => {
    const quantity = numberValue(item.orderQuantity)
    const unitPrice = numberValue(item.orderUnitPrice)
    onConfirmBid?.(item, index, {
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      note: item.note || "",
    })
  }

  const extraColumns = [
    {
      header: t("liveGoods.responseProfile", "HỒ SƠ ĐÁP ỨNG"),
      render: () => (
        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
          {t("productGrid.uploadFile", "Tải lên")}
        </button>
      ),
    },
    {
      header: t("customerConfirm.title", "XÁC NHẬN"),
      render: (item, index) => {
        const k = keyOf(item, index)
        const decision = decisions[k]
        return (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                setDecisions((prev) => ({ ...prev, [k]: "accepted" }))
                // Khách xác nhận cần nhập OTP trước khi gửi
                if (mode === "joiner") setOtpItem({ item, index })
              }}
              className={`px-3 py-1 text-xs font-bold text-white ${decision === "accepted" ? "ring-2 ring-offset-1 ring-blue-800" : ""}`}
              style={{ backgroundColor: "#1e40af" }}
            >
              {t("liveConfirm.agree", "ĐỒNG Ý")}
            </button>
            <button
              type="button"
              onClick={() => setDecisions((prev) => ({ ...prev, [k]: "rejected" }))}
              className={`px-3 py-1 text-xs font-bold text-white ${decision === "rejected" ? "ring-2 ring-offset-1 ring-red-800" : ""}`}
              style={{ backgroundColor: "#ef4444" }}
            >
              {t("liveConfirm.reject", "TỪ CHỐI")}
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="mt-4">
      <ProductGridReadOnly products={items} extraColumns={extraColumns} />
      <OtpModal
        open={!!otpItem}
        onClose={() => setOtpItem(null)}
        onConfirm={() => { if (otpItem) doConfirm(otpItem.item, otpItem.index) }}
        title={`${t("customerConfirm.title", "XÁC NHẬN")} - OTP`}
      />
    </div>
  )
}
