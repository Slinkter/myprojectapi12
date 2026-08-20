/**
 * @file AdminDashboard.tsx
 * @description Panel de control para administradores que permite gestionar inventario de productos
 * (crear, editar, activar/desactivar y controlar stock) y moderación de usuarios (suspender/reactivar).
 * @architecture Presentation Layer - Admin Feature
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@features/auth/application/AuthContext";
import { 
  getAllProductsForAdmin, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "@features/products/infrastructure/productsFirestore";
import { getAllUsers, setUserSuspension } from "@features/users/infrastructure/usersFirestore";
import type { IProduct } from "@/entities/product";
import type { IUserProfileDocument } from "@features/users/infrastructure/usersFirestore";
import { Button } from "@/shared/ui/Button";
import { Plus, Edit2, Trash2, ShieldAlert, Check, X } from "lucide-react";

/**
 * Componente de tablero administrativo con navegación por pestañas (Productos y Usuarios).
 *
 * @component
 * @returns {JSX.Element} Panel de administración.
 */
const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");
  
  // State for products
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // State for users
  const [users, setUsers] = useState<IUserProfileDocument[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getAllProductsForAdmin();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadUsersList = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadProducts();
      loadUsersList();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Acceso Denegado</h1>
        <p className="text-gray-600 mt-2">Solo los administradores autorizados pueden acceder a este panel.</p>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice(0);
    setStock(0);
    setCategory("");
    setThumbnail("https://dummyjson.com/image/i/products/1/thumbnail.jpg");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: IProduct) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category || "");
    setThumbnail(product.thumbnail);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        price,
        stock,
        category,
        thumbnail,
        isActive: editingProduct ? (editingProduct.isActive !== false) : true,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleToggleProductStatus = async (product: IProduct) => {
    const nextStatus = product.isActive === false ? true : false;
    try {
      await updateProduct(product.id, { isActive: nextStatus });
      loadProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar permanentemente este producto de Firestore?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleUserSuspension = async (targetUser: IUserProfileDocument) => {
    const nextStatus = !targetUser.isSuspended;
    const actionText = nextStatus ? "suspender" : "reactivar";
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} a ${targetUser.email}?`)) {
      try {
        await setUserSuspension(targetUser.uid, nextStatus);
        loadUsersList();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel de Administración</h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestiona el inventario de productos, controla stocks y administra el estado de los usuarios.
          </p>
        </div>
        {activeTab === "products" && (
          <Button onClick={handleOpenCreateModal} className="mt-4 md:mt-0 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Crear Producto
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Productos e Inventario
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Gestión de Usuarios
        </button>
      </div>

      {/* Tab Content - Products */}
      {activeTab === "products" && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {loadingProducts ? (
            <div className="p-8 text-center text-gray-500">Cargando inventario...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className={product.isActive === false ? "bg-gray-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img src={product.thumbnail} alt={product.title} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{product.title}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-semibold ${product.stock <= 5 ? "text-red-600" : "text-gray-600"}`}>
                          {product.stock} u.
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {product.isActive !== false ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleProductStatus(product)}
                            className={`p-1.5 rounded ${
                              product.isActive !== false 
                                ? "text-amber-600 hover:bg-amber-50" 
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={product.isActive !== false ? "Dar de baja" : "Dar de alta"}
                          >
                            {product.isActive !== false ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Eliminar de Firestore"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content - Users */}
      {activeTab === "users" && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {loadingUsers ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((item) => (
                    <tr key={item.uid} className={item.isSuspended ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{item.uid}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          !item.isSuspended ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {!item.isSuspended ? "Activo" : "Suspendido"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {item.role !== "admin" && (
                          <button
                            onClick={() => handleToggleUserSuspension(item)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              item.isSuspended 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {item.isSuspended ? "Reactivar Cuenta" : "Suspender"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal para Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Nombre</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 p-2 border"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Descripción</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 p-2 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Precio ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1 block w-full rounded border-gray-300 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">Stock (Unidades)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="mt-1 block w-full rounded border-gray-300 p-2 border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">Categoría</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 p-2 border"
                  placeholder="Ej: smart-home, laptops"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">URL de Imagen</label>
                <input
                  type="url"
                  required
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 p-2 border"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
