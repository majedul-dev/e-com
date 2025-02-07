// components/DataTable.js
'use client';
import Link from 'next/link';
import { ArrowsUpDownIcon, PencilSquareIcon, EyeIcon, TrashIcon, UserCircleIcon, TruckIcon, CheckCircleIcon, XCircleIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export default function DataTable({
  columns,
  data,
  onSort,
  rowIdKey = 'id',
  statusColors,
    renderCell,
    selectedIds = [], // Add default value
    onSelectAll = () => {}, // Add default function
    onSelectId = () => {} // Add default function
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium w-12 dark:text-gray-300">
            <input
                type="checkbox"
                checked={selectedIds.length > 0 && selectedIds.length === data.length}
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-sm font-medium dark:text-gray-300 ${
                  column.sortable ? 'cursor-pointer' : ''
                }`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                {column.sortable ? (
                  <div className="flex items-center">
                    {column.label}
                    <ArrowsUpDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" />
                  </div>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((item) => {
                      const itemId = item[rowIdKey];
                      return(
                      <tr key={item[rowIdKey]} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">
                              <input
                                  type="checkbox"
                                  checked={selectedIds.includes(itemId)}
                                  onChange={() => onSelectId(itemId)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              />
                          </td>
                          {columns.map((column) => (
                              <td key={column.key} className="px-6 py-4">
                                  {renderCell ? renderCell(column.key, item) : (
                                      <DefaultCellRenderer column={column} item={item} statusColors={statusColors} />
                                  )}
                              </td>
                          ))}
                      </tr>
                  )})}
        </tbody>
      </table>
    </div>
  );
}

function DefaultCellRenderer({ column, item, statusColors }) {
  const value = item[column.key];
  
  switch (column.type) {
    case 'status':
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors?.[value]} dark:bg-opacity-30`}>
          {value}
        </span>
      );
      
    case 'link':
      return (
        <Link
          href={column.href(item)}
          className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          {value}
        </Link>
      );
      
    case 'image':
      return (
        <div className="flex items-center">
          <img
            src={value}
            alt={item.name}
            className="h-12 w-12 object-cover rounded-md mr-4 border border-gray-200 dark:border-gray-700"
          />
          <div>
            <div className="font-medium dark:text-white">{item.name}</div>
            {column.metadata && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {column.metadata(item)}
              </div>
            )}
          </div>
        </div>
      );
      
    case 'actions':
        return (
            <div className="flex items-center space-x-3">
              {column.actions?.map((action) => (
                <div 
                    key={action.key}
                    className="tooltip" 
                    data-tooltip={action.tooltip}
                >
                    {action.type === 'link' ? (
                    <Link
                        href={action.href(item)}
                        className={`${action.className} transition-colors duration-200`}
                    >
                        <action.icon className="h-5 w-5" />
                    </Link>
                    ) : (
                    <button
                        onClick={() => action.handler(item)}
                        className={`${action.className} transition-colors duration-200`}
                    >
                        <action.icon className="h-5 w-5" />
                    </button>
                    )}
                </div>
                ))}
            </div>
          );
      
    default:
      return <span className="text-sm dark:text-gray-300">{value}</span>;
  }
}