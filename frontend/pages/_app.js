import "@/styles/globals.css";
import Layout from "@/components/Layout.js";
import { UserProvider } from "@/context/userContext";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
