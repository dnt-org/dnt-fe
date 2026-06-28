import React, { useEffect, useState } from "react";
import { Eye as EyeIcon, Forward as ForwardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import useHorizontalScrollbar from "../custom-hooks/useHorizontalScrollbar";
import TwoLineUnitInput from "./atoms/TwoLineUnitInput";

export default function ProductGridReadOnly({ products = [], category }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(products || []);
  const { containerRef, trackRef, thumbRef } = useHorizontalScrollbar();

  useEffect(() => {
    setItems(products || []);
  }, [products]);

  return (
    <>
      <div className="overflow-x-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 transparent' }}>
        {/* Header columns with horizontal scroll */}
        <div className="grid grid-flow-col auto-cols-[300px] border-gray-300 items-stretch" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {t("productGrid.sequenceNumber")}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (1) {t("productGrid.nameOfGoods")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (2) {t("productGrid.model")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (3) {t("productGrid.shape", "HÌNH DẠNG")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (4) {t("productGrid.size")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (5) {t("productGrid.color")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (6) <span dangerouslySetInnerHTML={{ __html: t("productGrid.image") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (7) {t("productGrid.recordingVideo", "QUAY PHIM")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (8) <span dangerouslySetInnerHTML={{ __html: t("productGrid.qualityInfo") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (9) {t("productGrid.poster_info", "THÔNG TIN NGƯỜI ĐĂNG BÀI")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (10) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyChangeDays") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (11) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyPolicy") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (12) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyRepairDays") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (13) <span dangerouslySetInnerHTML={{ __html: t("productGrid.repairWarrantyPercent") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (14) <span dangerouslySetInnerHTML={{ __html: t("productGrid.maxDeliveryDays") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (15) {t("productGrid.handoverLocation")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (16) <span dangerouslySetInnerHTML={{ __html: t("productGrid.contractDuration") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (17) {t("productGrid.timeUnit")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (18) {t("productGrid.directPayment")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (19) <span dangerouslySetInnerHTML={{ __html: t("productGrid.depositRequirementDirect") }} /></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (20) <span dangerouslySetInnerHTML={{ __html: t("productGrid.paymentViaWallet") }} /></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (21) <span dangerouslySetInnerHTML={{ __html: t("productGrid.depositRequirementWallet") }} /></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (22) <span dangerouslySetInnerHTML={{ __html: t("productGrid.vat") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (23) <span dangerouslySetInnerHTML={{ __html: t("productGrid.payOnWeb") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (24) <span dangerouslySetInnerHTML={{ __html: t("productGrid.timeUserMustPayAfterDelivery") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {(category === "SALE" || category === "FOR RENT") && (
              <div> (25) {t("productGrid.quantityMinimum")}</div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (25) {t("productGrid.quantitymax")}</div>
            )}
            {(!category || (category !== "SALE" && category !== "FOR RENT" && category !== "BUY" && category !== "RENT")) && (
              <div> (25) {t("productGrid.quantity")}</div>
            )}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (26) <span dangerouslySetInnerHTML={{ __html: t("productGrid.quantityMinRequire") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (26)
              <span>{t("productGrid.unit")}</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (28) <span dangerouslySetInnerHTML={{ __html: t("productGrid.unitMarketPrice") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {(category === "SALE" || category === "FOR RENT") && (
              <div> (29) <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceLow") }} /></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (29) <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceHigh") }} /></div>
            )}
            {(!category || (category !== "SALE" && category !== "FOR RENT" && category !== "BUY" && category !== "RENT")) && (
              <div> (29) <span dangerouslySetInnerHTML={{ __html: t("productGrid.unitAskingPrice") }} /></div>
            )}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
          {(category === "SALE" || category === "FOR RENT") && (
              <div> (30) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestAmount") }} /></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (30) <span dangerouslySetInnerHTML={{ __html: t("productGrid.highestAmount") }} /></div>
            )}
            {(!category || (category !== "SALE" && category !== "FOR RENT" && category !== "BUY" && category !== "RENT")) && (
              <div> (30) <span dangerouslySetInnerHTML={{ __html: t("productGrid.amountDesired") }} /></div>
            )}
          </div>

          <div className="p-2 text-center border-r border-b border-gray-300 flex flex-col items-center justify-center">
            <div> (31) <span dangerouslySetInnerHTML={{ __html: t("productGrid.totalAmountandvat") }} /></div>
          </div>

          <div className="p-2 text-center border-r border-b border-gray-300 flex flex-col items-center justify-center">
          {(category === "SALE" || category === "FOR RENT") && (
              <div> (32) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestLOWAutoAccept") }} /></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (32) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestHighestAutoAccept") }} /></div>
            )}
            {(!category || (category !== "SALE" && category !== "FOR RENT" && category !== "BUY" && category !== "RENT")) && (
              <div> (32) <span dangerouslySetInnerHTML={{ __html: t("productGrid.autoAcceptPrice") }} /></div>
            )}
          </div>
         <div className="p-2 text-center border-r border-b border-gray-300 flex flex-col items-center justify-center">
          {(category === "SALE" || category === "FOR RENT") && (
              <div> (33) <span dangerouslySetInnerHTML={{ __html: t("productGrid.autoRejectPricelow") }} /></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (33) <span dangerouslySetInnerHTML={{ __html: t("productGrid.autoRejectPricehigh") }} /></div>
            )}
            {(!category || (category !== "SALE" && category !== "FOR RENT" && category !== "BUY" && category !== "RENT")) && (
              <div> (33) <span dangerouslySetInnerHTML={{ __html: t("productGrid.autoRejectPrice") }} /></div>
            )}
          </div>
        </div>

        {/* Rows */}
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="grid grid-flow-col auto-cols-[300px] border-gray-300" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}
          >
            <div className="border-r border-b border-gray-300 text-center flex items-center justify-center">
              <div>{item.id || idx + 1}</div>
            </div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.name}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.model}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.shape}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.size}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.color}</div>
            
            <div className="border-r border-b border-gray-300 p-2 flex items-center justify-center">
              {item.image ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">{t("productGrid.viewFile")}</button>
              ) : (
                <span className="text-gray-400 text-xs">{t("productGrid.noFile")}</span>
              )}
            </div>
            <div className="border-r border-b border-gray-300 p-2 flex items-center justify-center">
              {item.videoFile ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">{t("productGrid.viewFile")}</button>
              ) : (
                <span className="text-gray-400 text-xs">{t("productGrid.noFile")}</span>
              )}
            </div>
            <div className="border-r border-b border-gray-300 p-2 flex items-center justify-center">
              {item.qualityInfoFile ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">{t("productGrid.viewFile")}</button>
              ) : (
                <span className="text-gray-400 text-xs">{t("productGrid.noFile")}</span>
              )}
            </div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.posterInfo}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.warrantyChangeDays} {item.warrantyChangeDays ? 'ngày' : ''}</div>
            <div className="border-r border-b border-gray-300 p-2 flex items-center justify-center">
              {item.warrantyPolicyFile ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">{t("productGrid.viewFile")}</button>
              ) : (
                <span className="text-gray-400 text-xs">{t("productGrid.noFile")}</span>
              )}
            </div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.warrantyRepairDays} {item.warrantyRepairDays ? 'ngày' : ''}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.repairWarrantyRetentionPercent}%</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.maxDeliveryDaysAfterAcceptance} {item.maxDeliveryDaysAfterAcceptance ? 'ngày' : ''}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.handoverLocation}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.contractDurationMultiplicity}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.contractDurationUnit}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.directPayment}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.depositRequirementDirect}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.paymentViaWallet}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.depositRequirementWallet}%</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.vat}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.paymentOnPlatform}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.timeUserMustPayAfterDelivery} {item.timeUserMustPayAfterDelivery ? 'ngày' : ''}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.quantityMinimum}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.quantityMinRequire}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 truncate">{item.unit}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.unitMarketPrice}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.unitAskingPrice}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.amountDesired}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.totalAmountAndVat}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.autoAcceptPrice}</div>
            <div className="w-full border-r border-b border-gray-300 p-2 text-right">{item.autoRejectPrice}</div>
          </div>
        ))}
      </div>
    </>
  );
}
