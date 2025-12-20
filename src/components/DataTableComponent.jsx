import { useTranslation } from 'react-i18next'
import { useSystemInfos } from "../custom-hooks/useSystemInfos"


const DataTableComponent = () => {
  const { t } = useTranslation()
  const infos = useSystemInfos()
  const metric = Array.isArray(infos) ? (infos[0] || {}) : (infos || {})

  if (!metric || Object.keys(metric).length === 0) return null

  return (
      <div
        className="flex flex-col text-sm text-left h-full w-full border border-black"
        style={{ fontSize: "clamp(6px, 0.75vw, 14px)" }}
      >
      {/* Row 1 */}
      <div className="flex border-b border-black">
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.listedValue", "GIÁ TRỊ LÊN SÀN")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.listedValue}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.transactions", "LƯỢT GIAO DỊCH")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.transactions}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.accesses", "LƯỢT TRUY CẬP")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1">
          <strong>{metric.accesses}</strong>
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex border-b border-black">
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.successfully", "THÀNH CÔNG")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.successfully}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.amount", "SỐ TIỀN")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.amount}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.duration", "THỜI LƯỢNG")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1">
          <strong>{metric.duration}</strong>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex border-b border-black">
        <div
          className="flex items-center justify-center font-bold py-1 px-1 border-r border-black"
          style={{ flex: "0 0 33.37%" }}
        >
          {t("metrics.bankUpdate", "NGÂN HÀNG CẬP NHẬT")}:
        </div>

        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.deposited", "ĐÃ GỬI")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.deposited}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.videoViews", "LƯỢT XEM VIDEO")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1">
          <strong>{metric.videoViews}</strong>
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex border-b border-black">
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.withTerm", "CÓ KỲ HẠN")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          {t("metrics.update", "CẬP NHẬT")}:
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.withdrawn", "ĐÃ RÚT")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.withdrawn}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.members", "THÀNH VIÊN")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1">
          <strong>{metric.members}</strong>
        </div>
      </div>

      {/* Row 5 */}
      <div className="flex">
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.withoutTerm", "KHÔNG KỲ HẠN")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          {t("metrics.update", "CẬP NHẬT")}:
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.remaining", "CÒN LẠI")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1 border-r border-black">
          <strong>{metric.remaining}</strong>
        </div>
        <div className="table-cell flex items-center font-bold py-1 px-1 border-r border-black">
          {t("metrics.online", "TRUY CẬP")}:
        </div>
        <div className="flex-2 flex items-center justify-end py-1 px-1">
          <strong>{metric.online}</strong>
        </div>
      </div>
    </div>

  );
};

export default DataTableComponent;
