import React from 'react';
import { useTranslation } from 'react-i18next';

const PageHeaderWithOutColorPicker = ({color, onColorChange, titlePrefix = "2", leftButton, rightButton, title }) => {
  const { t } = useTranslation();

  // If leftButton or rightButton are provided, use the flex layout with absolute positioned buttons
  if (leftButton || rightButton) {
    return (
      <div className="relative">
        {/* Left button - absolute positioned */}
        {leftButton && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            {leftButton}
          </div>
        )}
        
        {/* Center content - title always centered */}
        <div className="flex items-start justify-center">
            {/* Color picker input */}
            <input
                type="color"
                value={color}
                onChange={e=>onColorChange(e)}
                className="w-10 h-8 cursor-pointer mt-1"
            />
            <div className="text-center mb-4 relative">
                <h1 className="text-3xl font-bold text-black relative inline-block">
                    &nbsp;{titlePrefix ? `${titlePrefix} - ` : ""}  {title}
                </h1>
            </div>
        </div>

        {/* Right button - absolute positioned */}
        {rightButton && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            {rightButton}
          </div>
        )}
      </div>
    );
  }

  // Default layout (for Login.jsx)
  return (
    <div className="flex items-start justify-center">
      {/* Color picker input */}
      <input
        type="color"
        value={color}
        onChange={onColorChange}
        className="w-10 h-8 cursor-pointer mt-1"
      />
      <div className="text-center mb-4 relative">
        <h1 className="text-3xl font-bold text-black relative inline-block">
          &nbsp;{titlePrefix} - {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeaderWithOutColorPicker;
