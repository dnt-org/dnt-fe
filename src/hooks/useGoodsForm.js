import { useState } from "react"

export default function useGoodsForm() {
  const [goodsItems, setGoodsItems] = useState([
    {
      id: 1,
      name: "",
      model: "",
      size: "",
      color: "",
      image: null,
      qualityInfoFile: null,
      warrantyChangeDays: "",
      warrantyRepairDays: "",
      repairWarrantyRetentionPercent: "",
      maxDeliveryDaysAfterAcceptance: "",
      handoverLocation: "",
      contractDurationMultiplicity: "",
      contractDurationUnit: "",
      directPayment: "",
      depositRequirementDirect: "",
      paymentViaWallet: "",
      depositRequirementWallet: "",
      vat: "",
      quantityMinimum: "",
      unit: "",
      unitMarketPrice: "",
      unitAskingPrice: "",
      amountDesired: "",
      autoAcceptPrice: "",
    },
  ])

  const [goodsInfo, setGoodsInfo] = useState({})

  const handleGoodsItemChange = (id, field, value) => {
    setGoodsItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleAddGoodsItem = () => {
    setGoodsItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        model: "",
        size: "",
        color: "",
        image: null,
        qualityInfoFile: null,
        warrantyChangeDays: "",
        warrantyRepairDays: "",
        repairWarrantyRetentionPercent: "",
        maxDeliveryDaysAfterAcceptance: "",
        handoverLocation: "",
        contractDurationMultiplicity: "",
        contractDurationUnit: "",
        directPayment: "",
        depositRequirementDirect: "",
        paymentViaWallet: "",
        depositRequirementWallet: "",
        vat: "",
        quantityMinimum: "",
        unit: "",
        unitMarketPrice: "",
        unitAskingPrice: "",
        amountDesired: "",
        autoAcceptPrice: "",
      },
    ])
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setGoodsInfo((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  // Hàm kết hợp giờ và phút thành định dạng 24h (HH:mm)
  const formatPriceReviewTime = () => {
    const hour = (goodsInfo.priceReviewTimeHour || "00").toString().padStart(2, "0")
    const minute = (goodsInfo.priceReviewTimeMinute || "00").toString().padStart(2, "0")
    return `${hour}:${minute}`
  }

  return { goodsItems, goodsInfo, setGoodsInfo, handleGoodsItemChange, handleAddGoodsItem, handleInputChange, formatPriceReviewTime }
}