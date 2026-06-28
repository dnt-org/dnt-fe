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
          <ProductGrid products={goodsItems} category={selectedType} />
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
          <div className="grid grid-cols-16 border-gray-300">
            <div className="col-span-4 border-b border-r border-t border-gray-300 p-2 flex items-center">
              <div>{t("goods.successFee")}</div>
            </div>
            <div className="col-span-2 border-b border-r border-t border-gray-300 p-2 flex items-center">
              <NumberInput name="videoAd" value={goodsInfo.videoAd} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-2 p-2 text-left"><div className="text-red-500">*</div></div>
          </div>

          <div className="grid grid-cols-1 border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.vatOtherFees")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2">
              <div className="text-right">0 <span className="text-gray-700">%</span></div>
            </div>
            <div className="col-span-6 p-2 text-center" />
          </div>
          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-t border-gray-300 p-2 flex items-center">
              <div>{t("goods.eventFee")}</div>
            </div>
            <div className="col-span-2 border-r border-t border-gray-300 p-2 flex items-center">
              <NumberInput name="eventPercentFee" value={goodsInfo.eventPercentFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1  text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-t border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-t border-gray-300 p-2 flex items-center">
              <NumberInput name="eventFee" value={goodsInfo.eventFee} onChange={onGoodsInfoChange} className="w-full  border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-t border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput name="eventFee" value={goodsInfo.eventFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-t border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-1 border-gray-300 p-2"></div>
            <div className="col-span-1 border-gray-300 p-2"></div>
            <div className="col-span-1 border-gray-300 p-2"></div>
          </div>

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
              <TwoLineUnitInput name="livestreamFee" value={goodsInfo.livestreamFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-3 border-r border-gray-300 p-2 text-center flex items-center justify-center">
              <FileInput name="uploadLivestreamGoodsVideo" label={t("goods.uploadLivestreamGoodsVideo")} />
            </div>
          </div>

          <div className="grid grid-cols-16 border-b border-gray-300">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div className="uppercase">{t("goods.advertisingFee") || "PHÍ QUẢNG CÁO"}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="advertisingPercent" value={goodsInfo.advertisingPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center font-bold">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <NumberInput name="advertisingFee" value={goodsInfo.advertisingFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput name="advertisingFee" value={goodsInfo.advertisingFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center gap-1">
                <NumberInput name="advertisingAmount" value={goodsInfo.advertisingAmount} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-center font-bold" placeholder={t("goods.enterNum") || "(nhập số)"} />
                <div className="flex items-center justify-center">
                  <TwoLineUnitInput unitBottom="D" centerOnly={true} className="!text-[10px] !w-auto mr-1" />
                  <span className="text-[10px] font-bold whitespace-nowrap">
                    {t("goods.vndPerSecondView").replace(/^(VNĐ|VND|\s)*\/?\s*/i, "/ ")}
                  </span>
                </div>
              </div>
              <div className="col-span-1 p-2 flex items-center justify-center font-bold text-center border-r border-gray-300">
                <FileInput name="advertisingFile" label={t("goods.uploadAdvertisingVideo") || "TẢI LÊN VIDEO QUẢNG CÁO"} />
              </div>
            </div>
          </div>

          {/* Nhóm 3 dòng: Đăng ký làm video ... (dùng 1 grid và dùng row-span-3 cho 3 nút chung) */}
          <div className="grid grid-cols-16 border-b border-gray-300">
            {/* Row 1 - Đăng ký làm video livestream hàng hóa */}
            <div className="col-span-4 border-r border-b border-gray-300 p-2 flex items-center gap-2">
              <Checkbox name="regLivestreamGoods" checked={goodsInfo.regLivestreamGoods} onChange={onGoodsInfoChange} className="w-4 h-4" />
              <div className="font-medium">{t("goods.registerLivestreamGoodsVideo")}</div>
            </div>
            <div className="col-span-2 border-r border-b border-gray-300 p-2 flex items-center">
              <NumberInput name="regLivestreamGoodsPercent" value={goodsInfo.regLivestreamGoodsPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-b border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-b border-gray-300 p-2 flex items-center">
              <NumberInput name="regLivestreamGoodsFee" value={goodsInfo.regLivestreamGoodsFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-b border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput name="regLivestreamGoodsFee" value={goodsInfo.regLivestreamGoodsFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-b border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            {/* 3 nút chung cho cả 3 dòng - dùng row-span-3 */}
            <div className="col-span-1 row-span-3 border-r border-gray-300 p-2 text-center flex flex-col items-center justify-center">
              <button type="button" className="w-full text-xs underline text-blue-600">{t("goods.contractTemplate")}</button>
              <div className="text-[10px] text-gray-500">{t("goods.clickToViewDownload")}</div>
            </div>
            <div className="col-span-1 row-span-3 border-r border-gray-300 p-2 text-center flex items-center justify-center">
              <FileInput name="uploadCompanyProfile" label={t("goods.uploadCompanyProfile")} />
            </div>
            <div className="col-span-1 row-span-3 p-2 text-center flex items-center justify-center border-r border-gray-300">
              <FileInput name="uploadProductProfile" label={t("goods.uploadProductProfile")} />
            </div>

            {/* Row 2 - Đăng ký làm video thương hiệu bản thân */}
            <div className="col-span-4 border-r border-b border-gray-300 p-2 flex items-center gap-2">
              <Checkbox name="regPersonalBrandVideo" checked={goodsInfo.regPersonalBrandVideo} onChange={onGoodsInfoChange} className="w-4 h-4" />
              <div className="font-medium">{t("goods.registerPersonalBrandVideo")}</div>
            </div>
            <div className="col-span-2 border-r border-b border-gray-300 p-2 flex items-center">
              <NumberInput name="regPersonalBrandPercent" value={goodsInfo.regPersonalBrandPercent} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
              <span className="text-gray-700">%</span>
            </div>
            <div className="col-span-1 border-r border-b border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-b border-gray-300 p-2 flex items-center">
              <NumberInput name="regPersonalBrandFee" value={goodsInfo.regPersonalBrandFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1 text-right" placeholder={t("goods.enter")} />
            </div>
            <div className="col-span-1 border-r border-b border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput name="regPersonalBrandFee" value={goodsInfo.regPersonalBrandFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-b border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>

            {/* Row 3 - Đăng ký làm video quảng cáo sản phẩm */}
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center gap-2">
              <Checkbox name="regProductAdVideo" checked={goodsInfo.regProductAdVideo} onChange={onGoodsInfoChange} className="w-4 h-4" />
              <div className="font-medium">{t("goods.registerProductAdVideo")}</div>
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
              <TwoLineUnitInput name="regProductAdFee" value={goodsInfo.regProductAdFee} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
          </div>

          <div className="grid grid-cols-16">
            <div className="col-span-4 border-r border-gray-300 p-2 flex items-center">
              <div>{t("goods.totalFeeVat")}</div>
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-end">
              <div className="text-right">0 <span className="text-gray-700">%</span></div>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">+</div>
            <div className="col-span-3 border-r border-gray-300 p-2 flex items-center">
              <div className="w-full p-1 mr-1 text-right">0</div>
              <span className="text-gray-700"></span>
            </div>
            <div className="col-span-1 border-r border-gray-300 p-2 flex items-center justify-center">
              <TwoLineUnitInput name="totalFeeVat" value={goodsInfo.totalFeeVat} onChange={onGoodsInfoChange} className="w-full border-gray-300 p-1" placeholder={t("goods.enter")} centerOnly={true} />
            </div>
            <div className="col-span-2 border-r border-gray-300 p-2 flex items-center justify-center"><span>{t("goods.prepay")}</span></div>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-1 border-r border-gray-300 p-2 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <TwoLineUnitInput unitBottom="D" centerOnly={true} className="!text-[10px] !w-auto mr-1" />
                  <span className="text-[10px] font-bold whitespace-nowrap">
                    {t("goods.vndPerSecondView").replace(/^(VNĐ|VND|\s)*\/?\s*/i, "/ ")}
                  </span>
                </div>
              </div>
              <div className="col-span-1 p-2"></div>
            </div>
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