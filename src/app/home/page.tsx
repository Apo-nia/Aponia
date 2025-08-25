import AiScheduleGenerator from "../../../components/AiScheduleGenerator";

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
      <AiScheduleGenerator />
      {/* <img src="/pet.png" alt="Pet" className="absolute bottom-8 left-8 w-24" /> */}
    </main>
  );
}