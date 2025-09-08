    
# Modern Full-Stack Portfolio Website

[![CI/CD Status](https://github.com/Layfully/portfolio/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)](https://github.com/Layfully/portfolio/actions)

🚀 A modern, full-stack personal portfolio built with a decoupled architecture. The front-end is an Angular & TypeScript application, styled with Tailwind CSS and brought to life with GSAP animations. The back-end is a robust .NET (C#) Web API that handles business logic, such as the contact form.

**Live Demo:** [portfolio.adriangaborek.dev](https://portfolio.adriangaborek.dev)

---

### Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Project Structure](#project-structure)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation & Setup](#installation--setup)
*   [Usage](#usage)
*   [Deployment](#deployment)
*   [License](#license)
*   [Contact](#contact)

---

## About The Project

This repository contains the source code for a personal portfolio website designed to showcase projects, skills, and provide a point of contact. It follows modern development practices with a clean separation between the user-facing application and the server-side API.

**Key Features:**
*   **Dynamic Project Showcase:** Easily display and manage project information.
*   **Interactive UI:** Smooth animations powered by GSAP provide an engaging user experience.
*   **Functional Contact Form:** A secure backend endpoint processes and forwards contact messages.
*   **Responsive First:** Mobile-friendly design ensures the portfolio looks great on all devices.
*   **Automated Deployments:** CI/CD pipeline with GitHub Actions for building and deploying the application.

---

## Built With

This project is composed of two main parts: a front-end single-page application (SPA) and a back-end API.

### Frontend
*   **[Angular](https://angular.io/)**: A powerful framework for building dynamic client-side applications.
*   **[TypeScript](https://www.typescriptlang.org/)**: Superset of JavaScript that adds static typing.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
*   **[GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)**: A professional-grade animation library for creating high-performance animations.

### Backend
*   **[.NET](https://dotnet.microsoft.com/)**: A free, cross-platform, open-source developer platform for building many different types of applications.
*   **[C#](https://docs.microsoft.com/en-us/dotnet/csharp/)**: A modern, object-oriented, and type-safe programming language.
*   **[ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/)**: A framework for building HTTP services that can be accessed from any client.
*   **[Storyblok](https://www.storyblok.com/)**: A Headless CMS with Visual Editor.

---

## Project Structure

The repository is organized into two primary directories, `src` for the frontend and `api` for the backend.

---

## Getting Started

To get a local copy up and running, please follow these steps.

### Prerequisites

Ensure you have the following software installed on your machine:
*   **Node.js and npm:** [https://nodejs.org/](https://nodejs.org/)
*   **Angular CLI:** `npm install -g @angular/cli`
*   **.NET SDK:** [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Layfully/portfolio.git
    cd portfolio
    ```

2.  **Install Frontend Dependencies:**
    Navigate to the `src` directory and install the required npm packages.
    ```sh
    cd src
    npm install
    ```

3.  **Install Backend Dependencies:**
    From the root directory, navigate to the `api` directory and restore the .NET packages.
    ```sh
    cd ../api
    dotnet restore
    ```

---

## Usage

To run the application, you will need to start both the frontend and backend development servers in separate terminal windows.

1.  **Run the Frontend (Angular):**
    From the `src` directory, run the Angular development server.
    ```sh
    cd src
    ng serve
    ```
    The application will be available at `http://localhost:4200/`.

2.  **Run the Backend (.NET API):**
    From the `api` directory, run the .NET application.
    ```sh
    cd api
    dotnet run
    ```
    The API will start, typically on `https://localhost:7189` or `http://localhost:5189`. The `proxy.conf.json` in the root is configured to forward requests from the Angular app to the API.

---

## Deployment

This project uses **GitHub Actions** for its Continuous Integration and Deployment (CI/CD) pipeline. The workflow is defined in `.github/workflows/firebase-hosting-pull-request.yml`.

On every pull request to the `main` branch, the following actions are performed:
1.  The code is checked out.
2.  The Angular application is built.
3.  The build artifacts are deployed to **Azure Hosting**.

This allows for easy review of changes in a live environment before merging them into the main branch.

---

## License

Distributed under the MIT License. See `LICENSE` for more information. (Note: A LICENSE file was not present at the time of this generation, but MIT is a common choice for such projects).

---

## Contact

Adrian Gaborek - [adriangaborek.dev](https://adriangaborek.dev)

  
