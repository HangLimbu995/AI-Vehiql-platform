# 🚗 AI-Vehiql Platform

AI-Vehiql is a modern car listing and booking platform built with **Next.js 14**, **Tailwind CSS**, and optimized for speed, scalability, and a seamless user experience.  

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📸 Preview

> Coming soon with UI screenshots & demo link.  

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone git@github.com:HangLimbu995/AI-Vehiql-platform.git
cd AI-Vehiql-platform
npm install
Run the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser.

************************* IMPORTANT ************************
this is a simple ai vehicle search and list cars platform named Vehiql.
it has nextjs for frontend /  backend, supabase prisma for database, gemini api (2.5-flash) for ai api to extract vehicle data for search and extract related data to fill form for listing, ui.schadcn.com for ui components, 

hope you will enjoy making this project and learn a lot

✨ Features in Lading page
🔝 Header → Logo on the left, Login button on the right. It is very simple header navbar for the main layout which only has logo and login button. which will be used if the user is only on home page and not in admin or main page. as when layout is wrapped by clerkProvider like <ClerkProvider>{...layouts}</ClerkProvider> then and if clerk auth such as signin, signup , userprofile or such is called then it will be dynamic routing which makes the app slow as. and yes we will be calling those clerk auth in main and admim layouts to show user profile from clerk and signin, signup conditions and show the navitems accordingly.

🎯 Hero Section → Core value proposition with a modern intro, It will just have h1 text and sub text.
the main things it will have is a search section where users can serach cars with text and image. image search will be doen by gemini api and react-drop-down where user can drop the image in the drop box and click search and the gemini will find the car make and bodytype and it will be injected in /cars url and it will be filtered accordingly and displayed.

🚘 Featured Cars → Handpicked vehicles for quick discovery. It will display featured cars featured by admins.

🏷️ Browse by Make → Filter cars by manufacturer. Here user can find the cars according to the brand listed.

⭐ Why Choose Us → Benefits that differentiate our platform

🚗 Browse by Body Type → SUV, Sedan, Hatchback, Convertible, etc.  Here user can find the cars according to the body type listed.

❓ FAQ Section → Common user questions answered

📩 Newsletter / CTA → Subscribe for updates or view all cars or to explore more about this app

🗂️ Project Structure
bash
Copy
Edit
AI-Vehiql-platform/
├── app/                 # Next.js App Router pages
│   ├── (auth)           # Authentication routes
│   ├── (admin)  
    |--        # Admin dashboard
│   ├── (main)           # Public-facing routes
│   └── layout.js        # Root layout
├── components/          # Reusable React components
├── styles/              # Global styles & Tailwind config
├── public/              # Static assets (images, icons, etc.)
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
🗂️ Route Groups
Auth → Sign in, sign up

Admin → Management dashboard for content and data control

Main → Public pages (home, listings, car details, etc.)

## 🧩 UI Library: shadcn/ui (installed)
shadcn/ui components are included locally under `components/ui`, built on top of Radix UI primitives and styled with Tailwind CSS. They are fully themeable and can be edited in-place.

- **Accordion**: Collapsible content; used for FAQ and disclosure sections.
- **Alert**: Inline status messages (success, warning, error, info).
- **Badge**: Small status/metadata chips (e.g., “New”, “Featured”).
- **Button**: Primary and secondary actions across the app.
- **Calendar**: Date picking for filters and booking flows.
- **Card**: Content container used by car and brand cards.
- **Checkbox**: Filter controls and boolean form inputs.
- **Dialog**: Modal overlays (e.g., auth prompts, detail views).
- **Dropdown Menu**: Compact menus for user/profile/actions.
- **Input**: Text inputs for search and forms.
- **Label**: Accessible labels paired with inputs.
- **Pagination**: Navigate multi-page car lists.
- **Popover**: Lightweight contextual overlays (e.g., filters).
- **Select**: Styled select for choosing options.
- **Sheet**: Slide-over panels (mobile filters, menus).
- **Skeleton**: Loading placeholders for improved perceived speed.
- **Slider**: Range selection (e.g., price, mileage).
- **Sonner**: Toast notifications for quick feedback.
- **Table**: Tabular data views, especially in admin.
- **Tabs**: Switch between views (specs, details, reviews).
- **Textarea**: Multi-line text input.

All of these are already set up and can be used by importing from `@/components/ui/*`.

📚 Learn More
Next.js Documentation – Learn about Next.js features and API

Learn Next.js – Interactive tutorial

TailwindCSS Docs – Styling framework

Vercel Deployment Guide

🚀 Deployment
Easily deploy on Vercel (the creators of Next.js):


🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a Pull Request.

📜 License
This project is licensed under the MIT License.
See the LICENSE file for details.


