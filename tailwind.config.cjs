/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "@/components/**/*.{js,vue,ts}",
    "@/layouts/**/*.vue",
    "@/pages/**/*.vue",
    "@/plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT : "1rem",
        md      : "2rem",
        lg      : "1rem",
        xxl     : "4rem",
      },
      screens: {
        lg  : "1280px",
        xxl : "1640px",
      },
    },
    extend: {
      colors: {
        black: "#2E2E2F",
      },
      lineHeight: {
        normal: "1.1",
      },
    },
    fontFamily: {
      primary: [
        "Montserrat",
        "Inter",
        "Arial",
        "-apple-system",
        "BlinkMacSystemFont",
        "\"Segoe UI\"",
        "Roboto",
        "\"Helvetica Neue\"",
        "sans-serif",
        "\"Apple Color Emoji\"",
        "\"Segoe UI Emoji\"",
        "\"Segoe UI Symbol\"",
      ],
      secondary: [
        "Montserrat",
        "Inter",
        "Arial",
        "-apple-system",
        "BlinkMacSystemFont",
        "\"Segoe UI\"",
        "Roboto",
        "\"Helvetica Neue\"",
        "sans-serif",
        "\"Apple Color Emoji\"",
        "\"Segoe UI Emoji\"",
        "\"Segoe UI Symbol\"",
      ],
      code: ["\"Source Code Pro\""],
    },
  },
}
