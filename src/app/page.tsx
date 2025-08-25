import Link from 'next/link';
import BasicPomodoroTimer from "../../components/BasicPomodoroTimer";
import AmbiancePlayer from "../../components/AmbiancePlayer";

export default function First() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Link href="/home" className="absolute top-8 right-8 bg-[#569aa2] text-white py-2 px-4 rounded hover:bg-teal-600">
        Home
      </Link>
      <AmbiancePlayer />
      <BasicPomodoroTimer />
      {/* <img src="/pet.png" alt="Pet" className="absolute bottom-8 left-8 w-24" /> */}
    </main>
  );
}