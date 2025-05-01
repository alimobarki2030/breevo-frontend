import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SmartProductsGrid from "../components/SmartProductsGrid";
import ProductToolbar from "../components/ProductToolbar";
import { Dialog, Transition } from "@headlessui/react";
import { BASE_URL } from '../api/analyticsAPI'; // ✅ أضفنا هذا السطر

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
    fetch(`${BASE_URL}/products`)  // ✅ عدّلنا الرابط
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("❌ فشل جلب المنتجات:", err);
        alert("حدث خطأ أثناء تحميل المنتجات");
      });
  }, []);

  const handleAnalyze = (product) => {
    navigate("/product-seo", { state: { product } });
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("الرجاء إدخال اسم المنتج");

    const newProduct = {
      name,
      description,
    };

    navigate("/product-seo", { state: { product: newProduct } });
    setShowModal(false);
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) =>
      statusFilter === "الكل" ? true : p.status === statusFilter
    );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const seoCounts = {
    ممتاز: products.filter(p => (p.seoScore ?? 0) >= 90).length,
    متوسط: products.filter(p => (p.seoScore ?? 0) >= 60 && (p.seoScore ?? 0) < 90).length,
    ضعيف: products.filter(p => (p.seoScore ?? 0) < 60).length,
  };

  const averageScore = products.length > 0
    ? products.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / products.length
    : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex bg-gray-50">
        <main className="flex-1 p-6 space-y-6">
          <ProductToolbar
            openModal={openModal}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalCount={products.length}
            averageScore={averageScore}
            statusCounts={seoCounts}
            onAddProduct={openModal}
          />

          <SmartProductsGrid
            products={paginatedProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onAnalyze={handleAnalyze}
          />
        </main>
      </div>

      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  إضافة منتج جديد
                </Dialog.Title>
                <div className="mt-2 space-y-4">
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="وصف المنتج"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded min-h-[100px]"
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleSubmit}
                  >
                    متابعة
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
