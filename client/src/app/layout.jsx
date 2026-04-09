
import "./globals.css";
import OnbordaWrapper from "@/lib/tutorial/layout";

export default function RootLayout({ children }) {
  

  
  return (
    <html lang="es">
      <body>
        <OnbordaWrapper>
          {children}
        </OnbordaWrapper>
      </body>
    </html>
  );
}
