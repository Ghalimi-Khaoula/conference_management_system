"use client";

import { Mail, KeyRound, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="w-full h-screen flex flex-wrap-reverse lg:flex-nowrap">

            <div className="w-full h-4/6 lg:w-3/5 lg:h-full flex p-3 justify-center items-center overflow-auto">
                <div className="w-full md:w-4/5 lg:w-4/5 h-full flex flex-col gap-15 pt-21">
                    <h1 className="text-3xl font-bold text-violet-800 dark:text-violet-400 text-center">Connexion à votre compte</h1>
                    <form className="flex flex-col w-full h-auto gap-4">
                        <div className="w-full">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400">Adresse e‑mail</label>
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input type="email" id="email" className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="nom@exemple.com" />
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400">Mot de passe</label>
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input type="password" id="password" className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 focus:border-2 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500" placeholder="********" />
                                <div className="flex justify-end absolute w-full"><Link href="/dashboard" className="text-sm p-1 text-violet-400 dark:text-violet-300 hover:text-violet-500">Mot de passe oublié ?</Link></div>
                            </div>
                        </div>
                        <button type="submit" className="text-white end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-3 mt-4 dark:bg-violet-500 bg-violet-600 hover:bg-violet-700 cursor-pointer">Se connecter</button>
                    </form>
                    <p className="text-sm text-center p-6">
                        Vous n'avez pas de compte ?{" "}
                        <Link href="/register" className="text-violet-400 dark:text-violet-300 hover:text-violet-500">
                            Inscrivez-vous
                        </Link>
                    </p>
                </div>
            </div>


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
        </div>
    );
}

function LoginForm() {
    return (
        <div></div>
    );
}
