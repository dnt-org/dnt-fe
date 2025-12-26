import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { filterProducts } from "../services/productService";
import { useTranslation } from 'react-i18next';
import { getCountryByCode } from "../services/countries";
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
  const [error, setError] = useState(null);
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

  useEffect(() => {
    setFilters({
      listingType: selectedCategory ? categories[selectedCategory]?.en?.toLowerCase() : '',
      categoryType: selectedSubcategory ? subcategories[selectedSubcategory]?.en?.toLowerCase() : '',
      conditionType: selectedCondition ? conditions[selectedCondition]?.en?.toLowerCase() : '',
      nation: selectedCountry ? selectedCountry : '',
      province: selectedProvince ? selectedProvince : '',
      name: searchTerm
    });
  }, [selectedCategory, selectedSubcategory, selectedCondition, selectedCountry, selectedProvince, searchTerm]);
  
  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);

  const fetchProducts = async () => {
      try {
        //setLoading(true);
        const response = await filterProducts(filters, currentPage, 10, null, true);
        setProducts(response.data.data || []);
        setTotalPages(response.data.meta.pagination.pageCount);
        setCurrentPage(response.data.meta.pagination.page);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        //setLoading(false);
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
          // If province is already selected, check if it exists in the new list
          if (selectedProvince) {
            const provinceExists = provincesList?.some(
              p => p.en === selectedProvince || p.vi === selectedProvince
            );
            if (!provinceExists) {
              setSelectedProvince('');
            }
          }
          // Set province from localStorage if it was set but not yet applied
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

  useEffect(() => {
    // Read values from localStorage (set by EventFilterComponent)
    const category = localStorage.getItem("category");
    const subcategory = localStorage.getItem("subcategory");
    const condition = localStorage.getItem("condition");
    const nation = localStorage.getItem("nation");
    const province = localStorage.getItem("province");
    
    // Mapping from EventFilterComponent values to ListOfGoodsPage keys
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
    
    // Set category if exists and is valid
    if (category) {
      // Try direct key match first
      if (categories[category]) {
        setSelectedCategory(category);
      } else if (categoryMapping[category]) {
        // Use mapping
        setSelectedCategory(categoryMapping[category]);
      } else {
        // Try to find by normalizing (remove spaces, uppercase)
        const normalized = category.toUpperCase().replace(/\s+/g, '_');
        if (categories[normalized]) {
          setSelectedCategory(normalized);
        } else {
          // Try finding by key value
          const foundCategory = Object.keys(categories).find(
            key => key.toUpperCase() === category.toUpperCase() || 
                   categories[key]?.en?.toUpperCase() === category.toUpperCase()
          );
          if (foundCategory) {
            setSelectedCategory(foundCategory);
          }
        }
      }
    }
    
    // Set subcategory if exists and is valid
    if (subcategory) {
      // Try direct key match first
      if (subcategories[subcategory]) {
        setSelectedSubcategory(subcategory);
      } else if (subcategoryMapping[subcategory]) {
        // Use mapping
        setSelectedSubcategory(subcategoryMapping[subcategory]);
      } else {
        // Try to find by normalizing
        const normalized = subcategory.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
        if (subcategories[normalized]) {
          setSelectedSubcategory(normalized);
        } else {
          // Try finding by key value
          const foundSubcategory = Object.keys(subcategories).find(
            key => key.toUpperCase() === subcategory.toUpperCase() ||
                   subcategories[key]?.en?.toUpperCase() === subcategory.toUpperCase()
          );
          if (foundSubcategory) {
            setSelectedSubcategory(foundSubcategory);
          }
        }
      }
    }
    
    // Set condition if exists and is valid
    if (condition) {
      // Extract base condition value (before parentheses) in case it includes notes
      const baseCondition = condition.split(" (")[0].toUpperCase();
      
      // Try direct key match first
      if (conditions[condition]) {
        setSelectedCondition(condition);
      } else if (conditions[baseCondition]) {
        // Try match with base condition (without notes)
        setSelectedCondition(baseCondition);
      } else {
        // Try to find by normalizing
        const normalized = condition.toUpperCase();
        if (conditions[normalized]) {
          setSelectedCondition(normalized);
        } else {
          // Try finding by key value - compare with base en value (before parentheses)
          const foundCondition = Object.keys(conditions).find(
            key => {
              const baseEnValue = conditions[key]?.en?.split(" (")[0]?.toUpperCase();
              return key.toUpperCase() === baseCondition ||
                     baseEnValue === baseCondition;
            }
          );
          if (foundCondition) {
            setSelectedCondition(foundCondition);
          }
        }
      }
    }
    
    // Set country
    if (nation) {
      setSelectedCountry(nation);
    }
    
    // Province will be set automatically when provinces are loaded via the useEffect above

    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-1 rounded-lg shadow-lg w-full mx-auto">
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
          {/* Updated to 5-column grid */}
          <div className="grid grid-cols-5 gap-2">
            {/* Column 1 - Categories */}
            <div className="flex items-center justify-center">
              <select 
                className="w-full p-2 border border-gray-300"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">{t('goods.selectType')}</option>
                {Object.entries(categories).map(([key, value]) => (
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
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option value="">{t('goods.selectSubcategory')}</option>
                {Object.entries(subcategories).map(([key, value]) => (
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
                onChange={(e) => setSelectedCondition(e.target.value)}
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
                onChange={(e) => setSelectedProvince(e.target.value)}
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
                // placeholder={t('goods.searchPlaceholder')} 
                className="flex-1 p-2 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Listing section */}
          <div className="mt-1">
            
            {/* Sample listings */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-1">
              {/* Generate 12 sample items */}
              {products.map((_, index) => (
                <div 
                  key={index} 
                  className="border border-gray-300 p-2 flex flex-col relative overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => navigate(`/list-of-goods/${_.documentId}`)}
                >
                  {/* Background watermark image */}
                  <div className="absolute inset-0 opacity-15 z-0">
                    <img 
                      src={_.image ? _.image : 'https://img.lovepik.com/png/20231125/delivery-box-3d-illustration-icon-arrows-search_698016_wh860.png'}
                      alt="Watermark" 
                      className="w-full h-full object-cover"
                    />
                  </div>               
                  {/* Product details - with z-index to appear above the watermark */}
                  <div className="text-center font-medium relative z-10">{_.name}</div>
                  <div className="text-center text-sm relative z-10">{_.price}</div>
                  <div className="text-center text-sm text-gray-600 relative z-10">{_.address}</div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 ${
                        currentPage === index + 1 ? 'bg-gray-200' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
