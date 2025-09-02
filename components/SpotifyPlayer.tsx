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

  const toggleMute = () => {
    if (!player || typeof player.setVolume !== 'function') return;
    try {
      if (volume === 0) {
        handleVolumeChange(30);
      } else {
        handleVolumeChange(0);
      }
    } catch (e) {
      console.error('Error toggling mute:', e);
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
      <div className="fixed top-6 left-6 w-72 bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_24px_rgba(2,132,199,0.18)] overflow-hidden">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-slate-900 font-medium text-sm">Lo‑Fi Player</p>
          </div>
          <button
            onClick={() => signIn("spotify", { callbackUrl: typeof window !== 'undefined' ? window.location.href : '/' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-md text-xs font-semibold"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
      <div className="fixed top-6 left-6 w-[22rem] bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_24px_rgba(2,132,199,0.18)] overflow-hidden">
        {isActive && currentTrack ? (
          <div className="relative p-2">
            {/* Close */}
            <button
              onClick={() => signOut()}
              className="absolute top-1.5 right-1.5 text-slate-700 hover:text-slate-900 text-xs transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/60"
              aria-label="Sign out"
            >
              ×
            </button>

            <div className="flex items-center gap-3 px-2 py-1.5">
              {/* Art */}
              <div
                className="flex-none relative rounded-none shadow-sm overflow-hidden art-wrapper"
                style={{ position: 'absolute', left: '-0.5rem', top: '-0.5rem', bottom: '-0.5rem', width: '7rem' }}
              >
                <img
                  src={currentTrack.album.images[0]?.url}
                  className="absolute inset-0 w-full h-full object-cover art-img"
                  alt="Album cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 48 48\"><rect width=\"48\" height=\"48\" rx=\"6\" fill=\"%23e0f2fe\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" fill=\"%23172a46\" font-size=\"16\" dy=\".3em\">♪</text></svg>';
                  }}
                />
                <div className="art-fade" aria-hidden="true"></div>
              </div>

              {/* Meta + Controls */}
              <div className="flex-1 min-w-0" style={{ marginLeft: '7rem' }}>
                <div className="min-w-0">
                  <h3 className="text-slate-900 font-medium text-sm truncate leading-tight">
                    {currentTrack.name || 'Unknown Track'}
                  </h3>
                  <p className="text-slate-700 text-xs truncate">
                    {currentTrack.artists?.[0]?.name || 'Unknown Artist'}
                  </p>
                  {!isPaused && (
                    <div className="mt-1 h-0.5 rounded bg-gradient-to-r from-emerald-400/70 via-sky-400/70 to-transparent animate-pulse [animation-duration:2.2s]"></div>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-slate-700 hover:text-slate-900 transition-colors" 
                      onClick={previousTrack}
                      aria-label="Previous track"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
                      </svg>
                    </button>
                    <button 
                      className={`rounded-full w-8 h-8 flex items-center justify-center shadow-sm ring-1 transition-transform ${isPaused ? 'bg-emerald-600 ring-emerald-500/40 text-white hover:scale-105' : 'bg-slate-900 ring-slate-300/40 text-white hover:scale-105'}`}
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
                      className="text-slate-700 hover:text-slate-900 transition-colors" 
                      onClick={nextTrack}
                      aria-label="Next track"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2 pr-2 min-w-[110px]">
                    <button onClick={toggleMute} aria-label="Mute" className="text-slate-700 hover:text-slate-900">
                      {volume === 0 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM5 9v6h4l5 5V4L9 9H5zm12.59 3l2.12 2.12-1.41 1.41L16.17 13l-2.12 2.12-1.41-1.41L14.76 11l-2.12-2.12 1.41-1.41L16.17 9l2.12-2.12 1.41 1.41L18.59 11z"/></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-24 h-1 bg-sky-200 rounded-lg appearance-none cursor-pointer volume-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isReady ? (
          <div className="flex items-center justify-center min-h-16 p-3">
            <div className="text-center">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-1.5"></div>
              <p className="text-slate-800 font-medium text-xs">Starting Lo‑Fi...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-16 p-3">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              </div>
              <p className="text-slate-800 font-medium text-xs">Connecting…</p>
            </div>
          </div>
        )}
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
          background: #93c5fd; /* sky-400 */
          height: 4px;
          border-radius: 2px;
        }
        .volume-slider::-moz-range-track {
          background: #93c5fd; /* sky-400 */
          height: 4px;
          border-radius: 2px;
          border: none;
        }
        /* Equalizer removed for compactness */
        /* Album art left-side fade */
        /* Left side of art is flush with player border; keep right corners rounded */
        .art-wrapper { border-top-left-radius: 0; border-bottom-left-radius: 0; border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem; overflow: hidden; }
        /* Use a mask on the image itself for a true fade-to-transparent on the right */
        .art-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* make less visually distracting */
          opacity: 0.6;
          transition: opacity 180ms ease, transform 180ms ease;
          -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0) 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
        /* Remove the previous white overlay; keep the element for accessibility if needed */
        .art-fade { display: none; }
      `}</style>
    </>
  );
}