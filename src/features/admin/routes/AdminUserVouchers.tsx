import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import ActionMenu from "../components/ActionMenu";
import { Account, getAccounts } from "../api/account-api";
import {
  UserVoucher,
  assignVoucherToUser,
  getAccountsByVoucher,
  getUserVouchersByAccount,
  revokeVoucherFromUser,
} from "../api/user-voucher-api";
import { Voucher, getVouchers } from "../api/voucher-api";

const AdminUserVouchers: React.FC = () => {
  const [rows, setRows] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountIdFilter, setAccountIdFilter] = useState("");
  const [voucherIdFilter, setVoucherIdFilter] = useState("");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    accountId: "",
    voucherId: "",
  });

  const { showToast } = useToast();

  const syncOptions = async () => {
    try {
      const [accountData, voucherData] = await Promise.all([
        getAccounts(1, 999, {}),
        getVouchers(1, 200, {}),
      ]);

      const accountList = accountData["data-list"] || [];
      setAccounts(accountList);
      setVouchers(voucherData.items || []);

      if (!assignForm.accountId && accountList.length > 0) {
        setAssignForm((prev) => ({ ...prev, accountId: accountList[0].id }));
      }
      if (!assignForm.voucherId && voucherData.items.length > 0) {
        setAssignForm((prev) => ({ ...prev, voucherId: voucherData.items[0].voucherId }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    syncOptions();
  }, []);

  const fetchByAccount = async (id: string) => {
    if (!id) {
      showToast("Please provide account ID", "error");
      return;
    }

    try {
      setLoading(true);
      const list = await getUserVouchersByAccount(id);
      setRows(list);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load user vouchers by account");
    } finally {
      setLoading(false);
    }
  };

  const fetchByVoucher = async (id: string) => {
    if (!id) {
      showToast("Please provide voucher ID", "error");
      return;
    }

    try {
      setLoading(true);
      const list = await getAccountsByVoucher(id);
      setRows(list);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load user vouchers by voucher");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (accountIdFilter) {
      await fetchByAccount(accountIdFilter);
      return;
    }

    if (voucherIdFilter) {
      await fetchByVoucher(voucherIdFilter);
      return;
    }

    setRows([]);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignVoucherToUser(assignForm);
      showToast("Voucher assigned successfully", "success");
      setAssignOpen(false);
      await refresh();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to assign voucher", "error");
    }
  };

  const handleRevoke = async (item: UserVoucher) => {
    const confirmed = window.confirm("Revoke this voucher from user?");
    if (!confirmed) {
      return;
    }

    try {
      await revokeVoucherFromUser({
        accountId: item.accountId,
        voucherId: item.voucherId,
      });
      showToast("Voucher revoked successfully", "success");
      await refresh();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to revoke voucher", "error");
    }
  };

  const accountOptions = useMemo(() => {
    return accounts.map((account) => ({
      label: `${account.username} (${account.email})`,
      value: account.id,
    }));
  }, [accounts]);

  const voucherOptions = useMemo(() => {
    return vouchers.map((voucher) => ({
      label: `${voucher.voucherCode} - ${voucher.voucherName}`,
      value: voucher.voucherId,
    }));
  }, [vouchers]);

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
            User Vouchers
          </h1>
          <p className="text-text-muted">Assign and revoke vouchers for user accounts.</p>
        </div>
        <button
          onClick={() => setAssignOpen(true)}
          className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Assign Voucher
        </button>
      </div>

      <div className="bg-surface-dark border border-surface-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-2">
          <input
            value={accountIdFilter}
            onChange={(e) => setAccountIdFilter(e.target.value)}
            placeholder="Filter by account ID"
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
          />
          <button
            onClick={() => fetchByAccount(accountIdFilter)}
            className="bg-primary hover:bg-red-600 px-4 rounded text-white font-bold"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={voucherIdFilter}
            onChange={(e) => setVoucherIdFilter(e.target.value)}
            placeholder="Filter by voucher ID"
            className="bg-background-dark border-2 border-surface-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary w-full"
          />
          <button
            onClick={() => fetchByVoucher(voucherIdFilter)}
            className="bg-primary hover:bg-red-600 px-4 rounded text-white font-bold"
          >
            Search
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      ) : null}

      <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                <th className="px-6 py-4 font-bold">Account ID</th>
                <th className="px-6 py-4 font-bold">Voucher</th>
                <th className="px-6 py-4 font-bold">Discount</th>
                <th className="px-6 py-4 font-bold">Used</th>
                <th className="px-6 py-4 font-bold">Active</th>
                <th className="px-6 py-4 font-bold">Period</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    Loading user vouchers...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={`${item.accountId}-${item.voucherId}`}
                    className="border-b border-surface-border hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-text-muted text-xs">{item.accountId}</td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{item.voucherCode}</p>
                      <p className="text-xs text-text-muted">{item.voucherName}</p>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {item.discountType === "Percentage"
                        ? `${item.discountValue}%`
                        : `$${item.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      {item.isUsed ? (
                        <span className="bg-red-500/10 text-red-400 text-[10px] font-bold uppercase px-2 py-1 rounded">
                          Used
                        </span>
                      ) : (
                        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold uppercase px-2 py-1 rounded">
                          Unused
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      <p>{new Date(item.startDate).toLocaleDateString()}</p>
                      <p>{new Date(item.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu
                        actions={[
                          {
                            label: "Revoke",
                            icon: "delete",
                            onClick: () => handleRevoke(item),
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
      </div>

      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Assign Voucher
              </h2>
              <button
                onClick={() => setAssignOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAssign} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Account
                </label>
                <select
                  value={assignForm.accountId}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, accountId: e.target.value }))
                  }
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  {accountOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Voucher
                </label>
                <select
                  value={assignForm.voucherId}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, voucherId: e.target.value }))
                  }
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  {voucherOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setAssignOpen(false)}
                  className="px-6 py-2 rounded font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserVouchers;
