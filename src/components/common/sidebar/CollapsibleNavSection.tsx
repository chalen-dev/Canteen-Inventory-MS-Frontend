interface CollapsibleNavSectionProps {
    menuKey: string;
    icon: string;
    label: string;
    isOpen: boolean;
    onToggle: (key: string) => void;
    children: React.ReactNode;
}

export function CollapsibleNavSection({
                                   menuKey,
                                   icon,
                                   label,
                                   isOpen,
                                   onToggle,
                                   children
                               }: CollapsibleNavSectionProps) {
    return (
        <div>
            <button
                onClick={() => onToggle(menuKey)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
        <span className="flex items-center gap-3">
          <i className={`fas ${icon} w-5 text-center`} />
          <span>{label}</span>
        </span>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-xs transition-transform`} />
            </button>
            {isOpen && (
                <div className="ml-8 mt-1 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
}