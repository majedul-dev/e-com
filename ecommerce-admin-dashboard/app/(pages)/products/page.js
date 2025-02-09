import ProductList from "../../../components/products/ProductList";
import ProductFilters from "../../../components/products/ProductFilters";
import Pagination from "../../../components/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAllProducts } from "../../../lib/productAction";
import PageHeader from "@/components/PageHeader";

export default async function ProductsPage({ searchParams }) {
  const products = await getAllProducts(searchParams);

  return (
    <div className="p-6">
      <PageHeader title="Products Management" actionHref="/products/new" actionText="New Product" Icon={PlusIcon}/>
      <ProductFilters />
      <ProductList products={products} />
      <Pagination
        currentPage={products?.pagination.page}
        totalPages={products?.pagination.totalPages}
      />
    </div>
  );
}