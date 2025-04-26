import { Search } from "lucide-react";

const TableSearch = () => {
    return (
        <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
                type="search"
                id="search"
                className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500`}
                placeholder="Chercher..."
            />
        </div>
    )
}

export default TableSearch;