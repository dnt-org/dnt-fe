## Mục tiêu
- Refactor trang `NewGoodPostPage` thành hệ thống component theo Atomic Design, giữ nguyên 100% layout, spacing, màu sắc, typography và Tailwind class từ HTML/JSX gốc.
- Công nghệ: React 18+, Vite, JavaScript, TailwindCSS v4. Không dùng TypeScript. PropTypes cho mọi component.

## Phân tích UI hiện tại
- Header trang: `PageHeaderWithOutColorPicker` với nút Home và Admin (`src/pages/NewGoodPostPage.jsx:303-324`).
- Bộ chọn loại bài/loại hàng/tình trạng: Row số 1 gồm 3 `select` + quốc gia/tỉnh/thành (`src/pages/NewGoodPostPage.jsx:337-516`).
- Lưới sản phẩm nhập nhanh: Row số 2 hiển thị `ProductGrid` (`src/pages/NewGoodPostPage.jsx:519-526`).
- Thời điểm xem giá: Row số 3 `input[type=time]` (`src/pages/NewGoodPostPage.jsx:528-546`).
- Thời điểm kết thúc đăng: Row số 4 `input[type=datetime-local]` (`src/pages/NewGoodPostPage.jsx:549-571`).
- Địa chỉ hàng hóa + bản đồ placeholder: Row số 5 `textarea` + ô “(MAP)” (`src/pages/NewGoodPostPage.jsx:574-653`).
- Xác nhận quyền sở hữu: Row số 6 `checkbox` + label (`src/pages/NewGoodPostPage.jsx:656-672`).
- Phí sự kiện/livestream/VAT/tổng phí: Khối nhiều sub-row bên phải Row số 7 (`src/pages/NewGoodPostPage.jsx:677-895`).
- Phí quảng cáo: Khối 4 hàng với 3 input số + upload file (`src/pages/NewGoodPostPage.jsx:899-969`).
- Cam kết điều khoản: Khối checkbox cuối trang (`src/pages/NewGoodPostPage.jsx:974-989`).
- Nút gửi yêu cầu: Button submit (`src/pages/NewGoodPostPage.jsx:991-999`).
- State & logic: xử lý màu nền, localStorage, fetch quốc gia/tỉnh/huyện từ `services/countries`, submit qua `services/productService` (`src/pages/NewGoodPostPage.jsx:122-176, 436-501, 228-298`).

## Kiến trúc thư mục (Atomic Design)
- `src/components/atoms`
- `src/components/molecules`
- `src/components/organisms`
- `src/components/layouts`
- `src/pages`
- `src/hooks`
- `src/services` (tận dụng hiện có)
- `src/utils`

## Chia component
- Atoms:
  - `RowNumberCell.jsx`: hiển thị số thứ tự và dấu `*` khi cần. Props: `number`, `required`.
  - `TextLabel.jsx`: label văn bản. Props: `children`, `className`.
  - `NumberInput.jsx`: ô số có chặn `- . e +`. Props: `name`, `value`, `onChange`, `className`, `placeholder`, `min`, `step`.
  - `TextInput.jsx`: ô text. Props: `name`, `value`, `onChange`, `className`, `placeholder`.
  - `TextArea.jsx`: textarea. Props: `value`, `onChange`, `className`.
  - `Checkbox.jsx`: checkbox chuẩn. Props: `name`, `checked`, `onChange`, `className`.
  - `Select.jsx`: `select` chung. Props: `value`, `onChange`, `options` (array `{label,value}`), `className`, `disabled`.
  - `FileInput.jsx`: upload file ẩn/hiện. Props: `name`, `onChange`, `className`, `label`.
  - `Divider.jsx`: phần tử gạch ngang theo class.
- Molecules:
  - `CategoryRow.jsx`: 3 `Select` cho `category`, `subcategory`, `condition` theo i18n + map key. Props: `selectedType`, `selectedCategory`, `selectedCondition`, `onTypeChange`, `onCategoryChange`, `onConditionChange`.
  - `LocationSelectors.jsx`: Quốc gia/Tỉnh/Huyện với 2 `Select` và logic load tỉnh/huyện. Props: `countries`, `provinces`, `districts`, `selectedCountry`, `selectedProvince`, `selectedDistrict`, `onCountryChange`, `onProvinceChange`, `onDistrictChange`.
  - `FeeRow.jsx`: mô hình “% + số + đơn vị + nhãn” cho Event/Livestream/Tổng phí. Props: `label`, `percentName`, `percentValue`, `amountName`, `amountValue`, `unitLabel`, `onChange`.
  - `AdvertisingInputRow.jsx`: một hàng gồm label + `NumberInput` + đơn vị. Props: `label`, `name`, `value`, `unit`, `onChange`.
- Organisms:
  - `GoodsHeader.jsx`: header dùng `PageHeaderWithOutColorPicker` giữ nguyên props `color`, `onColorChange`, `titlePrefix`, `leftButton`, `rightButton`, `title`.
  - `GoodsFormRows.jsx`: wrap toàn bộ khối lưới 17 cột, gom các Row 1→8, giữ nguyên `grid grid-cols-17` và border classes.
  - `AdvertisingSection.jsx`: khối phí quảng cáo 4 hàng + upload giữ nguyên `grid-cols-17`/`grid-cols-16`.
  - `DeclarationSection.jsx`: checkbox điều khoản.
  - `SubmitBar.jsx`: nút submit.
  - Tận dụng: `ProductGrid` hiện có.
- Layouts:
  - `AppPageLayout.jsx`: container `flex justify-center items-center min-h-screen` + card `bg-transparent backdrop-blur-md p-1 rounded-lg shadow-lg w-full mx-auto`.
- Pages:
  - `NewGoodPostPage.jsx`: trang tái cấu trúc, bind state và gọi các organisms.

## Hooks & State chia sẻ
- `hooks/usePersistentColor.js`: đồng bộ `color` với `localStorage` và áp dụng vào `#root`.
- `hooks/useLocationSelection.js`: quản lý `selectedCountry`, `selectedProvince`, `selectedDistrict`, fetch bằng `services/countries` và sync `localStorage`.
- `hooks/useGoodsForm.js`: gom `goodsInfo`, `goodsItems`, helpers `handleInputChange`, `handleGoodsItemChange`, `handleAddGoodsItem`.

## Services & Utils
- Giữ `services/productService.js` và `services/countries.js` như hiện tại.
- `utils/inputGuards.js`: helper chặn phím không hợp lệ cho `NumberInput`.

## Chuẩn hoá props & PropTypes
- Mọi component đều có `propTypes` rõ ràng, ví dụ `RowNumberCell.propTypes = { number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, required: PropTypes.bool }`.
- Molecules nhận callback `onChange`/`onSelect` từ page để không tự quản lý state.

## Bảo toàn Tailwind class
- Giữ nguyên mọi class từ JSX gốc: `grid grid-cols-17`, `border-b border-gray-300`, `text-right`, `p-2`, v.v.
- Nơi cần wrap component, truyền `className` để duy trì class đúng từng ô.
- Giữ các ô `(MAP)` y nguyên như placeholder.

## Kế hoạch triển khai
1) Tạo thư mục Atomic và di chuyển/thêm component theo danh sách trên; tái dùng `ProductGrid`, `PostTypeMenu`, `GoodsAccount`, `PageHeaderWithOutColorPicker` bằng cách import từ vị trí mới.
2) Trích xuất Row 1 thành `CategoryRow` + `LocationSelectors` trong lưới 17 cột; map i18n key giống gốc.
3) Trích xuất các Row 3→7 thành các `FeeRow`, `AdvertisingInputRow`, `TextInput/NumberInput` theo đúng Tailwind class.
4) Tạo `AppPageLayout` và dùng nó wrap toàn trang.
5) Tạo hooks `usePersistentColor`, `useLocationSelection`, `useGoodsForm` và thay thế logic inline (`src/pages/NewGoodPostPage.jsx:122-176, 436-501`).
6) Giữ nguyên `handleSubmit` và gọi `createProduct` như gốc, thêm hiển thị lỗi qua state nếu cần.
7) Thay thế `NewGoodPostPage.jsx` để chỉ compose các organisms/molecules/atoms.

## Deliverables (sau khi xác nhận)
- File JSX đầy đủ cho từng component/hook/utils như đã liệt kê, không bình luận trong code, có `PropTypes`, dùng Tailwind class y nguyên.
- `pages/NewGoodPostPage.jsx` đã refactor, drop-in chạy trên Vite + Tailwind hiện có.

## Ghi chú
- Sẽ giữ nguyên mọi chuỗi i18n và key mapping như trong gốc.
- Nếu có class Tailwind không chuẩn (ví dụ `grid-cols-17`), sẽ giữ nguyên để đảm bảo UI không đổi; nếu cần, sẽ thêm lớp util nội bộ mà không thay đổi giao diện.
- Trường dữ liệu chưa có sẽ dùng placeholder hợp lý và có prop để thay thế sau.