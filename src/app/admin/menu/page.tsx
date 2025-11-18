"use client";

import { useRouter } from "next/navigation";

import Loading from "@/app/loading";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { AdminProductCard } from "@/components/menu/admin-product-card";
import { MenuLayout } from "@/components/menu/menu-layout";
import { useMenuFiltering } from "@/hooks/use-menu-filtering";
import { useProductos } from "@/hooks/use-productos";

export default function AdminMenuPage() {
  const router = useRouter();
  const { productos, loading } = useProductos();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    inputValue,
    setInputValue,
    filteredDishes,
    dishesByCategory,
    expandedCategories,
    toggleCategory
  } = useMenuFiltering(productos);

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem("token_sesion");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("userRole");
    localStorage.removeItem("fecha_expiracion");

    // Navegar al login de admin
    router.push("/admin/login");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sin navegación, con botón de cerrar sesión */}
      <Header showNavigation={false} showLogout={true} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">Nuestro Menú</h1>

        {/* Menu Layout Component */}
        <MenuLayout
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          inputValue={inputValue}
          onInputChange={setInputValue}
          filteredDishes={filteredDishes}
          dishesByCategory={dishesByCategory}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategory}
          renderProductCard={(dish) => <AdminProductCard dish={dish} />}
          searchPlaceholder="Buscar productos..."
          showSearch={true}
        />
      </main>

      {/* Footer */}
      <Footer showSocial={false} />
    </div>
  );
}
