"use client";

import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { axiosClient } from "@/utils/axios-client";
import { useRouter } from "next/navigation";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { isValidPhoneNumber } from "libphonenumber-js";
import countryTelData from "country-telephone-data";
import { NormalInput, SelectInput, PhoneInput, TextareaInput } from "@/components/Inputs";
import { z } from "zod";

countries.registerLocale(frLocale);

const installationTypes = [
  "conference",
  "book",
  "used for teaching",
  "journal special issue",
  "journal",
  "conference proceedings",
  "processing applications for funding, positions, competitions, or any other proposals",
  "other"
];

const countryOptions = countryTelData.allCountries.map(({ iso2, dialCode }) => {
  const name = countries.getName(iso2.toUpperCase(), "fr");
  return {
    name: name || iso2.toUpperCase(),
    iso2,
    dialCode: `+${dialCode}`,
  };
}).sort((a, b) => a.name.localeCompare(b.name, "fr"));

const schema = z.object({
  title: z.string().min(1, "Titre requis.").max(255),
  installation_type: z.string().min(1, "Type requis."),
  acronym: z.string().max(255).optional(),
  visibility: z.enum(["public", "private"]),
  web_page: z.string().url("URL invalide").optional().or(z.literal("").transform(() => undefined)),
  venue: z.string().max(255).optional(),
  city: z.string().min(1, "Ville requise.").max(255),
  country: z.string().min(1, "Pays requis.").max(255),
  start_date: z.string().min(1, "Date requise."),
  end_date: z.string().min(1, "Date requise."),
  estimated_submissions: z.string().min(1, "Le nombre doit être > 0"),
  primary_area: z.string().min(1, "Champ principal requis.").max(255),
  secondary_area: z.string().max(255).optional(),
  area_notes: z.string().optional(),
  organizer_name: z.string().min(1, "Nom requis.").max(255),
  organizer_web_page: z.string().url("URL invalide").optional().or(z.literal("").transform(() => undefined)),
  contact_phone: z.string()
              .refine((v) => v === "" || /^\+\d{6,20}$/.test(v), {
                  message: "Numéro de téléphone invalide",
              })
              .refine((v) => v === "" || isValidPhoneNumber(v), {
                  message: "Numéro de téléphone invalide",
              })
              .optional()
              .or(z.literal("").transform(() => undefined)),
  additional_info: z.string().optional(),
});

export default function CreateConferencePage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [country, setCountry] = useState("Maroc");
  const [countryCode, setCountryCode] = useState("MA +212");
  const [installationType, setInstallationType] = useState("conference");
  const [visibility, setVisibility] = useState("public");



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      title: e.target.title.value,
      installation_type: installationType,
      acronym: e.target.acronym.value,
      visibility: visibility,
      web_page: e.target.web_page.value,
      venue: e.target.venue.value,
      city: e.target.city.value,
      country: country,
      start_date: e.target.start_date.value,
      end_date: e.target.end_date.value,
      estimated_submissions: e.target.estimated_submissions.value,
      primary_area: e.target.primary_area.value,
      secondary_area: e.target.secondary_area.value,
      area_notes: e.target.area_notes.value,
      organizer_name: e.target.organizer_name.value,
      organizer_web_page: e.target.organizer_web_page.value,
      contact_phone: e.target.contact_phone.value
        ? `${countryCode.split(" ")[1] ?? ""}${e.target.contact_phone.value}`
        : "",
      additional_info: e.target.additional_info.value,
    };

    const result = schema.safeParse(formData);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosClient.post("/add-conference", result.data);
      alert("Conférence créée avec succès !");
      router.push("/my-conferences");
      setFieldErrors({});
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de la conférence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white dark:bg-gray-800 p-6">
      <div className="w-full p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-violet-700 dark:text-violet-400">
          Créer une conférence
        </h1>

        {Object.keys(fieldErrors).length > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-red-100 border-2 border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300">
            <CircleAlert className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              Certains champs du formulaire nécessitent votre attention.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-center">Informations principales</h1>
          <NormalInput name="title" label="Titre" placeholder="Nom de la conférence" errors={fieldErrors.title} />
          <SelectInput name="installation_type" label="Type d'installation" list={installationTypes} data={{ getter: installationType, setter: setInstallationType }}  />
          <NormalInput name="acronym" label="Acronyme" placeholder="EX: AIConf" errors={fieldErrors.acronym} />
          <SelectInput name="visibility" label="Visibilité" list={["public", "private"]} data={{ getter: visibility, setter: setVisibility }} />
          <NormalInput name="web_page" label="Page Web" placeholder="https://..." type="url" errors={fieldErrors.web_page} />
          <h1 className="text-xl font-semibold text-center">Emplacement</h1>
          <NormalInput name="venue" label="Lieu" placeholder="Université, Centre..." errors={fieldErrors.venue} />
          <NormalInput name="city" label="Ville" placeholder="Casablanca" errors={fieldErrors.city} />
          <SelectInput name="country" label="Pays" list={CountryData} data={{ getter: country, setter: setCountry }} />
          <h1 className="text-xl font-semibold text-center">Dates et volume</h1>
          <NormalInput name="start_date" label="Date de début" type="date" errors={fieldErrors.start_date} />
          <NormalInput name="end_date" label="Date de fin" type="date" errors={fieldErrors.end_date} />
          <NormalInput name="estimated_submissions" label="Soumissions estimées" type="number" errors={fieldErrors.estimated_submissions} />
          <h1 className="text-xl font-semibold text-center">Domaines</h1>
          <NormalInput name="primary_area" label="Champ principal" placeholder="Informatique, Physique..." errors={fieldErrors.primary_area} />
          <NormalInput name="secondary_area" label="Champ secondaire" placeholder="Optionnel" errors={fieldErrors.secondary_area} />
          <TextareaInput name="area_notes" label="Notes sur l'aire" placeholder="Informations complémentaires" errors={fieldErrors.area_notes} />
          <h1 className="text-xl font-semibold text-center">Organisateur</h1>
          <NormalInput name="organizer_name" label="Nom de l'organisateur" errors={fieldErrors.organizer_name} />
          <NormalInput name="organizer_web_page" label="Page Web de l'organisateur" type="url" placeholder="https://..." errors={fieldErrors.organizer_web_page} />
          <PhoneInput name="contact_phone" label="Téléphone" list={PhoneData} data={{ getter: countryCode, setter: setCountryCode }} placeholder="Votre numéro" errors={fieldErrors.contact_phone} />
          <h1 className="text-xl font-semibold text-center">Informations supplémentaires</h1>
          <TextareaInput name="additional_info" label="Informations supplémentaires" placeholder="Autres détails..." errors={fieldErrors.additional_info} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-3 mt-4 text-center dark:bg-violet-500 dark:hover:bg-violet-600 dark:focus:ring-violet-800 disabled:opacity-60 transition-all"
          >
            {isSubmitting ? "Création..." : "Créer la conférence"}
          </button>
        </form>
      </div>
    </div>
  );
}
