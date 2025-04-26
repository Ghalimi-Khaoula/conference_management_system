import { Sparkle } from "lucide-react";

const CardDashboard = ({type})=>{
    return (
        <div className="group rounded-[8px] odd:bg-gray-800 text-gray-100 dark:odd:bg-gray-200 dark:odd:text-gray-800 even:bg-violet-500 p-4 flex-1 text-sm font-medium">
            <div className=" flex justify-between items-center">
                <span className="text-[10px] group-even:bg-gray-100 group-even:text-gray-800 px-1.5 py-0.5 rounded-full group-odd:bg-violet-500 group-odd:text-gray-100">2024/25</span>
                <Sparkle className=""/>
            </div>
            <h1 className="font-semibold text-xl my-0.5">1 234</h1>
            <h2 className="capitalize group-odd:text-gray-600 group-even:text-gray-300 text-[12px]">{type}</h2>
        </div>
    )
}


export default CardDashboard;