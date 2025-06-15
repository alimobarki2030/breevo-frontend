import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SmartProductsGrid from "../components/SmartProductsGrid";
import ProductToolbar from "../components/ProductToolbar";
import { Dialog, Transition } from "@headlessui/react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const openModal = () => {
    setName("");
    setDescription("");
    setShowModal(true);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved_products") || "[]");

    if (saved.length > 0) {
      setProducts(saved);
    } else {
      const dummyData = Array.from({ length: 3 }).map((_, i) => ({
        id: i + 1,
        name: `منتج تجريبي رقم ${i + 1}`,
        seoScore: Math.floor(Math.random() * 100),
        status: ["ممتاز", "متوسط", "ضعيف"][Math.floor(Math.random() * 3)],
        lastUpdated: "2025-04-21",
      }));
      setProducts(dummyData);
    }
  }, []);

  const handleAnalyze = (product) => {
    navigate("/product-seo", { state: { product } });
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("الرجاء إدخال اسم المنتج");

    const newProduct = {
      id: Date.now(),
      name,
      description,
      seoScore: null,
      status: "جديد",
      lastUpdated: new Date().toISOString().slice(0, 10),
    };

    navigate("/product-seo", { state: { product: newProduct } });
    setShowModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesStatus =
      statusFilter === "الكل" || p.status === statusFilter;
    const matchesSearch = p.name.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const averageScore =
    filteredProducts.reduce((sum, p) => sum + p.seoScore, 0) /
      filteredProducts.length || 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6 space-y-6">
          <ProductToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalCount={filteredProducts.length}
            averageScore={averageScore}
            onAddProduct={openModal}
          />

          <SmartProductsGrid
            products={displayedProducts}
            onAnalyze={handleAnalyze}
          />

          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              disabled={currentPage === 1}
            >
              ⬅️ السابق
            </button>
            <span className="text-sm">
              صفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              disabled={currentPage === totalPages}
            >
              التالي ➡️
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full px-4 py-8">
              <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <Dialog.Title className="text-lg font-medium mb-4">
                  ➕ أضف منتجك
                </Dialog.Title>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                  />
                  <textarea
                    placeholder="وصف المنتج (اختياري)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                    rows={4}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-100"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      ابدأ التحسين
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
