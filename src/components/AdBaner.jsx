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

      {/* Sliding ads - the 4 featured slots get a raised 3D hover effect */}
      <div className="marquee-wrapper whitespace-nowrap flex gap-4 pl-10">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="w-48 h-20 bg-gray-200 flex items-center justify-center rounded border-2 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] -translate-y-0.5 transition-transform duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)]"
          >
            <p>Ad Card {n}</p>
          </div>
        ))}
      </div>
    </footer>
  );
}
