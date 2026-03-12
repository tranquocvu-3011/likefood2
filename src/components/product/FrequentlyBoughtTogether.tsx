"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect } from "react";
import { ShoppingCart, Loader2, Sparkles, Check } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    originalPrice?: number;
    salePrice?: number;
    isOnSale?: boolean;
    image?: string;
    inventory: number;
}

interface FrequentlyBoughtTogetherProps {
    currentProduct: Product;
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { addItem } = useCart();
    const [isAddingAll, setIsAddingAll] = useState(false);

    useEffect(() => {
        const fetchFBT = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/products/recommendations/fbt?product=${currentProduct.slug}`);
                if (!res.ok) throw new Error("Failed to fetch FBT");
                const data = await res.json();
                setRecommended(data);
                setSelectedIds(data.map((p: Product) => p.id)); // Select all by default
            } catch (err) {
                console.error("FBT Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentProduct.slug) {
            fetchFBT();
        }
    }, [currentProduct.slug]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleAddAll = async () => {
        setIsAddingAll(true);
        const selectedProducts = recommended.filter(p => selectedIds.includes(p.id));

        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 sản phẩm để thêm vào giỏ hàng");
            setIsAddingAll(false);
            return;
        }

        let addedCount = 0;
        for (const p of selectedProducts) {
            const added = addItem({
                productId: p.id,
                slug: p.slug,
                name: p.name,
                price: p.isOnSale && p.salePrice ? p.salePrice : p.price,
                image: p.image,
                quantity: 1,
                inventory: p.inventory,
            });
            if (added) addedCount++;
        }

        // Only show summary toast if at least 1 item was added (auth passed)
        if (addedCount > 1) {
            toast.success(`Đã thêm ${addedCount} sản phẩm vào giỏ hàng!`);
        }
        setIsAddingAll(false);
    };

    if (isLoading) return null;
    if (recommended.length === 0) return null;

    const totalPrice = recommended
        .filter(p => selectedIds.includes(p.id))
        .reduce((sum, p) => sum + (p.isOnSale && p.salePrice ? p.salePrice : p.price), 0);

    return (
        <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Thường được mua cùng</h2>
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Gợi ý từ lịch sử mua sắm của khách hàng</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl lg:flex items-center gap-12">
                {/* Product Duo/Trio List */}
                <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                    {/* Current Product (Fixed) */}
                    <div className="relative group grayscale-0 opacity-100 transition-all duration-300">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative shadow-sm">
                            <ImageWithFallback
                                src={currentProduct.image}
                                alt={currentProduct.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 128px, 160px"
                            />
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                <Check className="w-3 h-3" />
                            </div>
                        </div>
                        <p className="mt-3 text-[10px] font-black uppercase text-slate-400 text-center truncate w-32 sm:w-40">Đang xem</p>
                    </div>

                    {recommended.map((product) => (
                        <div key={product.id} className="flex items-center gap-6">
                            <div className="text-slate-200 text-3xl font-black">+</div>
                            <div
                                className={`relative group cursor-pointer transition-all duration-500 ${selectedIds.includes(product.id) ? "grayscale-0 opacity-100" : "grayscale opacity-40 hover:opacity-70"
                                    }`}
                                onClick={() => toggleSelection(product.id)}
                            >
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 relative shadow-md group-hover:shadow-xl transition-all">
                                    <ImageWithFallback
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 128px, 160px"
                                    />
                                    {selectedIds.includes(product.id) && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in-50 duration-300">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 text-center w-32 sm:w-40">
                                    <p className="text-[10px] font-black uppercase text-slate-900 truncate">{product.name}</p>
                                    <p className="text-xs font-bold text-primary">${(product.isOnSale && product.salePrice ? product.salePrice : product.price).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bundle Summary & Action */}
                <div className="mt-10 lg:mt-0 lg:w-80 p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                            <span>Sản phẩm đã chọn:</span>
                            <span className="text-slate-900">{selectedIds.length + 1}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-black uppercase tracking-widest text-slate-400">Tổng cộng:</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleAddAll}
                        disabled={selectedIds.length === 0 || isAddingAll}
                        className="w-full h-16 rounded-full bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50"
                    >
                        {isAddingAll ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5 mr-3" />
                                Mua cả bộ
                            </>
                        )}
                    </Button>
                    <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        * Tiết kiệm thời gian, tăng trải nghiệm
                    </p>
                </div>
            </div>
        </section>
    );
}
