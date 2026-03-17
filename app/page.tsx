"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal,
  Home,
  Search,
  Library,
  Plus,
  Globe,
  Music,
  ListMusic,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  liked: boolean;
  genre: string;
  year: number;
  albumCover: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  songCount: number;
  color: string;
}

type RepeatMode = 'off' | 'one' | 'all';

export default function MusicPlayer() {
  // State for playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [activePlaylist, setActivePlaylist] = useState<number | null>(1);
  
  // Mock data
  const [songs, setSongs] = useState<Song[]>([
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: 200,
      liked: true,
      genre: "Synth-pop",
      year: 2020,
      albumCover: "https://picsum.photos/seed/afterhours/300/300",
    },
    {
      id: 2,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      album: "F*CK LOVE 3",
      duration: 141,
      liked: false,
      genre: "Pop",
      year: 2021,
      albumCover: "https://picsum.photos/seed/fucklove/300/300",
    },
    {
      id: 3,
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      duration: 238,
      liked: true,
      genre: "Indie Pop",
      year: 2020,
      albumCover: "https://picsum.photos/seed/dreamland/300/300",
    },
    {
      id: 4,
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      duration: 167,
      liked: true,
      genre: "Pop Rock",
      year: 2022,
      albumCover: "https://picsum.photos/seed/harryshouse/300/300",
    },
    {
      id: 5,
      title: "Bad Habit",
      artist: "Steve Lacy",
      album: "Gemini Rights",
      duration: 191,
      liked: false,
      genre: "R&B",
      year: 2022,
      albumCover: "https://picsum.photos/seed/geminirights/300/300",
    },
    {
      id: 6,
      title: "Flowers",
      artist: "Miley Cyrus",
      album: "Endless Summer Vacation",
      duration: 200,
      liked: true,
      genre: "Pop",
      year: 2023,
      albumCover: "https://picsum.photos/seed/endlesssummer/300/300",
    },
    {
      id: 7,
      title: "Anti-Hero",
      artist: "Taylor Swift",
      album: "Midnights",
      duration: 200,
      liked: true,
      genre: "Pop",
      year: 2022,
      albumCover: "https://picsum.photos/seed/midnights/300/300",
    },
    {
      id: 8,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: 203,
      liked: false,
      genre: "Disco",
      year: 2020,
      albumCover: "https://picsum.photos/seed/futurenostalgia/300/300",
    },
  ]);
  
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 1, name: "Liked Songs", description: "Your favorite tracks", songCount: 42, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: 2, name: "Discover Weekly", description: "Your weekly mixtape", songCount: 30, color: "bg-gradient-to-br from-green-500 to-blue-500" },
    { id: 3, name: "Release Radar", description: "Catch all the latest music", songCount: 28, color: "bg-gradient-to-br from-orange-500 to-red-500" },
    { id: 4, name: "Chill Vibes", description: "Relax and unwind", songCount: 25, color: "bg-gradient-to-br from-blue-500 to-indigo-500" },
    { id: 5, name: "Workout Mix", description: "High energy tracks", songCount: 35, color: "bg-gradient-to-br from-red-500 to-yellow-500" },
    { id: 6, name: "Road Trip", description: "Songs for the open road", songCount: 22, color: "bg-gradient-to-br from-teal-500 to-emerald-500" },
  ]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSong = songs[currentSongIndex];
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Play/pause toggle
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Next song
  const nextSong = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      return;
    }
    
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      if (repeatMode === 'all') {
        setCurrentSongIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
    setCurrentTime(0);
  };
  
  // Previous song
  const prevSong = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
      return;
    }
    
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(songs.length - 1);
    }
    setCurrentTime(0);
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      // Shuffle the songs array
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      setSongs(shuffled);
      setCurrentSongIndex(0);
    } else {
      // Restore original order
      const originalOrder = [...songs].sort((a, b) => a.id - b.id);
      setSongs(originalOrder);
      const currentSongId = currentSong.id;
      const newIndex = originalOrder.findIndex(song => song.id === currentSongId);
      setCurrentSongIndex(newIndex);
    }
  };
  
  // Toggle repeat
  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };
  
  // Toggle like for a song
  const toggleLike = (songId: number) => {
    setSongs(songs.map(song => 
      song.id === songId ? { ...song, liked: !song.liked } : song
    ));
  };
  
  // Handle song selection
  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  // Handle time slider change
  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };
  
  // Handle volume slider change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.duration) {
            nextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSongIndex]);
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex flex-col border-r border-gray-800 bg-black/50">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-xl font-bold">MambaMusic</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="px-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Home className="mr-3 h-5 w-5" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Search className="mr-3 h-5 w-5" />
              Search
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Library className="mr-3 h-5 w-5" />
              Your Library
            </Button>
          </div>
          
          <Separator className="my-4 bg-gray-800" />
          
          {/* Playlists */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Playlists</h2>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-2 pr-2">
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                      activePlaylist === playlist.id && "bg-gray-800 text-white"
                    )}
                    onClick={() => setActivePlaylist(playlist.id)}
                  >
                    <div className={`w-8 h-8 rounded mr-3 ${playlist.color}`} />
                    <div className="text-left">
                      <div className="font-medium truncate">{playlist.name}</div>
                      <div className="text-xs text-gray-400 truncate">{playlist.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* User section */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Globe className="mr-3 h-5 w-5" />
              Install App
            </Button>
            <div className="flex items-center mt-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">User Profile</div>
                <div className="text-xs text-gray-400">Premium</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <Button size="icon" variant="ghost" className="rounded-full bg-black/50 hover:bg-gray-800">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full bg-black/50 hover:bg-gray-800">
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search songs, artists, or albums"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Premium
              </Badge>
              <Button variant="outline" className="rounded-full border-gray-700 hover:bg-gray-800">
                Upgrade
              </Button>
            </div>
          </div>
          
          {/* Now playing section */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Now Playing</h1>
            <p className="text-gray-400 mb-6">Currently playing from {activePlaylist ? playlists.find(p => p.id === activePlaylist)?.name : "Liked Songs"}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Album art and controls */}
              <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-4">
                      <img 
                        src={currentSong.albumCover} 
                        alt={`${currentSong.album} album cover`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-bold truncate">{currentSong.title}</h2>
                      <p className="text-gray-400 truncate">{currentSong.artist}</p>
                      <p className="text-sm text-gray-500 mt-1">{currentSong.album} • {currentSong.year}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={currentSong.duration}
                      step={1}
                      onValueChange={handleTimeChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentSong.duration)}</span>
                    </div>
                  </div>
                  
                  {/* Playback controls */}
                  <div className="flex items-center justify-center space-x-6 mt-6">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "rounded-full hover:bg-gray-800",
                        isShuffled && "text-green-500"
                      )}
                      onClick={toggleShuffle}
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-gray-800"
                      onClick={prevSong}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="default"
                      className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 text-black" />
                      ) : (
                        <Play className="h-7 w-7 text-black" />
                      )}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-gray-800"
                      onClick={nextSong}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "rounded-full hover:bg-gray-800",
                        repeatMode !== 'off' && "text-green-500"
                      )}
                      onClick={toggleRepeat}
                    >
                      <Repeat className="h-5 w-5" />
                      {repeatMode === 'one' && (
                        <span className="absolute -top-1 -right-1 text-xs">1</span>
                      )}
                    </Button>
                  </div>
                  
                  {/* Volume control */}
                  <div className="flex items-center space-x-3 mt-6">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-gray-800"
                      onClick={toggleMute}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-10">{isMuted ? 0 : volume}%</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Song list */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Queue</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <ListMusic className="mr-2 h-4 w-4" />
                      Playlist
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Clock className="mr-2 h-4 w-4" />
                      Recently Played
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {songs.map((song, index) => (
                      <div
                        key={song.id}
                        className={cn(
                          "flex items-center p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors",
                          index === currentSongIndex && "bg-gray-800"
                        )}
                        onClick={() => selectSong(index)}
                      >
                        <div className="w-10 text-center text-gray-400">
                          {index === currentSongIndex && isPlaying ? (
                            <div className="flex items-center justify-center space-x-0.5">
                              <div className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                              <div className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '100ms' }} />
                              <div className="w-1 h-3 bg-green-500 animate-pulse" style={{ animationDelay: '200ms' }} />
                            </div>
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded overflow-hidden ml-4">
                          <img 
                            src={song.albumCover} 
                            alt={`${song.album} album cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 ml-4">
                          <div className="font-medium truncate">{song.title}</div>
                          <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                        </div>
                        
                        <div className="hidden md:block w-32">
                          <Badge variant="outline" className="text-xs border-gray-700">
                            {song.genre}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
                          >
                            <Heart className={cn("h-4 w-4", song.liked && "fill-red-500 text-red-500")} />
                          </Button>
                          
                          <div className="text-sm text-gray-400 w-12 text-right">
                            {formatTime(song.duration)}
                          </div>
                          
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Total Songs</div>
                      <div className="text-2xl font-bold">{songs.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Liked Songs</div>
                      <div className="text-2xl font-bold">{songs.filter(s => s.liked).length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-400">Total Playtime</div>
                      <div className="text-2xl font-bold">
                        {formatTime(songs.reduce((acc, song) => acc + song.duration, 0))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom player bar (mobile/compact) */}
      <div className="border-t border-gray-800 bg-black/80 backdrop-blur-sm p-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded overflow-hidden">
              <img 
                src={currentSong.albumCover} 
                alt={`${currentSong.album} album cover`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm truncate max-w-[120px]">{currentSong.title}</div>
              <div className="text-xs text-gray-400 truncate max-w-[120px]">{currentSong.artist}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-gray-400 hover:text-white"
              onClick={() => toggleLike(currentSong.id)}
            >
              <Heart className={cn("h-5 w-5", currentSong.liked && "fill-red-500 text-red-500")} />
            </Button>
            
            <Button
              size="icon"
              variant="default"
              className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-black" />
              ) : (
                <Play className="h-6 w-6 text-black" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-3">
          <Slider
            value={[currentTime]}
            max={currentSong.duration}
            step={1}
            onValueChange={handleTimeChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
