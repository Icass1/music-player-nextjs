import SongInfo from "./components/songInfo";
import Queue from "./components/queue";
import Header from "./components/header";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import Lyrics from "./components/lyrics";
import Search from "./search/page";
import { MediaPlayerContext } from "./components/audioContext";
import clsx from "clsx";

export default function RenderLayout({ children }) {

    const [searchResults, setSearchResults] = useState({});
    const pathname = usePathname()

    const {
        showLyrics
    } = useContext(MediaPlayerContext)

    const handleSearch = async (query) => {

        if (query == null) {
            setSearchResults([]);
            return
        }

        try {
            const response = await fetch(`https://api.music.rockhosting.org/api/search?q=${query}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div id='page' className={clsx('pb-0 md:pb-2 grid h-full w-full md:p-2 gap-2 mobile-layout md:desktop-layout', {"md:desktop-layout-lyrics": showLyrics})}>
            <header className=' bg-neutral-900 rounded-md' style={{ gridArea: 'head' }}>
                <Header handleSearch={handleSearch}></Header>
            </header>
            <div id='song-info' className="overflow-hidden relative bg-neutral-900 rounded-md" style={{ gridArea: 'song-info' }}>
                <SongInfo></SongInfo>
            </div>
            <div id='queue' className="overflow-y-auto overflow-x-hidden hidden md:block bg-neutral-900 rounded-md" style={{ gridArea: 'queue' }}>
                <Queue></Queue>
            </div>
            <main
                style={{ gridArea: 'main' }}
                className="bg-neutral-900 rounded-md relative h-full overflow-y-auto scroll-smooth"
            // onScroll={(e) => { window.location.pathname == "/" ? (setScrollValue(e.target.scrollTop)) : (null) }}
            >
                {pathname == "/search" ? (
                    <Search searchResults={searchResults} handleSearch={handleSearch}></Search>
                ) : (
                    children
                )}
            </main>

            <div id='lyrics' className={clsx("overflow-y-auto overflow-x-hidden hidden md:block bg-neutral-900 rounded-md", {"md:hidden": !showLyrics})} style={{ gridArea: 'lyrics' }}>
                <Lyrics />
            </div>
        </div>
    )
}