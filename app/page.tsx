import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: 'url("/background.png")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="flex w-full bg-black text-white p-4">
        <nav className="container mx-auto flex justify-between items-center ">
          <div className="text-lg font-bold">Beatrix Schwire</div>
          <ul className="flex space-x-4 justify-between w-full max-w-md">
            <li><a href="#home" className="hover:underline">Home</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
          <div className="text-lg font-bold">Sign In</div>
        </nav>
      </header>
      <main className="flex-grow text-white">
        xxxxcxxxxxxxxxxxxxx
      </main>
    </div>
  );
}
