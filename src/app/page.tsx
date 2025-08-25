import PomodoroTimer from "../../components/PomodoroTimer";
import AmbiancePlayer from "../../components/AmbiancePlayer";
import Link from "next/link";

export default function Home() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Link href="/profile">
        <button className="absolute top-10 right-10 px-6 py-3 bg-[#ace2e9] bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:bg-[#569ab4] transition z-10">
          <h2 className="text-lg font-semibold">Profile</h2>
        </button>
      </Link>
      <AmbiancePlayer />
      <PomodoroTimer />
      {/* <img src="/pet.png" alt="Pet" className="absolute bottom-8 left-8 w-24" /> */}
    </main>
  );
}