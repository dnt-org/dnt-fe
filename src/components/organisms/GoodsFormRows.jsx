import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import RowNumberCell from "../atoms/RowNumberCell"
import CategoryRow from "../molecules/CategoryRow"
import LocationSelectors from "../molecules/LocationSelectors"
import NumberInput from "../atoms/NumberInput"
import TextInput from "../atoms/TextInput"
import TextArea from "../atoms/TextArea"
import Checkbox from "../atoms/Checkbox"
import FileInput from "../atoms/FileInput"
import ProductGrid from "../ProductGrid"

export default function GoodsFormRows({
  selectedType,
  selectedCategory,
  selectedCondition,
  onTypeChange,
  onCategoryChange,
  onConditionChange,
  countries,
  provinces,
  districts,
  selectedCountry,
  selectedProvince,
  selectedDistrict,
  onCountryChange,
  onProvinceChange,
  onDistrictChange,
  goodsInfo,
  onGoodsInfoChange,
  goodsItems,
}) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1">
      <div className="grid grid-cols-17 border-gray-300">
        <RowNumberCell number={1} required className="col-span-1 border-b" />
        <div className="col-span-16">
          <CategoryRow
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            selectedCondition={selectedCondition}
            onTypeChange={onTypeChange}
            onCategoryChange={onCategoryChange}
            onConditionChange={onConditionChange}
            countries={countries}
            provinces={provinces}
            selectedCountry={selectedCountry}
            selectedProvince={selectedProvince}
            onCountryChange={onCountryChange}
            onProvinceChange={onProvinceChange}
          />
          
        </div>
      </div>

      <div className="grid grid-cols-17 border-b border-gray-300">
        <RowNumberCell number={2} required className="col-span-1" />
        <div className="col-span-16">
          <ProductGrid products={goodsItems} />
        </div>
      </div>

      <div className="grid grid-cols-17 border-b border-gray-300">
        <RowNumberCell number={3} required className="col-span-1 p-2" />
        <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.priceReviewTime")}</div>
        </div>
        <div className="col-span-12 border-r border-gray-300 p-2">
          <input
            type="time"
            name="priceReviewTime"
            value={goodsInfo.priceReviewTime}
            onChange={onGoodsInfoChange}
            className="w-full border-gray-300 p-1 max-w-[80px]"
            placeholder={t("goods.enter")}
          />
        </div>
      </div>

      <div className="grid grid-cols-17 border-b border-gray-300">
        <RowNumberCell number={4} required className="col-span-1 p-2" />
        <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.endPostTime")}</div>
        </div>
        <div className="col-span-12 border-r border-gray-300 p-2">
          <input
            type="datetime-local"
            name="endPostDate"
            value={goodsInfo.endPostDate || ""}
            onChange={onGoodsInfoChange}
            className="max-w-80 border border-gray-300 p-1 text-right"
            placeholder={t("goods.enter")}
            style={{ border: "none" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-17 border-b border-gray-300">
        <RowNumberCell number={5} required className="col-span-1 p-2" />
        <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.goodsAddress")}</div>
        </div>
        <div className="col-span-6 border-r border-gray-300 p-2">
          <TextArea value={goodsInfo.goodsAddress} onChange={(e) => onGoodsInfoChange({ target: { name: "goodsAddress", value: e.target.value, type: "text" } })} className="w-full border-gray-300 p-1 text-left" />
        </div>
        <div className="col-span-6 border-r border-gray-300 p-2 text-center flex items-center justify-center">(MAP)</div>
      </div>

      <div className="grid grid-cols-17 border-b border-gray-300">
        <RowNumberCell number={6} required className="col-span-1 p-2" />
        <div className="col-span-16 border-gray-300 p-2 flex items-center">
          <Checkbox name="confirmOwnership" checked={goodsInfo.confirmOwnership} onChange={onGoodsInfoChange} className="w-4 h-4" />
          <div className="col-span-10 border-gray-300 p-2 flex items-center">
            <div>{t("goods.confirmOwnership")}</div>
          </div>
        </div>
      </div>

      <div id="row7" className="grid grid-cols-17 border-b border-gray-300">
        <div className="col-span-1 border-r border-gray-300 p-2 text-center flex items-center justify-center">
          <span className="font-bold">7</span>
        </div>
        <div className="col-span-16">
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.eventFee")}</div>
            </div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="eventPercentFee" value={goodsInfo.eventPercentFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1  text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="eventFee" value={goodsInfo.eventFee} onChange={onGoodsInfoChange} className="w-full  border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">{t("goods.vnd")}</div>
            <div className="col-span-4 border-gray-300 p-2 text-center"><span>{t("goods.prepay")}</span></div>
          </div>

          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.livestreamFee")}</div>
            </div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="livestreamPercentFee" value={goodsInfo.livestreamPercentFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="livestreamFee" value={goodsInfo.livestreamFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">{t("goods.vnd")}</div>
            <div className="col-span-2 border-r border-gray-300 p-2 text-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-2 border-gray-300 p-2 text-center flex items-center justify-center">
              <FileInput name="videoAd" label={t("goods.uploadAd")} />
            </div>
          </div>

          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.successFee")}</div>
            </div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="videoAd" value={goodsInfo.videoAd} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 p-2 text-center"><div className="text-red-500">*</div></div>
          </div>

          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.vatOtherFees")}</div>
            </div>
            <div className="col-span-3 border-r border-gray-300 p-2">
              <div className="text-right">0 <span className="text-gray-700">%</span></div>
            </div>
            <div className="col-span-5 p-2 text-center" />
          </div>

          <div className="grid grid-cols-16">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.totalFeeVat")}</div>
            </div>
            <div className="col-span-3 border-r border-gray-300 p-2">
              <div className="text-right">0 <span className="text-gray-700">%</span></div>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <div className="w-full p-1 mr-1 text-right">0</div>
              <span className="text-gray-700"></span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 text-center">{t("goods.vnd")}</div>
            <div className="col-span-4 border-gray-300 p-2 text-center"><span>{t("goods.prepay")}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

GoodsFormRows.propTypes = {
  selectedType: PropTypes.string,
  selectedCategory: PropTypes.string,
  selectedCondition: PropTypes.string,
  onTypeChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onConditionChange: PropTypes.func.isRequired,
  countries: PropTypes.array,
  provinces: PropTypes.array,
  districts: PropTypes.array,
  selectedCountry: PropTypes.string,
  selectedProvince: PropTypes.string,
  selectedDistrict: PropTypes.string,
  onCountryChange: PropTypes.func.isRequired,
  onProvinceChange: PropTypes.func.isRequired,
  onDistrictChange: PropTypes.func.isRequired,
  goodsInfo: PropTypes.object.isRequired,
  onGoodsInfoChange: PropTypes.func.isRequired,
  goodsItems: PropTypes.array.isRequired,
}