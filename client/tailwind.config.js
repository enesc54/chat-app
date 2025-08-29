/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#007BFFdd",
                    hover: "#0056b3dd"
                },
                background: {
                    dark: "#252525",
                    darkOpacity: "#252525aa",
                    darkHover: "#fafafa11",
                    darkSelected: "#fafafa22",
                    light: "#f5f5f5",
                    lightOpacity: "#f5f5f544",
                    lightHover: "#25252511",
                    lightSelected: "#25252522",
                    progressBar: "#4b5563",
                    overlay:'#050505aa'
                },
                entry: {
                    DEFAULT: "#ffffff33"
                },
                border: {
                    dark: "#252525",
                    light: "#fafafa",
                    focus: "#bfdbfe"
                },
                text: {
                    dark: "#fafafa",
                    light: "#252525",
                    link: {
                        DEFAULT: "#007BFFdd",
                        hover: "#0056b3dd"
                    },
                    button: "#fafafa",
                    placeholder: {
                        dark: "#afafaf",
                        light: "#4f4f4f"
                    },
                    info: "#6b7280"
                }
            },
            spacing: {
                8: "2rem",
                4: "1rem",
                2: "0.5rem",
                1: "0.25rem"
            },
            borderRadius: {
                xl: "0.75rem"
            },
            fontFamily: {
                oswald: ["Oswald", "sans-serif"]
            },
            backgroundImage: {
                main: "url('https://xjgddaylqjdcmvkzzeaj.supabase.co/storage/v1/object/public/files/app_main_background.jpg')"
            }
        }
    },
    plugins: [require("tailwind-scrollbar-hide")]
};
