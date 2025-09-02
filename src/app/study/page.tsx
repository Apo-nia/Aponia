import PomodoroTimer from "../../../components/PomodoroTimer";
import AiScheduleGenerator from "../../../components/AiScheduleGenerator";
import AiChatBox from "../../../components/AiChatBox";
import SpotifyPlayer from '../../../components/SpotifyPlayer';

export default function study() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <PomodoroTimer />
      <AiScheduleGenerator />
      {/* Vent Box for "Study Mode" */}
      <AiChatBox
        mode="vent"
        title="Vent Box"
        placeholder="How are you feeling?"
        colorTheme="blue"
      />
      <SpotifyPlayer />
    </main>
  );
}