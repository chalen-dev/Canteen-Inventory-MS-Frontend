import {Link} from "react-router-dom";

interface SubNavLinkProps {
    to: string;
    icon: string;
    children: React.ReactNode;
}

export function SubNavLink({ to, icon, children }: SubNavLinkProps) {
    return (
        <Link
            to={to}
            className="block px-4 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors"
        >
            <i className={`fas ${icon} w-4 mr-2`} />
            {children}
        </Link>
    );
}