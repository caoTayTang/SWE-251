# Frontend Folder Structure

This document explains the frontend folder structure of the MuTor project. The frontend is built using **React** and **Tailwind CSS**.

```

./frontend

```
Contains the entire frontend project.

---

## **Main Folders and Files**

### 1. `src/`
This is where most of the source code lives.

- `App.js` – The root React component that sets up routes, navigation, and high-level state.
- `index.js` – Entry point of the app; renders `App.js` into the DOM.
- `index.css` & `App.css` – Global and app-specific styles.
- `reportWebVitals.js` – Optional performance monitoring for React apps.
- `setupTests.js` & `App.test.js` – For unit testing components using Jest.

#### **Subfolders**
- `api/`
  - `api.js` – Handles API calls to the backend (FastAPI).
- `assets/`
  - Contains images, logos, and static files used in the frontend.
  - Example: `slbk.jpg`, `logoBK.png`.
- `models/`
  - `Course.js` – Defines frontend data structures for courses (for example, to use with state management or ViewModels).
- `viewmodels/`
  - `CourseViewModel.js`, `NotificationViewModel.js` – Implements the **MVVM pattern**, bridging backend API data with React views.
- `views/`
  - Contains **pages** and **components**.
  - `components/` – Reusable UI components like `CourseCard.js` or `Header.js`.
  - `pages/` – Full pages/screens like `LoginPage.js`, `Dashboard.js`, `CourseDetail.js`, `CreateCourse.js`.

---

### 2. `public/`
Contains static files served as-is, without processing by Webpack:

- `index.html` – The main HTML file React injects components into.
- `logo192.png`, `logo512.png` – App icons.
- `favicon.ico` – Browser tab icon.
- `manifest.json` – Defines metadata for Progressive Web App (PWA) support.
- `robots.txt` – Search engine instructions.

---

### 3. Config and Dependencies
- `.gitignore` – Lists files/folders Git should ignore.
- `package.json` – Project dependencies, scripts, and metadata.
- `package-lock.json` – Exact dependency versions used.
- `tailwind.config.js` – Tailwind CSS configuration.
- `postcss.config.js` – PostCSS setup for Tailwind.

---

### **Summary**
- `views` → UI components and pages.
- `viewmodels` → Handles data and logic for views (MVVM pattern).
- `models` → Defines frontend data structures.
- `api` → Handles backend communication.
- `assets` → Images and static assets.
- `public` → Static files served directly.
```