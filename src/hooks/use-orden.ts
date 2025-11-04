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

  if (simulateNetworkError) {
    console.error("🌐 Simulando error de red...");
    throw new TypeError("Failed to fetch");
  }

  try {
    const res = await fetch("https://back-dp2.onrender.com/api/v1/pedidos/completo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_mesa: idMesa, items: [] }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("✅ Pedido enviado correctamente:", data);
    return data;

  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ Error de red: no se pudo conectar al servidor o la conexión falló.");
    } else {
      console.error("💥 Error al enviar pedido:", error);
    }
    throw error;
  }
}