import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { SlidersHorizontal,Plus } from "lucide-react";

const MyConferencePage = ()=>{
    return (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-md flex-1 m-3 mt-0">
            <div className="flex justify-end md:justify-between items-center">
                <div className="font-semibold text-lg hidden md:block flex-1">Tous les conferences</div>
                <div className="flex gap-3 flex-col md:flex-row items-end flex-1 justify-end md:items-center">
                    <TableSearch />
                    <div className="gap-4 flex">
                        <button>
                            <SlidersHorizontal size={22} />
                        </button>
                        <button>
                            <Plus size={22} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="">

            </div>
            <Pagination />
        </div>
    )
}


export default MyConferencePage;