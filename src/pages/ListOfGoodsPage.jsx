import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { filterProducts } from "../services/productService";
import { useTranslation } from 'react-i18next';
import { getCountryByCode } from "../services/countries";
import { getMediaUrl } from "../services/videoService";
import {
  Home as HomeIcon,
  KeyboardIcon as KeyboardIcon,
  SearchIcon as SearchIcon,
} from "lucide-react";

// Categories data - defined outside component to avoid reference errors
const categories = {
  "SALE": { vi: "HÀNG BÁN", en: "Sell" },
  "BUY": { vi: "CẦN MUA", en: "Buy" },
  "RENT": { vi: "HÀNG THUÊ", en: "Rent" },
  "FOR_RENT": { vi: "CHO THUÊ", en: "For rent" },
  "SERVICE": { vi: "DỊCH VỤ", en: "Service" },
};

const subcategories = {
  "GOODS": { vi: "HÀNG HÓA", en: "Goods" },
  "LANDHOUSE": { vi: "BẤT ĐỘNG SẢN", en: "Land/house" },
  "VEHICLE": { vi: "PHƯƠNG TIỆN", en: "Vehicle" },
  "Manpower": { vi: "NHÂN LỰC", en: "Manpower" },
  "IMPORT_EXPORT": { vi: "XUẤT - NHẬP KHẨU", en: "Import - Export" },
};

const conditions = {
  "SCRAP": { vi: "PHẾ LIỆU", en: "Scrap" },
  "NEW": { vi: "MỚI", en: "New", noteVi: "< 7 năm từ ngày sản xuất", noteEn: "< 7 years from production date" },
  "OLD": { vi: "CŨ", en: "Old", noteVi: "Hoạt động bình thường", noteEn: "Operating normally" },
  "UNUSED": { vi: "CHƯA SỬ DỤNG", en: "Unused", noteVi: "> 7 năm từ ngày sản xuất", noteEn: "> 7 years from production date" },
};

export default function ListOfGoodsPage() {
  const { t, i18n } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    listingType: '',
    categoryType: '',
    conditionType: '',
    nation: '',
    province: '',
    name: ''
  });
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // DB category mapping functions to translate keys to API-compliant values
  const getDbListingType = (cat) => {
    if (!cat) return "";
    switch (cat.toUpperCase()) {
      case "SALE": return "sale";
      case "BUY": return "buy";
      case "RENT": return "rent";
      case "FOR_RENT":
      case "FOR RENT": return "forRent";
      case "SERVICE":
      case "SERVICES": return "service";
      default: return cat.toLowerCase();
    }
  };

  const getDbCategoryType = (subcat) => {
    if (!subcat) return "";
    switch (subcat.toUpperCase()) {
      case "GOODS": return "goods";
      case "LANDHOUSE":
      case "LAND HOUSE":
      case "LAND_HOUSE":
      case "LAND_AND_HOUSE": return "land";
      case "VEHICLE": return "vehicle";
      case "MANPOWER": return "manpower";
      case "IMPORT_EXPORT": return "importExport";
      default: return subcat.toLowerCase();
    }
  };

  const getDbConditionType = (cond) => {
    if (!cond) return "";
    return cond.split(" (")[0].toLowerCase();
  };

  // Helper functions for displaying values on the product cards
  const getProductTitle = (event) => {
    const firstItem = event.productItems?.[0] || {};
    return firstItem.name || event.name || event.custom_id || event.id;
  };

  const getProductQuantity = (event) => {
    const firstItem = event.productItems?.[0] || {};
    return firstItem.quantityMinimum || firstItem.quantityMinRequire || "";
  };

  const getProductPrice = (event) => {
    const firstItem = event.productItems?.[0] || {};
    return firstItem.unitAskingPrice || firstItem.autoAcceptPrice || firstItem.unitMarketPrice || "";
  };

  const getProductImage = (event) => {
    const firstItem = event.productItems?.[0] || {};
    if (firstItem.image) {
      return getMediaUrl(firstItem.image);
    }
    return 'https://img.lovepik.com/png/20231125/delivery-box-3d-illustration-icon-arrows-search_698016_wh860.png';
  };

  // Sync state to filters structure when inputs change
  useEffect(() => {
    setFilters({
      listingType: getDbListingType(selectedCategory),
      categoryType: getDbCategoryType(selectedSubcategory),
      conditionType: getDbConditionType(selectedCondition),
      nation: selectedCountry || '',
      province: selectedProvince || '',
      name: searchTerm || ''
    });
  }, [selectedCategory, selectedSubcategory, selectedCondition, selectedCountry, selectedProvince, searchTerm]);
  
  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  // Fetch products when filters or currentPage change
  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch 12 items to perfectly fit the 6-column layout
      const response = await filterProducts(filters, currentPage, 12, null, true);
      setProducts(response.data.data || []);
      setTotalPages(response.data.meta.pagination.pageCount || 1);
      setCurrentPage(response.data.meta.pagination.page || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch provinces when country changes
  useEffect(() => {
    const fetchProvinces = async () => {
      if (selectedCountry) {
        setLoadingProvinces(true);
        try {
          const provincesList = await getCountryByCode(selectedCountry);
          setProvinces(provincesList || []);
          if (selectedProvince) {
            const provinceExists = provincesList?.some(
              p => p.en === selectedProvince || p.vi === selectedProvince
            );
            if (!provinceExists) {
              setSelectedProvince('');
            }
          }
          const savedProvince = localStorage.getItem("province");
          if (savedProvince && !selectedProvince) {
            const provinceExists = provincesList?.some(
              p => p.en === savedProvince || p.vi === savedProvince
            );
            if (provinceExists) {
              setSelectedProvince(savedProvince);
            }
          }
        } catch (error) {
          console.error("Error fetching provinces:", error);
          setProvinces([]);
        } finally {
          setLoadingProvinces(false);
        }
      } else {
        setProvinces([]);
        setSelectedProvince('');
      }
    };

    fetchProvinces();
  }, [selectedCountry]);

  // Load criteria pre-filtered on the Home page (stored in localStorage)
  useEffect(() => {
    const category = localStorage.getItem("category");
    const subcategory = localStorage.getItem("subcategory");
    const condition = localStorage.getItem("condition");
    const nation = localStorage.getItem("nation");
    const province = localStorage.getItem("province");
    
    const categoryMapping = {
      "SALE": "SALE",
      "BUY": "BUY",
      "RENT": "RENT",
      "FOR RENT": "FOR_RENT",
      "FOR_RENT": "FOR_RENT",
      "SERVICES": "SERVICE",
      "SERVICE": "SERVICE"
    };
    
    const subcategoryMapping = {
      "GOODS": "GOODS",
      "LAND AND HOUSE": "LANDHOUSE",
      "LANDHOUSE": "LANDHOUSE",
      "VEHICLE": "VEHICLE",
      "MANPOWER": "Manpower",
      "IMPORT - EXPORT": "IMPORT_EXPORT",
      "IMPORT_EXPORT": "IMPORT_EXPORT"
    };
    
    if (category) {
      if (categories[category]) {
        setSelectedCategory(category);
      } else if (categoryMapping[category]) {
        setSelectedCategory(categoryMapping[category]);
      } else {
        const normalized = category.toUpperCase().replace(/\s+/g, '_');
        if (categories[normalized]) {
          setSelectedCategory(normalized);
        } else {
          const foundCategory = Object.keys(categories).find(
            key => key.toUpperCase() === category.toUpperCase() || 
                   categories[key]?.en?.toUpperCase() === category.toUpperCase()
          );
          if (foundCategory) setSelectedCategory(foundCategory);
        }
      }
    }
    
    if (subcategory) {
      if (subcategories[subcategory]) {
        setSelectedSubcategory(subcategory);
      } else if (subcategoryMapping[subcategory]) {
        setSelectedSubcategory(subcategoryMapping[subcategory]);
      } else {
        const normalized = subcategory.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
        if (subcategories[normalized]) {
          setSelectedSubcategory(normalized);
        } else {
          const foundSubcategory = Object.keys(subcategories).find(
            key => key.toUpperCase() === subcategory.toUpperCase() ||
                   subcategories[key]?.en?.toUpperCase() === subcategory.toUpperCase()
          );
          if (foundSubcategory) setSelectedSubcategory(foundSubcategory);
        }
      }
    }
    
    if (condition) {
      const baseCondition = condition.split(" (")[0].toUpperCase();
      if (conditions[condition]) {
        setSelectedCondition(condition);
      } else if (conditions[baseCondition]) {
        setSelectedCondition(baseCondition);
      } else {
        const normalized = condition.toUpperCase();
        if (conditions[normalized]) {
          setSelectedCondition(normalized);
        } else {
          const foundCondition = Object.keys(conditions).find(
            key => {
              const baseEnValue = conditions[key]?.en?.split(" (")[0]?.toUpperCase();
              return key.toUpperCase() === baseCondition || baseEnValue === baseCondition;
            }
          );
          if (foundCondition) setSelectedCondition(foundCondition);
        }
      }
    }
    
    if (nation) {
      setSelectedCountry(nation);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-1 rounded-lg w-full mx-auto">
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
              5 - {t('goods.listOfGoods')}
            </h1>
          </div>
          <button 
            className="text-red-600 hover:text-red-800"
            onClick={() => navigate("/admin-control")}
          >
            <KeyboardIcon size={28} />
          </button>
        </div>

        <div className="mt-2">
          {/* 5-column grid for filters */}
          <div className="grid grid-cols-5 gap-2">
            {/* Column 1 - Categories */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedCategory || ''}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('goods.selectType')}</option>
                {Object.entries(categories).map(([key]) => (
                  <option key={key} value={key}>
                    {t(`goods.category.${key.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Column 2 - Subcategories */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedSubcategory || ''}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('goods.selectSubcategory')}</option>
                {Object.entries(subcategories).map(([key]) => (
                  <option key={key} value={key}>
                    {t(`goods.subcategory.${key.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Column 3 - Conditions */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedCondition || ''}
                onChange={(e) => {
                  setSelectedCondition(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('goods.selectCondition')}</option>
                {Object.entries(conditions).map(([key, value]) => {
                  const isVi = (i18n.language || 'vi').toLowerCase().startsWith('vi');
                  const label = isVi ? value.vi : value.en;
                  const note = isVi ? value.noteVi : value.noteEn;
                  return (
                    <option key={key} value={key}>
                      {note ? `${label} (${note})` : label}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Column 4 - Country */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedCountry || ''}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedProvince('');
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('goods.selectCountry')}</option>
                <option value="Vietnam">{t('goods.vietnam')}</option>
                <option value="United States">{t('goods.usa')}</option>
                <option value="China">{t('goods.china')}</option>
                <option value="Japan">{t('goods.japan')}</option>
                <option value="South Korea">{t('goods.korea')}</option>
              </select>
            </div>
            
            {/* Column 5 - Province */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedProvince || ''}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedCountry || loadingProvinces}
              >
                <option value="">{loadingProvinces ? (i18n.language === 'vi' ? 'Đang tải...' : 'Loading...') : t('goods.selectProvince')}</option>
                {provinces.map((province, index) => {
                  const isVi = (i18n.language || 'vi').toLowerCase().startsWith('vi');
                  return (
                    <option key={index} value={province.en}>
                      {isVi ? province.vi : province.en}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          {/* Search section */}
          <div className="mt-1 border-1 border-gray-300">
            <div className="flex items-center">
              <SearchIcon size={24} className="text-gray-400" />
              <input 
                type="text" 
                className="flex-1 p-2 rounded focus:outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          
          {/* Loading details */}
          {loading && (
            <div className="p-4 text-center text-sm font-semibold text-gray-600">
              {t("common.loading", "Đang tải danh sách hàng hóa...")}
            </div>
          )}

          {/* Listing section */}
          {!loading && (
            <div className="mt-2">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic bg-white/50 rounded-xl border border-dashed border-gray-300">
                  Không tìm thấy hàng hóa nào phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {products.map((product) => {
                    const detailId = product.documentId || product.id;
                    const imageUrl = getProductImage(product);
                    const title = getProductTitle(product);
                    const isVi = (i18n.language || 'vi').toLowerCase().startsWith('vi');

                    return (
                      <div 
                        key={product.id} 
                        className="relative bg-white rounded-xl shadow-sm border border-gray-800 p-3 flex flex-col justify-between items-stretch text-center cursor-pointer min-h-[220px] transition-all hover:translate-y-[-2px] hover:shadow-md overflow-hidden group"
                        onClick={() => navigate(`/list-of-goods/${detailId}`)}
                      >
                        {/* Background watermark image */}
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity z-0">
                          <img 
                            src={imageUrl}
                            alt="Watermark" 
                            className="w-full h-full object-cover"
                          />
                        </div>               
                        
                        {/* Product title */}
                        <h3 className="relative z-10 font-bold text-gray-900 text-xs mb-2 min-h-[36px] line-clamp-3 leading-snug break-words">
                          {title}
                        </h3>

                        {/* Product metadata similar to Home page */}
                        <div className="relative z-10 text-left text-[11px] leading-relaxed font-semibold text-gray-700 space-y-0.5">
                          <p className="truncate">- {t("events.category")}: {product.listingType || ""}</p>
                          <p className="truncate">- {t("events.classification")}: {product.categoryType || ""}</p>
                          <p className="truncate">- {t("events.status")}: {product.conditionType || product.status || ""}</p>
                          <p className="line-clamp-2">- {t("events.goodsAddress")}: {product.goodsAddress || product.address || product.province || ""}</p>
                          <p className="truncate">- {t("events.quantity")}: {getProductQuantity(product)}</p>
                          {getProductPrice(product) && (
                            <p className="truncate text-blue-600">- {t("productGrid.unitAskingPrice", "Đơn giá")}: {getProductPrice(product)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm ${
                          currentPage === index + 1 ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
