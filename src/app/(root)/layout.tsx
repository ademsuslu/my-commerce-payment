import Navbar from "@/components/navbar";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return <main>
      <Navbar/>
      {children}
      </main>
  }