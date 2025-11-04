/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
// Reusa tu CartItem del hook si ya lo exporta.
// Si no, deja este igual al que ya tienes:
export interface CartItem {
  id: string;
  dishId: number;
  name: string;
  description: string;
  basePrice: number;
  quantity: number;
  image: string;
  selectedOptions: {
    id: any; type: string; name: string; price: number 
}[];
  totalPrice: number;
  comments?: string;
}

export interface SendOrderParams {
  cart: CartItem[];
  idMesa: string;            // 👈 NUEVO (obligatorio)
  notasCliente?: string;
  notasCocina?: string;
  simulateServerError?: boolean; // 👈 NUEVO parámetro opcional
}

export async function sendOrderToKitchen({
  cart,
  idMesa,
  notasCliente = "",
  notasCocina = "",
  simulateNetworkError = false, // 👈 NUEVO
}: SendOrderParams & { simulateNetworkError?: boolean }) {

  if (!idMesa) throw new Error("No se encontró el ID de la mesa");

  const items = cart.map((item) => ({
    id_producto: String(item.id).split("-")[0],
    cantidad: Number(item.quantity),
    precio_unitario: Number(Number(item.basePrice).toFixed(2)),
    // Mapear opciones con los nombres que espera el backend
    opciones: item.selectedOptions?.map(o => ({
      id_producto_opcion: o.id,
      precio_adicional: Number(o.price)
    })) ?? [],
    notas_personalizacion: item.comments ?? "",
  }));

  const payload = {
    id_mesa: idMesa,
    items,
    notas_cliente: notasCliente,
    notas_cocina: notasCocina,
  };

  console.log("📤 POST a /api/v1/pedidos/completo con payload:", payload);
  const res = await fetch("https://back-dp2.onrender.com/api/v1/pedidos/completo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("📥 Respuesta del servidor:", res.status, res.statusText);

  const text = await res.text();               // lee SOLO una vez
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    console.error("📋 Respuesta completa del servidor:", data);

    // Mostrar detalles de cada error
    if (data?.detail && Array.isArray(data.detail)) {
      data.detail.forEach((err: any, idx: number) => {
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
