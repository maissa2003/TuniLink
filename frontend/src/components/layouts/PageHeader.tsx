import { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <div className="mb-8">

      {/* Breadcrumb */}

      <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">

        <Link
          to="/admin/dashboard"
          className="flex items-center hover:text-blue-600"
        >
          <Home className="mr-1 h-4 w-4" />
          Dashboard
        </Link>

        {breadcrumbs.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />

            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-900">
                {item.label}
              </span>
            )}
          </div>
        ))}

      </nav>

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-2 text-slate-500">
              {description}
            </p>
          )}

        </div>

        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}

      </div>

    </div>
  );
}