import ChaoticPendulum from '../components/ChaoticPendulum';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"
      style={{
        // backgroundImage: 'url("/background.png")',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <main className="flex flex-grow items-center justify-center">
        <ChaoticPendulum /> 
      </main>
    </div>
  );
}
