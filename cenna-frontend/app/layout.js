import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import ToastProvider from "@/components/ui/ToastProvider";
import SiteShell from "@/components/website/SiteShell";
import ReduxProvider from "@/providers/ReduxProvider";
import AppInitializer from "@/components/providers/AppInitializer";

export const metadata = {
  title: "CENNA School & College Pabbi",
  description:
    "CENNA School and College Pabbi — Nurturing Excellence, Building Futures.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>

          {/* Load School Settings Globally */}
          <AppInitializer />

          <ToastProvider />

          <SiteShell>
            {children}
          </SiteShell>

        </ReduxProvider>
      </body>
    </html>
  );
}