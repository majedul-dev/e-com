import {
    DocumentTextIcon,
    HashtagIcon,
    PhotoIcon,
    SquaresPlusIcon,
    ChartBarIcon
  } from '@heroicons/react/24/outline';
  
  const sections = [
    { key: 'basic', label: 'Basic Info', icon: DocumentTextIcon },
    { key: 'inventory', label: 'Inventory', icon: HashtagIcon },
    { key: 'media', label: 'Media', icon: PhotoIcon },
    { key: 'variants', label: 'Variants', icon: SquaresPlusIcon },
    { key: 'seo', label: 'SEO', icon: ChartBarIcon }
  ];
  
  export default function SidebarNavigation({ activeSection, setActiveSection }) {
    return (
      <div className="lg:col-span-1 space-y-2">
        {sections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeSection === key 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300'
            }`}
          >
            <Icon className="h-5 w-5 mr-2 inline dark:text-gray-400" />
            {label}
          </button>
        ))}
      </div>
    );
  }
  