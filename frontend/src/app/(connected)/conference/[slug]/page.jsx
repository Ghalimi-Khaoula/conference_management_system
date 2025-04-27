// "use client" because this needs useState and useEffect
"use client";

import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axios-client";
import { useParams } from "next/navigation";

export default function ConferencePage() {
    const { slug } = useParams();
    const [conference, setConference] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInvited, setIsInvited] = useState(false);

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const res = await axiosClient.get(`/conference/${slug}`);
                setConference(res.data);
                setIsInvited(true); // if no error, you are invited
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError("Cette conférence est privée. Vous devez être invité pour y accéder.");
                } else if (err.response && err.response.status === 404) {
                    setError("Conférence non trouvée.");
                } else {
                    setError("Erreur inconnue.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchConference();
    }, [slug]);

    const handleBecomeReviewer = async () => {
        alert("TODO: Send request to become reviewer 🧐");
    };

    const handleBecomeParticipant = async () => {
        alert("TODO: Send request to become participant 🤝");
    };

    if (loading) return <div className="p-4">Chargement...</div>;
    if (error) return (
        <div className="p-4 text-red-600 font-semibold">
            {error}
            <div className="mt-4 flex gap-4">
                <button onClick={handleBecomeReviewer} className="px-4 py-2 bg-blue-500 text-white rounded">Devenir Reviewer</button>
                <button onClick={handleBecomeParticipant} className="px-4 py-2 bg-green-500 text-white rounded">Devenir Participant</button>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{conference.title}</h1>
            <p className="text-gray-700 mb-2">Type d'installation: {conference.installation_type}</p>
            <p className="text-gray-700 mb-2">Lieu: {conference.venue || "Non spécifié"}</p>
            <p className="text-gray-700 mb-2">Ville: {conference.city}</p>
            <p className="text-gray-700 mb-2">Pays: {conference.country}</p>
            <p className="text-gray-700 mb-2">Dates: {conference.start_date} ➔ {conference.end_date}</p>
            <p className="text-gray-700 mb-2">Zone principale: {conference.primary_area}</p>
            {conference.secondary_area && (
                <p className="text-gray-700 mb-2">Zone secondaire: {conference.secondary_area}</p>
            )}
            {conference.area_notes && (
                <p className="text-gray-700 mb-2">Notes: {conference.area_notes}</p>
            )}
            <p className="text-gray-700 mb-2">Organisateur: {conference.organizer_name}</p>
            {conference.organizer_web_page && (
                <p className="text-gray-700 mb-2">Site Organisateur: <a href={conference.organizer_web_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{conference.organizer_web_page}</a></p>
            )}
            {conference.web_page && (
                <p className="text-gray-700 mb-2">Site Conférence: <a href={conference.web_page} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{conference.web_page}</a></p>
            )}
            {conference.contact_phone && (
                <p className="text-gray-700 mb-2">Téléphone: {conference.contact_phone}</p>
            )}
            {conference.additional_info && (
                <p className="text-gray-700 mb-2">Informations Supplémentaires: {conference.additional_info}</p>
            )}

            {/* Buttons */}
            {conference.visibility === "public" && (
                <div className="mt-8 flex gap-4">
                    <button onClick={handleBecomeReviewer} className="px-4 py-2 bg-blue-500 text-white rounded">Devenir Reviewer</button>
                    <button onClick={handleBecomeParticipant} className="px-4 py-2 bg-green-500 text-white rounded">Devenir Participant</button>
                </div>
            )}
            {conference.visibility === "private" && isInvited && (
                <div className="mt-8 text-green-600 font-semibold">
                    Vous êtes invité à cette conférence privée.
                </div>
            )}
        </div>
    );
}
