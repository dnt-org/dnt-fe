import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import NumberInput from "../atoms/NumberInput"
import FileInput from "../atoms/FileInput"

export default function AdvertisingSection({ goodsInfo, onGoodsInfoChange }) {
  const { t } = useTranslation()
  const rows = [
    { label: t("goods.amountForAdvertising"), name: "advertisingAmount", value: goodsInfo.advertisingAmount, unit: t("goods.vnd") },
    { label: t("goods.onMainPage"), name: "mainPageAd", value: goodsInfo.mainPageAd, unit: t("goods.vndPerSecondView") },
    { label: t("goods.onVideo"), name: "videoAd", value: goodsInfo.videoAd, unit: t("goods.vndPerSecondView") },
  ]
  return (
    <div className="grid grid-cols-17 grid-rows-4 border-b border-gray-300">
      <div className="col-span-1 row-span-4 border-r border-gray-300 p-2 flex items-center justify-center">
        <span className="font-bold">8</span>
      </div>
      <div className="col-span-4 row-span-4 border-r border-gray-300 p-2 flex items-center">
        <div className="font-semibold">{t("goods.advertisingFee")}</div>
      </div>
      {rows.map((item, idx) => (
        <React.Fragment key={item.name}>
          <div className={`col-span-3 border-r border-gray-300 p-2 flex items-center ${idx > 0 ? "border-t" : ""}`}>{item.label}</div>
          <div className={`col-span-4 border-r border-gray-300 p-2 flex items-center ${idx > 0 ? "border-t" : ""}`}>
            <NumberInput name={item.name} value={item.value} onChange={onGoodsInfoChange} className="w-full border-gray-300 text-right" placeholder={t("goods.enter")} />
          </div>
          <div className={`col-span-5 p-2 text-left border-gray-300 ${idx > 0 ? "border-t" : ""}`}>{item.unit}</div>
        </React.Fragment>
      ))}
      <div className="col-span-3 border-r border-t border-gray-300 p-2 flex items-center">{t("goods.advertisingContent")}</div>
      <div className="col-span-4 border-r border-t border-gray-300 p-2 flex items-center">
        <FileInput name="advertisingFile" />
      </div>
      <div className="col-span-5 border-t border-gray-300" />
    </div>
  )
}

AdvertisingSection.propTypes = {
  goodsInfo: PropTypes.object.isRequired,
  onGoodsInfoChange: PropTypes.func.isRequired,
}