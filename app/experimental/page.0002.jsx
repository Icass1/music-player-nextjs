"use client"

import React, { useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkipBack, SkipForward, Play, Pause, Volume2, Mic, Sun, Moon, Grid, List, Home, Library, Search, Menu, ChevronLeft, ChevronRight, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { MediaPlayerContext } from '../components/audioContext'

export default function Component() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [showLyrics, setShowLyrics] = React.useState(false)
  const [currentView, setCurrentView] = React.useState('home')
  const [libraryView, setLibraryView] = React.useState('grid')
  const [showNavigation, setShowNavigation] = React.useState(true)
  const [showQueue, setShowQueue] = React.useState(true)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { currentSong, queue } = useContext(MediaPlayerContext)

  const renderContent = () => {
    if (showLyrics && currentSong) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
          <pre className="whitespace-pre-wrap font-sans">{currentSong.lyrics || "No lyrics available"}</pre>
        </div>
      )
    }

    switch (currentView) {
      case 'home':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Home</h2>
            <p>Welcome to RockIT! Your personalized music experience.</p>
          </div>
        )
      case 'search':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Search</h2>
            <p>Search functionality coming soon...</p>
          </div>
        )
      case 'library':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Library</h2>
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant={libraryView === 'grid' ? 'default' : 'outline'}
                  onClick={() => setLibraryView('grid')}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant={libraryView === 'list' ? 'default' : 'outline'}
                  onClick={() => setLibraryView('list')}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {libraryView === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md">
                    <div className="aspect-square bg-muted"></div>
                    <div className="p-4">
                      <h3 className="font-semibold">Album {item}</h3>
                      <p className="text-sm text-muted-foreground">Artist {item}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="flex items-center space-x-4 p-2 bg-card text-card-foreground rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div>
                      <h3 className="font-semibold">Album {item}</h3>
                      <p className="text-sm text-muted-foreground">Artist {item}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Navigation toggle button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 left-4 z-10"
          onClick={() => setShowNavigation(!showNavigation)}
          aria-label={showNavigation ? "Hide navigation" : "Show navigation"}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Sidebar */}
        <div className={`${showNavigation ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">RockIT</h1>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            {session && (
              <div className="flex items-center space-x-2 mb-6">
                <Avatar>
                  <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{session.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                </div>
              </div>
            )}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant={currentView === 'home' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('home')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant={currentView === 'search' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('search')}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </li>
                <li>
                  <Button
                    variant={currentView === 'library' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setCurrentView('library')}
                  >
                    <Library className="mr-2 h-4 w-4" />
                    Your Library
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Content and Queue View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Content View */}
          <div className="flex-1 overflow-hidden">
            <div className="p-6 flex justify-end">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowLyrics(!showLyrics)}
                aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-14rem)]">
              {renderContent()}
            </ScrollArea>
          </div>

          {/* Queue View */}
          <div className={`${showQueue ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-l relative`}>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 left-0 transform -translate-x-full"
              onClick={() => setShowQueue(!showQueue)}
              aria-label={showQueue ? "Hide queue" : "Show queue"}
            >
              {showQueue ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <div className="p-4 border-b">
              <h2 className="font-semibold">Queue</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {queue.map((song, index) => (
                  <div key={song.id} className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-muted rounded"></div>
                    <div>
                      <p className="text-sm font-medium">{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Persistent player UI */}
      <div className="border-t bg-card text-card-foreground h-auto">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Current song info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded"></div>
              <div>
                <h3 className="font-semibold">{currentSong?.title || "No song playing"}</h3>
                <p className="text-sm text-muted-foreground">{currentSong?.artist || "Unknown artist"}</p>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center space-x-4">
              <Button size="icon" variant="ghost">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button size="icon" variant="ghost">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume control */}
            <div className="hidden md:flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <Slider
                className="w-24"
                defaultValue={[50]}
                max={100}
                step={1}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <Slider
              className="w-full"
              defaultValue={[30]}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0:00</span>
              <span>{currentSong ? `${Math.floor(currentSong.duration / 60)}:${String(currentSong.duration % 60).padStart(2, '0')}` : "0:00"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}