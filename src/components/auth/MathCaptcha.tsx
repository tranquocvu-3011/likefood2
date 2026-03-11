"use client";

/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MathCaptchaProps {
    onValidate: (isValid: boolean) => void;
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [operator, setOperator] = useState<"+" | "-">("+");
    const [answer, setAnswer] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const generateCaptcha = () => {
        const op = Math.random() > 0.5 ? "+" : "-";
        let n1, n2;
        if (op === "+") {
            n1 = Math.floor(Math.random() * 10) + 1;
            n2 = Math.floor(Math.random() * 10) + 1;
        } else {
            n1 = Math.floor(Math.random() * 10) + 10;
            n2 = Math.floor(Math.random() * 10) + 1;
        }
        setNum1(n1);
        setNum2(n2);
        setOperator(op);
        setAnswer("");
        setIsCorrect(null);
        onValidate(false);
    };

    useEffect(() => {
        setIsClient(true);
        generateCaptcha();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAnswer(val);

        if (val === "") {
            setIsCorrect(null);
            onValidate(false);
            return;
        }

        const expected = operator === "+" ? num1 + num2 : num1 - num2;
        const valid = parseInt(val, 10) === expected;
        setIsCorrect(valid);
        onValidate(valid);
    };

    if (!isClient) {
        return <div className="animate-pulse h-14 bg-slate-100 rounded-2xl w-full"></div>;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Xác thực bảo mật
                </label>
                <button
                    type="button"
                    onClick={generateCaptcha}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                    <RefreshCcw className="w-3 h-3" /> Đổi câu hỏi
                </button>
            </div>
            <div className="flex flex-row items-center gap-3">
                <div className="h-14 flex-shrink-0 px-6 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-lg text-slate-700 select-none border border-slate-200 shadow-inner min-w-[110px]">
                    {num1} {operator} {num2} =
                </div>
                <div className="flex-1 min-w-0">
                    <input
                        type="number"
                        required
                        value={answer}
                        onChange={handleChange}
                        className={cn(
                            "w-full h-14 px-5 bg-slate-50 border rounded-2xl outline-none transition-all font-bold text-lg text-center appearance-none",
                            isCorrect === true
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-500/10"
                                : isCorrect === false && answer !== ""
                                    ? "border-red-500 bg-red-50 text-red-700 ring-4 ring-red-500/10"
                                    : "border-slate-200 focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5"
                        )}
                        placeholder="?"
                        style={{ MozAppearance: "textfield" }}
                    />
                </div>
            </div>
            {isCorrect === false && answer !== "" && (
                <p className="text-[11px] font-bold text-red-500 px-1 mt-1">Kết quả chưa chính xác!</p>
            )}
        </div>
    );
}
