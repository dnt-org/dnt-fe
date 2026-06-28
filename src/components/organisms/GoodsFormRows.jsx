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
import TwoLineUnitInput from "../atoms/TwoLineUnitInput"
import Select from "../atoms/Select"

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
  onItemsChange,
}) {
  const { t } = useTranslation()

  const countryOptions = (countries || []).map((c) => ({ label: c.vi || c.en, value: c.en || c.vi }))
  const provinceOptions = (provinces || []).map((p) => ({ label: p.vi || p.en, value: p.en || p.vi }))

  return (
    <div className="grid grid-cols-1">
      <div className="grid grid-cols-30 border-gray-300">
        <RowNumberCell number={1} required className="col-span-1 border-b" />
        <div className="col-span-29">
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

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={2} required className="col-span-1" />
        <div className="col-span-29">
          <ProductGrid products={goodsItems} category={selectedType} onItemsChange={onItemsChange} />
        </div>
      </div>

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={3} required className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.priceReviewTime")}</div>
        </div>
        <div className="col-span-12 border-r border-gray-300 p-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              name="priceReviewTimeHour"
              value={goodsInfo.priceReviewTimeHour || ""}
              onChange={(e) => {
                const hour = Math.max(0, Math.min(23, parseInt(e.target.value) || 0))
                onGoodsInfoChange({ target: { name: "priceReviewTimeHour", value: hour.toString().padStart(2, "0"), type: "text" } })
              }}
              min="0"
              max="23"
              className="w-12 border border-gray-300 p-1 text-center"
              placeholder="00"
            />
            <span>:</span>
            <input
              type="number"
              name="priceReviewTimeMinute"
              value={goodsInfo.priceReviewTimeMinute || ""}
              onChange={(e) => {
                const minute = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                onGoodsInfoChange({ target: { name: "priceReviewTimeMinute", value: minute.toString().padStart(2, "0"), type: "text" } })
              }}
              min="0"
              max="59"
              className="w-12 border border-gray-300 p-1 text-center"
              placeholder="00"
            />
          </div>
          <small className="text-gray-500 text-xs">(HH:mm)</small>
        </div>
      </div>

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={4} required className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.timeLive")}</div>
        </div>
        <div className="col-span-12 border-r border-gray-300 p-2">
          <input
            type="datetime-local"
            name="timeLive"
            value={goodsInfo.timeLive || ""}
            onChange={onGoodsInfoChange}
            className="max-w-80 border border-gray-300 p-1 text-right"
            placeholder={t("goods.enter")}
            style={{ border: "none" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={5} required className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
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

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={6} required className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.goodsAddress")}</div>
        </div>
        <div className="col-span-10 border-r border-gray-300 p-2">
          <TextArea value={goodsInfo.goodsAddress} onChange={(e) => onGoodsInfoChange({ target: { name: "goodsAddress", value: e.target.value, type: "text" } })} className="w-full border-gray-300 p-1 text-left" />
        </div>
        <div className="col-span-2 border-r border-gray-300 p-2 text-center flex items-center justify-center">(MAP)</div>
      </div>

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={7} required className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.location")}</div>
        </div>
        <div className="col-span-12 border-r border-gray-300 p-2">
           <div className="flex items-center gap-2">
              <Select value={selectedCountry} onChange={onCountryChange} options={countryOptions} className="w-full border border-gray-300 p-1 mb-2" />
              <Select value={selectedProvince} onChange={onProvinceChange} options={provinceOptions} className="w-full border border-gray-300 p-1 mb-2" disabled={!selectedCountry} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-30 border-b border-gray-300">
        <RowNumberCell number={8} className="col-span-1 p-2" />
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center">
          <div>{t("goods.taxVatAndPit", "NỘP HỖ THUẾ VAT + TNCN")}</div>
        </div>
        <div className="col-span-6 border-r border-gray-300 p-2 flex items-center justify-end">
          <span className="font-medium">0</span>
          <span className="ml-1 text-gray-700">%</span>
        </div>
      </div>

      <div id="row9" className="grid grid-cols-30 border-b border-gray-300">
        <div className="col-span-1 border-r border-t border-gray-300 p-2 text-center flex items-center justify-center">
          <span className="font-bold">9</span>
        </div>
        <div className="col-span-29">

          {/* PHÍ THÀNH CÔNG */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.successFee")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="successFee" value={goodsInfo.successFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-10 p-2 flex items-center gap-1">
              <span className="text-red-500 font-bold">*</span>
              <span className="text-red-500 text-xs">&gt;= 2%</span>
            </div>
          </div>

          {/* THUẾ + PHÍ KHÁC — auto-filled based on VAT */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.vatOtherFees", "THUẾ + PHÍ KHÁC")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-end">
              <span className="font-medium">0</span>
              <span className="ml-1 text-gray-700">%</span>
            </div>
            <div className="col-span-10 p-2 flex items-start">
              <div className="text-[10px] text-gray-600 leading-tight border border-orange-300 bg-orange-50 rounded p-1">
                <div>Nếu có <span className="font-bold">VAT</span> thì = 0% <span className="text-gray-400">(người cung cấp/nhân liên chịu thuế này)</span></div>
                <div>Nếu ko VAT = <span className="font-bold">2%</span> cho đăng Mua-Bán</div>
                <div>= <span className="font-bold">10%</span> cho đăng thuê, cho thuê, dịch vụ</div>
              </div>
            </div>
          </div>

          {/* PHÍ HIỂN THỊ TRÊN TRANG CHỦ */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div className="text-xs leading-tight">{t("goods.eventFee", "PHÍ HIỂN THỊ TRÊN TRANG CHỦ")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="eventPercentFee" value={goodsInfo.eventPercentFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="eventFee" value={goodsInfo.eventFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex flex-col justify-center gap-1">
              <NumberInput name="mainPageViewCount" value={goodsInfo.mainPageViewCount} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-center text-xs" placeholder={t("goods.enterNum", "(nhập số)")} />
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <TwoLineUnitInput unitBottom="D" centerOnly={true} className="!text-[10px] !w-auto" />
                <span>/ GIẤY / LƯỢT XEM</span>
              </div>
            </div>
          </div>

          {/* PHÍ LIVESTREAM HÀNG HÓA */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.livestreamFee")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="livestreamPercentFee" value={goodsInfo.livestreamPercentFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="livestreamFee" value={goodsInfo.livestreamFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* Video upload (hidden label) + LIVESTREAM title */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <FileInput name="livestreamVideoFile" label="Video" />
              <div className="text-[10px] leading-tight font-medium">LIVESTREAM HÀNG HÓA</div>
            </div>
            {/* Nhập input */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <input type="text" name="livestreamNote" value={goodsInfo.livestreamNote || ""} onChange={onGoodsInfoChange} className="w-full border border-gray-300 p-1 text-xs text-center" placeholder="(Nhập)" />
            </div>
            {/* Giấy xác nhận */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">Giấy xác nhận nội dung quảng cáo</div>
              <FileInput name="livestreamCertFile" label={t("goods.uploadFile", "Tải file")} />
            </div>
          </div>

          {/* PHÍ QUẢNG CÁO */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div className="uppercase">{t("goods.advertisingFee", "PHÍ QUẢNG CÁO")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="advertisingPercent" value={goodsInfo.advertisingPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="advertisingFee" value={goodsInfo.advertisingFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* Nhập số D / GIẤY / LƯỢT XEM */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col justify-center gap-1">
              <NumberInput name="advertisingAmount" value={goodsInfo.advertisingAmount} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-center text-xs" placeholder={t("goods.enterNum", "(nhập số)")} />
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <TwoLineUnitInput unitBottom="D" centerOnly={true} className="!text-[10px] !w-auto" />
                <span>/ GIẤY / LƯỢT XEM</span>
              </div>
            </div>
            {/* Video QUẢNG CÁO */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <FileInput name="advertisingVideoFile" label="Video" />
              <div className="text-[10px] leading-tight font-medium">QUẢNG CÁO</div>
            </div>
            {/* Giấy xác nhận */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">Giấy xác nhận nội dung quảng cáo</div>
              <FileInput name="advertisingCertFile" label={t("goods.uploadFile", "Tải file")} />
            </div>
          </div>

          {/* ĐĂNG KÝ LÀM VIDEO — 3 rows, each with its own right-side columns */}
          {/* Row 1: LIVESTREAM HÀNG HÓA */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-start gap-2">
              <Checkbox name="regLivestreamGoods" checked={goodsInfo.regLivestreamGoods} onChange={onGoodsInfoChange} className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs leading-tight font-medium">{t("goods.registerLivestreamGoodsVideo", "ĐĂNG KÝ LÀM VIDEO LIVESTREAM HÀNG HÓA")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regLivestreamGoodsPercent" value={goodsInfo.regLivestreamGoodsPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regLivestreamGoodsFee" value={goodsInfo.regLivestreamGoodsFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* AI / Người thực */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col gap-1 justify-center">
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regLivestreamGoodsAI" checked={goodsInfo.regLivestreamGoodsAI || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>AI</span>
              </label>
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regLivestreamGoodsPerson" checked={goodsInfo.regLivestreamGoodsPerson || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>Người thực</span>
              </label>
            </div>
            {/* HỒ SƠ ĐẦY ĐỦ CỦA SẢN PHẨM */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">HỒ SƠ ĐẦY ĐỦ CỦA SẢN PHẨM</div>
              <FileInput name="regLivestreamProductProfile" label={t("goods.uploadFile", "Tải file")} />
            </div>
            {/* Giấy xác nhận */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">Giấy xác nhận nội dung quảng cáo</div>
              <FileInput name="regLivestreamCertFile" label={t("goods.uploadFile", "Tải file")} />
            </div>
          </div>

          {/* Row 2: QUẢNG CÁO SẢN PHẨM */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-start gap-2">
              <Checkbox name="regProductAdVideo" checked={goodsInfo.regProductAdVideo} onChange={onGoodsInfoChange} className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs leading-tight font-medium">{t("goods.registerProductAdVideo", "ĐĂNG KÝ LÀM VIDEO QUẢNG CÁO SẢN PHẨM")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regProductAdPercent" value={goodsInfo.regProductAdPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regProductAdFee" value={goodsInfo.regProductAdFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* AI / Người thực */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col gap-1 justify-center">
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regProductAdAI" checked={goodsInfo.regProductAdAI || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>AI</span>
              </label>
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regProductAdPerson" checked={goodsInfo.regProductAdPerson || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>Người thực</span>
              </label>
            </div>
            {/* HỒ SƠ ĐẦY ĐỦ CỦA CÔNG TY */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">HỒ SƠ ĐẦY ĐỦ CỦA CÔNG TY</div>
              <FileInput name="regProductAdCompanyProfile" label={t("goods.uploadFile", "Tải file")} />
            </div>
            {/* Giấy xác nhận + Nền tảng hỗ trợ */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">Giấy xác nhận nội dung quảng cáo</div>
              <FileInput name="regProductAdCertFile" label={t("goods.uploadFile", "Tải file")} />
              <label className="flex items-center gap-1 text-[10px] cursor-pointer mt-1">
                <input type="checkbox" name="regProductAdPlatformSupport" checked={goodsInfo.regProductAdPlatformSupport || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>Nền tảng hỗ trợ</span>
              </label>
            </div>
          </div>

          {/* Row 3: THƯƠNG HIỆU BẢN THÂN */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-start gap-2">
              <Checkbox name="regPersonalBrandVideo" checked={goodsInfo.regPersonalBrandVideo} onChange={onGoodsInfoChange} className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-xs leading-tight font-medium">{t("goods.registerPersonalBrandVideo", "ĐĂNG KÝ LÀM VIDEO THƯƠNG HIỆU BẢN THÂN")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regPersonalBrandPercent" value={goodsInfo.regPersonalBrandPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="regPersonalBrandFee" value={goodsInfo.regPersonalBrandFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* AI / Người thực */}
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col gap-1 justify-center">
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regPersonalBrandAI" checked={goodsInfo.regPersonalBrandAI || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>AI</span>
              </label>
              <label className="flex items-center gap-1 text-[10px] cursor-pointer">
                <input type="checkbox" name="regPersonalBrandPerson" checked={goodsInfo.regPersonalBrandPerson || false} onChange={onGoodsInfoChange} className="w-3 h-3" />
                <span>Người thực</span>
              </label>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">HỒ SƠ ĐẦY ĐỦ CỦA SẢN PHẨM</div>
              <FileInput name="regPersonalBrandProductProfile" label={t("goods.uploadFile", "Tải file")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1 text-center">
              <div className="text-[10px] leading-tight text-gray-600">Giấy xác nhận nội dung quảng cáo</div>
              <FileInput name="regPersonalBrandCertFile" label={t("goods.uploadFile", "Tải file")} />
            </div>
          </div>

          {/* TỔNG PHÍ NỀN TẢNG */}
          <div className="grid grid-cols-16">
            <div className="col-span-4 border-r border-gray-300 p-2 flex flex-col justify-center">
              <div className="font-semibold text-red-600">{t("goods.totalFeeVat", "TỔNG PHÍ NỀN TẢNG")}</div>
              <div className="text-[10px] text-gray-500">(ko cộng Thuế + Phí khác vào đây)</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-end">
              <span className="text-[10px] text-gray-400 mr-1">(a)</span>
              <span className="font-medium">0</span>
              <span className="ml-1 text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <span className="text-[10px] text-gray-400 mr-1">(b)</span>
              <div className="w-full p-1 text-right font-medium">0</div>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-3 border-r border-gray-300 p-2" />
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