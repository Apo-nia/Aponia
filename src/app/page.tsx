import PomodoroTimer from "../../components/PomodoroTimer";
import AmbiancePlayer from "../../components/AmbiancePlayer";
import Link from "next/link";
import PetDisplay from "../../components/PetDisplay";

export default function Home() {
  const userId = "user456";
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
      <AmbiancePlayer userId={userId} />
      <PomodoroTimer userId={userId} />
      <div className="absolute bottom-8 left-10">
        <PetDisplay userId={userId} />
      </div>
    </main>
  );
}