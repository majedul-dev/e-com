// app/categories/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  FolderIcon,
  ChevronUpDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';
import BulkActions from '../../components/BulkActions';
import DeleteModal from '../../components/DeleteModal';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Devices and gadgets',
    parentCategory: null,
    productCount: 245,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    description: 'Smartphones and accessories',
    parentCategory: 'Electronics',
    productCount: 150,
    status: 'active',
    createdAt: '2024-02-20'
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Sorting functionality
  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredCategories = sortedCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  // Sort handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Bulk selection
  const toggleSelectAll = (e) => {
    setSelectedCategories(e.target.checked ? currentCategories.map(c => c.id) : []);
  };

  const toggleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Delete confirmation modal
  const handleDeleteCategories = () => {
    console.log('Deleting categories:', selectedCategories);
    // Add actual delete logic here
    setSelectedCategories([]);
    setIsDeleteModalOpen(false);
  };
  
  // Merge handler
  const handleMergeCategories = () => {
    console.log('Merging categories:', selectedCategories);
    // Add actual merge logic here
    setSelectedCategories([]);
    setIsMergeModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategories}
        itemName="category"
        selectedCount={selectedCategories.length}
      />

      {/* Merge Modal (create similar component) */}
      {/* <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        onConfirm={handleMergeCategories}
        selectedCount={selectedCategories.length}
      /> */}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Link 
          href="/dashboard/categories/new"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Category
        </Link>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        </div>

        <select
          className="p-2 border rounded-lg bg-white"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === currentCategories.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Category Name
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Parent Category</th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium cursor-pointer dark:text-gray-300"
                onClick={() => handleSort('productCount')}
              >
                <div className="flex items-center">
                  Products
                  <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleSelectCategory(category.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FolderIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-3" />
                    <div>
                      <div className="font-medium dark:text-white">{category.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">/{category.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  {category.description || '–'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {category.parentCategory || '–'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-medium dark:text-white">{category.productCount}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">products</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/categories/${category.id}/edit`}
                      className="tooltip text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      data-tooltip="Edit Category"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button 
                      className="tooltip text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      data-tooltip="Delete Category"
                      onClick={() => {
                        setSelectedCategories([category.id]);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        // totalPages={totalPages}
        onPageChange={(page) => {
          // Handle page change logic
          setCurrentPage(page);
          // You might want to update the URL or fetch new data
        }}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedCategories.length}
        actions={[
          {
            key: 'merge',
            label: 'Merge Categories',
            onAction: () => setIsMergeModalOpen(true)
          },
          {
            key: 'delete',
            label: 'Delete Categories',
            variant: 'danger',
            onAction: () => setIsDeleteModalOpen(true)
          }
        ]}
      />
    </div>
  );
}