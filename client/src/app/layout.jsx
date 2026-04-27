import './globals.css';
import OnbordaWrapper from '@/lib/tutorial/layout';

export const metadata = {
  title: 'Colibrí OS',
  description: 'Sistema operativo de reputación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <OnbordaWrapper>{children}</OnbordaWrapper>
      </body>
    </html>
  );
}
