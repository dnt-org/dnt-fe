import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { filterProducts } from "../services/productService";

export default function EventComponent() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const columnsDesktop = 6;
  const columnsMobile = 2;
  const perPageDesktop = columnsDesktop * 2;
  const perPageMobile = columnsMobile * 2;

  const [filters, setFilters] = useState(() => ({
    listingType: localStorage.getItem("category") || "",
    categoryType: localStorage.getItem("subcategory") || "",
    conditionType: localStorage.getItem("condition") || "",
    nation: localStorage.getItem("nation") || "",
    province: localStorage.getItem("province") || "",
    name: "",
  }));

  const normalizedFilters = useMemo(() => {
    const trimOrEmpty = (v) => (typeof v === "string" ? v.trim() : "");
    const province = trimOrEmpty(filters.province);
    const nation = trimOrEmpty(filters.nation);
    return {
      listingType: trimOrEmpty(filters.listingType),
      categoryType: trimOrEmpty(filters.categoryType),
      conditionType: trimOrEmpty(filters.conditionType),
      nation: nation && nation.toLowerCase() !== "all" ? nation : "",
      province: province && province.toLowerCase() !== "all" ? province : "",
      name: trimOrEmpty(filters.name),
    };
  }, [filters]);

  const [pageDesktop, setPageDesktop] = useState(1);
  const [pageMobile, setPageMobile] = useState(1);
  const [totalPagesDesktop, setTotalPagesDesktop] = useState(1);
  const [totalPagesMobile, setTotalPagesMobile] = useState(1);
  const [productsDesktop, setProductsDesktop] = useState([]);
  const [productsMobile, setProductsMobile] = useState([]);
  const [loadingDesktop, setLoadingDesktop] = useState(false);
  const [loadingMobile, setLoadingMobile] = useState(false);
  const [errorDesktop, setErrorDesktop] = useState("");
  const [errorMobile, setErrorMobile] = useState("");

  const fetchDesktop = useCallback(async () => {
    try {
      setLoadingDesktop(true);
      setErrorDesktop("");
      const response = await filterProducts(normalizedFilters, pageDesktop, perPageDesktop, null, false);
      setProductsDesktop(response.data?.data || []);
      const pageCount = response.data?.meta?.pagination?.pageCount || 1;
      setTotalPagesDesktop(pageCount);
    } catch (err) {
      setErrorDesktop(err?.message || "Failed to fetch products");
      setProductsDesktop([]);
      setTotalPagesDesktop(1);
    } finally {
      setLoadingDesktop(false);
    }
  }, [normalizedFilters, pageDesktop, perPageDesktop]);

  const fetchMobile = useCallback(async () => {
    try {
      setLoadingMobile(true);
      setErrorMobile("");
      const response = await filterProducts(normalizedFilters, pageMobile, perPageMobile, null, false);
      setProductsMobile(response.data?.data || []);
      const pageCount = response.data?.meta?.pagination?.pageCount || 1;
      setTotalPagesMobile(pageCount);
    } catch (err) {
      setErrorMobile(err?.message || "Failed to fetch products");
      setProductsMobile([]);
      setTotalPagesMobile(1);
    } finally {
      setLoadingMobile(false);
    }
  }, [normalizedFilters, pageMobile, perPageMobile]);

  useEffect(() => {
    fetchDesktop();
  }, [fetchDesktop]);

  useEffect(() => {
    fetchMobile();
  }, [fetchMobile]);

  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      setFilters((prev) => ({
        ...prev,
        listingType: detail.listingType || prev.listingType,
        categoryType: detail.categoryType || prev.categoryType,
        conditionType: detail.conditionType || prev.conditionType,
        nation: detail.nation || prev.nation,
        province: detail.province || prev.province,
      }));
      setPageDesktop(1);
      setPageMobile(1);
    };
    window.addEventListener("dnt:home-filters", handler);
    return () => window.removeEventListener("dnt:home-filters", handler);
  }, []);

  const canGoPreviousDesktop = pageDesktop > 1;
  const canGoNextDesktop = pageDesktop < totalPagesDesktop;
  const canGoPreviousMobile = pageMobile > 1;
  const canGoNextMobile = pageMobile < totalPagesMobile;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragLastX, setDragLastX] = useState(null);
  const swipeThreshold = 50;

  const handlePrevious = (isMobile = false) => {
    if (isMobile) setPageMobile((prev) => Math.max(1, prev - 1));
    else setPageDesktop((prev) => Math.max(1, prev - 1));
  };

  const handleNext = (isMobile = false) => {
    if (isMobile) setPageMobile((prev) => Math.min(totalPagesMobile, prev + 1));
    else setPageDesktop((prev) => Math.min(totalPagesDesktop, prev + 1));
  };

  const onPointerDown = (clientX) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragLastX(clientX);
  };

  const onPointerMove = (clientX) => {
    if (!isDragging || dragStartX === null) return;
    setDragLastX(clientX);
  };

  const onPointerUp = (isMobile = false) => {
    if (!isDragging || dragStartX === null || dragLastX === null) {
      setIsDragging(false);
      setDragStartX(null);
      setDragLastX(null);
      return;
    }
    const deltaX = dragLastX - dragStartX;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        const canGoNext = isMobile ? canGoNextMobile : canGoNextDesktop;
        if (canGoNext) handleNext(isMobile);
      } else if (deltaX > 0) {
        const canGoPrevious = isMobile ? canGoPreviousMobile : canGoPreviousDesktop;
        if (canGoPrevious) handlePrevious(isMobile);
      }
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragLastX(null);
  };

  const getItemFromProduct = (product) => {
    const items = product?.productItems || product?.items || [];
    return Array.isArray(items) && items.length ? items[0] : null;
  };

  const getImageUrl = (product) => {
    const item = getItemFromProduct(product);
    const img = item?.image;
    if (!img) return null;
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    if (img.data?.attributes?.url) return img.data.attributes.url;
    return null;
  };

  const ProductCard = ({ product }) => {
    const item = getItemFromProduct(product);
    const title = item?.name || t("goods.name", "Hàng hóa");
    const address = product?.province || product?.address || product?.goodsAddress || "";
    const thumb = getImageUrl(product);
    const detailId = product?.custom_id || product?.id;

    return (
      <div
        onClick={() => navigate(`/list-of-goods/${detailId}`)}
        style={{
          backgroundColor: "white",
          aspectRatio: 3 / 4,
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
          border: "1px solid black",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {thumb && (
          <img
            src={thumb}
            alt={title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          />
        )}
        
        <div style={{ width: "100%", zIndex: 1, textAlign: "left", fontSize: "12px", fontWeight: "bold", paddingLeft: "5px", paddingBottom: "10px" }}>
          <p style={{ margin: "2px 0" }}>- {title}</p>
          <p style={{ margin: "2px 0" }}>- {product?.listingType || ""}</p>
          <p style={{ margin: "2px 0" }}>- {product?.categoryType || ""}</p>
          <p style={{ margin: "2px 0" }}>- {product?.conditionType || ""}</p>
          <p style={{ margin: "2px 0" }}>- {address}</p>
        </div>
      </div>
    );
  };

  const NavigationButton = ({
    direction,
    onClick,
    disabled,
    isMobile = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#ccc" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: isMobile ? "40px" : "50px",
        height: isMobile ? "40px" : "50px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMobile ? "16px" : "20px",
        zIndex: 10,
      }}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );

  return (
    <section className="action-section " style={{ marginTop: "5px" }}>
      {/* Desktop Layout */}
      <div
        className="action-section-1"
        style={{
          alignItems: "center",
          gap: "2vw",
          position: "relative",
        }}
      >
        <NavigationButton
          direction="prev"
          onClick={() => handlePrevious(false)}
          disabled={!canGoPreviousDesktop}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "10px",
            flex: 1,
            padding: "0 10px",
            userSelect: "none",
          }}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={() => onPointerUp(false)}
          onMouseLeave={() => onPointerUp(false)}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={() => onPointerUp(false)}
        >
          {loadingDesktop && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              {t("common.loading", "Đang tải...")}
            </div>
          )}
          {!loadingDesktop && errorDesktop && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "red" }}>
              {errorDesktop}
            </div>
          )}
          {!loadingDesktop && !errorDesktop && productsDesktop.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              {t("common.noData", "Không có dữ liệu")}
            </div>
          )}
          {!loadingDesktop && !errorDesktop && productsDesktop.map((product, index) => (
            <ProductCard key={`${product?.id || "p"}-${index}`} product={product} />
          ))}
        </div>

        <NavigationButton
          direction="next"
          onClick={() => handleNext(false)}
          disabled={!canGoNextDesktop}
        />
      </div>

      {/* Mobile Layout */}
      <div
        className="action-section-1-mobile"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          position: "relative",
        }}
      >
        <NavigationButton
          direction="prev"
          onClick={() => handlePrevious(true)}
          disabled={!canGoPreviousMobile}
          isMobile={true}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "10px",
            flex: 1,
            padding: "0 10px",
            userSelect: "none",
          }}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={() => onPointerUp(true)}
        >
          {loadingMobile && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              {t("common.loading", "Đang tải...")}
            </div>
          )}
          {!loadingMobile && errorMobile && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "red" }}>
              {errorMobile}
            </div>
          )}
          {!loadingMobile && !errorMobile && productsMobile.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              {t("common.noData", "Không có dữ liệu")}
            </div>
          )}
          {!loadingMobile && !errorMobile && productsMobile.map((product, index) => (
            <ProductCard key={`${product?.id || "p"}-${index}`} product={product} />
          ))}
        </div>

        <NavigationButton
          direction="next"
          onClick={() => handleNext(true)}
          disabled={!canGoNextMobile}
          isMobile={true}
        />
      </div>
    </section>
  );
}
