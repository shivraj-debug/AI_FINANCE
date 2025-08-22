import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter=Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance",
  description: "A platform for managing your financial assets",
  icons: {
    icon: "/logo.png"
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <Header />
        <main className="min-h-screen">{children}</main>
        {/* footer */}
       <footer className="bg-blue-50 py-12 " >
         <div className="text-center mx-auto px-4 text-gray-600" >
           <p>Made by Shiv Raj with ❤️</p>
         </div>
       </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
