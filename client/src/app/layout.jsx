import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Colibrí OS',
  description: 'Sistema operativo de reputación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}