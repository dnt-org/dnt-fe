import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import "../styles/Login.css"
import { useNavigate } from "react-router-dom"
import { Home as HomeIcon, KeyboardIcon as KeyboardIcon } from "lucide-react"
import { createProduct } from "../services/productService"
import PostTypeMenu from "../components/PostTypeMenu"
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker.jsx"
import GoodsAccount from "../components/GoodsAccount.jsx"
import AppPageLayout from "../components/layouts/AppPageLayout.jsx"
import GoodsFormRows from "../components/organisms/GoodsFormRows.jsx"
import AdvertisingSection from "../components/organisms/AdvertisingSection.jsx"
import usePersistentColor from "../hooks/usePersistentColor.js"
import useLocationSelection from "../hooks/useLocationSelection.js"
import useGoodsForm from "../hooks/useGoodsForm.js"

export default function NewGoodPostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { color, onColorChange } = usePersistentColor()
  const [selectedType, setSelectedType] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const { countries, provinces, districts, selectedCountry, selectedProvince, selectedDistrict, handleCountryChange, handleProvinceChange, handleDistrictChange } = useLocationSelection()
  const { goodsItems, goodsInfo, setGoodsInfo, handleInputChange, formatPriceReviewTime } = useGoodsForm()
  const [errorMessage, setErrorMessage] = useState("")

  const onGoodsInfoChange = (e) => {
    handleInputChange(e)
  }

  const buildPayload = (status) => ({
    ...goodsInfo,
    status,
    listingType: selectedType,
    categoryType: selectedCategory,
    conditionType: selectedCondition,
    nation: selectedCountry,
    province: selectedProvince,
    address: selectedDistrict,
    priceReviewTime: formatPriceReviewTime(),
    items: goodsItems,
  })

  const submitForm = async (status) => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt")
    if (!token) {
      setErrorMessage("Bạn cần đăng nhập để đăng hàng hóa.")
      return
    }
    try {
      const res = await createProduct(token, buildPayload(status))
      console.log("Created product:", res.data)
      navigate("/")
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message || "Tạo hàng hóa thất bại")
    }
  }

  const handleSaveDraft = (e) => {
    e.preventDefault()
    submitForm("draft")
  }

  const handleSendRequest = (e) => {
    e.preventDefault()
    submitForm("pending")
  }

  return (
    <AppPageLayout>
      <PageHeaderWithOutColorPicker
        color={color}
        onColorChange={onColorChange}
        titlePrefix="4"
        leftButton={<button className="text-red-600 hover:text-red-800 relative" onClick={() => navigate("/")}><HomeIcon size={28} /></button>}
        rightButton={<button className="text-red-600 hover:text-red-800" onClick={() => navigate("/admin-control")}><KeyboardIcon size={28} /></button>}
        title={t("goods.newPost")}
      />
      <div className="mt-1">
        <form className="border-gray-300">
          <PostTypeMenu activeType="goods" />
          <GoodsAccount title={t("goods.accountOfGoods")} country={selectedCountry} onTransfer={() => { }} />
          <GoodsFormRows
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            selectedCondition={selectedCondition}
            onTypeChange={(e) => setSelectedType(e.target.value)}
            onCategoryChange={(e) => setSelectedCategory(e.target.value)}
            onConditionChange={(e) => setSelectedCondition(e.target.value)}
            countries={countries}
            provinces={provinces}
            districts={districts}
            selectedCountry={selectedCountry}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            onCountryChange={handleCountryChange}
            onProvinceChange={(e) => {
              handleProvinceChange(e)
              setGoodsInfo((prev) => ({ ...prev, province: e.target.value }))
            }}
            onDistrictChange={(e) => {
              handleDistrictChange(e)
              setGoodsInfo((prev) => ({ ...prev, address: e.target.value }))
            }}
            goodsInfo={goodsInfo}
            onGoodsInfoChange={onGoodsInfoChange}
            goodsItems={goodsItems}
          />
          {/* <AdvertisingSection goodsInfo={goodsInfo} onGoodsInfoChange={onGoodsInfoChange} /> */}
          <div className="border-t border-gray-300 p-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" name="agreeTerms" checked={goodsInfo.agreeTerms || false} onChange={onGoodsInfoChange} className="w-4 h-4 mt-1 flex-shrink-0" required />
              <div className="text-justify text-sm">
                <div className="mb-2">{t("goods.termsAgreement")}</div>
              </div>
            </div>
          </div>
          {errorMessage && <div className="text-red-500 text-sm text-center px-4 pb-2">{errorMessage}</div>}
          <div className="flex justify-center gap-4 p-4 border-t border-gray-300">
            <button type="button" onClick={handleSaveDraft} className="bg-gray-300 hover:bg-gray-100 text-black font-bold py-2 px-6 border border-gray-200">{t("goods.saveDraff")}</button>
            <button type="button" onClick={handleSendRequest} className="bg-gray-300 hover:bg-gray-100 text-black font-bold py-2 px-6 border border-gray-200">{t("goods.sendRequirement")}</button>
          </div>
        </form>
      </div>
    </AppPageLayout>
  )
}