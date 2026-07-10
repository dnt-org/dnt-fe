import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "../styles/Login.css"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../services/productService"
import PostTypeMenu from "../components/PostTypeMenu"
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker.jsx"
import AppPageLayout from "../components/layouts/AppPageLayout.jsx"
import GoodsFormRows from "../components/organisms/GoodsFormRows.jsx"
import usePersistentColor from "../hooks/usePersistentColor.js"
import useLocationSelection from "../hooks/useLocationSelection.js"
import useGoodsForm from "../hooks/useGoodsForm.js"
import { buildGoodsDraft, deleteGoodsDraft, loadGoodsDraft, saveGoodsDraft } from "../utils/goodsDraft.js"

export default function NewGoodPostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { color, onColorChange } = usePersistentColor()
  const [selectedType, setSelectedType] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const { countries, provinces, districts, selectedCountry, selectedProvince, selectedDistrict, handleCountryChange, handleProvinceChange, handleDistrictChange, setLocationSelection } = useLocationSelection()
  const { goodsItems, goodsInfo, setGoodsInfo, handleInputChange, formatPriceReviewTime, handleItemsChange } = useGoodsForm()
  const [errorMessage, setErrorMessage] = useState("")
  const [draftMessage, setDraftMessage] = useState("")

  useEffect(() => {
    let mounted = true
    const loadDraft = async () => {
      try {
        const draft = await loadGoodsDraft()
        if (!draft || !mounted) return
        setSelectedType(draft.selectedType || "")
        setSelectedCategory(draft.selectedCategory || "")
        setSelectedCondition(draft.selectedCondition || "")
        setGoodsInfo(draft.goodsInfo || {})
        handleItemsChange(draft.goodsItems?.length ? draft.goodsItems : goodsItems)
        await setLocationSelection({
          country: draft.selectedCountry || "",
          province: draft.selectedProvince || "",
          district: draft.selectedDistrict || "",
        })
        if (mounted) {
          setDraftMessage("Đã tải bản nháp vào form.")
        }
      } catch (err) {
        console.error("Cannot load goods draft:", err)
        deleteGoodsDraft().catch((deleteErr) => console.error("Cannot delete invalid goods draft:", deleteErr))
      }
    }

    loadDraft()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const token = localStorage.getItem("authToken")
    if (!token) {
      setErrorMessage("Bạn cần đăng nhập để đăng hàng hóa.")
      return
    }
    try {
      const res = await createProduct(token, buildPayload(status))
      console.log("Created product:", res.data)
      await deleteGoodsDraft()
      navigate("/")
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message || "Tạo hàng hóa thất bại")
    }
  }

  const handleSaveDraft = (e) => {
    e.preventDefault()
    setErrorMessage("")
    setDraftMessage("")
    buildGoodsDraft({
      selectedType,
      selectedCategory,
      selectedCondition,
      selectedCountry,
      selectedProvince,
      selectedDistrict,
      goodsInfo,
      goodsItems,
    })
      .then((draft) => {
        return saveGoodsDraft(draft)
      })
      .then(() => {
        setDraftMessage("Đã lưu bản nháp trên thiết bị này.")
      })
      .catch((err) => {
        console.error("Cannot save goods draft:", err)
        setErrorMessage("Lưu bản nháp thất bại. Vui lòng thử lại.")
      })
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
        title={t("goods.newPost")}
      />
      <div className="mt-1">
        <form className="border-gray-300">
          <PostTypeMenu activeType="goods" />
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
            onItemsChange={handleItemsChange}
          />
          {/* <AdvertisingSection goodsInfo={goodsInfo} onGoodsInfoChange={onGoodsInfoChange} /> */}
          <div className="border-t border-gray-300 p-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" name="agreeTerms" checked={goodsInfo.agreeTerms || false} onChange={onGoodsInfoChange} className="w-4 h-4 mt-1 flex-shrink-0" required />
              <div className="text-justify text-sm">
                <div className="mb-2 whitespace-pre-line">{t("goods.termsAgreement")}</div>
              </div>
            </div>
          </div>
          {draftMessage && <div className="text-green-600 text-sm text-center px-4 pb-2">{draftMessage}</div>}
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
