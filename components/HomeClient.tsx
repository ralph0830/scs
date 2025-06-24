"use client";

import { useState } from "react";

const mainMenus = [
  { key: "inn", label: "숙소", icon: "🌙", status: "2/2 모험가" },
  { key: "tavern", label: "선술집", icon: "🏔️", status: "1/1 손님 · 신규!", statusClass: "text-orange-400 font-bold" },
  { key: "storage", label: "저장소", icon: "📦", status: "12/30 아이템" },
  { key: "market", label: "시장", icon: "🍺", status: "" },
  { key: "workshop", label: "작업장", icon: "🧵", status: "1/1 완료됨" },
  { key: "kennel", label: "보호소", icon: "🦴", status: "0/2 펫" },
];

export default function HomeClient() {
  return (
    <div className="bg-[#222] text-gray-100 min-h-0 h-auto overflow-y-hidden">
      {/* 메인 메뉴 카드 */}
      <main className="px-2 py-4 bg-[#222]">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {mainMenus.map((menu) => (
            <button
              key={menu.key}
              className="flex items-center gap-4 bg-[#333] border border-[#444] rounded-xl px-4 py-3 shadow hover:bg-[#444] transition group"
            >
              <span className="text-3xl">{menu.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-base font-semibold">{menu.label}</div>
                {menu.status && (
                  <div className={`text-xs mt-1 ${menu.statusClass || "text-gray-400"}`}>{menu.status}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
} 