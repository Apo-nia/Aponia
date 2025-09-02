"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Song {
  title: string;
  src: string;
}

// angle for each song title to appear on the record
const SONG_ANGLES = [-45, 0, 45]; 

interface AmbiancePlayerProps {
  userId: string;
}

const AmbiancePlayer: React.FC<AmbiancePlayerProps> = ({ userId }) => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(SONG_ANGLES[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // fetch playlist from API on mount
  useEffect(() => {
    fetch('/api/playlist')
      .then(res => res.json())
      .then(data => setPlaylist(data));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlayPause = () => {
    if (audioRef.current?.src) {
      setIsPlaying(!isPlaying);
    }
  };

  const selectTrack = (index: number) => {
    setRotation(SONG_ANGLES[index]);
    if (index === currentTrackIndex) {
      togglePlayPause();
      return;
    }
    setCurrentTrackIndex(index);
    setTimeout(() => setIsPlaying(true), 50);
  };

  if (playlist.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 w-72 h-72 sm:w-80 sm:h-80 opacity-60">
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex].src}
        loop={true}
      />

      <div
        className="relative w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 1.0s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        }}
      >
        <img 
          src="/record.png" 
          alt="Vinyl record" 
          className="w-full h-full cursor-pointer"
          onClick={togglePlayPause}
        />

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {playlist.map((song, index) => {
            const isCurrent = index === currentTrackIndex;
            return (
              <p
                key={song.title}
                className={`
                  absolute left-1/2 top-1/2
                  w-max px-2 py-1 rounded
                  text-base font-semibold transition-all duration-300
                  ${isCurrent ? 'text-cyan-200' : 'text-white text-opacity-60'}
                  hover:text-opacity-90
                  cursor-pointer
                  pointer-events-auto
                `}
                style={{
                  transform: `
                    translate(-50%, -50%)
                    rotate(${SONG_ANGLES[index]}deg)
                    translateY(-110px)
                    rotate(${-SONG_ANGLES[index]}deg)
                  `,
                  zIndex: isCurrent ? 2 : 1,
                }}
                onClick={e => {
                  e.stopPropagation();
                  selectTrack(index);
                }}
              >
                {song.title}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AmbiancePlayer;