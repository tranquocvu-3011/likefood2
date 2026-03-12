"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useCompare } from "@/contexts/CompareContext";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Check, Star, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export function CompareContent() {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const { addItem } = useCart();
    const { language } = useLanguage();

    if (compareItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 pb-20">
                <div className="page-container-wide text-center py-20">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-slate-300" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
                        {language === "vi" ? "Chưa có sản phẩm để so sánh" : "No products to compare"}
                    </h1>
                    <p className="text-slate-500 font-medium mb-8">
                        {language === "vi"
                            ? "Thêm sản phẩm vào danh sách so sánh từ trang sản phẩm"
                            : "Add products to compare from the product page"}
                    </p>
                    <Link href="/products">
                        <Button className="rounded-full px-8 font-bold">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {language === "vi" ? "Xem sản phẩm" : "Browse Products"}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = (product: { id: string; name: string; price: number; image?: string; slug?: string; inventory?: number }) => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            slug: product.slug,
            inventory: product.inventory,
        });
        // toast handled by CartContext
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="page-container-wide">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/products" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary mb-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            {language === "vi" ? "Tiếp tục mua sắm" : "Continue shopping"}
                        </Link>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            {language === "vi" ? "So sánh sản phẩm" : "Compare Products"}
                            <span className="text-primary"> ({compareItems.length})</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            clearCompare();
                            toast.success(language === "vi" ? "Đã xóa tất cả" : "Cleared all");
                        }}
                        className="text-sm font-bold text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        {language === "vi" ? "Xóa tất cả" : "Clear all"}
                    </button>
                </div>

                {/* Compare Table */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-3xl overflow-hidden shadow-sm">
                        <thead>
                            <tr>
                                <th className="text-left p-4 bg-slate-50 font-black text-sm uppercase tracking-wider text-slate-400 w-40">
                                    {language === "vi" ? "Sản phẩm" : "Product"}
                                </th>
                                {compareItems.map((item) => (
                                    <th key={item.id} className="p-4 bg-slate-50 relative">
                                        <button
                                            onClick={() => removeFromCompare(item.id)}
                                            className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full"
                                        >
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Image */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm"></td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4">
                                        <Link href={`/products/${item.slug || item.id}`}>
                                            <div className="w-48 h-48 relative rounded-2xl overflow-hidden mx-auto">
                                                <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" sizes="192px" />
                                            </div>
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                            {/* Name */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm"></td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4">
                                        <Link href={`/products/${item.slug || item.id}`}>
                                            <p className="font-black text-lg text-center hover:text-primary transition-colors line-clamp-2">
                                                {item.name}
                                            </p>
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                            {/* Price */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm">{language === "vi" ? "Giá" : "Price"}</td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                        <span className="text-xl font-black text-primary">{formatPrice(item.price)}</span>
                                        {item.originalPrice && item.originalPrice > item.price && (
                                            <span className="text-sm text-slate-400 line-through ml-2">
                                                {formatPrice(item.originalPrice)}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {/* Rating */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm">{language === "vi" ? "Đánh giá" : "Rating"}</td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold">{item.rating || 0}</span>
                                            <span className="text-slate-400 text-sm">({item.reviewCount || 0})</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            {/* Category */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm">{language === "vi" ? "Danh mục" : "Category"}</td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                        <span className="text-sm font-medium text-slate-600">{item.category || "-"}</span>
                                    </td>
                                ))}
                            </tr>
                            {/* Inventory */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm">{language === "vi" ? "Tình trạng" : "Availability"}</td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                        {(item.inventory ?? 0) > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 font-bold text-sm">
                                                <Check className="w-4 h-4" />
                                                {language === "vi" ? "Còn hàng" : "In stock"}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-bold text-sm">
                                                {language === "vi" ? "Hết hàng" : "Out of stock"}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {/* Actions */}
                            <tr>
                                <td className="p-4 font-bold text-slate-500 text-sm"></td>
                                {compareItems.map((item) => (
                                    <td key={item.id} className="p-4 text-center">
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            disabled={(item.inventory ?? 0) <= 0}
                                            className="rounded-full font-bold"
                                        >
                                            {language === "vi" ? "Thêm vào giỏ" : "Add to Cart"}
                                        </Button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
