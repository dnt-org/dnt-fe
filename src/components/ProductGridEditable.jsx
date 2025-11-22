import React, { useEffect, useState } from "react";
import { Eye as EyeIcon, Forward as ForwardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import useHorizontalScrollbar from "../custom-hooks/useHorizontalScrollbar";
import NumberInput from "./atoms/NumberInput";

export default function ProductGridEditable({ products = [], onItemsChange }) {
  const { t } = useTranslation();
  const [items, setItems] = useState(products || []);
  const [isFollowing, setIsFollowing] = useState(false);
  const { containerRef, trackRef, thumbRef } = useHorizontalScrollbar();
  const [lowestHighestAskingPrice, setLowestHighestAskingPrice] = useState(true);
  const [lowestAmount, setLowestAmount] = useState(true);

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
      autoRejectPrice: "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    if (onItemsChange) onItemsChange(updated);
  };

  return (
    <>


      <div className="overflow-x-scroll" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 transparent' }}>
        {/* Header columns with horizontal scroll */}
        <div className="grid grid-flow-col auto-cols-[300px] border-gray-300" style={{ gridTemplateColumns: '50px repeat(auto-fit, 300px)' }}>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            {t("productGrid.sequenceNumber")}
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.nameOfGoods")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.model")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.size")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.color")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.image")} <span className="text-red-500">*</span>
            </div>
          </div>
          {/* New columns */}
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.qualityInfo")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.warrantyChangeDays")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.warrantyRepairDays")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.repairWarrantyPercent")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.maxDeliveryDays")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.handoverLocation")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          {/* THỜI LƯỢNG THỰC HIỆN split into 2 columns */}
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.contractDuration")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.timeUnit")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.directPayment")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.depositRequirementDirect")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.paymentViaWallet")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{t("productGrid.depositRequirementWallet")}</div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.vat")} <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.quantityMinimum")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.unit")} <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>
              {t("productGrid.unitMarketPrice")}{" "}
              <span className="text-red-500">*</span>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <select
              value={lowestAmount ? "yes" : "no"}
              onChange={(e) =>
                setLowestAmount(lowestAmount === undefined ? e.target.value === "yes" : !lowestAmount)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="yes">{t("productGrid.lowestHighestAskingPricelow")}</option>
              <option value="no">{t("productGrid.lowestHighestAskingPricehigh")}</option>
            </select>
            <span className="text-red-500">*</span>
            <div>
            </div>
          </div>
          <div className="border-r border-b border-gray-300 p-2 text-center">
            <div>{lowestAmount ? t("productGrid.lowestAmount") : t("productGrid.highestAmount")}</div>
          </div>
          <div className="p-2 text-center border-r border-b border-gray-300">
            <div>{lowestAmount ? t("productGrid.lowestHighestAutoAccept") : t("productGrid.highestAutoAccept")}</div>
          </div>
          <div className="p-2 text-center border-r border-b border-gray-300">
            <div>{lowestAmount ? t("productGrid.autoRejectPricelow") : t("productGrid.autoRejectPricehigh")}</div>
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
            <div className="border-r border-t border-b border-gray-300 p-2 text-center">
              <input
                type="file"
                onChange={(e) =>
                  handleItemChange(item.id, "image", e.target.files[0])
                }
                className="w-full p-1 mt-1 text-xs border"
              />
            </div>
            {/* New cells */}
            <div className="border-r border-t border-b border-gray-300 p-2 text-center">
              <button
                type="button"
                className="mt-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                {t("productGrid.uploadFile")}
              </button>
            </div>
            <input
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
            />
            <input
              type="number"
              min="0"
              value={item.warrantyRepairDays}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "warrantyRepairDays",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-right"
            />
            <input
              type="number"
              min="0"
              value={item.repairWarrantyRetentionPercent}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "repairWarrantyRetentionPercent",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-right"
            />
            <input
              type="number"
              min="0"
              value={item.maxDeliveryDaysAfterAcceptance}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "maxDeliveryDaysAfterAcceptance",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-right"
            />
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
              <option value="one">{t("productGrid.one")}</option>
              <option value="many">{t("productGrid.many")}</option>
            </select>
            <select
              value={item.contractDurationUnit}
              onChange={(e) =>
                handleItemChange(
                  item.id,
                  "contractDurationUnit",
                  e.target.value
                )
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="time">{t("productGrid.time")}</option>
              <option value="year">{t("productGrid.year")}</option>
            </select>

            <select
              value={item.directPayment}
              onChange={(e) =>
                handleItemChange(item.id, "directPayment", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="yes">{t("productGrid.yes")}</option>
              <option value="no">{t("productGrid.no")}</option>
            </select>

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
            </div>

            <select
              value={item.paymentViaWallet}
              onChange={(e) =>
                handleItemChange(item.id, "paymentViaWallet", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="yes">{t("productGrid.yes")}</option>
              <option value="no">{t("productGrid.no")}</option>
            </select>

            <select
              value={item.depositRequirementWallet}
              onChange={(e) =>
                handleItemChange(item.id, "depositRequirementWallet", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="yes">{t("productGrid.yes")}</option>
              <option value="no">{t("productGrid.no")}</option>
            </select>


            <select
              value={item.vat}
              onChange={(e) =>
                handleItemChange(item.id, "vat", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-center"
            >
              <option value="">{t("productGrid.choose")}</option>
              <option value="yes">{t("productGrid.yes")}</option>
              <option value="no">{t("productGrid.no")}</option>
            </select>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
            </div>
            <input
              type="text"
              value={item.unit}
              onChange={(e) =>
                handleItemChange(item.id, "unit", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300"
            />
            <input
              type="currency"
              value={item.unitMarketPrice}
              onChange={(e) =>
                handleItemChange(item.id, "unitMarketPrice", e.target.value)
              }
              className="w-full border-t border-b border-r border-gray-300 text-right"
            />

            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
            </div>


            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
            </div>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
            </div>
            <div className="w-full border-t border-b border-r border-gray-300 text-right flex items-center">
              <NumberInput
                placeholder={t("goods.enter")}

                className="w-full p-3  border-gray-300 text-right"

              />
              VND
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
    </>
  );
}
