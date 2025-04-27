import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, setPage, lastPage }) => {
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

    return (
        <div className="p-4 flex items-center justify-between text-sm">
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="py-2 px-4 rounded-md font-semibold flex gap-2 bg-gray-200 dark:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
                <ChevronLeft size={22} />
                <span className="hidden md:block">Retour</span>
            </button>

            <div className="flex items-center gap-2">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-2 font-semibold ${p === page ? "text-violet-500" : ""}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setPage(page + 1)}
                disabled={page === lastPage}
                className="py-2 px-4 rounded-md font-semibold flex gap-2 bg-gray-200 dark:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
                <span className="hidden md:block">Suite</span>
                <ChevronRight size={22} />
            </button>
        </div>
    );
};

export default Pagination;
