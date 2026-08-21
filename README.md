# FIT5032 Library

A Vue 3 and Firebase personal-library web application. Each signed-in user has a private collection of books and reading records, and can explore nearby libraries, share an update by email, export records, and view reading insights.

## Live deployments

- Cloudflare Pages: https://fit5032-2026-shenzhi-huang-36668206.pages.dev
- GitHub Pages: https://shua0179-svg.github.io/FIT5032_2026_Shenzhi_Huang_36668206/

## A3 feature summary

- Firebase authentication and user-owned Firestore data for books and reading records.
- Two independent interactive tables: **My Library** and **Reading Records**. Both support per-column filtering, sortable headers, refresh, and pagination.
- CSV and JSON exports of the currently filtered and sorted private records.
- **Reading Insights**: status and genre summaries, an adjustable personal reading goal stored locally, recommendation priorities, and a recent-activity timeline.
- **Library Map Explorer**: nearby library search, markers, current-location support, and route distance/time display.
- **Share My Library**: EmailJS email sharing for a personal library update. File attachment support depends on the configured EmailJS plan/template.
- Accessibility improvements: skip link, keyboard-operable responsive navigation, clear focus indicator, labelled filters, live status messages, and semantic table sort state.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Add only your own keys to `.env.local`; do not commit this file. The optional EmailJS variables are `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`.

## Validate before submitting

```powershell
npm run build
```

Manual checks:

1. Sign in, add a book, then confirm it appears in both **My Library** and **Reading Records**.
2. On each table, filter a column, change sort order, export CSV and JSON, and confirm both downloads contain the filtered records.
3. Open **Reading Insights** and change the goal and status filter; refresh the page to confirm the goal persists locally.
4. Use only the keyboard: press `Tab` after page load to use the **Skip to main content** link, then open/close the responsive navigation with `Enter` or `Space`.
5. In **Library Map Explorer**, search libraries near Clayton and select **Get route** to display distance and estimated travel time.
6. In **Share My Library**, send a message to an address you control and verify it arrives. Attachment availability depends on the EmailJS plan and template configuration.
