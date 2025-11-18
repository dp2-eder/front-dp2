"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Producto } from "@/types/productos";

interface AdminProductCardProps {
  dish: Producto;
}

export function AdminProductCard({ dish }: AdminProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Ajusta el campo según tu modelo: id, id_producto, slug, etc.
    router.push(`/admin/personalizar/${dish.id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="text-center cursor-pointer transition-transform duration-200 hover:scale-105"
      data-cy="plate-card"
    >
      <div className="relative bg-[#004166] md:aspect-[16/9] rounded-3xl flex items-center justify-center overflow-hidden p-6 md:p-6">
        <h3
          className="text-white text-lg font-bold text-center line-clamp-3"
          title={dish.nombre}
          data-cy="plate-name"
        >
          {dish.nombre || "Nombre no disponible"}
        </h3>
      </div>
    </article>
  );
}
