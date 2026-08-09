import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { filterProducts } from "../services/productService";
import { getMediaUrl } from "../services/videoService";

const isVideoFile = (media) => {
  if (!media) return false;
  const mime = media.mime || media.attributes?.mime || media.data?.attributes?.mime;
  if (mime && typeof mime === "string") {
    return mime.startsWith("video/");
  }
  const url = typeof media === "string"
    ? media
    : (media.url || media.attributes?.url || media.data?.attributes?.url || "");
  if (url && typeof url === "string") {
    return /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url);
  }
  return false;
};

export default function AdBanner() {
  const [showAd, setShowAd] = useState(true);
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [adProducts, setAdProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const VISIBLE_COUNT = 5;

  useEffect(() => {
    const timer = setTimeout(() => setShowCloseBtn(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchAdProducts = async () => {
      try {
        const response = await filterProducts({}, 1, 50, null, false);
        if (!mounted) return;
        const productsList = response.data?.data || [];
        const productsWithAdFile = productsList
          .filter((p) => p.advertisingVideoFile)
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 20);

        if (productsWithAdFile.length > 0) {
          setAdProducts(productsWithAdFile);
        } else if (productsList.length > 0) {
          const newestProducts = [...productsList]
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .slice(0, 20);
          setAdProducts(newestProducts);
        }
      } catch (err) {
        console.error("Failed to load ad products:", err);
      }
    };
    fetchAdProducts();
    return () => { mounted = false; };
  }, []);

  const getAdMediaUrl = (product) => {
    if (product.advertisingVideoFile) return getMediaUrl(product.advertisingVideoFile);
    if (product.videoFile) return getMediaUrl(product.videoFile);
    const items = product.productItems || [];
    if (items.length > 0) {
      const firstItem = items[0];
      if (firstItem.videoFile) return getMediaUrl(firstItem.videoFile);
      if (firstItem.image) return getMediaUrl(firstItem.image);
    }
    return "";
  };

  const isProductMediaVideo = (product) => {
    if (product.advertisingVideoFile) return isVideoFile(product.advertisingVideoFile);
    if (product.videoFile) return isVideoFile(product.videoFile);
    const items = product.productItems || [];
    if (items.length > 0) {
      const firstItem = items[0];
      if (firstItem.videoFile) return true;
      if (firstItem.image) return false;
    }
    return false;
  };

  const maxIndex = Math.max(0, adProducts.length - VISIBLE_COUNT);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  const displayProducts = adProducts.length > 0 ? adProducts : null;

  if (!showAd) return null;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-[100000] h-[100px] border-t font-bold bg-white flex items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close button */}
      {showCloseBtn && (
        <button
          onClick={() => setShowAd(false)}
          className="absolute z-[100001] top-1 right-2 text-gray-500 hover:text-black font-bold cursor-pointer bg-white/80 rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 shadow-sm"
        >
          ✕
        </button>
      )}

      {/* Left nav button - arrow pointing RIGHT (→), shown on hover */}
      {isHovered && adProducts.length > VISIBLE_COUNT && (
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-1 z-[100002] w-8 h-8 rounded-full bg-blue-700/90 text-white flex items-center justify-center shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          →
        </button>
      )}

      {/* Ads list */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 overflow-hidden w-full"
        style={{ transition: "none" }}
      >
        {displayProducts ? (
          displayProducts.slice(currentIndex, currentIndex + VISIBLE_COUNT).map((product) => {
            const mediaUrl = getAdMediaUrl(product);
            const isVideo = isProductMediaVideo(product);
            const detailId = product.documentId || product.id;

            return (
              <div
                key={product.id}
                onClick={() => detailId && navigate(`/list-of-goods/${detailId}`)}
                className="flex-shrink-0 w-48 h-20 bg-gray-100 flex items-center justify-center rounded border-2 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] -translate-y-0.5 transition-transform duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer relative group"
                title={product.name}
              >
                {mediaUrl ? (
                  isVideo ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={product.name}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-900 font-bold text-center px-3 text-[11px] leading-snug break-words whitespace-normal pointer-events-none">
                    {product.name}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-[10px] px-2 py-0.5 truncate font-semibold text-center transition-all group-hover:bg-black/90 pointer-events-none">
                  {product.name}
                </div>
              </div>
            );
          })
        ) : (
          [1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="flex-shrink-0 w-48 h-20 bg-gray-200 flex items-center justify-center rounded border-2 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] -translate-y-0.5"
            >
              <p>Ad Card {n}</p>
            </div>
          ))
        )}
      </div>

      {/* Right nav button - arrow pointing LEFT (←), shown on hover */}
      {isHovered && adProducts.length > VISIBLE_COUNT && (
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="absolute right-7 z-[100002] w-8 h-8 rounded-full bg-blue-700/90 text-white flex items-center justify-center shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          ←
        </button>
      )}
    </footer>
  );
}
