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
  selectedOptions: { type: string; name: string; price: number }[];
  totalPrice: number;
  comments?: string;
}

export interface SendOrderParams {
  cart: CartItem[];
  idMesa: string;            // 👈 NUEVO (obligatorio)
  notasCliente?: string;
  notasCocina?: string;
}

export async function sendOrderToKitchen({
  cart,
  idMesa,
  notasCliente = "",
  notasCocina = "",
}: SendOrderParams) {

  if (!idMesa) throw new Error("No se encontró el ID de la mesa");

  const items = cart.map((item) => ({
    id_producto: String(item.id).split("-")[0],
    cantidad: Number(item.quantity),
    precio_unitario: Number(Number(item.basePrice).toFixed(2)),
    // si tu backend espera string[]:
    opciones: item.selectedOptions?.map(o => String(o.name)) ?? [],
    notas_personalizacion: item.comments ?? "",
  }));

  const payload = {
    id_mesa: idMesa,
    items,
    notas_cliente: notasCliente,
    notas_cocina: notasCocina,
  };

  const res = await fetch("https://back-dp2.onrender.com/api/v1/pedidos/completo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();               // lee SOLO una vez
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.error || data.detail)) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
