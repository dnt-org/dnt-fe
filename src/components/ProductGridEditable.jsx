import React, { useEffect, useState } from "react";
import { Eye as EyeIcon, Forward as ForwardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import useHorizontalScrollbar from "../custom-hooks/useHorizontalScrollbar";
import NumberInput from "./atoms/NumberInput";
import TwoLineUnitInput from "./atoms/TwoLineUnitInput";
import CameraCapture from "./CameraCapture";
import { getUserCountry } from "../utils/user";

export default function ProductGridEditable({ products = [], category, onItemsChange }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(products || []);
  const [isFollowing, setIsFollowing] = useState(false);
  const { containerRef, trackRef, thumbRef } = useHorizontalScrollbar();
  const [lowestHighestAskingPrice, setLowestHighestAskingPrice] = useState(true);
  const [lowestAmount, setLowestAmount] = useState(true);
  // Camera: { itemId, mode: "photo" | "video", field } hoặc null
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    setItems(products || []);
  }, [products]);


  const handleItemChange = (id, field, value) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    if (onItemsChange) onItemsChange(updated);
  };

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      name: "",
      model: "",
      shape: "",
      size: "",
      color: "",
      image: null,
      videoFile: null,
      qualityInfoFile: null,
      posterInfo: "",
      warrantyChangeDays: "",
      warrantyPolicyFile: null,
      warrantyRepairDays: "",
      repairWarrantyRetentionPercent: "",
      maxDeliveryDaysAfterAcceptance: "",
      handoverLocation: "",
      contractDurationMultiplicity: "",
      contractDurationUnit: "",
      invoiceExport: "",
      paymentTimeAfterDelivery: "",
      depositRequirement: "",
      quantityMinimum: "",
      quantityMinRequire: "",
      unit: "",
      unitMarketPrice: "",
      unitAskingPrice: "",
      amountDesired: "",
      totalAmountAndVat: "",
      autoAcceptPrice: "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    if (onItemsChange) onItemsChange(updated);
  };

  return (
    <>
      <div className="overflow-x-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 transparent' }}>
        {/* Header columns with horizontal scroll */}
        <div className="grid grid-flow-col auto-cols-[300px] border-gray-300 items-stretch" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {t("productGrid.sequenceNumber")}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (1) {t("productGrid.nameOfGoods")} <span className="text-red-500">*</span></div>
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
            <div> (6) {t("productGrid.image", "HÌNH ẢNH")} <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (7) {t("productGrid.recordingVideo", "QUAY PHIM")} <span className="text-red-500">*</span></div>
          </div>
          {/* New columns */}
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (8) <span dangerouslySetInnerHTML={{ __html: t("productGrid.qualityInfo") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (9) {t("productGrid.poster_info", "THÔNG TIN NGƯỜI ĐĂNG BÀI")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (10) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyChangeDays") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (11) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyPolicy") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (12) <span dangerouslySetInnerHTML={{ __html: t("productGrid.warrantyRepairDays") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (13) <span dangerouslySetInnerHTML={{ __html: t("productGrid.repairWarrantyPercent") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (14) <span dangerouslySetInnerHTML={{ __html: t("productGrid.maxDeliveryDays") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (15) {t("productGrid.handoverLocation")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          {/* THỜI LƯỢNG THỰC HIỆN split into 2 columns */}
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (16) <span dangerouslySetInnerHTML={{ __html: t("productGrid.contractDuration") }} />{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (17) {t("productGrid.invoiceExport", "XUẤT HÓA ĐƠN")} <span className="text-red-500">*</span></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (18) {t("productGrid.paymentViaPlatform", "THANH TOÁN QUA NỀN TẢNG")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (19) {t("productGrid.paymentTimeAfterDelivery", "THỜI GIAN THANH TOÁN CHÍNH THỨC CHO CHỦ HÀNG SAU KHI NHẬN ĐƯỢC HÀNG")} <span className="text-red-500">*</span></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (20) {t("productGrid.depositRequirement", "YÊU CẦU ĐẶT CỌC, KÝ QUỸ")} <span className="text-red-500">*</span></div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {(category === "SALE" || category === "FOR RENT") && (
              <div> (21) {t("productGrid.quantityMinimum")}{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (21) {t("productGrid.quantitymax")}{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "PROVIDE SERVICES" || category === "USE SERVICES" || category === null) && (
              <>
                <select>
                  <option value="1">(21)  {t("productGrid.quantitymax")}</option>
                  <option value="2">(21)  {t("productGrid.quantityMinimum")}</option>
                </select>
              </>
            )}


          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (22) <span dangerouslySetInnerHTML={{ __html: t("productGrid.quantityMinRequire") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (23)
              <span>{t("productGrid.unit")}</span>   <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            <div> (24) <span dangerouslySetInnerHTML={{ __html: t("productGrid.unitMarketPrice") }} />
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
            {(category === "SALE" || category === "FOR RENT") && (
              <div> (25) <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceLow") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (25) <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceHigh") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "PROVIDE SERVICES" || category === "USE SERVICES" || category === null) && (
              <>
                <select>
                  <option value="1">(25)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceLow") }} /></option>
                  <option value="2">(25)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.desiredUnitPriceHigh") }} /></option>
                </select>
              </>
            )}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center flex flex-col items-center justify-center">
          {(category === "SALE" || category === "FOR RENT") && (
              <div> (26) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestAmount") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (26) <span dangerouslySetInnerHTML={{ __html: t("productGrid.highestAmount") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "PROVIDE SERVICES" || category === "USE SERVICES" || category === null) && (
              <>
                <select>
                  <option value="1">(26)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestAmount") }} /></option>
                  <option value="2">(26)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.highestAmount") }} /></option>
                </select>
              </>
            )}
          </div>

          <div className="p-2 text-center border-r border-b border-gray-300 flex flex-col items-center justify-center">
            <div> (27) {t("productGrid.totalPlatformFee", "TỔNG PHÍ NỀN TẢNG (không tính phần trả trước)")}</div>
          </div>

          <div className="p-2 text-center border-r border-b border-gray-300 flex flex-col items-center justify-center">
          {(category === "SALE" || category === "FOR RENT") && (
              <div> (28) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestLOWAutoAccept") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "BUY" || category === "RENT") && (
              <div> (28) <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestHighestAutoAccept") }} />{" "}<span className="text-red-500">*</span></div>
            )}
            {(category === "PROVIDE SERVICES" || category === "USE SERVICES" || category === null) && (
              <>
                <select>
                  <option value="1">(28)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestLOWAutoAccept") }} /></option>
                  <option value="2">(28)  <span dangerouslySetInnerHTML={{ __html: t("productGrid.lowestHighestAutoAccept") }} /></option>
                </select>
              </>
            )}

          </div>
        </div>

        {/* Rows */}
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-flow-col auto-cols-[300px] border-gray-300" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}
          >
            <div className="border-r border-b border-gray-300 text-center flex items-center justify-center">
              <div>{item.id}</div>
            </div>
            <input
              type="text"
              value={item.name}
              onChange={(e) =>
                handleItemChange(item.id, "name", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
            />
            <input
              type="text"
              value={item.model}
              onChange={(e) =>
                handleItemChange(item.id, "model", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
            />
            <input
              type="text"
              value={item.shape}
              onChange={(e) =>
                handleItemChange(item.id, "shape", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
            />
            <input
              type="text"
              value={item.size}
              onChange={(e) =>
                handleItemChange(item.id, "size", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
            />
            <input
              type="text"
              value={item.color}
              onChange={(e) =>
                handleItemChange(item.id, "color", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
            />
            <div className="border-r border-t border-b border-gray-300 p-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCamera({ itemId: item.id, mode: "photo", field: "image" })}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                >
                  📷 {t("productGrid.capturePhoto", "Chụp ảnh")}
                </button>
                {item.image && (
                  <div className="text-xs truncate max-w-[150px]" title={item.image.name}>{item.image.name}</div>
                )}
              </div>
            </div>
            {/* New cells */}
            {/* Col 7: QUAY PHIM */}
            <div className="border-r border-t border-b border-gray-300 p-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCamera({ itemId: item.id, mode: "video", field: "videoFile" })}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                >
                  🎥 {t("productGrid.recordVideo", "Quay phim")}
                </button>
                {item.videoFile && (
                  <div className="text-xs truncate max-w-[150px]" title={item.videoFile.name}>{item.videoFile.name}</div>
                )}
              </div>
            </div>
            {/* Col 8: CHẤT LƯỢNG THÔNG TIN */}
            <div className="border-r border-t border-b border-gray-300 p-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                {/* Hide native file input to remove default "No file chosen" text */}
                <input
                  type="file"
                  id={`qualityInfoFile-${item.id}`}
                  onChange={(e) =>
                    handleItemChange(item.id, "qualityInfoFile", e.target.files?.[0] || null)
                  }
                  className="sr-only"
                />
                <label
                  htmlFor={`qualityInfoFile-${item.id}`}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                >
                  📄 {t("productGrid.uploadFile", "Tải file")}
                </label>
                {item.qualityInfoFile && (
                  <div className="text-xs truncate max-w-[150px]" title={item.qualityInfoFile.name}>{item.qualityInfoFile.name}</div>
                )}
              </div>
            </div>
            {/* Col 9: THÔNG TIN NGƯỜI ĐĂNG BÀI */}
            <input
              type="text"
              value={item.posterInfo}
              onChange={(e) =>
                handleItemChange(item.id, "posterInfo", e.target.value)
              }
              className="w-full border-r border-b border-gray-300"
              placeholder={t("goods.enter")}
            />
            {/* <input
              type="number"
              min="0"
              value={item.warrantyChangeDays}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "warrantyChangeDays",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-right"
            /> */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="warrantyChangeDays"
                type="number"
                value={item.warrantyChangeDays}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "warrantyChangeDays",
                    e.target.value
                  )
                }
                placeholder={t("goods.enter")}
                unit="ngày"
                isInput={true}
              />
            </div>
            <div className="border-r border-t border-b border-gray-300 p-2 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                {/* Hide native file input to remove default "No file chosen" text */}
                <input
                  type="file"
                  id={`warrantyPolicyFile-${item.id}`}
                  onChange={(e) =>
                    handleItemChange(item.id, "warrantyPolicyFile", e.target.files?.[0] || null)
                  }
                  className="sr-only"
                />
                <label
                  htmlFor={`warrantyPolicyFile-${item.id}`}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer whitespace-nowrap"
                >
                  {t("productGrid.uploadFile")}
                </label>
                {item.warrantyPolicyFile && (
                  <div className="text-xs truncate max-w-[150px]" title={item.warrantyPolicyFile.name}>{item.warrantyPolicyFile.name}</div>
                )}
              </div>
            </div>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="warrantyRepairDays"
                type="number"
                value={item.warrantyRepairDays}
                onChange={(e) =>
                  handleItemChange(item.id, "warrantyRepairDays", e.target.value)
                }
                placeholder={t("goods.enter")}
                unit="ngày"
                isInput={true}
              />
            </div>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="repairWarrantyRetentionPercent"
                type="number"
                value={item.repairWarrantyRetentionPercent}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "repairWarrantyRetentionPercent",
                    e.target.value
                  )
                }
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="maxDeliveryDaysAfterAcceptance"
                type="number"
                value={item.maxDeliveryDaysAfterAcceptance}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "maxDeliveryDaysAfterAcceptance",
                    e.target.value
                  )
                }
                placeholder={t("goods.enter")}
                unit="ngày"
                isInput={true}
              />
            </div>
            <div className="border-r border-t border-b border-gray-300 p-2 text-center">
              <select
                value={item.handoverLocation}
                onChange={(e) =>
                  handleItemChange(item.id, "handoverLocation", e.target.value)
                }
                className="w-full border-gray-300 p-1 mt-1 text-center"
              >
                <option value="">{t("productGrid.choose")}</option>
                <option value="Kho bên bán">
                  {t("productGrid.sellerWarehouse")}
                </option>
                <option value="Kho bên mua">
                  {t("productGrid.buyerWarehouse")}
                </option>
              </select>
            </div>
            <select
              value={item.contractDurationMultiplicity}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "contractDurationMultiplicity",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="one-year">{t("productGrid.oneYear")}</option>
              <option value="many-year">{t("productGrid.manyYear")}</option>
              <option value="one-time">{t("productGrid.oneTime")}</option>
              <option value="many-time">{t("productGrid.manyTime")}</option>
            </select>
            <select
              value={item.invoiceExport}
              onChange={(e) =>
                handleItemChange(item.id, "invoiceExport", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="vat">{t("productGrid.invoiceExportVAT", "GIÁ TRỊ GIA TĂNG (VAT)")}</option>
              <option value="no-vat">{t("productGrid.invoiceExportNoVAT", "HÓA ĐƠN BÁN HÀNG (không có VAT)")}</option>
            </select>

            <div className="w-full border-t border-b border-r border-gray-300 text-center p-2 text-xs">
              <span>{t("productGrid.paymentViaInfo", "Theo điểm b, khoản 6, Điều 14 Luật Thương mại điện tử")}</span>
            </div>

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="paymentTimeAfterDelivery"
                type="number"
                value={item.paymentTimeAfterDelivery}
                onChange={(e) =>
                  handleItemChange(item.id, "paymentTimeAfterDelivery", e.target.value)
                }
                placeholder={t("goods.enter")}
                unit="ngày"
                isInput={true}
              />
            </div>

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="depositRequirement"
                type="number"
                value={item.depositRequirement}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "depositRequirement",
                    e.target.value)
                }
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                name="quantityMinimum"
                value={item.quantityMinimum}
                onChange={(e) => handleItemChange(item.id, "quantityMinimum", e.target.value)}
                className="w-full p-3 border-gray-300 text-right"
              />
            </div>
            {/* New cell for (26) quantityMinRequire */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                name="quantityMinRequire"
                value={item.quantityMinRequire}
                onChange={(e) => handleItemChange(item.id, "quantityMinRequire", e.target.value)}
                className="w-full p-3 border-gray-300 text-right"
              />
            </div>
            <input
              type="text"
              value={item.unit}
              onChange={(e) =>
                handleItemChange(item.id, "unit", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300"
            />

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="repairWarrantyRetentionPercent"
                type="number"
                value={item.unitMarketPrice}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "unitMarketPrice",
                    e.target.value
                  )
                }
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            {/* Col 29: unitAskingPrice */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="unitAskingPrice"
                type="number"
                value={item.unitAskingPrice}
                onChange={(e) => handleItemChange(item.id, "unitAskingPrice", e.target.value)}
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            {/* Col 30: amountDesired */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="amountDesired"
                type="number"
                value={item.amountDesired}
                onChange={(e) => handleItemChange(item.id, "amountDesired", e.target.value)}
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            {/* Col 31: totalAmountAndVat */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="totalAmountAndVat"
                type="number"
                value={item.totalAmountAndVat}
                onChange={(e) => handleItemChange(item.id, "totalAmountAndVat", e.target.value)}
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            {/* Col 32: autoAcceptPrice */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="autoAcceptPrice"
                type="number"
                value={item.autoAcceptPrice}
                onChange={(e) => handleItemChange(item.id, "autoAcceptPrice", e.target.value)}
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>

            {/* Col 33: autoRejectPrice */}
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <TwoLineUnitInput
                name="autoRejectPrice"
                type="number"
                value={item.autoRejectPrice}
                onChange={(e) => handleItemChange(item.id, "autoRejectPrice", e.target.value)}
                placeholder={t("goods.enter")}
                country={getUserCountry()}
              />
            </div>
          </div>
        ))}

        <div className="grid grid-flow-col auto-cols-[300px] border-gray-300" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}>
          <div className="border-r border-gray-300 p-2 text-center">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full text-center font-bold text-blue-500 hover:text-blue-700"
            >
              +
            </button>
          </div>



        </div>
        {/* Always-visible horizontal scrollbar track + moving thumb */}
        {/*<div className="scrollbar-track" aria-hidden="true" ref={trackRef}>*/}
        {/*  <div className="scrollbar-thumb" ref={thumbRef}></div>*/}
        {/*</div>*/}
      </div>
      <CameraCapture
        open={!!camera}
        mode={camera?.mode || "photo"}
        onCapture={(file) => {
          if (camera) handleItemChange(camera.itemId, camera.field, file);
        }}
        onClose={() => setCamera(null)}
      />
    </>
  );
}
