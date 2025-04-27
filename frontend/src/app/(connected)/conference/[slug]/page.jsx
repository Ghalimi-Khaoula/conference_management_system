// "use client" because this needs useState and useEffect
"use client";

import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axios-client";
import { useParams } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import { NormalInput, PhoneInput, SelectInput, TextareaInput } from "@/components/Inputs";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import countryTelData from "country-telephone-data";

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
    const [conference, setConference] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [fieldValues, setFieldValues] = useState({});
    const [country, setCountry] = useState("Maroc");
    const [countryCode, setCountryCode] = useState("MA +212");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const res = await axiosClient.get(`/conference/${slug}`);
                console.log("Fetched conference:", res.data);
                setConference(res.data);
                setFieldValues(res.data);

                if (res.data.contact_phone) {
                    const matchedCode = PhoneData.find(({ code }) => res.data.contact_phone.startsWith(code));
                    if (matchedCode) {
                        setCountryCode(`${matchedCode.iso2} ${matchedCode.code}`);
                        setPhoneNumber(res.data.contact_phone.replace(matchedCode.code, ""));
                    }
                }

                if (res.data.country) setCountry(res.data.country);
            } catch (err) {
                console.error(err);
            }
        };

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

    if (!conference) return <div className="p-4">Chargement...</div>;

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

    return (
        <div className="relative bg-white dark:bg-gray-700 p-4 rounded-md flex-1 m-3 mt-0 flex flex-col md:flex-row gap-3">
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
            <div className="w-full bg-red-400 md:w-1/3">1234567</div>
        </div>
    );
}