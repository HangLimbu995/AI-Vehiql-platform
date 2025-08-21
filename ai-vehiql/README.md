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

This project is a **simple AI-powered vehicle search and car listing platform** named **Vehiql**.  

- **Frontend / Backend** → Next.js  
- **Database** → Supabase + Prisma  
- **AI API** → Gemini (2.5-flash) for extracting vehicle data from text or images and auto-filling car listing forms  
- **UI Components** → [shadcn/ui](https://ui.shadcn.com)  

The goal is to help you **learn modern full-stack development** while building a practical AI-driven app.  

---

## ✨ Features on the Landing Page  

### 🔝 Header  
- Minimal and simple header containing only the **logo (left)** and **login button (right)**.  
- This header is shown only on the **home page**, not on `admin` or `main` layouts.  
- Reason: Wrapping layouts in `<ClerkProvider>{...layouts}</ClerkProvider>` triggers **dynamic routing** when using Clerk authentication (`sign-in`, `sign-up`, `user-profile`), which can slow down the app.  
- Instead, Clerk authentication will be integrated in **main** and **admin layouts** to dynamically show user profile, sign-in/up buttons, and nav items.  

---

### 🎯 Hero Section  
- Clean **H1 heading** and **sub-text** introducing the platform.  
- Includes a **search section** where users can search cars using:  
  - **Text input** → filter cars by make or body type.  
  - **Image upload** → powered by **Gemini API**.  
    - Users drag & drop an image via `react-dropzone`.  
    - Gemini analyzes the image to detect car **make** and **body type**.  
    - Results are injected into the `/cars` URL and displayed with filters applied.  

---

### 🚘 Featured Cars  
- Section showcasing vehicles **curated by admins** for quick discovery.  

---

### 🏷️ Browse by Make  
- Filter cars by **manufacturer/brand**.  
- Users can quickly find vehicles from their preferred brand.  

---

### ⭐ Why Choose Us  
- Highlights **benefits and differentiators** of Vehiql compared to other platforms.  

---

### 🚗 Browse by Body Type  
- Filter cars by **SUV, Sedan, Hatchback, Convertible**, etc.  
- Helps users explore cars based on preferred body style.  

---

### ❓ FAQ Section  
- Answers common user questions.  
- Reduces user confusion and improves onboarding experience.  

---

### 📩 Newsletter / CTA  
- Allows users to:  
  - Subscribe for updates.  
  - View all cars.  
  - Explore more about the platform.  

---

This README note is designed so new developers or contributors can quickly understand **what Vehiql is, how it works, and what makes it unique**.


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


