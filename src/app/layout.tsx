// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Keycypher",
//   description: "Keycypher is a cybersecurity company specializing in protecting businesses from digital threats with advanced security solutions, risk management, and compliance services.",
//   icons: {
//     icon: "/logo_key_2.png",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
//       >
//         <ThemeProvider attribute="class"  defaultTheme="dark" enableSystem={false} >

//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keycypher",
  description:
    "Keycypher is a cybersecurity company specializing in protecting businesses from digital threats with advanced security solutions, risk management, and compliance services.",
  icons: {
    icon: "/logo_key_2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning  // 👈 avoids mismatch flash
    >
      <body>
        <ThemeProvider
          attribute="class"      // adds "class=dark" or "class=light" on <html>
          defaultTheme="dark"    // start in dark mode
          enableSystem={false}   // don’t auto-detect OS theme
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
