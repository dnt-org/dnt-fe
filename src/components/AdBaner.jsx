import { useState, useEffect } from "react";

export default function AdBanner() {
  const [showAd, setShowAd] = useState(true);
  const [showCloseBtn, setShowCloseBtn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCloseBtn(true);
    }, 5000); // show close button after 5s

    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 h-[100px] border-t font-bold bg-white flex items-center overflow-hidden"
    >
      {/* Close button */}
      {showCloseBtn && (
        <button
          onClick={() => setShowAd(false)}
          className=" absolute z-10 top-1 right-2 text-gray-500 hover:text-black font-bold"
        >
          ✕
        </button>
      )}

      {/* Sliding ads */}
      <div className="marquee-wrapper whitespace-nowrap flex gap-4 pl-10">
        <div className="w-48 h-20 bg-gray-200 flex items-center justify-center rounded">
          <p>Ad Card 1</p>
        </div>
        <div className="w-48 h-20 bg-gray-200 flex items-center justify-center rounded">
          <p>Ad Card 2</p>
        </div>
        <div className="w-48 h-20 bg-gray-200 flex items-center justify-center rounded">
          <p>Ad Card 3</p>
        </div>
        <div className="w-48 h-20 bg-gray-200 flex items-center justify-center rounded">
          <p>Ad Card 4</p>
        </div>
      </div>
    </footer>
  );
}
