import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "~/context/cart";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { SettingsProvider } from "~/context/settings";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </CartProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
