import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminGetPayments } from "@/lib/api";
import { CreditCard, Calendar, Mail, DollarSign } from "lucide-react";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard/profile");
    }

    const payments = await adminGetPayments();

    return (
        <div className="space-y-8 bg-zinc-950 max-w-5xl">
            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Payment Transactions</h1>
                <p className="text-sm text-zinc-500 mt-1">Review lifetime Premium upgrade logs and Stripe session payloads</p>
            </div>

            {payments.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/15">
                    <CreditCard className="mx-auto text-zinc-600 mb-3" size={32} />
                    <p className="text-zinc-500 text-sm">No transaction records found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Transaction ID / Session ID</th>
                                <th className="px-6 py-4">User Email</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                            {payments.map((pay) => (
                                <tr key={pay._id} className="hover:bg-zinc-900/20 transition-colors">
                                    <td className="px-6 py-4 font-mono text-zinc-400 text-xs truncate max-w-[200px]" title={pay.transactionId}>
                                        {pay.transactionId}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white flex items-center gap-1.5">
                                        <Mail size={14} className="text-zinc-500" />
                                        {pay.email}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-emerald-400 font-mono flex items-center">
                                        <DollarSign size={13} />
                                        {pay.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-zinc-400 text-xs">
                                        {new Date(pay.date).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
