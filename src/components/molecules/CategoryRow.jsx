import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { categories, subCategories, conditions } from "../../constants/filterConstants"
import Select from "../atoms/Select"

export default function CategoryRow({ selectedType, 
  selectedCategory, 
  selectedCondition, 
  onTypeChange, 
  onCategoryChange, 
  onConditionChange,
  countries,
  provinces,
  selectedCountry,
  selectedProvince,
  onCountryChange,
  onProvinceChange, 
 }) {
  const { t, i18n } = useTranslation()
  const isVi = (i18n.language || "vi").toLowerCase().startsWith("vi")

  const categoryKeyMap = { SALE: "sale", BUY: "buy", RENT: "rent", "FOR RENT": "for_rent", SERVICES: "service" }
  const subcategoryKeyMap = { GOODS: "goods", "LAND AND HOUSE": "landhouse", VEHICLE: "vehicle", MANPOWER: "manpower", "IMPORT - EXPORT": "import_export" }
  const conditionKeyMap = { SCRAP: "scrap", NEW: "new", OLD: "old", UNUSED: "unused" }

  const categoryOptions = [{ label: t("goods.selectCategory"), value: "" }, ...categories.slice(1).map((c) => ({ label: t(`goods.category.${categoryKeyMap[c.en] || c.en.toLowerCase()}`) || (isVi ? c.vi : c.en), value: c.en }))]
  const subcategoryOptions = [{ label: t("goods.selectSubcategoryPlaceholder"), value: "" }, ...subCategories.slice(1).map((sc) => ({ label: t(`goods.subcategory.${subcategoryKeyMap[sc.en] || sc.en.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_")}`) || (isVi ? sc.vi : sc.en), value: sc.en }))]
  const conditionOptions = [{ label: t("goods.selectConditionPlaceholder"), value: "" }, ...conditions.slice(1).map((cd) => ({ label: t(`goods.condition.${conditionKeyMap[cd.en] || cd.en.toLowerCase()}`) || (isVi ? cd.vi : cd.en), value: cd.en }))]

  const countryOptions = (countries || []).map((c, idx) => ({ label: c.vi || c.en, value: c.en || c.vi }))
  const provinceOptions = (provinces || []).map((p, idx) => ({ label: p.vi || p.en, value: p.en || p.vi }))
  
  return (
    <div className="grid grid-cols-4 border-b border-gray-300">
      <div className="border-r border-gray-300 p-2">
        <div className="text-center">
          <Select value={selectedType} onChange={onTypeChange} options={categoryOptions} className="w-full border border-gray-300 p-1" />
        </div>
      </div>
      <div className="border-r border-gray-300 p-2">
        <div className="text-center">
          <Select value={selectedCategory} onChange={onCategoryChange} options={subcategoryOptions} className="w-full border border-gray-300 p-1" />
        </div>
      </div>
      <div className="border-r border-gray-300 p-2">
        <div className="text-center">
          <Select value={selectedCondition} onChange={onConditionChange} options={conditionOptions} className="w-full border border-gray-300 p-1" />
        </div>
      </div>
      <div className="p-2">
        <div className="text-center">
          <Select value={selectedCountry} onChange={onCountryChange} options={countryOptions} className="w-full border border-gray-300 p-1 mb-2" />
        </div>
        <div className="text-center">
          <Select value={selectedProvince} onChange={onProvinceChange} options={provinceOptions} className="w-full border border-gray-300 p-1 mb-2" disabled={!selectedCountry} />
        </div>
      </div>
    </div>
  )
}

CategoryRow.propTypes = {
  selectedType: PropTypes.string,
  selectedCategory: PropTypes.string,
  selectedCondition: PropTypes.string,
  onTypeChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onConditionChange: PropTypes.func.isRequired,
}