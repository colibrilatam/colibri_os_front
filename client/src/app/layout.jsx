import './globals.css';
import ClientLayout from './ClientLayout';
import Providers from './Providers';

export const metadata = {
  title: 'Colibrí OS',
  description: 'Sistema operativo de reputación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}