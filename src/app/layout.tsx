import "./globals.css";

export const metadata = {
  title: "2D Linear Algebra Visualizer",
  description: "Visualize 2D vectors, transformations, and vector operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
