# Folio

A premium portfolio generation platform built with TanStack Start, React 19, and Tailwind CSS 4.

## Features

- **TanStack Start Architecture**: Full-stack React application with server-side rendering and type-safe routing.
- **Dynamic Portfolio Renderer**: Customizable portfolio templates and sections.
- **Interactive UI Components**: Built using Radix UI primitives and Tailwind CSS 4 for a premium look and feel.
- **Responsive Design**: Mobile-first approach ensuring your portfolio looks great on any device.
- **Type-Safe Development**: Leverages TypeScript and Zod for robust data validation and developer experience.
- **TanStack Query & Router**: State management and routing handled by the industry-standard TanStack suite.
- **Drag and Drop**: Integration with `@dnd-kit` for intuitive portfolio layout management.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start)
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- `npm` (preferred) or `bun`

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

### Building for Production

```bash
npm run build
# or
bun run build
```

## Project Structure

- `src/routes`: TanStack Router file-based routing.
  - `index.tsx`: Main landing page for Folio.
  - `login.tsx` / `signup.tsx`: User authentication flows.
  - `dashboard.tsx`: Private area for users to manage their portfolios.
  - `u.$handle.tsx`: Dynamic route for rendering public portfolios.
- `src/components`: Reusable UI components and feature-specific components.
  - `portfolio/`: Logic for rendering the final portfolio view.
  - `dashboard/`: Components used in the portfolio management interface.
  - `landing/`: Landing page sections.
  - `ui/`: Shared primitive components (shadcn/ui style).
- `src/hooks`: Custom React hooks for state and interaction.
- `src/lib`: Utility functions and shared libraries.
- `src/styles.css`: Global styles and Tailwind configuration.

## License

MIT
