import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import ProductGridReadOnly from "../ProductGridReadOnly"
import OtpModal from "../molecules/OtpModal"

const numberValue = (value) => {
  const next = Number(value)
  return Number.isFinite(next) ? next : 0
}

// Căn phải, có dấu phẩy cách 3 số
const formatMoney = (value) => {
  const next = numberValue(value)
  return next ? next.toLocaleString("vi-VN") : "0"
}

// Thuế GTGT + TNCN (mặc định; lấy từ field item khi có)
const computeTax = (item, thanhTien) => {
  const vatRate = numberValue(item.vatRate ?? 8)
  const pitRate = numberValue(item.pitRate ?? 0)
  return thanhTien * (vatRate + pitRate) / 100
}
// Tổng tiền cần trả sau khi cộng thuế và trừ thưởng, giảm giá
const computeTotalPayable = (item, thanhTien, tax) => {
  const discount = numberValue(item.discountAmount ?? 0)
  const reward = numberValue(item.rewardAmount ?? 0)
  return thanhTien + tax - discount - reward
}

const keyOf = (item, index) => item.documentId || item.id || item.rowIndex || index

/**
 * Bảng hàng hóa trong phiên live: tái dùng ProductGridReadOnly để hiển thị đủ
 * các cột product item của phần ĐĂNG BÀI, và gắn thêm cột cuối tùy theo vai trò:
 *  - joiner (khách): HỒ SƠ ĐÁP ỨNG (tải lên + hiển thị phản hồi từ chủ bài đăng),
 *    và 1 nút XÁC NHẬN -> OTP ở dưới cùng.
 *  - poster (chủ bài đăng): HỒ SƠ ĐÁP ỨNG + cột XÁC NHẬN với 2 nút ĐỒNG Ý / TỪ CHỐI.
 */
export default function LiveGoodsTable({ items = [], bids = [], onConfirmBid, mode = "joiner" }) {
  const { t } = useTranslation()
  const [decisions, setDecisions] = useState({})
  const [otpOpen, setOtpOpen] = useState(false)
  const [liveItems, setLiveItems] = useState(items)

  useEffect(() => setLiveItems(items), [items])

  // Phản hồi (ĐỒNG Ý/TỪ CHỐI) từ chủ bài đăng theo từng mặt hàng
  const responseByItem = useMemo(() => {
    return bids.reduce((acc, bid) => {
      const key = bid.productItemDocumentId || bid.productItemId || bid.itemIndex
      if (key !== undefined && bid.decision && acc[key] === undefined) acc[key] = bid.decision
      return acc
    }, {})
  }, [bids])

  const uploadButton = (
    <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
      {t("productGrid.uploadFile", "Tải lên")}
    </button>
  )

  /* -------- Chủ bài đăng: cột XÁC NHẬN có 2 nút hành động -------- */
  if (mode === "poster") {
    const extraColumns = [
      { header: t("liveGoods.responseProfile", "HỒ SƠ ĐÁP ỨNG"), render: () => uploadButton },
      {
        header: t("customerConfirm.title", "XÁC NHẬN"),
        render: (item, index) => {
          const k = keyOf(item, index)
          const decision = decisions[k]
          return (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDecisions((prev) => ({ ...prev, [k]: "accepted" }))}
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
      </div>
    )
  }

  /* -------- Khách (joiner): thuế + tổng tiền + HỒ SƠ ĐÁP ỨNG + XÁC NHẬN -> OTP -------- */
  const joinerExtraColumns = [
    {
      header: `(27) ${t("liveGoods.taxVatPit", "THUẾ GTGT + TNCN")}`,
      render: (item) => {
        const thanhTien = numberValue(item.orderQuantity) * numberValue(item.orderUnitPrice)
        return <div className="w-full text-right pr-2 whitespace-nowrap">{formatMoney(computeTax(item, thanhTien))}</div>
      },
    },
    {
      header: `(28) ${t("liveGoods.totalPayable", "TỔNG TIỀN CẦN TRẢ SAU KHI CỘNG THUẾ GTGT + TNCN VÀ TRỪ THƯỞNG, GIẢM GIÁ")}`,
      render: (item) => {
        const thanhTien = numberValue(item.orderQuantity) * numberValue(item.orderUnitPrice)
        const tax = computeTax(item, thanhTien)
        return <div className="w-full text-right pr-2 whitespace-nowrap font-bold">{formatMoney(computeTotalPayable(item, thanhTien, tax))}</div>
      },
    },
    {
      header: `(29) ${t("liveGoods.responseProfile", "HỒ SƠ ĐÁP ỨNG")}`,
      render: (item, index) => {
        const decision = responseByItem[item.documentId] ?? responseByItem[item.id] ?? responseByItem[index]
        return (
          <div className="flex flex-col items-center gap-1">
            {uploadButton}
            {/* hiển thị phản hồi từ chủ bài đăng (read-only) */}
            {decision === "accepted" && <span className="text-xs font-bold text-blue-700">{t("liveConfirm.agree", "ĐỒNG Ý")}</span>}
            {decision === "rejected" && <span className="text-xs font-bold text-red-600">{t("liveConfirm.reject", "TỪ CHỐI")}</span>}
            {!decision && <span className="text-[10px] text-gray-500">{t("aiLiveVideo.waitingResponse", "Chờ phản hồi")}</span>}
          </div>
        )
      },
    },
  ]

  const submitAll = () => {
    liveItems.forEach((item, index) => {
      const quantity = numberValue(item.orderQuantity)
      const unitPrice = numberValue(item.orderUnitPrice)
      if (quantity > 0 && unitPrice > 0) {
        onConfirmBid?.(item, index, {
          quantity,
          unitPrice,
          totalAmount: quantity * unitPrice,
          note: item.note || "",
        })
      }
    })
  }

  return (
    <div className="mt-4">
      <ProductGridReadOnly products={items} onItemsChange={setLiveItems} extraColumns={joinerExtraColumns} />
      {/* XÁC NHẬN cần nhập OTP */}
      <div className="flex items-center justify-center mt-3">
        <button
          type="button"
          onClick={() => setOtpOpen(true)}
          className="border-2 border-black px-8 py-2 font-bold hover:bg-gray-50"
        >
          {t("customerConfirm.title", "XÁC NHẬN")}
        </button>
      </div>
      <OtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onConfirm={submitAll}
        title={`${t("customerConfirm.title", "XÁC NHẬN")} - OTP`}
      />
    </div>
  )
}
