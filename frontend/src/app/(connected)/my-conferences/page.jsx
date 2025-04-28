"use client";
import { useEffect, useState } from 'react';
import { axiosClient } from "@/utils/axios-client";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { SlidersHorizontal, Plus } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';


const MyConferencePage = () => {
    const { user,token } = useAuthContext();
    const fetchConferences = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/my-conferences', {
                params: {
                    limit,
                    page,
                },
            });
    
            const conferences = response.data.data;
            console.log(user,token)
    
            const formatted = conferences.map(conf => ({
                id: conf.id,
                slug: conf.slug,
                title: conf.title,
                visibility: conf.visibility,
                status: conf.status,
                role: conf.pivot?.role ?? "creator", // if pivot missing, assume creator
                role_status: conf.pivot?.role == "creator" || !conf.pivot?.role ? "-" : conf.pivot?.role_status ?? conf.creator_role_status ?? "-", // use creator role status if pivot missing
                creator_email: conf.creator_email == user.email ? "Vous" : conf.creator_email, // optional if you want to show it in table later
            }));
    
            setData(formatted);
            setTotal(response.data.total);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Failed to fetch conferences:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const columns = ["Title", "Visibility", "Status", "Role", "Role Status", "Creator Email", "Actions"];


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        if (user) {  // 💥 wait until user is not null
            fetchConferences();
        }
    }, [page,user]); // refetch when page changes

    return (
        <div className="relative bg-white dark:bg-gray-700 p-4 rounded-md flex-1 m-3 mt-0">
    
            <div className="flex justify-end md:justify-between items-center">
                <div className="font-semibold text-lg hidden md:block flex-1">Tous les conférences</div>
                <div className="flex gap-3 flex-col md:flex-row items-end flex-1 justify-end md:items-center">
                    <TableSearch />
                    <div className="gap-4 flex">
                        <button>
                            <SlidersHorizontal size={22} />
                        </button>
                        <Link href="/add-conference" className='cursor-pointer hover:text-violet-500'>
                            <Plus size={22} />
                        </Link>
                    </div>
                </div>
            </div>
    
            <div className='relative'>
                {loading && <LoadingOverlay />}
                {!loading && <Table columns={columns} data={data} refetch={fetchConferences} />}
            </div>
    
            {total > limit && (
                <Pagination page={page} setPage={setPage} lastPage={lastPage} />
            )}
        </div>
    );
    
};

export default MyConferencePage;
