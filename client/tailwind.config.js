/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize : {
        'course-details-heading-small' : ['26px','36px'],
        'course-details-heading-large' : ['36px','44px'],
        'home-heading-small' : ['28px','34px'],
        'home-heading-large' : ['48px','56px'],
        'default' : ['15px','21px']
      },
      gridTemplateColumns:{
        'auto' : 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing:{
        'section-height' : '500px'
      },
      maxWidth: {
        'course-card' : '424px'
      },
      boxShadow: {
        'custom-card' : '0px 4px 15px 2px rgba(0,0,0,0.1)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'float': 'float 6s ease-in-out infinite',
      },

    },
  },
  plugins: [ typography ],
}