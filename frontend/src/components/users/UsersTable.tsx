// src/components/users/UsersTable.tsx
import UserRow, { UserRowData } from "./UserRow";

interface Props {
  users: UserRowData[];
  onEdit: (user: UserRowData) => void;
  onDelete: (user: UserRowData) => void;
}

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Company</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Last Login</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">👤</span>
                  <p>No users found.</p>
                </div>
              </td>
            </tr>
          )}
          {users.map((user) => (
            <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}