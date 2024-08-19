export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/articles">Articles</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
