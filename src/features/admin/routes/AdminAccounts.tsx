import React, { useEffect, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import {
  getAccounts,
  Account,
  AccountQuery,
  PaginatedAccounts,
  updateAccount,
  UpdateAccountRequest,
  updateAccountRole,
  UpdateAccountRoleRequest,
  updateAccountPassword,
  ResetAccountPasswordRequest,
  deleteAccount,
} from "../api/account-api";
import { registerApi } from "../../auth/api/auth-api";
import AccountModal from "../components/AccountModal";
import ActionMenu from "../components/ActionMenu";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const CACHE_KEY = "admin_accounts_cache";
const CACHE_TIMESTAMP_KEY = "admin_accounts_timestamp";

// Lấy cache từ localStorage
const getCache = (): {
  accounts: Account[];
  timestamp: string | null;
} | null => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (cachedData) {
    return { accounts: JSON.parse(cachedData), timestamp: cachedTimestamp };
  }
  return null;
};

// Lưu cache vào localStorage
const setCache = (accounts: Account[]) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(accounts));
  localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
};

const AdminAccounts: React.FC = () => {
  // State for all data from server
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  // State for data displayed in table (filtered and paginated)
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalMode, setModalMode] = useState<
    "create" | "edit" | "changeRole" | "changePassword"
  >("create");

  const [pagination, setPagination] = useState<
    Omit<PaginatedAccounts, "data-list">
  >({
    "page-index": 1,
    "page-size": 10,
    "total-count": 0,
    "total-page": 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<AccountQuery>({});
  const { showToast } = useToast();

  // Function to fetch all data from server and update cache
  const syncData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all data, assuming the API supports a large page size for this
      const data = await getAccounts(1, 9999, {});
      const allData = data["data-list"] || [];
      setAllAccounts(allData);
      setCache(allData);
      const now = new Date();
      setLastSync(now);
    } catch (err: any) {
      console.error("Failed to sync accounts", err);
      setError("Failed to sync accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = getCache();
    if (cached) {
      setAllAccounts(cached.accounts);
      if (cached.timestamp) {
        setLastSync(new Date(cached.timestamp));
      }
      setLoading(false);
    } else {
      syncData(); // Initial data fetch if no cache
    }
  }, []);

  useEffect(() => {
    // This effect handles filtering and pagination on the client side
    let filteredAccounts = [...allAccounts];

    // Apply filters
    if (query["search-term"]) {
      const searchTerm = query["search-term"].toLowerCase();
      filteredAccounts = filteredAccounts.filter(
        (acc) =>
          acc.username.toLowerCase().includes(searchTerm) ||
          acc.email.toLowerCase().includes(searchTerm) ||
          (acc["full-name"] &&
            acc["full-name"].toLowerCase().includes(searchTerm)) ||
          (acc.phone && acc.phone.includes(searchTerm)),
      );
    }
    if (query.role) {
      filteredAccounts = filteredAccounts.filter(
        (acc) => acc.role === query.role,
      );
    }
    if (query.status) {
      filteredAccounts = filteredAccounts.filter(
        (acc) => acc.status === query.status,
      );
    }
    if (query["is-active"] !== undefined) {
      filteredAccounts = filteredAccounts.filter(
        (acc) => acc["is-active"] === query["is-active"],
      );
    }
    if (query["from-date"]) {
      const fromDate = parseISO(query["from-date"]);
      filteredAccounts = filteredAccounts.filter((acc) => {
        const accDate = parseISO(acc["created-at"]);
        return accDate >= fromDate;
      });
    }
    if (query["to-date"]) {
      const toDate = parseISO(query["to-date"]);
      // Add 1 day to toDate to include the whole day
      toDate.setDate(toDate.getDate() + 1);
      filteredAccounts = filteredAccounts.filter((acc) => {
        const accDate = parseISO(acc["created-at"]);
        return accDate < toDate;
      });
    }

    const totalCount = filteredAccounts.length;
    const totalPage = Math.ceil(totalCount / pagination["page-size"]);

    // Apply pagination
    const start = (pagination["page-index"] - 1) * pagination["page-size"];
    const end = start + pagination["page-size"];
    const paginatedAccounts = filteredAccounts.slice(start, end);

    setAccounts(paginatedAccounts);
    setPagination((prev) => ({
      ...prev,
      "total-count": totalCount,
      "total-page": totalPage,
    }));
  }, [allAccounts, query, pagination["page-index"], pagination["page-size"]]);

  // Modal Handlers
  const handleOpenModal = (
    account: Account | null = null,
    mode: "create" | "edit" | "changeRole" | "changePassword" = "create",
  ) => {
    setModalMode(mode);
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleSave = async (data: UpdateAccountRequest) => {
    try {
      await updateAccount(data);
      await syncData(); // Resync data
      showToast("Account updated successfully", "success");
    } catch (err) {
      showToast("Failed to update account", "error");
      throw err;
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await registerApi(data.username, data.email, data.password);
      await syncData(); // Resync data
      showToast("Account created successfully", "success");
    } catch (err) {
      showToast("Failed to create account", "error");
      throw err;
    }
  };

  const handleSaveRole = async (data: UpdateAccountRoleRequest) => {
    try {
      await updateAccountRole(data);
      await syncData();
      showToast("Role changed successfully", "success");
    } catch (err) {
      showToast("Failed to change role", "error");
      throw err;
    }
  };

  const handleSavePassword = async (data: ResetAccountPasswordRequest) => {
    try {
      await updateAccountPassword(data);
      await syncData();
      showToast("Password reset successfully", "success");
    } catch (err) {
      showToast("Failed to reset password", "error");
      throw err;
    }
  };

  // Handler phân trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination["total-page"]) {
      setPagination((prev) => ({ ...prev, "page-index": newPage }));
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPagination((prev) => ({
      ...prev,
      "page-size": newSize,
      "page-index": 1, // Reset về trang 1
    }));
  };

  // Handler Filter
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | boolean | undefined =
      value === "" ? undefined : value;

    if (name === "is-active" && value !== "") {
      parsedValue = value === "true";
    }

    setPagination((prev) => ({ ...prev, "page-index": 1 }));
    setQuery((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this account?")) {
      return;
    }

    try {
      const response = await deleteAccount(id);

      if (!response || response.data !== true) {
        throw new Error("Account deletion failed from server");
      }

      const updatedAccounts = allAccounts.filter((acc) => acc.id !== id);
      setAllAccounts(updatedAccounts);
      setCache(updatedAccounts);
      showToast("Account deleted successfully", "success");
    } catch (err: any) {
      showToast("Failed to delete account", "error");
      console.error(err);
      await syncData();
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination["total-page"]; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded text-sm flex items-center justify-center transition-colors ${
            pagination["page-index"] === i
              ? "bg-primary text-white font-bold"
              : "bg-surface-light text-text-muted hover:bg-white/10"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  const getActions = (account: Account) => [
    {
      label: "Edit",
      icon: "edit",
      onClick: () => handleOpenModal(account, "edit"),
    },
    {
      label: "Change Role",
      icon: "manage_accounts",
      onClick: () => handleOpenModal(account, "changeRole"),
    },
    {
      label: "Reset Password",
      icon: "lock_reset",
      onClick: () => handleOpenModal(account, "changePassword"),
    },
    {
      label: "Delete",
      icon: "delete",
      onClick: () => handleDelete(account.id),
      className: "text-red-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onCreate={handleCreate}
        onSaveRole={handleSaveRole}
        onSavePassword={handleSavePassword}
        initialData={selectedAccount}
        mode={modalMode}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
            Accounts
          </h1>
          <p className="text-text-muted">Manage user and staff accounts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenModal(null, "create")}
            className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            New Account
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-surface-dark border border-surface-border rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Search Input với Tooltip Gợi ý */}
          <div className="relative md:col-span-2 group">
            <input
              type="text"
              name="search-term"
              placeholder="Search..."
              onChange={handleFilterChange}
              // Thêm w-full và pr-10 để chừa không gian cho icon bên phải
              className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-primary w-full"
            />

            {/* Icon Dấu hỏi */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-help">
              <span className="material-symbols-outlined text-text-muted text-lg hover:text-white transition-colors">
                help
              </span>
            </div>

            <div className="absolute z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bg-black border border-gray-700 text-gray-300 text-xs rounded py-2 px-3 top-full right-0 mt-2 w-max shadow-2xl pointer-events-none">
              Can find by enter:{" "}
              <strong className="text-white">
                Username, FullName, Email, Phone
              </strong>
            </div>
          </div>
          {/* Role Selection Box*/}
          <select
            name="role"
            onChange={handleFilterChange}
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
          <select
            name="status"
            onChange={handleFilterChange}
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="Normal">Normal</option>
            <option value="Suspend">Suspend</option>
            <option value="Abandoned">Abandoned</option>
            <option value="Spam">Spam</option>
            <option value="Banned">Banned</option>
          </select>
          <select
            name="is-active"
            onChange={handleFilterChange}
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Activation</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <div className="relative">
            <label className="text-xs text-text-muted absolute -top-2 left-2 bg-surface-dark px-1">
              From Date
            </label>
            <input
              type="date"
              name="from-date"
              onChange={handleFilterChange}
              className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
            />
          </div>
          <div className="relative">
            <label className="text-xs text-text-muted absolute -top-2 left-2 bg-surface-dark px-1">
              To Date
            </label>
            <input
              type="date"
              name="to-date"
              onChange={handleFilterChange}
              className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
            />
          </div>
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
                  <th className="px-6 py-4 font-bold">Username</th>
                  <th className="px-6 py-4 font-bold">Full Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-center">
                    Activation
                  </th>
                  <th className="px-6 py-4 font-bold">Created Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-text-muted"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-text-muted"
                    >
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-surface-border hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-bold">
                        {account.username}
                      </td>
                      <td
                        className="px-6 py-4 text-text-muted max-w-52 truncate"
                        title={account["full-name"] || ""}
                      >
                        {account["full-name"] || "N/A"}
                      </td>
                      <td
                        className="px-6 py-4 text-text-muted max-w-xs truncate"
                        title={account.email}
                      >
                        {account.email}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {account.role}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            account.status === "Normal"
                              ? "bg-blue-500/10 text-green-500"
                              : account.status === "Banned"
                                ? "bg-red-500/10 text-red-500"
                                : account.status === "Suspend"
                                  ? "bg-orange-500/10 text-yellow-500"
                                  : account.status === "Abandoned"
                                    ? "bg-gray-500/10 text-red-500"
                                    : account.status === "Spam"
                                      ? "bg-gray-500/10 text-gray-400"
                                      : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`w-3 h-3 rounded-full inline-block ${
                            account["is-active"] ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {format(parseISO(account["created-at"]), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionMenu actions={getActions(account)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {/* Pagination & Sync Footer */}
      <div className="p-4 border-t border-surface-border flex justify-between items-center mt-auto">
        {/* NỬA TRÁI: Khu vực Sync */}
        <div className="flex items-center gap-4">
          <button
            onClick={syncData}
            className="bg-surface-border hover:bg-primary text-text-muted px-4 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2 text-sm"
            disabled={loading}
          >
            <span
              className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`}
            >
              sync
            </span>
            Sync
          </button>
          {lastSync && (
            <p className="text-xs text-text-muted italic">
              Last sync: {formatDistanceToNow(lastSync, { addSuffix: true })}
            </p>
          )}
        </div>

        {/* NỬA PHẢI: Khu vực Paging */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Rows per page:</span>
            <select
              value={pagination["page-size"]}
              onChange={handlePageSizeChange}
              className="bg-background-dark border border-surface-border rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination["page-index"] - 1)}
              disabled={pagination["page-index"] <= 1}
              className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <div className="flex items-center gap-1">{renderPageNumbers()}</div>
            <button
              onClick={() => handlePageChange(pagination["page-index"] + 1)}
              disabled={
                pagination["page-index"] >= pagination["total-page"] ||
                pagination["total-page"] === 0
              }
              className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
