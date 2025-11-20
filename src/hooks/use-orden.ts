/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { API_BASE_URL } from "@/lib/api-config"
import {
  CartItem,
  SendOrderParams,
  SendOrderParamsLegacy,
  ValidationError
} from "@/types/orders"

// Re-export para compatibilidad hacia atrás
export type { CartItem, SendOrderParams, SendOrderParamsLegacy, ValidationError }

/**
 * Envía un pedido al backend usando el nuevo endpoint con token_sesion
 * POST /api/pedidos/enviar (proxy a /api/v1/pedidos/enviar en el backend)
 */
export async function sendOrderToKitchen({
  cart,
  tokenSesion,
  notasCliente = "",
  notasCocina = "",
}: SendOrderParams) {

  if (!tokenSesion) throw new Error("Token de sesión no disponible");

  const items = cart.map((item) => ({
    id_producto: String(item.id).split("-")[0],
    cantidad: Number(item.quantity),
    opciones: item.selectedOptions?.map(o => ({
      id_producto_opcion: o.id,
    })) ?? [],
    notas_personalizacion: item.comments ?? "",
  }));

  const payload = {
    token_sesion: tokenSesion,
    items,
    notas_cliente: notasCliente,
    notas_cocina: notasCocina,
  };

  console.log("📤 POST a backend con payload:", payload);
  const res = await fetch(`${API_BASE_URL}/api/v1/pedidos/enviar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("📥 Respuesta del servidor:", res.status, res.statusText);

  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    console.error("📋 Respuesta completa del servidor:", data);

    // Mostrar detalles de cada error
    if (data?.detail && Array.isArray(data.detail)) {
      const details = data.detail as ValidationError[];
      details.forEach((err, idx) => {
        // eslint-disable-next-line no-console
        console.error(`  ❌ Error ${idx + 1}:`, {
          location: err.loc?.join(" > "),
          message: err.msg,
          input: err.input,
          type: err.type
        });
      });
    }

    const msg =
      (data && typeof data === "object" && (data.error || data.detail || JSON.stringify(data))) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

/**
 * Función antigua para compatibilidad (DEPRECATED)
 * Usa sendOrderToKitchen con tokenSesion en su lugar
 */
export async function sendOrderToKitchenLegacy({
  cart,
  idMesa,
  userId,
  notasCliente = "",
  notasCocina = "",
}: SendOrderParamsLegacy) {

  if (!idMesa) throw new Error("No se encontró el ID de la mesa");
  if (!userId) throw new Error("No se encontró el ID del usuario");

  const items = cart.map((item) => ({
    id_producto: String(item.id).split("-")[0],
    cantidad: Number(item.quantity),
    precio_unitario: Number(Number(item.basePrice).toFixed(2)),
    opciones: item.selectedOptions?.map(o => ({
      id_producto_opcion: o.id,
      precio_adicional: Number(o.price)
    })) ?? [],
    notas_personalizacion: item.comments ?? "",
  }));

  const payload = {
    id_usuario: userId,
    id_mesa: idMesa,
    items,
    notas_cliente: notasCliente,
    notas_cocina: notasCocina,
  };

  const res = await fetch("/api/pedidos/completo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    if (data?.detail && Array.isArray(data.detail)) {
      const details = data.detail as ValidationError[];
      details.forEach((err, idx) => {
        // eslint-disable-next-line no-console
        console.error(`  ❌ Error ${idx + 1}:`, {
          location: err.loc?.join(" > "),
          message: err.msg,
          input: err.input,
          type: err.type
        });
      });
    }

    const msg =
      (data && typeof data === "object" && (data.error || data.detail || JSON.stringify(data))) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
