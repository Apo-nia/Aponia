"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const LOFI_PLAYLIST_ID = "37i9dQZF1DWWQRwui0ExPn";

export default function SpotifyPlayer() {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<any>(undefined);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isActive, setActive] = useState(false);
  const [currentTrack, setTrack] = useState<any>(undefined);
  const [isPaused, setPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(30);

  useEffect(() => {
    if (!session?.accessToken) return;

    if (typeof window !== 'undefined' && window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    function initializePlayer() {
      if (!session?.accessToken) return;

      const playerInstance = new window.Spotify.Player({
        name: "Aponia Lo-Fi Player",
        getOAuthToken: (cb: (token: string) => void) => { 
          cb(session.accessToken!); 
        },
        volume: 0.3,
      });

      setPlayer(playerInstance);

      playerInstance.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      playerInstance.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      playerInstance.addListener("player_state_changed", (state: any) => {
        if (!state) {
          setActive(false);
          return;
        }
        
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setActive(true);
      });

      playerInstance.addListener('initialization_error', ({ message }: any) => {
        console.error('Failed to initialize:', message);
      });

      playerInstance.addListener('authentication_error', ({ message }: any) => {
        console.error('Failed to authenticate:', message);
      });

      playerInstance.addListener('account_error', ({ message }: any) => {
        console.error('Failed to validate account:', message);
      });

      playerInstance.addListener('playback_error', ({ message }: any) => {
        console.error('Failed to perform playback:', message);
      });

      playerInstance.connect().then((success: boolean) => {
        if (success) {
          console.log('Connected to Spotify!');
        } else {
          console.error('Failed to connect to Spotify');
        }
      });
    }
  }, [session]);

  useEffect(() => {
    if (!deviceId || !session?.accessToken || !isReady) return;

    const startLoFiPlayback = async () => {
      try {
        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: false,
          }),
        });

        setTimeout(async () => {
          await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${LOFI_PLAYLIST_ID}/tracks`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (playlistResponse.ok) {
            const playlistData = await playlistResponse.json();
            const tracks = playlistData.items.filter((item: any) => item.track && !item.track.is_local);
            
            if (tracks.length > 0) {
              const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
              
              await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  context_uri: `spotify:playlist:${LOFI_PLAYLIST_ID}`,
                  offset: { uri: randomTrack.track.uri }
                }),
              });
            }
          }
        }, 1000);

      } catch (error) {
        console.error('Error starting playback:', error);
      }
    };

    startLoFiPlayback();
  }, [deviceId, session, isReady]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (player && typeof player.setVolume === 'function') {
      try {
        player.setVolume(newVolume / 100);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  const togglePlay = () => {
    if (player && typeof player.togglePlay === 'function') {
      try {
        player.togglePlay();
      } catch (error) {
        console.error('Error toggling play:', error);
      }
    }
  };

  const previousTrack = () => {
    if (player && typeof player.previousTrack === 'function') {
      try {
        player.previousTrack();
      } catch (error) {
        console.error('Error going to previous track:', error);
      }
    }
  };

  const nextTrack = () => {
    if (player && typeof player.nextTrack === 'function') {
      try {
        player.nextTrack();
      } catch (error) {
        console.error('Error going to next track:', error);
      }
    }
  };

  if (!session) {
    return (
      <div className="fixed top-6 left-6 w-80 h-32 bg-gradient-to-br from-sky-600/95 to-sky-200/95 backdrop-blur-xl rounded-2xl border border-sky-300/30 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-white/90 font-medium text-sm">Lo-Fi Player</p>
          </div>
          <button
            onClick={() => signIn("spotify")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 px-6 rounded-full font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
      <div className="fixed top-6 left-6 w-80 h-32 bg-gradient-to-br from-sky-600/95 to-sky-200/95 backdrop-blur-xl rounded-2xl border border-sky-300/30 shadow-2xl overflow-hidden">
        {isActive && currentTrack ? (
          <div className="flex h-full">
            <div className="w-32 h-32 flex-shrink-0 bg-sky-700">
              <img
                src={currentTrack.album.images[0]?.url}
                className="w-full h-full object-cover rounded-l-2xl"
                alt="Album cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%230369a1"/><text x="50%" y="50%" text-anchor="middle" fill="%23e0f2fe" font-size="14" dy=".3em">♪</text></svg>';
                }}
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate leading-tight mb-1">
                  {currentTrack.name || 'Unknown Track'}
                </h3>
                <p className="text-sky-50 text-xs truncate">
                  {currentTrack.artists?.[0]?.name || 'Unknown Artist'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <button 
                    className="text-sky-50 hover:text-white transition-colors duration-200" 
                    onClick={previousTrack}
                    aria-label="Previous track"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
                    </svg>
                  </button>
                  <button 
                    className="bg-white text-sky-700 w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-200 shadow-md" 
                    onClick={togglePlay}
                    aria-label={isPaused ? 'Play' : 'Pause'}
                  >
                    {isPaused ? (
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    )}
                  </button>
                  <button 
                    className="text-sky-50 hover:text-white transition-colors duration-200" 
                    onClick={nextTrack}
                    aria-label="Next track"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 px-3">
                  <svg className="w-4 h-4 text-sky-50 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="flex-1 max-w-24 h-1 bg-sky-500 rounded-lg appearance-none cursor-pointer volume-slider"
                  />
                  <span className="text-sky-50 text-xs font-mono w-6 text-right flex-shrink-0">{volume}</span>
                </div>
              </div>
            </div>
          </div>
        ) : isReady ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white/80 font-medium text-sm">Starting Lo-Fi...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
              <p className="text-white/80 font-medium text-sm">Connecting...</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => signOut()} 
          className="absolute top-2 right-2 text-sky-100 hover:text-white text-sm transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-sky-600/50"
          aria-label="Sign out"
        >
          ×
        </button>
      </div>
      
      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
        .volume-slider::-webkit-slider-track {
          background: #0284c7;
          height: 4px;
          border-radius: 2px;
        }
        .volume-slider::-moz-range-track {
          background: #0284c7;
          height: 4px;
          border-radius: 2px;
          border: none;
        }
      `}</style>
    </>
  );
}