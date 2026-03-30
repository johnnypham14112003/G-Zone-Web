import React, { useState, useEffect } from "react";
import { CartItem } from "@/lib/cart";
import { createCustomization, getCustomizationByProductAndCustomer, updateCustomization } from "@/features/admin/api/customization-api";



interface CustomizationModalProps {
    item: CartItem;
    onClose: () => void;
    onSave: (data: any) => void;
}


const CustomizationModal: React.FC<CustomizationModalProps> = ({
    item,
    onClose,
    onSave,
}) => {
    const [form, setForm] = useState({
        name: item.productName,
        sku: item.sku,
        color: "",
        size: "",
        weight: 0,
        staffNote: "Empty",
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "weight" ? parseFloat(value) || 0 : value,
        }));
    };

    const [customId, setCustomId] = useState<string | null>(null);
    const COLORS = [
        { name: "Red", value: "Red", class: "bg-red-500" },
        { name: "Black", value: "Black", class: "bg-black" },
        { name: "White", value: "White", class: "bg-white border" },
        { name: "Blue", value: "Blue", class: "bg-blue-500" },
        { name: "Gray", value: "Gray", class: "bg-gray-400" },
    ];


    const handleSubmit = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("GZONE_USER_DATA") || "{}");
            const customerId = user?.accountId || user?.["account-id"];

            if (!customerId) {
                alert("User not found");
                return;
            }

            if (customId) {
                // ✅ UPDATE
                await updateCustomization(customId, {
                    name: form.name,
                    color: form.color,
                    size: form.size,
                    weight: form.weight,
                    quotedPrice: 0, // backend will calculate or ignore
                    staffNote: "staff note is currently empty",
                    status: "Pending",
                });
            } else {
                // ✅ CREATE
                await createCustomization({
                    name: form.name,
                    sku: form.sku,
                    color: form.color,
                    size: form.size,
                    weight: form.weight,
                    staffNote: "staff note is currently empty",
                    customerId,
                    productId: item.productId,
                });
            }

            onClose();
        } catch (err) {
            console.error("Save customization failed", err);
            alert("Failed to save customization");
        }
    };

    useEffect(() => {
        const loadCustomization = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("GZONE_USER_DATA") || "{}");
                const customerId = user?.accountId || user?.["account-id"];

                if (!customerId || !item.productId) return;

                const existing = await getCustomizationByProductAndCustomer(
                    item.productId,
                    customerId
                );

                if (existing) {
                    setCustomId(existing.customId); // ✅ important

                    setForm({
                        name: existing.name,
                        sku: existing.sku,
                        color: existing.color || "",
                        size: existing.size || "",
                        weight: existing.weight,
                        staffNote: "",
                    });
                } else {
                    setCustomId(null);
                }
            } catch (err) {
                console.error("Load customization failed", err);
            }
        };

        loadCustomization();
    }, [item]);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-surface-dark border border-surface-border rounded-2xl w-full max-w-lg shadow-2xl">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-surface-border">
                    <h2 className="text-xl font-black uppercase text-white tracking-tight">
                        Customize Product
                    </h2>
                    <button onClick={onClose}>
                        <span className="material-symbols-outlined text-gray-400 hover:text-white">
                            close
                        </span>
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 flex flex-col gap-4">

                    {/* PRODUCT INFO */}
                    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-sm">
                        <p className="text-white font-semibold">{item.productName}</p>
                        <p className="text-gray-400 text-xs">SKU: {item.sku}</p>
                    </div>

                    {/* COLOR */}
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-2">
                            Color
                        </label>

                        <div className="flex gap-3">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, color: c.value }))}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${c.class
                                        } ${form.color === c.value
                                            ? "border-primary scale-110"
                                            : "border-transparent hover:scale-105"
                                        }`}
                                    title={c.name}
                                />
                            ))}
                        </div>

                        {/* Selected label */}
                        {form.color && (
                            <p className="text-xs text-gray-400 mt-2">
                                Selected: <span className="text-white font-medium">{form.color}</span>
                            </p>
                        )}
                    </div>

                    {/* SIZE */}
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                            Size
                        </label>
                        <select
                            name="size"
                            value={form.size}
                            onChange={handleChange}
                            className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                        >
                            <option value="">Select size</option>
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                        </select>
                    </div>

                    {/* WEIGHT */}
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                            Weight (kg)
                        </label>
                        <input
                            name="weight"
                            type="number"
                            value={form.weight}
                            onChange={handleChange}
                            className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-surface-border">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-text-muted hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg font-bold uppercase tracking-wide"
                    >
                        {customId ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;