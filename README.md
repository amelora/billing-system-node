# Billing System (Node.js / MongoDB)

Personal backend project developed to manage **jobs, invoices, expenses and PDF generation** for a small service-based activity.

This project is **not a tutorial** and was originally built for **personal use**, which explains some of the current design choices.  
It is now being **refactored and cleaned up** to become a more maintainable and extensible system.

> **Note:**  
> The current user interface and data labels are **in French**.  
> Internationalization (i18n) is planned as part of a future refactor, but was not a priority during the initial development of this personal tool.

---

## What this project does

- Manage jobs, work items and expenses
- Generate professional invoices in **PDF format**
- Support partial payments and tax calculations
- Persist data in **MongoDB**
- Stream generated PDFs directly to the browser while saving them on disk

---

## Technical stack

- **Node.js**
- **Express**
- **MongoDB / Mongoose**
- **PDFKit**
- Handlebars (server-side views)

---

## Current state (important)

This project was **initially developed as a personal tool**, not intended for public distribution.

As a result:
- Some configuration values are still hardcoded
- Certain parts of the code reflect early design decisions
- Validation and edge cases are not fully standardized yet

👉 The project is currently undergoing a **progressive refactor** to:
- centralize configuration
- remove hardcoded values
- improve structure and separation of concerns
- prepare the codebase for long-term evolution

This repository represents **an intermediate refactoring stage**, not a final product.

At this stage, the application is intentionally single-language (French).

---

## Configuration

This project uses environment variables for local configuration.

Copy `dev.env.example` to `dev.env` and adjust values for your local environment.

--

## Design choices

- PDF invoices are generated **once** and streamed simultaneously to:
  - the browser (immediate display)
  - the filesystem (archiving)
- Configuration (taxes, company information) is being migrated toward a centralized application config
- Emphasis is placed on **readability and explicit logic** over abstraction-heavy patterns

---

## Why this project exists on GitHub

This repository exists to demonstrate:
- real-world backend logic
- handling of documents and business rules
- pragmatic problem-solving
- ability to refactor and improve existing code

It is **not** presented as a production-ready SaaS, but as a realistic backend system evolving over time.

---

## Roadmap (non-exhaustive)

- Remove remaining hardcoded values
- Finalize application configuration model
- Improve validation and error handling
- Prepare a production-oriented structure

---

## Author

Developed by **Amelora**  
Backend-focused developer with experience in automation, systems, and real-world tooling.
