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
import { NormalInput, ImageInput, SelectInput, PhoneInput } from "@/components/Inputs";

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
                                <NormalInput
                                    name="firstname"
                                    label="Prénom"
                                    errors={fieldErrors.first_name}
                                    placeholder="John"
                                />
                            </div>
                            <div className="w-full md:w-1/2 lg:w-1/2 mb-6">
                                <NormalInput
                                    name="lastname"
                                    label="Nom"
                                    errors={fieldErrors.last_name}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* ─────── email ─────── */}
                        <div className="flex-1 mb-6">
                            <ImageInput
                                name="email"
                                label="Addresse e-mail"
                                errors={fieldErrors.email}
                                placeholder="nom@exemple.com"
                                type="email"
                                Icon={Mail}
                            />
                        </div>

                        {/* ─────── country (custom select) ─────── */}
                        <div className="flex-1 mb-6">
                            <SelectInput
                                name="country"
                                label="Pays"
                                list={CountryData}
                                data={{ getter: country, setter: setCountry }}
                            />
                        </div>

                        {/* ─────── country code + phone ─────── */}
                        <div className="flex-1 mb-6">
                            <PhoneInput
                                name="phone"
                                label="Numéro de téléphone"
                                list={PhoneData}
                                data={{ getter: countryCode, setter: setCountryCode }}
                                placeholder="Entrez votre numéro"
                                errors={fieldErrors.phone}
                            />
                        </div>

                        {/* ─────── affiliation ─────── */}
                        <div className="flex-1 mb-6">
                            <ImageInput
                                name="affiliation"
                                label="Affiliation"
                                placeholder="Université, laboratoire, entreprise…"
                                type="text"
                                Icon={Building2}
                                errors={fieldErrors.affiliation}
                            />
                        </div>

                        {/* ─────── password ─────── */}
                        <div className="flex-1 mb-6">
                            <ImageInput
                                name="password"
                                label="Mot de passe"
                                placeholder="••••••••"
                                type="password"
                                Icon={KeyRound}
                                errors={fieldErrors.password}
                            />
                        </div>

                        {/* ─────── confirm password ─────── */}
                        <div className="flex-1 mb-6">
                            <ImageInput
                                name="confirmPassword"
                                label="Confirmer le mot de passe"
                                placeholder="••••••••"
                                type="password"
                                Icon={KeyRound}
                                errors={fieldErrors.password_confirmation}
                            />
                        </div>

                        {/* ─────── submit ─────── */}
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
