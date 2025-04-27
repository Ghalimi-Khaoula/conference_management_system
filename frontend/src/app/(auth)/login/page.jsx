"use client";

import { useState } from "react";
import { Mail, KeyRound, BookOpen, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { axiosClient, rawAxios } from "@/utils/axios-client";
import { z } from "zod";
import { ImageInput } from "@/components/Inputs"; // <-- ✅ Import your inputs

const schema = z.object({
    email: z.string().trim().min(1, "Veuillez remplir votre e-mail.").email("Format de l’e‑mail invalide."),
    password: z.string().min(1, "Veuillez remplir votre mot de passe."),
});

export default function LoginPage() {
    const { setUser, setToken } = useAuthContext();
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        const result = schema.safeParse(formData);

        if (!result.success) {
            const zodErrors = result.error.flatten().fieldErrors;
            setFieldErrors(zodErrors);
            setIsSubmitting(false);
            return;
        }

        rawAxios.get("/sanctum/csrf-cookie").then(() => {
            axiosClient
                .post("/login", formData)
                .then(({ data }) => {
                    setUser(data.user);
                    setToken(data.token);
                    setIsSubmitting(false);
                })
                .catch((err) => {
                    const apiErrors = err.response?.data?.errors;
                    const generic = err.response?.data?.message;
                    if (apiErrors) {
                        setFieldErrors((prev) => ({
                            ...prev,
                            ...apiErrors,
                        }));
                    } else if (generic) {
                        setFieldErrors((prev) => ({
                            ...prev,
                            email: [generic],
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        });
    };

    return (
        <div className="w-full h-screen flex flex-wrap-reverse lg:flex-nowrap">
            <div className="w-full h-4/6 lg:w-3/5 lg:h-full flex p-3 justify-center items-center overflow-auto">
                <div className="w-full md:w-4/5 lg:w-4/5 h-full flex flex-col gap-15 pt-21">

                    <h1 className="text-3xl font-bold text-violet-800 dark:text-violet-400 text-center">
                        Connexion à votre compte
                    </h1>

                    {Object.keys(fieldErrors).length > 0 && (
                        <div className="flex items-center gap-3 p-4 rounded-md bg-red-100 border-2 border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 transition-opacity duration-300">
                            <CircleAlert className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">
                                Certains champs du formulaire nécessitent votre attention.
                            </span>
                        </div>
                    )}

                    <form className="flex flex-col w-full h-auto gap-4" onSubmit={handleSubmit}>

                        {/* ─────── email ─────── */}
                        <div className="w-full">
                            <ImageInput
                                name="email"
                                label="Adresse e‑mail"
                                placeholder="nom@exemple.com"
                                type="email"
                                Icon={Mail}
                                errors={fieldErrors.email}
                            />
                        </div>

                        {/* ─────── password ─────── */}
                        <div className="w-full relative">
                            <ImageInput
                                name="password"
                                label="Mot de passe"
                                placeholder="••••••••"
                                type="password"
                                Icon={KeyRound}
                                errors={fieldErrors.password}
                            />
                            {/* forgot password link */}
                            <div className="flex justify-end w-full pr-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm p-1 text-violet-400 dark:text-violet-300 hover:text-violet-500"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        {/* ─────── submit ─────── */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="text-white end-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-3 mt-4 dark:bg-violet-500 bg-violet-600 hover:bg-violet-700 cursor-pointer"
                        >
                            {isSubmitting ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <p className="text-sm text-center p-6">
                        Vous n'avez pas de compte ?{" "}
                        <Link href="/register" className="text-violet-400 dark:text-violet-300 hover:text-violet-500">
                            Inscrivez-vous
                        </Link>
                    </p>

                </div>
            </div>

            {/* Image Section */}
            <div className="w-full h-2/6 lg:w-2/5 lg:h-full flex flex-col justify-center bg-[url('/auth_image2.jpg')] bg-cover bg-center relative overflow-hidden px-15 gap-10 -z-0">
                <div className="w-full grid place-items-center">
                    <BookOpen className="stroke-3 size-10 lg:size-15 text-white" />
                </div>
                <div className="absolute inset-0 bg-purple-900/20 -z-1"></div>
                <div>
                    <h1 className="text-4xl font-bold text-white z-10 text-center lg:text-left">
                        Bienvenue sur DocSub
                    </h1>
                    <p className="text-white mt-4 text-lg z-10 hidden lg:block">
                        Gérez vos conférences, connectez-vous avec les chercheurs du monde entier, et soumettez vos travaux en toute simplicité.
                    </p>
                </div>
            </div>
        </div>
    );
}
