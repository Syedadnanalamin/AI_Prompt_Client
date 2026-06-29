"use client"

import { useState } from "react";
import { adminChangeRoleAction, adminDeleteUserAction } from "@/lib/actions";
import { Trash2, Shield, UserCheck, Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersClient({ initialUsers = [], currentUser }) {
    const [users, setUsers] = useState(initialUsers);
    const [loadingId, setLoadingId] = useState(null);

    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser.id || userId === currentUser._id) {
            toast.error("You cannot change your own role!");
            return;
        }

        setLoadingId(userId);
        try {
            await adminChangeRoleAction(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId || u._id === userId ? { ...u, role: newRole } : u));
            toast.success("User role updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update user role");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser.id || userId === currentUser._id) {
            toast.error("You cannot delete your own account!");
            return;
        }

        if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;

        setLoadingId(userId);
        try {
            await adminDeleteUserAction(userId);
            setUsers(prev => prev.filter(u => u.id !== userId && u._id !== userId));
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-xs border-b border-zinc-800">
                    <tr>
                        <th className="px-6 py-4">Avatar</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 font-mono">Tier</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {users.map((u) => {
                        const isSelf = u.id === currentUser.id || u._id === currentUser._id;
                        const uId = u.id || u._id;
                        return (
                            <tr key={uId} className="hover:bg-zinc-900/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="h-9 w-9 rounded-full overflow-hidden border border-zinc-800 relative bg-zinc-950">
                                        <img
                                            src={u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || "U")}`}
                                            alt="User Avatar"
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-white">
                                    {u.name} {isSelf && <span className="text-[10px] text-zinc-500 font-normal ml-1.5">(You)</span>}
                                </td>
                                <td className="px-6 py-4 font-mono text-zinc-400">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                                        u.subscription === "Premium"
                                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    }`}>
                                        {u.subscription || "Free"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        disabled={loadingId === uId || isSelf}
                                        value={u.role || "User"}
                                        onChange={(e) => handleRoleChange(uId, e.target.value)}
                                        className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="User">User</option>
                                        <option value="Creator">Creator</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(uId)}
                                        disabled={loadingId === uId || isSelf}
                                        className="p-1.5 rounded-lg border border-zinc-800 hover:border-red-500/30 bg-zinc-950 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                                        title="Delete User"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
