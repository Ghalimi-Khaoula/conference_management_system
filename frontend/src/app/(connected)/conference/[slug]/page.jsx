"use client";

import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axios-client";
import { useParams } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import { NormalInput, PhoneInput, SelectInput } from "@/components/Inputs";
import { useAuthContext } from "@/contexts/AuthContext"; // <<== Added
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import countryTelData from "country-telephone-data";
import Table from "@/components/Table";
import SubmissionForm from "@/components/SubmissionForm";

countries.registerLocale(frLocale);

const countryOptions = countryTelData.allCountries.map(({ iso2, dialCode }) => {
    const name = countries.getName(iso2.toUpperCase(), "fr");
    return {
        name: name || iso2.toUpperCase(),
        iso2,
        dialCode: `+${dialCode}`,
    };
}).sort((a, b) => a.name.localeCompare(b.name, "fr"));

const PhoneData = countryTelData.allCountries.map(({ iso2, dialCode }) => ({
    code: `+${dialCode}`,
    iso2: iso2.toUpperCase(),
})).sort((a, b) => a.iso2.localeCompare(b.iso2));

const installationTypes = [
    "conference", "book", "used for teaching", "journal special issue",
    "journal", "conference proceedings",
    "processing applications for funding, positions, competitions, or any other proposals", "other"
];

const visibilityTypes = ["public", "private"];

export default function ConferencePage() {
    const { slug } = useParams();
    const { user } = useAuthContext();
    const [conference, setConference] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [fieldValues, setFieldValues] = useState({});
    const [country, setCountry] = useState("Maroc");
    const [countryCode, setCountryCode] = useState("MA +212");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [conferenceUserId, setConferenceUserId] = useState(null);
    const [userSubmission, setUserSubmission] = useState(null);
    const [allSubmissions, setAllSubmissions] = useState([]);



    // Roles
    const [isCreator, setIsCreator] = useState(false);
    const [isParticipant, setIsParticipant] = useState(false);
    const [isReviewer, setIsReviewer] = useState(false);
    const [participantStatus, setParticipantStatus] = useState(null);
    const [reviewerStatus, setReviewerStatus] = useState(null);

    const fetchUserSubmission = async (conferenceUserId) => {
        try {
            const res = await axiosClient.get(`/submission/${conferenceUserId}`);
            setUserSubmission(res.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setUserSubmission(null); // No submission yet, that's normal
            } else {
                console.error("Erreur lors de la récupération de la soumission:", error);
            }
        }
    };


    const fetchConference = async () => {
        try {
            const res = await axiosClient.get(`/conference/${slug}`);
            setConference(res.data);
            setFieldValues(res.data);
            console.log(res.data);

            if (res.data.contact_phone) {
                const matchedCode = PhoneData.find(({ code }) => res.data.contact_phone.startsWith(code));
                if (matchedCode) {
                    setCountryCode(`${matchedCode.iso2} ${matchedCode.code}`);
                    setPhoneNumber(res.data.contact_phone.replace(matchedCode.code, ""));
                }
            }

            if (res.data.country) setCountry(res.data.country);
            if (res.data.pivot?.conference_user_id) {
                setConferenceUserId(res.data.pivot.conference_user_id);
                console.log(res.data.pivot.conference_user_id)

                if (res.data.pivot.role === "participant") {
                    await fetchUserSubmission(res.data.pivot.conference_user_id);
                }
            }
            if (res.data.pivot?.role === "reviewer" && res.data.pivot.role_status === "approved") {
                const submissionsRes = await axiosClient.get(`/conference/${slug}/submissions`);
                setAllSubmissions(submissionsRes.data);
            }



            // Detect roles
            if (res.data.pivot) {
                if (res.data.pivot.role === "creator") setIsCreator(true);
                if (res.data.pivot.role === "participant") {
                    setIsParticipant(true);
                    setParticipantStatus(res.data.pivot.role_status);
                }
                if (res.data.pivot.role === "reviewer") {
                    setIsReviewer(true);
                    setReviewerStatus(res.data.pivot.role_status);
                }
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConference();
    }, [slug]);

    const handleEdit = (field) => {
        setEditingField(field);
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    const handleSave = () => {
        console.log("Saving", fieldValues);
        setEditingField(null);
    };

    const handleBecomeParticipant = async () => {
        try {
            await axiosClient.post(`/conference/${slug}/become-participant`);
            await fetchConference(); // Refetch after success
            alert('Demande envoyée !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la participation.');
        }
    };

    const handleBecomeReviewer = async () => {
        try {
            await axiosClient.post(`/conference/${slug}/become-reviewer`);
            await fetchConference();
            alert('Demande envoyée !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la demande reviewer.');
        }
    };


    if (!conference) return <div className="p-4">Chargement...</div>;
    //console.log(conference.participants[1].role)

    const renderField = (label, field, inputType = "text", isSelect = false, selectList = []) => (
        <div className="mb-4">
            <div className="flex items-center gap-2">
                <strong className="text-violet-400 flex-1/3">{label}:</strong>
                {editingField !== field && (
                    <span className="flex-2/3">{conference[field] || "Non spécifié"}</span>
                )}
                {editingField === field && (
                    !isSelect ? (
                        <div className="flex-2/3 bg-amber-400">
                            <NormalInput
                                name={field}
                                type={inputType}
                                placeholder={label}
                                errors={null}
                                label={""}
                                value={fieldValues[field] || ""}
                                onChange={(e) => setFieldValues({ ...fieldValues, [field]: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div className="flex-2/3">
                            <SelectInput
                                name={field}
                                label={""}
                                list={selectList}
                                data={{ getter: fieldValues[field] || selectList[0], setter: (v) => setFieldValues({ ...fieldValues, [field]: v }) }}
                            />
                        </div>
                    )
                )}
                <div className="flex gap-1">
                    {editingField !== field ? (
                        <button onClick={() => handleEdit(field)}>
                            <Pencil size={16} />
                        </button>
                    ) : (
                        <>
                            <button onClick={handleSave} className="text-green-500">
                                <Check size={18} />
                            </button>
                            <button onClick={handleCancel} className="text-red-500">
                                <X size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
    const handleSubmissionDecision = async (submissionId, action) => {
        try {
            await axiosClient.post('/submission/decision', { submission_id: submissionId, action });
            await fetchConference(); // refresh submissions after update
            const submissionsRes = await axiosClient.get(`/conference/${slug}/submissions`);
            setAllSubmissions(submissionsRes.data); // refresh updated submissions
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownload = (submissionId) => {
        const link = document.createElement('a');
        link.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submission/${submissionId}/download`;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleRoleDecision = async (conferenceUserId, action) => {
        try {
            console.log(conferenceUserId);
            await axiosClient.post('/conference/role-decision', { conference_user_id: conferenceUserId, action });
            await fetchConference();
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <div className="relative bg-white dark:bg-gray-700 p-4 rounded-md flex-1 m-3 mt-0 flex flex-col gap-3">
            {/* LEFT SIDE */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-2/3">
                    <h1 className="text-3xl font-bold mb-8">{conference.title}</h1>

                    {renderField("Titre", "title")}
                    {renderField("Type d'installation", "installation_type", "text", true, installationTypes)}
                    {renderField("Acronyme", "acronym")}
                    {renderField("Visibilité", "visibility", "text", true, visibilityTypes)}
                    {renderField("Page Web", "web_page")}
                    {renderField("Lieu", "venue")}
                    {renderField("Ville", "city")}

                    {/* Country Special */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <strong className="text-violet-400 flex-1/3">Pays:</strong>
                            {editingField !== "country" ? (
                                <span className="flex-2/3">{country}</span>
                            ) : (
                                <div className="flex-2/3">
                                    <SelectInput
                                        name="country"
                                        label={""}
                                        list={countryOptions.map(c => c.name)}
                                        data={{ getter: country, setter: setCountry }}
                                    />
                                </div>
                            )}
                            <div className="flex gap-1">
                                {editingField !== "country" ? (
                                    <button onClick={() => handleEdit("country")}>
                                        <Pencil size={16} />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleSave} className="text-green-500">
                                            <Check size={18} />
                                        </button>
                                        <button onClick={handleCancel} className="text-red-500">
                                            <X size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {renderField("Date de début", "start_date", "date")}
                    {renderField("Date de fin", "end_date", "date")}
                    {renderField("Soumissions estimées", "estimated_submissions", "number")}
                    {renderField("Champ principal", "primary_area")}
                    {renderField("Champ secondaire", "secondary_area")}
                    {renderField("Notes sur l'aire", "area_notes")}
                    {renderField("Nom de l'organisateur", "organizer_name")}
                    {renderField("Page Web de l'organisateur", "organizer_web_page")}

                    {/* Phone Special */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <strong className="text-violet-400 flex-1/3">Téléphone:</strong>
                            {editingField !== "contact_phone" ? (
                                <span className="flex-2/3">{conference.contact_phone || "Non spécifié"}</span>
                            ) : (
                                <div className="flex-2/3">
                                    <PhoneInput
                                        name="contact_phone"
                                        label={""}
                                        list={PhoneData}
                                        data={{ getter: countryCode, setter: setCountryCode }}
                                        placeholder="Votre numéro"
                                        errors={null}
                                    />
                                </div>
                            )}
                            <div className="flex gap-1">
                                {editingField !== "contact_phone" ? (
                                    <button onClick={() => handleEdit("contact_phone")}>
                                        <Pencil size={16} />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleSave} className="text-green-500">
                                            <Check size={18} />
                                        </button>
                                        <button onClick={handleCancel} className="text-red-500">
                                            <X size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {renderField("Informations supplémentaires", "additional_info")}
                </div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-1/3 flex flex-col gap-2">
                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        CALENDRIER ICI
                    </div>

                    {/* Participate Button */}
                    {!isCreator && (
                        <>
                            {isParticipant ? (
                                participantStatus === 'pending' ? (
                                    <div className="text-yellow-400 text-center mt-4">Demande de participation en attente.</div>
                                ) : (
                                    <div className="text-green-500 text-center mt-4">Vous êtes participant.</div>
                                )
                            ) : (
                                <button
                                    className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-3 mt-4 dark:bg-violet-500 bg-violet-600 hover:bg-violet-700 cursor-pointer"
                                    onClick={handleBecomeParticipant}
                                >
                                    Participer
                                </button>
                            )}

                            {/* Reviewer Button */}
                            {isReviewer ? (
                                reviewerStatus === 'pending' ? (
                                    <div className="text-yellow-400 text-center mt-4">Demande reviewer en attente.</div>
                                ) : (
                                    <div className="text-green-500 text-center mt-4">Vous êtes reviewer.</div>
                                )
                            ) : (
                                <button
                                    className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-3 mt-2 dark:bg-violet-500 bg-violet-600 hover:bg-violet-700 cursor-pointer"
                                    onClick={handleBecomeReviewer}
                                >
                                    Devenir reviewer
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="">
                {/* Participant/Reviewer Table for Admin */}
                {/* Participants / Reviewers Table for Admin/Creator */}
                {(isCreator || user?.roles?.includes('admin')) && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Participants & Évaluateurs</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-violet-500">
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Rôle</th>
                                        <th className="p-3 text-left">Statut du Rôle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conference.participants?.filter(p => p.role !== 'creator').map((p, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-white dark:even:bg-gray-600">
                                            <td className="p-3">{p.email}</td>
                                            <td className="p-3">{p.role}</td>
                                            <td className="p-3">
                                                {p.role_status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleRoleDecision(p.conference_user_id, 'accept')} className="text-green-500 hover:text-green-700">
                                                            <Check size={18} />
                                                        </button>
                                                        <button onClick={() => handleRoleDecision(p.conference_user_id, 'reject')} className="text-red-500 hover:text-red-700">
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : p.role_status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {isReviewer && reviewerStatus === 'approved' && allSubmissions.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Toutes les Soumissions</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-violet-500">
                                        <th className="p-3 text-left">Titre</th>
                                        <th className="p-3 text-left">Statut</th>
                                        <th className="p-3 text-left">Fichier</th>
                                        <th className="p-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allSubmissions.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-white dark:even:bg-gray-600">
                                            <td className="p-3">{sub.title}</td>
                                            <td className="p-3">{sub.status}</td>
                                            <td className="p-3">
                                                <button
                                                    className="text-violet-600 hover:underline"
                                                    onClick={() => handleDownload(sub.id)}
                                                >
                                                    {sub.file_name}
                                                </button>
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                {sub.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleSubmissionDecision(sub.id, 'accept')} className="text-green-500 hover:text-green-700">
                                                            <Check size={18} />
                                                        </button>
                                                        <button onClick={() => handleSubmissionDecision(sub.id, 'reject')} className="text-red-500 hover:text-red-700">
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {isParticipant && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Soumission</h2>

                        {userSubmission ? (
                            // ✅ Show submission table
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-violet-500">
                                            <th className="p-3 text-left">Titre</th>
                                            <th className="p-3 text-left">Statut</th>
                                            <th className="p-3 text-left">Fichier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-white dark:even:bg-gray-600">
                                            <td className="p-3">{userSubmission.title}</td>
                                            <td className="p-3">{userSubmission.status}</td>
                                            <td className="p-3">
                                                {userSubmission.file_name}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // 🚀 No submission yet → show form
                            <SubmissionForm conferenceUserId={conferenceUserId} refetchSubmission={fetchConference} />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
