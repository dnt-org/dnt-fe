import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Login.css";
import { useParams } from "react-router-dom";
import { getProductById, updateProductPriceInfo } from "../services/productService";
import {
  Home as HomeIcon,
  KeyboardIcon as KeyboardIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Forward as Share2Icon,
} from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import GoodsAccount from "../components/GoodsAccount";


export default function DetailOfGoodsPage() {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [priceData, setPriceData] = useState({
    setPrice: null,
    depositRequirement: null,
  });


  const handlePriceUpdate = async () => {
    const authToken = await localStorage.getItem("authToken");
    try {
      await updateProductPriceInfo(product.id, authToken, priceData);
      alert(t('goods.priceUpdatedSuccess', 'Price updated successfully'));
    } catch (error) {
      alert(t('goods.priceUpdateError', 'Price update failed'));
    }
  };


  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL parameter
  const [product, setProduct] = useState({
    id: 1,
    documentId: "w940wbgafccoucy16evy21v4",
    name: "Oil",
    model: "M",
    size: "120 KG",
    color: "red",
    price: 100000,
    askingPrice: null,
    displayPrice: true,
    hidePrice: false,
    location: "HCM",
    address: null,
    description: null,
    estimatedValue: null,
    deliveryDate: null,
    depositRequirement: null,
    autoAcceptPrice: null,
    unit: null,
    marketPrice: null,
    lowUnitPrice: null,
    lowestUnitAskingPrice: null,
    highestUnitAskingPrice: null,
    deliveryDays: null,
    endPostTime: null,
    lowestAmount: null,
    highestAmount: null,
    lowestAutoAcceptPrice: null,
    highestAutoAcceptPrice: null,
    contractDuration: null,
    personInCharge: null,
    phoneNumber: null,
    email: null,
    confirmOwnership: true,
    eventFeePercentage: null,
    livestreamFee: null,
    advertisingAmount: null,
    showOnMainPage: 0,
    showOnVideo: 0,
    advertisingUrl: null,
    registerForAdvertising: false,
    successFee: null,
    totalFees: null,
    createdAt: "2025-08-10T07:55:48.149Z",
    updatedAt: "2025-08-10T07:55:48.149Z",
    publishedAt: "2025-08-10T07:55:48.127Z",
    listingType: null,
    categoryType: null,
    conditionType: null,
    nation: null,
    province: null
  });

  const categories = {
    sale: { vi: "HÀNG BÁN", en: "Sale" },
    buy: { vi: "CẦN MUA", en: "Buy" },
    rent: { vi: "HÀNG THUÊ", en: "Rent" },
    forRent: { vi: "CHO THUÊ", en: "For rent" },
    service: { vi: "DỊCH VỤ", en: "Service" }
  };

  const subcategories = {
    goods: { vi: "HÀNG HÓA", en: "Goods" },
    land: { vi: "BẤT ĐỘNG SẢN", en: "Land/house" },
    vehicle: { vi: "PHƯƠNG TIỆN", en: "Vehicle" },
    manpower: { vi: "NHÂN LỰC", en: "Manpower" },
    importExport: { vi: "XUẤT - NHẬP KHẨU", en: "Import - Export" }
  };

  const conditions = {
    scrap: { vi: "PHẾ LIỆU", en: "Scrap" },
    new: { vi: "MỚI", en: "New", noteVi: "< 7 năm từ ngày sản xuất", noteEn: "< 7 years from production date" },
    old: { vi: "CŨ", en: "Old", noteVi: "Hoạt động bình thường", noteEn: "Operating normally" },
    unused: { vi: "CHƯA SỬ DỤNG", en: "Unused", noteVi: "> 7 năm từ ngày sản xuất", noteEn: "> 7 years from production date" }
  };

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);

  useEffect(() => {
    // Fetch product details using the ID
    fetchProductDetails();

  }, [id]);

  // Map localStorage values (EN upper-case) to internal keys used by this page
  // Xử lý cả giá trị từ localStorage và API (có thể khác format)
  const mapCategoryToKey = (value) => {
    if (!value) return "";
    const v = value.toString().toUpperCase().replace(/_/g, " ").trim();
    switch (v) {
      case "SALE": return "sale";
      case "BUY": return "buy";
      case "RENT": return "rent";
      case "FOR RENT":
      case "FORRENT": return "forRent";
      case "SERVICES":
      case "SERVICE": return "service";
      default: return "";
    }
  };

  const openAiLiveGoodsVideo = () => {
    const targetId = product?.documentId || product?.custom_id || product?.id || id;
    if (!targetId) return;
    const fromFileLinks = product?.fileLinks?.product?.livestreamVideoFile;
    const videoUrl = typeof fromFileLinks === "string"
      ? fromFileLinks
      : Array.isArray(fromFileLinks) && typeof fromFileLinks[0] === "string"
        ? fromFileLinks[0]
        : product?.livestreamVideoFile?.url || product?.livestreamVideoFile?.data?.attributes?.url || "";

    navigate(`/ai-live/video-goods/${targetId}`, { state: { videoUrl } });
  };

  const mapSubcategoryToKey = (value) => {
    if (!value) return "";
    const v = value.toString().toUpperCase().replace(/_/g, " ").trim();
    switch (v) {
      case "GOODS": return "goods";
      case "LAND AND HOUSE":
      case "LAND HOUSE":
      case "LANDHOUSE":
      case "LAND_HOUSE": return "land";
      case "VEHICLE": return "vehicle";
      case "MANPOWER": return "manpower";
      case "IMPORT - EXPORT":
      case "IMPORT-EXPORT":
      case "IMPORT_EXPORT":
      case "IMPORTEXPORT": return "importExport";
      default: return "";
    }
  };

  const mapConditionToKey = (value) => {
    if (!value) return "";
    const v = value.toString().toUpperCase().replace(/_/g, " ").trim();
    switch (v) {
      case "SCRAP": return "scrap";
      case "NEW": return "new";
      case "OLD": return "old";
      case "UNUSED": return "unused";
      default: return "";
    }
  };

  // Load filter context from localStorage set on the home page and lock the UI controls
  useEffect(() => {
    const lsCategory = localStorage.getItem("category");
    const lsSubcategory = localStorage.getItem("subcategory");
    const lsCondition = localStorage.getItem("condition");
    const lsNation = localStorage.getItem("nation");
    const lsProvince = localStorage.getItem("province");
    const lsDistrict = localStorage.getItem("district");

    setSelectedCategory((prev) => mapCategoryToKey(lsCategory) || prev);
    setSelectedSubcategory((prev) => mapSubcategoryToKey(lsSubcategory) || prev);
    setSelectedCondition((prev) => mapConditionToKey(lsCondition) || prev);
    setSelectedCountry((prev) => lsNation || prev);
    setSelectedProvince((prev) => lsProvince || prev);
    setSelectedDistrict((prev) => lsDistrict || prev);
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data.data);
      console.log(response.data.data);

      // Ưu tiên giá trị từ localStorage (từ filter ở trang chủ), nếu không có thì dùng từ API
      const lsCategory = localStorage.getItem("category");
      const lsSubcategory = localStorage.getItem("subcategory");
      const lsCondition = localStorage.getItem("condition");
      const lsNation = localStorage.getItem("nation");
      const lsProvince = localStorage.getItem("province");

      if (lsCategory) {
        setSelectedCategory(mapCategoryToKey(lsCategory));
      } else if (response.data.data.listingType) {
        // Map giá trị từ API về đúng format nếu cần
        const apiCategory = response.data.data.listingType;
        setSelectedCategory(mapCategoryToKey(apiCategory));
      }

      if (lsSubcategory) {
        setSelectedSubcategory(mapSubcategoryToKey(lsSubcategory));
      } else if (response.data.data.categoryType) {
        const apiSubcategory = response.data.data.categoryType;
        setSelectedSubcategory(mapSubcategoryToKey(apiSubcategory));
      }

      if (lsCondition) {
        setSelectedCondition(mapConditionToKey(lsCondition));
      } else if (response.data.data.conditionType) {
        const apiCondition = response.data.data.conditionType;
        setSelectedCondition(mapConditionToKey(apiCondition));
      }

      if (lsNation) {
        setSelectedCountry(lsNation);
      } else if (response.data.data.nation) {
        setSelectedCountry(response.data.data.nation);
      }

      if (lsProvince) {
        setSelectedProvince(lsProvince);
      } else if (response.data.data.province) {
        setSelectedProvince(response.data.data.province);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  return (
    <div className="min-h-screen w-full">
      <div className="bg-transparent p-4 w-full">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between relative mb-2">
          <button
            className="text-red-600 hover:text-red-800 relative"
            onClick={() => navigate("/")}
          >
            <HomeIcon size={28} />
          </button>
          {/* Tiêu đề ở giữa */}
          <div className="text-center relative flex-1 flex items-center justify-center gap-2">
            <input
              type="color"
              value={color}
              onChange={handleChangeColor}
              className="w-10 h-8 cursor-pointer"
            />
            <h1 className="text-3xl font-bold text-black relative inline-block">
              6 - {t('detailOfGoods.title')}
            </h1>
          </div>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => navigate("/admin-control")}
          >
            <KeyboardIcon size={28} />
          </button>
        </div>
        {/* TÀI KHOẢN HÀNG HÓA Section - Chỉ hiển thị khi đã đăng nhập */}
        {user && (
          <GoodsAccount title={t("goods.accountOfGoods")} onTransfer={() => { /* TODO: thêm handler nếu cần */ }} />
        )}
        {/* Category Selection - Tối ưu không gian */}
        <div className="mt-2">
          <div className="grid grid-cols-5 gap-2">
            <div className="flex items-center justify-center">
              <select
                className="w-full p-2 border border-gray-300"
                value={selectedCategory}
                disabled
              >
                <option value="">{t('detailOfGoods.selectType')}</option>
                {Object.entries(categories).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t(`detailOfGoods.category.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <select
                className="w-full p-2 border border-gray-300"
                value={selectedSubcategory}
                disabled
              >
                <option value="">{t('detailOfGoods.selectType')}</option>
                {Object.entries(subcategories).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t(`detailOfGoods.subcategory.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <select
                className="w-full p-2 border border-gray-300"
                value={selectedCondition}
                disabled
              >
                <option value="">{t('detailOfGoods.selectType')}</option>
                {Object.entries(conditions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {t(`detailOfGoods.condition.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <select className="w-full p-2 border border-gray-300" disabled value={selectedCountry || ""}>
                <option value="">{t('detailOfGoods.selectCountry')}</option>
                {selectedCountry && (
                  <option value={selectedCountry}>{selectedCountry}</option>
                )}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <select className="w-full p-2 border border-gray-300" disabled value={selectedProvince || ""}>
                <option value="">{t('detailOfGoods.selectProvince')}</option>
                {selectedProvince && (
                  <option value={selectedProvince}>{selectedProvince}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* ID Section */}
        <div className="flex items-center border border-gray-300">
          <label className="w-20 text-center font-bold">ID:</label>
          <div className="w-full p-2  border-gray-300 text-center grid grid-cols-12">
            <div className="col-span-11 text-left">
              {product.custom_id}
            </div>
            <div className="col-span-1 flex items-center gap-2 justify-end">
              <EyeIcon size={16} />
              <Share2Icon size={16} />
            </div>

          </div>
        </div>
        <ProductGrid products={[product]} readOnly={true} />

        {/* Product Details Section */}

        {/* Product Information */}
        <div className="w-full border border-gray-300 mt-4 rounded-md overflow-hidden">
          <div className="grid grid-cols-3 divide-y divide-gray-300">
            <div className="p-2 text-left font-bold">
              {t('detailOfGoods.timeReviewPrice')}:
            </div>
            <div className="p-2 text-center border-l border-gray-300">
              <span className="text-sm italic">{product.priceReviewTime || "24:00"}</span>
            </div>
            <div className="border-l border-gray-300"></div>

            <div className="p-2 text-left font-bold">
              {t('detailOfGoods.endTime')}:
            </div>
            <div className="p-2 text-center border-l border-gray-300">
              {product.endPostTime ? new Date(product.endPostTime).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : ''}
            </div>
            <div className="p-2 text-center border-l border-gray-300">
              {product.endPostTime ? new Date(product.endPostTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }) : ''}
            </div>

            <div className="p-2 text-left font-bold">
              {t('detailOfGoods.goodsAddress')}:
            </div>
            <div className="p-2 text-center border-l border-gray-300">
              {product.address}
            </div>
            <div className="p-2 text-center border-l border-gray-300">
              #Map#
            </div>

            {/* Column 1: XÁC MINH HÀNG HÓA */}
            {/* Column 1: XÁC MINH HÀNG HÓA */}
            <div className="p-2 text-center flex flex-col items-center justify-center">
              <div className="font-bold">{t('detailOfGoods.goodsVerify')}</div>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded text-sm mt-1"
                onClick={openAiLiveGoodsVideo}
              >
                {t('detailOfGoods.clickToOpen')}
              </button>
            </div>
            {/* Column 2: THƯƠNG HIỆU NGƯỜI ĐĂNG BÀI */}
            <div className="p-2 text-center flex flex-col items-center justify-center border-l border-gray-300">
              <div className="font-bold">{t('detailOfGoods.posterBrand')}</div>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded text-sm mt-1"
                onClick={openAiLiveGoodsVideo}
              >
                {t('detailOfGoods.clickToOpen')}
              </button>
            </div>
            {/* Column 3: LIVESTREAM HÀNG HÓA */}
            <div className="p-2 text-center flex flex-col items-center justify-center border-l border-gray-300">
              <div className="font-bold">{t('detailOfGoods.goodsLivestream')}</div>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded text-sm mt-1"
                onClick={openAiLiveGoodsVideo}
              >
                {t('detailOfGoods.clickToOpen')}
              </button>
            </div>
          </div>
        </div>


        {/* Fee and Advertising Sections */}
        <div className="w-full border border-gray-300 mt-4 rounded-md overflow-hidden bg-white">
          {/* PHÍ THÀNH CÔNG */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300">
              {t("goods.successFee")}
            </div>
            <div className="col-span-8 p-2">
              {product.successFee}% <span className="text-red-500 ml-2">* &gt;= 2%</span>
            </div>
          </div>

          {/* THUẾ + PHÍ KHÁC */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300">
              {t("goods.vatOtherFees", "THUẾ + PHÍ KHÁC")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">0%</div>
            <div className="col-span-6 p-2 text-[10px] text-gray-500 italic">
              (Nếu có VAT = 0%; Ko VAT = 2% Mua-Bán, 10% Thuê/Dịch vụ)
            </div>
          </div>

          {/* PHÍ HIỂN THỊ TRÊN TRANG CHỦ */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300 text-xs">
              {t("goods.eventFee", "PHÍ HIỂN THỊ TRÊN TRANG CHỦ")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.eventPercentFee}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.eventFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
              <div>{product.mainPageViewCount} D / GIẤY / LƯỢT XEM</div>
              <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
            </div>
          </div>

          {/* PHÍ LIVESTREAM HÀNG HÓA */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300">
              {t("goods.livestreamFee")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.livestreamPercentFee}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.livestreamFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
              <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
              {product.livestreamVideoFile && (
                <button className="bg-blue-100 text-blue-600 px-1 rounded mt-1">Video Livestream</button>
              )}
            </div>
          </div>

          {/* PHÍ QUẢNG CÁO */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300">
              {t("goods.advertisingFee", "PHÍ QUẢNG CÁO")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.advertisingPercent}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.advertisingFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
              <div>{product.advertisingAmount} D / GIẤY / LƯỢT XEM</div>
              <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
            </div>
          </div>

          {/* ĐĂNG KÝ LÀM VIDEO Section */}
          <div className="bg-gray-50 p-2 font-bold text-center border-b border-gray-300">
            {t("goods.registerMakeVideo", "ĐĂNG KÝ LÀM VIDEO")}
          </div>

          {/* Row 1: LIVESTREAM HÀNG HÓA */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-medium border-r border-gray-300 text-[10px] flex items-center gap-1">
              <input type="checkbox" checked={product.regLivestreamGoods} disabled />
              {t("goods.registerLivestreamGoodsVideo", "LIVESTREAM HÀNG HÓA")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regLivestreamGoodsPercent}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regLivestreamGoodsFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
               <div className="flex gap-1">
                  <span className={product.regLivestreamGoodsAI ? "font-bold text-black" : ""}>AI</span> / 
                  <span className={product.regLivestreamGoodsPerson ? "font-bold text-black" : ""}>Người thực</span>
               </div>
               <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
            </div>
          </div>

          {/* Row 2: QUẢNG CÁO SẢN PHẨM */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-medium border-r border-gray-300 text-[10px] flex items-center gap-1">
              <input type="checkbox" checked={product.regProductAdVideo} disabled />
              {t("goods.registerProductAdVideo", "QUẢNG CÁO SẢN PHẨM")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regProductAdPercent}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regProductAdFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
               <div className="flex gap-1">
                  <span className={product.regProductAdAI ? "font-bold text-black" : ""}>AI</span> / 
                  <span className={product.regProductAdPerson ? "font-bold text-black" : ""}>Người thực</span>
               </div>
               <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
            </div>
          </div>

          {/* Row 3: THƯƠNG HIỆU BẢN THÂN */}
          <div className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 p-2 font-medium border-r border-gray-300 text-[10px] flex items-center gap-1">
              <input type="checkbox" checked={product.regPersonalBrandVideo} disabled />
              {t("goods.registerPersonalBrandVideo", "THƯƠNG HIỆU BẢN THÂN")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regPersonalBrandPercent}%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold">
              {product.regPersonalBrandFee?.toLocaleString()}
            </div>
            <div className="col-span-3 p-2 text-[10px] text-gray-500 flex flex-col justify-center">
               <div className="flex gap-1">
                  <span className={product.regPersonalBrandAI ? "font-bold text-black" : ""}>AI</span> / 
                  <span className={product.regPersonalBrandPerson ? "font-bold text-black" : ""}>Người thực</span>
               </div>
               <div className="font-bold text-blue-600">{t("goods.prepay")}</div>
            </div>
          </div>

          {/* TỔNG PHÍ NỀN TẢNG */}
          <div className="grid grid-cols-12 bg-red-50">
            <div className="col-span-4 p-2 font-bold border-r border-gray-300 text-red-600 uppercase">
              {t("goods.totalFeeVat", "TỔNG PHÍ NỀN TẢNG")}
            </div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold text-red-600">
              {/* Calculate total % if needed, or just display 0 if not pre-calculated */}
              0%
            </div>
            <div className="col-span-1 p-2 border-r border-gray-300 text-center font-bold text-red-600">+</div>
            <div className="col-span-2 p-2 border-r border-gray-300 text-center font-bold text-red-600">
              0
            </div>
            <div className="col-span-3 p-2 text-[10px] text-red-600 font-bold flex items-center justify-center">
              {t("goods.prepay")}
            </div>
          </div>
        </div>

        {/* Accept Section - Temp Hidden */}
        {/* <div className="w-full  mt-4">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  className=" p-2 text-center"
                  width="30%"
                ></td>
                <td
                  className=" p-2 text-center font-bold"
                  width="40%"
                >
                  <button
                    onClick={handlePriceUpdate}

                    className="px-6 py-2 border rounded hover:bg-green-600 font-bold w-full"
                  >
                    {t('detailOfGoods.accept')}
                  </button>
                </td>
                <td
                  className=" p-2 text-center"
                  width="30%"
                ></td>
              </tr>
            </tbody>
          </table>
        </div> */}

        {/* Back Button */}

      </div>
    </div>
  );
}
