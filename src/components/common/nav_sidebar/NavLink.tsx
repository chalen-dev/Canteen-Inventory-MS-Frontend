import { Link } from "react-router-dom";

interface NavLinkProps {
    to: string;
    icon: string; // Font Awesome class, e.g. "fa-chart-line"
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function NavLink({ to, icon, children, onClick }: NavLinkProps) {
    return (
        <Link
            to={to}
            onClick={onClick} // 👈 pass it down
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
            <i className={`fas ${icon} w-5 text-center`} />
            <span>{children}</span>
        </Link>
    );
}