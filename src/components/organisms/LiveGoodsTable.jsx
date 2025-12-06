import { useState } from "react"
import { useTranslation } from "react-i18next"
import MoneyInputModal from "../molecules/MoneyInputModal.jsx"

export default function LiveGoodsTable({ initialItems = [] }) {
  const { t } = useTranslation()
  const [items, setItems] = useState(
    initialItems.length > 0
      ? initialItems.map((it, idx) => ({
          index: idx + 1,
          name: it.name || "",
          model: it.model || "",
          size: it.size || "",
          color: it.color || "",
          images: [],
          qualityFiles: [],
          warrantyChangeDays: it.warrantyChangeDays || "",
          warrantyRepairDays: it.warrantyRepairDays || "",
          repairRetentionPercent: it.repairRetentionPercent || "",
          maxDeliveryDays: it.maxDeliveryDays || "",
          handoverLocation: it.handoverLocation || "",
          contractDurationFrom: it.contractDurationFrom || "",
          contractDurationTo: it.contractDurationTo || "",
          directPayment: !!it.directPayment,
          directDepositRequirement: it.directDepositRequirement || "",
          walletPayment: !!it.walletPayment,
          walletDepositRequirement: it.walletDepositRequirement || "",
          vat: !!it.vat,
          qtyMin: it.qtyMin || "",
          qtySet: it.qtySet || "",
          unit: it.unit || "",
          unitMarketPrice: it.unitMarketPrice || "",
          unitAskingPriceLow: it.unitAskingPriceLow || "",
          unitAskingPriceHigh: it.unitAskingPriceHigh || "",
          askChoice: it.askChoice || "low",
          setPrice: it.setPrice || "",
        }))
      : [
          {
            index: 1,
            name: "",
            model: "",
            size: "",
            color: "",
            images: [],
            qualityFiles: [],
            warrantyChangeDays: "",
            warrantyRepairDays: "",
            repairRetentionPercent: "",
            maxDeliveryDays: "",
            handoverLocation: "",
            contractDurationFrom: "",
            contractDurationTo: "",
            directPayment: false,
            directDepositRequirement: "",
            walletPayment: false,
            walletDepositRequirement: "",
            vat: false,
            qtyMin: "",
            qtySet: "",
            unit: "",
            unitMarketPrice: "",
            unitAskingPriceLow: "",
            unitAskingPriceHigh: "",
            askChoice: "low",
            setPrice: "",
          },
        ]
  )
  const [moneyOpen, setMoneyOpen] = useState(false)
  const [moneyRow, setMoneyRow] = useState(null)
  const [moneyKey, setMoneyKey] = useState("")
  const [moneyTitle, setMoneyTitle] = useState("")
  const [moneyInitial, setMoneyInitial] = useState(0)
  const [askChoiceColumn, setAskChoiceColumn] = useState("low")

  const updateItem = (idx, patch) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  const calcAmount = (row) => {
    const qty = Number(row.qtySet || 0)
    const price = Number(row.setPrice || 0)
    return qty * price
  }

  const openMoney = (idx, key, title, initial) => {
    setMoneyRow(idx)
    setMoneyKey(key)
    setMoneyTitle(title)
    setMoneyInitial(initial || 0)
    setMoneyOpen(true)
  }

  const confirmMoney = (num) => {
    if (moneyRow == null || !moneyKey) return
    updateItem(moneyRow, { [moneyKey]: num })
  }

  return (
    <div className="mt-6">
      <div className="overflow-x-auto border border-black">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-1">{t("productGrid.sequenceNumber")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.nameOfGoods")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.model")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.size")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.color")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.image")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.qualityInfo") }} /> *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyChangeDays") }} /> *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyRepairDays") }} /> *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.repairWarrantyPercent") }} /> *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.maxDeliveryDays")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.handoverLocation")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.contractDuration") }} /> *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.directPayment")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.depositRequirementDirect") }} /></th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.paymentViaWallet") }} /></th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed"><span dangerouslySetInnerHTML={{ __html: t("productGrid.depositRequirementWallet") }} /></th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.vat")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.quantityMinimum")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("liveGoods.setQuantity")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.unit")} *</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.unitMarketPrice")} *</th>
              <th className="border border-black px-2 py-1 min-w-[260px]">
                <select className="w-full p-2" value={askChoiceColumn} onChange={(e) => setAskChoiceColumn(e.target.value)}>
                  <option value="low">{t("productGrid.lowestHighestAskingPricelow")}</option>
                  <option value="high">{t("productGrid.lowestHighestAskingPricehigh")}</option>
                </select>
              </th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{t("productGrid.setPrice")}</th>
              <th className="border border-black px-2 py-1 live-goods-col-fixed">{askChoiceColumn === "low" ? t("liveGoods.totalLowest") : t("liveGoods.totalHighest")}</th>
              
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-black px-2 py-1 text-center">{row.index}</td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.name} onChange={(e) => updateItem(idx, { name: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.model} onChange={(e) => updateItem(idx, { model: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.size} onChange={(e) => updateItem(idx, { size: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.color} onChange={(e) => updateItem(idx, { color: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="file" className="w-full p-2" multiple onChange={(e) => updateItem(idx, { images: Array.from(e.target.files || []) })} />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="file" className="w-full p-2" multiple onChange={(e) => updateItem(idx, { qualityFiles: Array.from(e.target.files || []) })} />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.warrantyChangeDays} onChange={(e) => updateItem(idx, { warrantyChangeDays: e.target.value })} onDoubleClick={() => openMoney(idx, "warrantyChangeDays", t("productGrid.warrantyChangeDays"), row.warrantyChangeDays)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.warrantyRepairDays} onChange={(e) => updateItem(idx, { warrantyRepairDays: e.target.value })} onDoubleClick={() => openMoney(idx, "warrantyRepairDays", t("productGrid.warrantyRepairDays"), row.warrantyRepairDays)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.repairRetentionPercent} onChange={(e) => updateItem(idx, { repairRetentionPercent: e.target.value })} onDoubleClick={() => openMoney(idx, "repairRetentionPercent", t("productGrid.repairWarrantyPercent"), row.repairRetentionPercent)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.maxDeliveryDays} onChange={(e) => updateItem(idx, { maxDeliveryDays: e.target.value })} onDoubleClick={() => openMoney(idx, "maxDeliveryDays", t("productGrid.maxDeliveryDays"), row.maxDeliveryDays)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.handoverLocation} onChange={(e) => updateItem(idx, { handoverLocation: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <div className="flex items-center gap-2">
                    <input value={row.contractDurationFrom} onChange={(e) => updateItem(idx, { contractDurationFrom: e.target.value })} className="flex-1 p-2" placeholder={t("liveGoods.from")} />
                    <input value={row.contractDurationTo} onChange={(e) => updateItem(idx, { contractDurationTo: e.target.value })} className="flex-1 p-2" placeholder={t("liveGoods.to")} />
                  </div>
                </td>
                <td className="border border-black px-2 py-1 text-center live-goods-col-fixed">
                  <input type="checkbox" checked={row.directPayment} onChange={(e) => updateItem(idx, { directPayment: e.target.checked })} />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.directDepositRequirement} onChange={(e) => updateItem(idx, { directDepositRequirement: e.target.value })} onDoubleClick={() => openMoney(idx, "directDepositRequirement", t("productGrid.depositRequirementDirect"), row.directDepositRequirement)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 text-center live-goods-col-fixed">
                  <input type="checkbox" checked={row.walletPayment} onChange={(e) => updateItem(idx, { walletPayment: e.target.checked })} />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.walletDepositRequirement} onChange={(e) => updateItem(idx, { walletDepositRequirement: e.target.value })} onDoubleClick={() => openMoney(idx, "walletDepositRequirement", t("productGrid.depositRequirementWallet"), row.walletDepositRequirement)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 text-center live-goods-col-fixed">
                  <input type="checkbox" checked={row.vat} onChange={(e) => updateItem(idx, { vat: e.target.checked })} />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.qtyMin} onChange={(e) => updateItem(idx, { qtyMin: e.target.value })} onDoubleClick={() => openMoney(idx, "qtyMin", t("productGrid.quantityMinimum"), row.qtyMin)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.qtySet} onChange={(e) => updateItem(idx, { qtySet: e.target.value })} onDoubleClick={() => openMoney(idx, "qtySet", t("liveGoods.setQuantity"), row.qtySet)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input value={row.unit} onChange={(e) => updateItem(idx, { unit: e.target.value })} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.unitMarketPrice} onChange={(e) => updateItem(idx, { unitMarketPrice: e.target.value })} onDoubleClick={() => openMoney(idx, "unitMarketPrice", t("productGrid.unitMarketPrice"), row.unitMarketPrice)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  {askChoiceColumn === "low" ? (
                      <input type="number" value={row.unitAskingPriceLow} onChange={(e) => updateItem(idx, { unitAskingPriceLow: e.target.value })} onDoubleClick={() => openMoney(idx, "unitAskingPriceLow", t("productGrid.lowest"), row.unitAskingPriceLow)} className="w-full p-2" />
                  ) : (
                      <input type="number" value={row.unitAskingPriceHigh} onChange={(e) => updateItem(idx, { unitAskingPriceHigh: e.target.value })} onDoubleClick={() => openMoney(idx, "unitAskingPriceHigh", t("productGrid.highest"), row.unitAskingPriceHigh)} className="w-full p-2" />
                  )}
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <input type="number" value={row.setPrice} onChange={(e) => updateItem(idx, { setPrice: e.target.value })} onDoubleClick={() => openMoney(idx, "setPrice", t("productGrid.setPrice"), row.setPrice)} className="w-full p-2" />
                </td>
                <td className="border border-black px-2 py-1 live-goods-col-fixed">
                  <div className="w-28 text-right">{calcAmount(row)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MoneyInputModal
        open={moneyOpen}
        onClose={() => setMoneyOpen(false)}
        title={moneyTitle}
        initialValue={moneyInitial}
        onConfirm={confirmMoney}
      />
    </div>
  )
}