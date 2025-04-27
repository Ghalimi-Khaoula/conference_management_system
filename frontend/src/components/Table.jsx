import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"; // in Next 13+

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

const Table = ({ columns, data }) => {
    const router = useRouter();

    const translate = (column, value) => {
        if (column === "Rôle" && value) {
            return roleTranslations[value] || value;
        }
        if (column === "Statut" && value) {
            return statusTranslations[value] || value;
        }
        if (column === "Statut du Rôle" && value) {
            return statusTranslations[value] || value;
        }
        return value;
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
                                                    onClick={() => router.push(`/conference/${row.id}`)}
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
                                        ) : (
                                            translate(col, row[col.toLowerCase().replace(/\s+/g, "_")])
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
