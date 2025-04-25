"use client";

import { useState } from "react";
import {
    Mail,
    KeyRound,
    BookOpen,
    ChevronDown,
    Building2
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [countryCode, setCountryCode] = useState("+212");
    const [codeOpen, setCodeOpen] = useState(false);
    const codes = ["+1", "+212", "+31", "+100"];

    const [country, setCountry] = useState("Maroc");
    const [countryOpen, setCountryOpen] = useState(false);
    const countries = ["Maroc", "États-Unis", "Pays-Bas", "Canada"];

    return (
        <div className="w-full h-screen flex flex-wrap lg:flex-nowrap">
            <div className="w-full h-2/6 lg:w-2/5 lg:h-full flex flex-col justify-center
                        bg-[url('/auth_image2.jpg')] bg-cover bg-center relative overflow-hidden px-15 gap-10 -z-0">
                <div className="w-full grid place-items-center"><BookOpen className="stroke-3 size-10 lg:size-15 text-white" /></div>
                <div className="absolute inset-0 bg-purple-900/20 -z-1"></div>
                <div>
                    <h1 className="text-4xl font-bold text-white z-10 text-center lg:text-left">Bienvenue sur DocSub</h1>
                    <p className="text-white mt-4 text-lg z-10 hidden lg:block">
                        Gérez vos conférences, connectez-vous avec les chercheurs du monde entier, et soumettez vos travaux en toute simplicité.
                    </p>
                </div>
            </div>

            <div className="w-full h-4/6 lg:w-3/5 lg:h-full flex p-3 justify-center items-center overflow-auto">
            <div className="w-full md:w-4/5 lg:w-4/5 h-full flex flex-col gap-15 pt-21">
                    <h1 className="text-3xl font-bold text-violet-800 dark:text-violet-400 text-center">
                        Créer un nouveau compte
                    </h1>

                    <form className="flex flex-col w-full h-auto gap-4">
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
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
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
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
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
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="nom@exemple.com"
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
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
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {countries.map((c) => (
                                                <li key={c}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCountry(c);
                                                            setCountryOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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

                            <div className="relative flex">
                                {/* code dropdown button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCodeOpen(!codeOpen);
                                    }}
                                    className="flex items-center p-2 text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 text-sm"
                                >
                                    {countryCode}
                                    <ChevronDown className="w-4 h-4 ms-2.5" />
                                </button>

                                {/* code dropdown list */}
                                {codeOpen && (
                                    <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm w-32">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {codes.map((code) => (
                                                <li key={code}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCountryCode(code);
                                                            setCodeOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        {code}
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
                                    placeholder="Entrez votre numéro"
                                    className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-violet-500"
                                    required
                                />
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
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
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
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
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
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                />
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
                        <Link href="/login" className="text-violet-400 dark:text-violet-300 hover:text-violet-500">
                            Connexion
                        </Link>
                    </p>

                    
                </div>
            </div>


            
        </div>
    );
}
