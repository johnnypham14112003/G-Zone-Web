import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import ActionMenu from "../components/ActionMenu";
import VoucherModal from "../components/VoucherModal";
import {
  Voucher,
  VoucherQuery,
  VoucherRequest,
  createVoucher,
  deleteVoucher,
  getVouchers,
  updateVoucher,
} from "../api/voucher-api";

const mapVoucherToRequest = (voucher: Voucher): VoucherRequest => ({
  voucherCode: voucher.voucherCode,
  voucherName: voucher.voucherName,
  description: voucher.description || "",
  discountType: voucher.discountType,
  discountValue: voucher.discountValue,
  maxDiscountAmount: voucher.maxDiscountAmount,
  minOrderAmount: voucher.minOrderAmount,
  maxUsageTotal: voucher.maxUsageTotal,
  maxUsagePerCustomer: voucher.maxUsagePerCustomer,
  startDate: voucher.startDate,
  endDate: voucher.endDate,
  applicableTo: voucher.applicableTo || "",
  isActive: voucher.isActive,
});

const AdminVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<VoucherQuery>({});
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
  });

  const { showToast } = useToast();

  const fetchData = async (nextPage?: number, nextPageSize?: number) => {
    try {
      setLoading(true);
      const pageIndex = nextPage || pagination.pageIndex;
      const pageSize = nextPageSize || pagination.pageSize;

      const data = await getVouchers(pageIndex, pageSize, query);
      setVouchers(data.items || []);
      setPagination({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPage: data.totalPage,
      });
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch vouchers", err);
      setError("Failed to load vouchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, [query]);

  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleOpenModal = (voucher?: Voucher) => {
    setSelectedVoucher(voucher || null);
    setIsModalOpen(true);
  };

  const handleSaveVoucher = async (payload: VoucherRequest, id?: string) => {
    if (id) {
      await updateVoucher(id, payload);
      showToast("Voucher updated successfully", "success");
    } else {
      await createVoucher(payload);
      showToast("Voucher created successfully", "success");
    }

    await fetchData();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this voucher?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteVoucher(id);
      showToast("Voucher deleted successfully", "success");
      await fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete voucher", "error");
    }
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      await updateVoucher(voucher.voucherId, {
        ...mapVoucherToRequest(voucher),
        isActive: !voucher.isActive,
      });
      showToast(
        `Voucher ${voucher.isActive ? "deactivated" : "activated"} successfully`,
        "success",
      );
      await fetchData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update voucher status", "error");
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
    setQuery((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
    }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));

    if (value === "") {
      setQuery((prev) => ({ ...prev, isActive: undefined }));
      return;
    }

    setQuery((prev) => ({
      ...prev,
      isActive: value === "true",
    }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageSize = Number(e.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize,
      pageIndex: 1,
    }));
  };

  const renderPages = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= pagination.totalPage; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [pagination.totalPage]);

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
            Vouchers
          </h1>
          <p className="text-text-muted">Manage promotions and discount campaigns.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Voucher
        </button>
      </div>

      <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3 flex gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by voucher code or name"
              className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-primary hover:bg-red-600 px-4 rounded text-white font-bold"
            >
              Search
            </button>
          </div>

          <select
            onChange={handleStatusFilter}
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                  <th className="px-6 py-4 font-bold">Code</th>
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Discount</th>
                  <th className="px-6 py-4 font-bold">Usage</th>
                  <th className="px-6 py-4 font-bold">Duration</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                      Loading vouchers...
                    </td>
                  </tr>
                ) : vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                      No vouchers found.
                    </td>
                  </tr>
                ) : (
                  vouchers.map((voucher) => (
                    <tr
                      key={voucher.voucherId}
                      className="border-b border-surface-border hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-bold">{voucher.voucherCode}</td>
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{voucher.voucherName}</p>
                        <p className="text-xs text-text-muted mt-1 truncate max-w-56">
                          {voucher.description || "No description"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {voucher.discountType === "Percentage"
                          ? `${voucher.discountValue}%`
                          : `$${voucher.discountValue.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {voucher.currentUsageCount}/{voucher.maxUsageTotal}
                      </td>
                      <td className="px-6 py-4 text-text-muted text-sm">
                        <p>{new Date(voucher.startDate).toLocaleDateString()}</p>
                        <p>{new Date(voucher.endDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {voucher.isActive ? (
                          <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionMenu
                          actions={[
                            {
                              label: "Edit",
                              icon: "edit",
                              onClick: () => handleOpenModal(voucher),
                            },
                            {
                              label: voucher.isActive ? "Deactivate" : "Activate",
                              icon: voucher.isActive ? "toggle_off" : "toggle_on",
                              onClick: () => handleToggleStatus(voucher),
                            },
                            {
                              label: "Delete",
                              icon: "delete",
                              onClick: () => handleDelete(voucher.voucherId),
                              className: "text-red-500",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-surface-border flex justify-end items-center mt-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.max(1, prev.pageIndex - 1),
                  }))
                }
                disabled={pagination.pageIndex <= 1}
                className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {renderPages.map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                  className={`w-8 h-8 rounded text-sm flex items-center justify-center transition-colors ${
                    pagination.pageIndex === page
                      ? "bg-primary text-white font-bold"
                      : "bg-surface-light text-text-muted hover:bg-white/10"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: Math.min(prev.totalPage || 1, prev.pageIndex + 1),
                  }))
                }
                disabled={pagination.pageIndex >= pagination.totalPage || pagination.totalPage === 0}
                className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <VoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVoucher}
        initialData={selectedVoucher}
      />
    </div>
  );
};

export default AdminVouchers;
