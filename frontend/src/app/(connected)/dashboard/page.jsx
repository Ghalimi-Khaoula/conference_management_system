"use client";
import CardDashboard from "@/components/CardDashboard";

export default function DashboardPage(){
    return(
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            {/* left */}
            <div className="w-full lg:w-2/3">
                <div className="flex gap-4 justify-between flex-wrap">
                    <CardDashboard type="Etudiant"></CardDashboard>
                    <CardDashboard type="Etudiant"></CardDashboard>
                    <CardDashboard type="Etudiant"></CardDashboard>
                    <CardDashboard type="Etudiant"></CardDashboard>
                </div>
            </div>
            {/* right */}
            <div className="w-full lg:w-1/3"></div>
        </div>
    )
}