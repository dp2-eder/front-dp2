"use client";

import { LogIn, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PlatoSkeleton } from "@/components/custom/plato-skeleton";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/lib/image-url";
import { useAdminProducto } from "@/hooks/use-admin-producto";
import { useOpcionesProducto } from "@/hooks/use-opciones-producto";
import { markImageAsCached } from "@/lib/image-cache";

// Mapeo de iconos por defecto para cuando la API no devuelve icono
const defaultIcons: Record<string, string> = {
  "Nueces": "🥜",
  "Sésamo": "🌰",
  "Crustáceo": "🦐",
  "Mariscos": "🦐",
  "Huevo": "🥚",
  "Gluten": "🌾",
  "Pescado": "🐟",
  "Cítricos": "🍋",
  "Moluscos": "🐙",
  "Aj": "🧄",
};


// Si usas shadcn dialog

type ComplementoForm = {
  nombre: string;
  precio: string;
};

type SeccionForm = {
  id: string;
  nombre: string;
  complementos: ComplementoForm[];
};

export default function AdminPersonalizarPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { producto, loading, error } = useAdminProducto(id);

  // Extraer alergenos directamente del producto (ya vienen en la respuesta)
  const alergenos = producto?.alergenos?.map((item: any) => ({
    nombre: item.nombre,
    icono: item.icono || defaultIcons[item.nombre] || "⚠️",
  })) || [];

  const alergenosLoading = loading;

  // Traer opciones (misma API que en el cliente)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    producto: productoConOpciones,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading: _loadingOpciones,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: _errorOpciones,
  } = useOpcionesProducto(id);


  // Secciones en el panel derecho (por ahora solo en front)
  const [secciones, setSecciones] = useState<SeccionForm[]>([]);

  useEffect(() => {
    if (!productoConOpciones || !productoConOpciones.tipos_opciones) return;

    const mapped: SeccionForm[] = productoConOpciones.tipos_opciones.map(
      (tipo) => ({
        id: tipo.id_tipo_opcion,            // viene del backend
        nombre: tipo.nombre_tipo,           // nombre de la sección
        complementos: tipo.opciones.map((op) => ({
          nombre: op.nombre,
          // guardamos el precio tal cual string: "5.00", "S/5.00", etc.
          precio: op.precio_adicional ?? "",
        })),
      })
    );

    setSecciones(mapped);
  }, [productoConOpciones]);

  // Estado del modal "Nueva sección"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [complements, setComplements] = useState<ComplementoForm[]>([
    { nombre: "", precio: "" },
  ]);

  console.log("🔎 [AdminPersonalizar] route param id =", id);

  // Skeleton mientras carga
  if (loading && !producto) {
    return <PlatoSkeleton />;
  }

  if (error) return <div>Error: {error}</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  // Handlers para secciones / modal
  const handleOpenModal = () => {
    setSectionName("");
    setComplements([{ nombre: "", precio: "" }]);
    setIsModalOpen(true);
  };

  const handleAddComplementRow = () => {
    setComplements((prev) => [...prev, { nombre: "", precio: "" }]);
  };

  const handleComplementChange = (
    index: number,
    field: keyof ComplementoForm,
    value: string
  ) => {
    setComplements((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      )
    );
  };

  const handleSaveSection = () => {
    const nuevaSeccion: SeccionForm = {
      id: crypto.randomUUID(),
      nombre: sectionName || "Nueva sección",
      complementos: complements.filter(
        (c) => c.nombre.trim() !== "" || c.precio.trim() !== ""
      ),
    };

    setSecciones((prev) => [...prev, nuevaSeccion]);
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleBack = () => {
    router.push("/admin/menu");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleRefresh = () => {
    // Por ahora recarga la página, luego puedes cambiarlo a un refetch
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAFCFE] flex flex-col">
      {/* Header admin (sin navegación cliente) */}
      <Header showNavigation={false} showLogout={true} />

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Barra superior: Back + Refresh */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/admin/menu" className="flex items-center gap-2 mb-6">
              <LogIn className="w-7 h-7" style={{ transform: 'scaleX(-1)' }} />
            </Link>
          </div>

          {/* Layout principal: 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-8">
            {/* Columna izquierda: Datos del producto */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Datos Del Producto
              </h2>

              {/* ⬇️ NUEVO LAYOUT SIN CARD BLANCA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">

                {/* IZQUIERDA: Imagen + archivo + Importar */}
                <div className="flex flex-col items-start">
                  {/* Contenedor de la imagen con borde, como en Figma */}
                  <div className="w-[260px] h-[260px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <SafeImage
                      src={getProductImageUrl(producto.imagen_path) || ''}
                      alt={producto.nombre || "Sin nombre"}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                      priority={true}
                      quality={70}
                      onLoad={() => {
                        if (producto.imagen_path) {
                          const imageUrl = getProductImageUrl(producto.imagen_path)
                          if (imageUrl) markImageAsCached(imageUrl)
                        }
                      }}
                    />
                  </div>

                  {/* Upload + Importar */}
                  <div className="flex gap-3 mt-4 w-full max-w-[260px]">
                    <Input
                      type="file"
                      className="text-xs"
                    />
                    <Button
                      className="bg-[#004166] text-white text-xs px-4 rounded-lg hover:bg-[#003855]"
                    >
                      Importar
                    </Button>
                  </div>
                </div>

                {/* DERECHA: Nombre / Descripción / Precio */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Nombre
                    </label>
                    <Input
                      defaultValue={producto.nombre}
                      className="bg-white border-customBorder"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Descripción
                    </label>
                    <textarea
                      defaultValue={producto.descripcion || ""}
                      className="w-full rounded-md border border-customBorder bg-white px-3 py-2 text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#004166]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Precio
                    </label>
                    <Input
                      defaultValue={producto.precio_base}
                      className="bg-white max-w-xs border-customBorder"
                    />
                  </div>
                </div>
              </div>

              {/* 🔹 Alérgenos: SE MANTIENE IGUAL */}
              {/* Título + badge */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-[#0D1030]">
                  Alérgenos
                </h2>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#004166] text-white">
                  Opcional
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-customBorder shadow-sm px-6 py-4">

                {alergenosLoading ? (
                  <p className="text-sm text-gray-400">Cargando alérgenos...</p>
                ) : alergenos.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-3 text-sm">
                    {alergenos.map((a, index) => (
                      <div key={a.nombre}>
                        <label className="flex items-center gap-3 text-[#0D1030]">
                          <input type="checkbox" className="h-4 w-4" />
                          <span>{a.nombre}</span>
                        </label>

                        {index < alergenos.length - 1 && (
                          <div className="mt-2 border-b border-customBorder" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    No hay alérgenos registrados para este producto.
                  </p>
                )}
              </div>
            </section>


            {/* Columna derecha: Secciones de personalización */}
            <section className="flex flex-col">
              {/* Título + botón (fuera del card grande) */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Agregar Sección</h2>
                <Button
                  size="sm"
                  className="bg-[#004166] hover:bg-[#003855]"
                  onClick={handleOpenModal}
                >
                  Agregar sección
                </Button>
              </div>

              {/* Contenedor grande con borde + scroll interno */}
              <div className="bg-white border border-customBorder rounded-2xl shadow-md flex-1 overflow-hidden">

                <div className="h-full max-h-[560px] overflow-y-auto px-4 py-4 space-y-4">
                  {secciones.length === 0 && (
                    <p className="text-sm text-gray-400">
                      Aún no hay secciones de personalización para este
                      producto. Haz clic en &quot;Agregar sección&quot; para
                      crear la primera.
                    </p>
                  )}

                  {secciones.map((sec) => (
                    <div
                      key={sec.id}
                      className="bg-white border border-[#99A1AF] rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="p-4">
                        {/* Título de la sección */}
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {sec.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          Puedes elegir 1 opción.
                        </p>

                        {/* Lista de opciones (estilo cliente) */}
                        <div className="space-y-0">
                          {sec.complementos.map((c, idx) => {
                            const precioNum = Number(
                              (c.precio || "").replace(/[^\d.]/g, "")
                            );
                            const esGratis = !precioNum || isNaN(precioNum);

                            return (
                              <div key={idx}>
                                <div className="flex items-center justify-between py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-3 rounded-full border border-gray-400" />
                                    <span className="text-sm text-gray-800">
                                      {c.nombre || "Complemento"}
                                    </span>
                                  </div>

                                  <span className="text-sm text-gray-900 mr-4">
                                    {esGratis ? "Gratis" : `+S/${precioNum.toFixed(2)}`}
                                  </span>
                                </div>

                                {idx < sec.complementos.length - 1 && (
                                  <div className="border-b border-gray-200" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer showSocial={false} />

      {/* MODAL NUEVA SECCIÓN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              Nueva Sección
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nombre de la sección
              </label>
              <Input
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Ej: Añade más bebidas"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Complementos</h3>

              {complements.map((c, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-3 space-y-2"
                >
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Nombre del complemento
                    </label>
                    <Input
                      value={c.nombre}
                      onChange={(e) =>
                        handleComplementChange(
                          index,
                          "nombre",
                          e.target.value
                        )
                      }
                      placeholder="Ej: Inca Kola 600ml"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Precio del complemento
                    </label>
                    <Input
                      value={c.precio}
                      onChange={(e) =>
                        handleComplementChange(
                          index,
                          "precio",
                          e.target.value
                        )
                      }
                      placeholder="Ej: S/ 5.00"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddComplementRow}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#004166] hover:bg-[#003855]"
              onClick={handleSaveSection}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
