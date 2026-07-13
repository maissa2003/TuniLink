import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Lock,
  Eye,
  Building2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatLastLogin, formatLastLoginDetailed } from "@/lib/formatLastLogin";
import { useLanguage } from "@/lib/useLanguage";


export interface UserRowData {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  companyId: number | null;
  companyName: string | null;
  lastLoginAt?: string | null;
  profilePicture?: string | null;
}

interface Props {
  user: UserRowData;

  onEdit: (user: UserRowData) => void;

  onDelete: (user: UserRowData) => void;
}

export default function UserRow({
  user,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useLanguage();
  const lastLoginLabel = formatLastLogin(user.lastLoginAt, t("admin.users.neverLoggedIn"));
  const lastLoginTitle = formatLastLoginDetailed(user.lastLoginAt);

  const initials = user.username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const roleColor = () => {
    switch (user.role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-700";

      case "HR":
        return "bg-purple-100 text-purple-700";

      case "FINANCE":
        return "bg-orange-100 text-orange-700";

      case "CLIENT":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const statusColor = () => {
    switch (user.status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "DISABLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <tr className="border-b hover:bg-slate-50 transition">

      {/* User */}

      <td className="py-4">

        <div className="flex items-center gap-4">

          <Avatar className="h-11 w-11">
            <AvatarImage src={user.profilePicture ?? undefined} alt={user.username} />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">{initials}</AvatarFallback>
          </Avatar>

          <div>

            <p className="font-medium text-slate-900">
              {user.username}
            </p>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>

          </div>

        </div>

      </td>

      {/* Company */}

      <td>

        <div className="flex items-center gap-2">

          <Building2 className="h-4 w-4 text-slate-400"/>

          {user.companyName ?? "-"}

        </div>

      </td>

      {/* Role */}

      <td>

        <Badge className={roleColor()}>

          {user.role}

        </Badge>

      </td>

      {/* Status */}

      <td>

        <Badge className={statusColor()}>

          {user.status}

        </Badge>

      </td>

      {/* Last Login */}

      <td className="text-slate-500" title={lastLoginTitle || undefined}>
        {lastLoginLabel}
      </td>

      {/* Actions */}

      <td className="text-right">

        <DropdownMenu>

          <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 text-slate-500">
  <MoreHorizontal className="h-5 w-5" />
</DropdownMenuTrigger>

           

        

          <DropdownMenuContent align="end">

            <DropdownMenuItem>

              <Eye className="mr-2 h-4 w-4"/>

              View

            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEdit(user)}
            >

              <Pencil className="mr-2 h-4 w-4"/>

              Edit

            </DropdownMenuItem>

            <DropdownMenuItem>

              <Lock className="mr-2 h-4 w-4"/>

              Reset Password

            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(user)}
            >

              <Trash2 className="mr-2 h-4 w-4"/>

              Delete

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </td>

    </tr>
  );
}