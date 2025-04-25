"use client";

import { useState } from "react";
import {
    Mail,
    KeyRound,
    BookOpen,
    ChevronDown,
    Building2,
    CircleAlert,
} from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";

import { z } from "zod";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { isValidPhoneNumber, getCountryCallingCode } from "libphonenumber-js";
import countryTelData from "country-telephone-data";
import { axiosClient, rawAxios } from "@/utils/axios-client";

countries.registerLocale(frLocale);
const countryOptions = countryTelData.allCountries
    .map(({ iso2, dialCode }) => {
        const name = countries.getName(iso2.toUpperCase(), "fr");
        return {
            name: name || iso2.toUpperCase(), // fallback
            iso2,
            dialCode: `+${dialCode}`,
        };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const emptyErrors = {
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    country: false,
    password: false,
    password_confirmation: false,
};

const schema = z
    .object({
        first_name: z
            .string()
            .trim()
            .min(1, "Veuillez remplir votre prénom.")
            .max(255),
        last_name: z
            .string()
            .trim()
            .min(1, "Veuillez remplir votre nom.")
            .max(255),
        email: z
            .string()
            .trim()
            .min(1, "Veuillez remplir votre e-mail.")
            .email("Format de l’e‑mail invalide."),
        country: z
            .string()
            .trim()
            .min(1, "Veuillez remplir tous les champs.")
            .max(100)
            .optional()
            .or(z.literal(null))
            .transform((val) =>
                val === "- - Choisir un pays - -" ? null : val
            ),
        phone: z
            .string()
            .refine((v) => v === "" || /^\+\d{6,20}$/.test(v), {
                message: "Numéro de téléphone invalide",
            })
            .refine((v) => v === "" || isValidPhoneNumber(v), {
                message: "Numéro de téléphone invalide",
            })
            .optional()
            .or(z.literal("").transform(() => undefined)),
        affiliation: z
            .string()
            .trim()
            .max(255, "Max 255 caractères")
            .optional()
            .or(z.literal("").transform(() => undefined)),
        password: z
            .string()
            .min(8, "Min 8 caractères")
            .regex(/[A-Za-z]/, "Le mot de passe doit contenir une lettre")
            .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir un symbole"),
        password_confirmation: z.string(),
    })
    .refine((d) => d.password === d.password_confirmation, {
        path: ["password_confirmation"],
        message: "Les mots de passe ne correspondent pas",
    });

export default function RegisterPage() {
    const { setUser, setToken } = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const PhoneData = Array.from(
        new Set(
            countryOptions.map((c) => ({
                code: c.dialCode,
                iso2: c.iso2.toUpperCase(),
            }))
        )
    ).sort((a, b) => a.iso2.localeCompare(b.iso2));

    const CountryData = [
        "- - Choisir un pays - -",
        ...Array.from(new Set(countryOptions.map((c) => c.name))),
    ].sort((a, b) => a.localeCompare(b, "fr"));

    const [countryCode, setCountryCode] = useState("MA +212");
    const [codeOpen, setCodeOpen] = useState(false);

    const [country, setCountry] = useState("- - Choisir un pays - -");
    const [countryOpen, setCountryOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log(country)

        const formData = {
            first_name: e.target.firstname.value,
            last_name: e.target.lastname.value,
            email: e.target.email.value,
            country: country === "- - Choisir un pays - -" ? null : country,
            phone:
                e.target.numero.value != ""
                    ? `${countryCode.split(" ")[1] ?? ""}${e.target.numero.value}`
                    : "",
            affiliation: e.target.affiliation.value,
            password: e.target.password.value,
            password_confirmation: e.target.confirmPassword.value,
        };
        //console.log(formData);
        //return
        const result = schema.safeParse(formData);

        if (!result.success) {
            const zodErrors = result.error.flatten().fieldErrors;

            console.log("Zod errors:", zodErrors); // 👈 for debugging
            // Set these into your error state to show below each input
            setFieldErrors(zodErrors);
            setIsSubmitting(false);
            return;
        }

        // 🟢 No error — you're clear to submit
        console.log("Form data:", result.data);

        rawAxios.get("/sanctum/csrf-cookie").then(() => {
            axiosClient
                .post("/register", formData)
                .then(({ data }) => {
                    setUser(data.user);
                    setToken(data.token);
                    setIsSubmitting(false);
                })
                .catch((err) => {
                    const apiErrors = err.response?.data?.errors;
                    const generic = err.response?.data?.message;
                    
                    if (apiErrors) {
                        // If there are validation errors from backend, spread them into fieldErrors
                        setFieldErrors((prev) => ({
                            ...prev,
                            ...apiErrors, // 👈 apiErrors has the same structure: { email: ["..."], country: ["..."] }
                        }));
                    } else if (generic) {
                        // If it's a general message
                        setFieldErrors((prev) => ({
                            ...prev,
                            email: [generic], // or password, whatever you want
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        });
        //setIsSubmitting(false);
    };

    return (
        <div className="w-full h-screen flex flex-wrap lg:flex-nowrap">
            <div
                className="w-full h-2/6 lg:w-2/5 lg:h-full flex flex-col justify-center
                        bg-[url('/auth_image2.jpg')] bg-cover bg-center relative overflow-hidden px-15 gap-10 -z-0"
            >
                <div className="w-full grid place-items-center">
                    <BookOpen className="stroke-3 size-10 lg:size-15 text-white" />
                </div>
                <div className="absolute inset-0 bg-purple-900/20 -z-1"></div>
                <div>
                    <h1 className="text-4xl font-bold text-white z-10 text-center lg:text-left">
                        Bienvenue sur DocSub
                    </h1>
                    <p className="text-white mt-4 text-lg z-10 hidden lg:block">
                        Gérez vos conférences, connectez-vous avec les chercheurs du monde
                        entier, et soumettez vos travaux en toute simplicité.
                    </p>
                </div>
            </div>

            <div className="w-full h-4/6 lg:w-3/5 lg:h-full flex p-3 justify-center items-center overflow-auto">
                <div className="w-full md:w-4/5 lg:w-4/5 h-full flex flex-col gap-15 pt-21">
                    <h1 className="text-3xl font-bold text-violet-800 dark:text-violet-400 text-center">
                        Créer un nouveau compte
                    </h1>
                    {Object.keys(fieldErrors).length > 0 && (
                        <div className="flex items-center gap-3 p-4 rounded-md bg-red-100 border-2 border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 transition-opacity duration-300">
                            <CircleAlert className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">
                                Certains champs du formulaire nécessitent votre attention.
                            </span>
                        </div>
                    )}
                    <form
                        className="flex flex-col w-full h-auto gap-4"
                        onSubmit={handleSubmit}
                    >
                        {/* ─────── first / last name ─────── */}
                        <div className="w-full flex gap-5 flex-wrap md:flex-nowrap lg:flex-nowrap">
                            <div className="w-full md:w-1/2 lg:w-1/2 mb-6">
                                <label
                                    htmlFor="firstname"
                                    className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                                >
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    placeholder="John"
                                    className={`outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${fieldErrors.first_name && ("dark:!border-red-400 !border-red-600")}`}
                                />
                                {fieldErrors.first_name && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.first_name ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.first_name[0]}</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-1/2 lg:w-1/2 mb-6">
                                <label
                                    htmlFor="lastname"
                                    className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                                >
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    placeholder="Doe"
                                    className={`outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${fieldErrors.last_name && ("dark:!border-red-400 !border-red-600")}`}
                                />
                                {fieldErrors.last_name && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.last_name ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.last_name[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─────── email ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Adresse e-mail
                            </label>
                            <div className="relative">
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="nom@exemple.com"
                                        className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${fieldErrors.email && ("dark:!border-red-400 !border-red-600")}`}
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.email ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.email[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─────── country (custom select) ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="country"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Pays
                            </label>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCountryOpen(!countryOpen);
                                    }}
                                    className="flex justify-between items-center w-full p-2.5 text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 text-sm"
                                >
                                    {country}
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {/* country list */}
                                {countryOpen && (
                                    <div className="absolute top-12 left-0 z-50 w-full bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200  h-[150px] overflow-auto">
                                            {CountryData.map((c) => (
                                                <li key={c}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCountry(c);
                                                            setCountryOpen(false);
                                                        }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${c === "- - Choisir un pays - -"
                                                                ? "font-semibold italic text-gray-400"
                                                                : ""
                                                            }`}
                                                    >
                                                        {c}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─────── country code + phone ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="numero"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Numéro de téléphone
                            </label>

                            <div className="relative">
                                <div className="relative flex">
                                    {/* code dropdown button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCodeOpen(!codeOpen);
                                        }}
                                        className="flex items-center justify-between p-2 text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 text-sm w-[120px]"
                                    >
                                        {countryCode}
                                        <ChevronDown className="w-4 h-4 ms-2.5" />
                                    </button>

                                    {/* code dropdown list */}
                                    {codeOpen && (
                                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm w-32">
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 h-[150px] overflow-auto">
                                                {PhoneData.map(({ code, iso2 }) => (
                                                    <li key={iso2}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCountryCode(`${iso2.toUpperCase()} ${code}`);
                                                                setCodeOpen(false);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        >
                                                            {iso2} {code}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* phone number input */}
                                    <input
                                        type="tel"
                                        id="numero"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, ""); // 👈 remove all non-numbers
                                        }}
                                        placeholder="Entrez votre numéro"
                                        className={`outline-none block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-2 border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-violet-500 ${fieldErrors.phone && ("dark:!border-red-400 !border-red-600")}`}
                                    />
                                </div>
                                {fieldErrors.phone && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.phone ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.phone[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* ─────── affiliation ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="affiliation"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Affiliation
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="affiliation"
                                    placeholder="Université, laboratoire, entreprise…"
                                    className="outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
                            </div>
                        </div>

                        {/* ─────── password ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${(fieldErrors.password || fieldErrors.password_confirmation) && ("dark:!border-red-400 !border-red-600")}`}
                                    />
                                </div>
                                {fieldErrors.password && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.password ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.password[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─────── confirm password ─────── */}
                        <div className="flex-1 mb-6">
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                            >
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${fieldErrors.password_confirmation && ("dark:!border-red-400 !border-red-600")}`}
                                    />
                                </div>
                                {fieldErrors.password_confirmation && (
                                    <div
                                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${fieldErrors.password_confirmation ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <CircleAlert className="w-5 h-5" />
                                        <span>{fieldErrors.password_confirmation[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─────── submit (placeholder) ─────── */}
                        <button
                            type="submit"
                            className="text-white end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-3 mt-4 dark:bg-violet-500 bg-violet-600 hover:bg-violet-700 cursor-pointer"
                        >
                            S’inscrire
                        </button>
                    </form>
                    <p className="text-sm text-center p-6">
                        Vous avez déjà un compte ?{" "}
                        <Link
                            href="/login"
                            className="text-violet-400 dark:text-violet-300 hover:text-violet-500"
                        >
                            Connexion
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
