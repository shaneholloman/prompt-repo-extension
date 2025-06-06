import typography from '@tailwindcss/typography'

export default {
    content: [
        "./src/**/*.{html,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {

        },
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [
        typography,
    ],
}