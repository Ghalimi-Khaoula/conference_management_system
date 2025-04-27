import { ChevronDown, CircleAlert } from "lucide-react";
import { useState } from "react";

export function NormalInput({ label, name, errors, placeholder, type = "text" }) {
    return (
        <div>
            {label && <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
            >
                {label}
            </label>}
            <input
                type={type}
                id={name}
                placeholder={placeholder}
                className={`outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${errors && ("dark:!border-red-400 !border-red-600")}`}
            />
            {errors && (
                <div
                    className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${errors ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <CircleAlert className="w-5 h-5" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    );
}
export function ImageInput({ label, name, errors, placeholder, type = "text", Icon }) {
    return (
        <div>
            {label && <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
            >
                {label}
            </label>}
            <div className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type={type}
                        id={name}
                        placeholder={placeholder}
                        className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-2 dark:focus:ring-violet-500 dark:focus:border-violet-500 ${errors && ("dark:!border-red-400 !border-red-600")}`}
                    />
                </div>
                {errors && (
                    <div
                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${errors ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <CircleAlert className="w-5 h-5" />
                        <span>{errors[0]}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function SelectInput({ label, name, list, data }) {
    const [countryOpen, setCountryOpen] = useState(false);

    return (
        <div>
            {label && <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
            >
                {label}
            </label>}

            <div className="relative">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setCountryOpen(!countryOpen);
                    }}
                    className="flex justify-between items-center w-full p-2.5 text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 text-sm"
                >
                    {data.getter}
                    <ChevronDown className="w-4 h-4" />
                </button>

                {/* country list */}
                {countryOpen && (
                    <div className="absolute top-12 left-0 z-50 w-full bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200  h-[150px] overflow-auto">
                            {list.map((c) => (
                                <li key={c}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            data.setter(c);
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
    );
}
export function PhoneInput({ label,name, errors,placeholder,data,list }) {
    const [codeOpen, setCodeOpen] = useState(false);
    return (
        <div>
            {label && <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
            >
                {label}
            </label>}

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
                        {data.getter}
                        <ChevronDown className="w-4 h-4 ms-2.5" />
                    </button>

                    {/* code dropdown list */}
                    {codeOpen && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-lg shadow-sm w-32">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 h-[150px] overflow-auto">
                                {list.map(({ code, iso2 }) => (
                                    <li key={iso2}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                data.setter(`${iso2.toUpperCase()} ${code}`);
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

                    <input
                        type="tel"
                        id={name}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, ""); // 👈 remove all non-numbers
                        }}
                        placeholder={placeholder}
                        className={`outline-none block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-2 border-gray-300 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-violet-500 ${errors && ("dark:!border-red-400 !border-red-600")}`}
                    />
                </div>
                {errors && (
                    <div
                        className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${errors ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <CircleAlert className="w-5 h-5" />
                        <span>{errors[0]}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function TextareaInput({ label, name, errors, placeholder }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-violet-600 dark:text-violet-400"
            >
                {label}
            </label>
            <textarea
                id={name}
                placeholder={placeholder}
                rows="4"
                className={`outline-none bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500 ${errors && "dark:!border-red-400 !border-red-600"}`}
            />
            {errors && (
                <div
                    className={`flex items-center gap-2 p-2 mt-2 dark:text-red-400 text-red-600 bg-transparent transition-opacity duration-300 text-sm ${
                        errors ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <CircleAlert className="w-5 h-5" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    );
}
