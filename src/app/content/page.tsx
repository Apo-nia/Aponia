import AiChatBox from "../../../components/AiChatBox";
import SpotifyPlayer from '../../../components/SpotifyPlayer';

export default function content() {
  return (
    <main 
      className="relative flex min-h-screen flex-col items-center justify-center p-12"
      style={{
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Idea Box for "Content Mode" */}
      <AiChatBox
        mode="idea"
        title="Idea Box"
        placeholder="What content do you want to create?"
        colorTheme="purple"
      />
    <SpotifyPlayer />
    </main>
  );
}