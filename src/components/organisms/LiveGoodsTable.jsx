import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

const numberValue = (value) => {
  const next = Number(value)
  return Number.isFinite(next) ? next : 0
}

const formatMoney = (value) => {
  const next = numberValue(value)
  return next ? next.toLocaleString("vi-VN") : ""
}

const getItemKey = (item, index) => item.documentId || item.id || item.rowIndex || index

export default function LiveGoodsTable({ items = [], bids = [], onConfirmBid, submittingBidKey, mode = "joiner" }) {
  const { t } = useTranslation()
  const [drafts, setDrafts] = useState({})
  const canBid = mode === "joiner"

  const latestBidByItem = useMemo(() => {
    return bids.reduce((acc, bid) => {
      const key = bid.productItemDocumentId || bid.productItemId || bid.itemIndex
      if (key !== undefined && acc[key] === undefined) acc[key] = bid
      return acc
    }, {})
  }, [bids])

  const updateDraft = (key, patch) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }))
  }

  const confirmBid = (item, index) => {
    const key = getItemKey(item, index)
    const draft = drafts[key] || {}
    const quantity = numberValue(draft.quantity)
    const unitPrice = numberValue(draft.unitPrice)
    if (quantity <= 0 || unitPrice <= 0) return
    onConfirmBid?.(item, index, {
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      note: draft.note || "",
    })
  }

  return (
    <div className="mt-6">
      <div className="mb-2 text-sm font-bold">{t("aiLiveVideo.productItems", "Chi tiết sản phẩm trong phiên live")}</div>
      <div className="overflow-x-auto border border-black">
        <table className={`w-full text-xs ${canBid ? "min-w-[1200px]" : "min-w-[900px]"}`}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-2">{t("productGrid.sequenceNumber", "STT")}</th>
              <th className="border border-black px-2 py-2 min-w-[180px]">{t("productGrid.nameOfGoods", "Tên hàng hóa")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.model", "Model")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.size", "Kích thước")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.color", "Màu sắc")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.quantityMinimum", "SL tối thiểu")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.unit", "Đơn vị")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.unitMarketPrice", "Giá thị trường")}</th>
              <th className="border border-black px-2 py-2">{t("productGrid.lowestHighestAskingPricelow", "Giá yêu cầu")}</th>
              {canBid ? (
                <>
                  <th className="border border-black px-2 py-2 min-w-[120px]">{t("liveGoods.setQuantity", "SL đặt")}</th>
                  <th className="border border-black px-2 py-2 min-w-[140px]">{t("productGrid.setPrice", "Giá đặt")}</th>
                  <th className="border border-black px-2 py-2 min-w-[140px]">{t("liveGoods.totalLowest", "Thành tiền")}</th>
                  <th className="border border-black px-2 py-2 min-w-[180px]">{t("common.note", "Ghi chú")}</th>
                  <th className="border border-black px-2 py-2 min-w-[130px]">{t("customerConfirm.title", "XÁC NHẬN")}</th>
                </>
              ) : null}
              <th className="border border-black px-2 py-2 min-w-[180px]">{t("aiLiveVideo.latestBid", "Giá mới nhất")}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="border border-black px-3 py-6 text-center" colSpan={canBid ? 15 : 10}>
                  {t("aiLiveVideo.noProductItems", "Chưa có product item cho sản phẩm này.")}
                </td>
              </tr>
            ) : items.map((item, index) => {
              const key = getItemKey(item, index)
              const draft = drafts[key] || {}
              const quantity = draft.quantity || ""
              const unitPrice = draft.unitPrice || ""
              const totalAmount = numberValue(quantity) * numberValue(unitPrice)
              const latestBid = latestBidByItem[item.documentId] || latestBidByItem[item.id] || latestBidByItem[index]
              const isSubmitting = submittingBidKey === key

              return (
                <tr key={key}>
                  <td className="border border-black px-2 py-2 text-center">{item.rowIndex || index + 1}</td>
                  <td className="border border-black px-2 py-2 font-semibold">{item.name || "-"}</td>
                  <td className="border border-black px-2 py-2">{item.model || "-"}</td>
                  <td className="border border-black px-2 py-2">{item.size || item.shape || "-"}</td>
                  <td className="border border-black px-2 py-2">{item.color || "-"}</td>
                  <td className="border border-black px-2 py-2 text-right">{item.quantityMinRequire || item.quantityMinimum || "-"}</td>
                  <td className="border border-black px-2 py-2">{item.unit || "-"}</td>
                  <td className="border border-black px-2 py-2 text-right">{formatMoney(item.unitMarketPrice)}</td>
                  <td className="border border-black px-2 py-2 text-right">{formatMoney(item.unitAskingPrice || item.autoAcceptPriceLow || item.autoAcceptPrice)}</td>
                  {canBid ? (
                    <>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={quantity}
                          onChange={(event) => updateDraft(key, { quantity: event.target.value })}
                          className="w-full border border-gray-300 px-2 py-2 text-right"
                        />
                      </td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={unitPrice}
                          onChange={(event) => updateDraft(key, { unitPrice: event.target.value })}
                          className="w-full border border-gray-300 px-2 py-2 text-right"
                        />
                      </td>
                      <td className="border border-black px-2 py-2 text-right font-bold">{formatMoney(totalAmount)}</td>
                      <td className="border border-black px-2 py-2">
                        <input
                          value={draft.note || ""}
                          onChange={(event) => updateDraft(key, { note: event.target.value })}
                          className="w-full border border-gray-300 px-2 py-2"
                        />
                      </td>
                      <td className="border border-black px-2 py-2 text-center">
                        <button
                          type="button"
                          disabled={isSubmitting || numberValue(quantity) <= 0 || numberValue(unitPrice) <= 0}
                          onClick={() => confirmBid(item, index)}
                          className="border border-black bg-cyan-200 px-3 py-2 font-bold disabled:cursor-not-allowed disabled:bg-gray-200"
                        >
                          {isSubmitting ? t("common.loading", "Đang tải...") : t("customerConfirm.title", "XÁC NHẬN")}
                        </button>
                      </td>
                    </>
                  ) : null}
                  <td className="border border-black px-2 py-2">
                    {latestBid ? (
                      <div>
                        <div className="font-bold">{formatMoney(latestBid.unitPrice)} x {latestBid.quantity}</div>
                        <div>{latestBid.viewerName || t("aiLiveVideo.guest", "Khách")}</div>
                      </div>
                    ) : "-"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
