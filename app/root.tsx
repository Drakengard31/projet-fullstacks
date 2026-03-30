import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      </body>
      </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  let message = "Oops!";
  let details = "Une erreur est survenue.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
        error.status === 404
            ? "Page non trouvée"
            : error.statusText || details;
  }

  return (
      <main>
        <h1>{message}</h1>
        <p>{details}</p>
      </main>
  );
}
