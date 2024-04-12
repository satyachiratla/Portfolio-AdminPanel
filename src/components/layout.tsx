import Navbar from "./navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="bg-stone-800 h-screen py-20 overflow-scroll">
        {children}
      </main>
    </div>
  );
}
