"use client";

import { Eye, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { axiosClient } from "@/utils/axios-client";
import { useAuthContext } from "@/contexts/AuthContext";

const roleTranslations = {
    creator: "Créateur",
    admin: "Administrateur",
    reviewer: "Évaluateur",
    participant: "Participant",
};

const statusTranslations = {
    pending: "En attente",
    accepted: "Accepté",
    rejected: "Rejeté",
};

// 🛠 mapping between French columns and real data keys
const columnToField = {
    "Email": "email",
    "Rôle": "role",
    "Statut du Rôle": "role_status",
    "Status": "status", // for conference status if needed
};

const Table = ({ columns, data, refetch }) => {
    const router = useRouter();
    const { user } = useAuthContext();

    const translate = (column, value) => {
        if (column === "Rôle" && value) {
            return roleTranslations[value] || value;
        }
        if ((column === "Statut" || column === "Statut du Rôle") && value) {
            return statusTranslations[value] || value;
        }
        return value;
    };

    const handleDecision = async (slug, action) => {
        try {
            await axiosClient.post("/conference/decision", {
                slug,
                action,
            });
            refetch(); // 🚀 after success, refetch conferences
        } catch (error) {
            console.error("Erreur lors de l'action sur la conférence:", error);
        }
    };

    return (
        <div className="overflow-x-auto mt-4 rounded-md">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 dark:bg-violet-500">
                        {columns.map((col, idx) => (
                            <th key={idx} className="text-left p-3 font-semibold border-b">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-white dark:even:bg-gray-600">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="p-3 border-b">
                                        {col === "Actions" ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => router.push(`/conference/${row.slug}`)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Eye size={20} />
                                                </button>

                                                {row.role === "creator" && (
                                                    <button
                                                        onClick={() => alert("Delete conference id: " + row.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : col === "Status" ? (
                                            <div className="flex items-center gap-2">
                                                {translate(col,row[columnToField[col]] ?? row[col.toLowerCase().replace(/\s/g, '_')])}
                                                {user?.roles?.includes('admin') && row.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDecision(row.slug, "accept")}
                                                            className="text-green-500 hover:text-green-700"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecision(row.slug, "reject")}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            translate(col, row[columnToField[col]] ?? row[col.toLowerCase().replace(/\s/g, '_')])
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-3 text-center">
                                Aucune conférence disponible.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
