'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from './components/audioContext';
import SongInfo from "./components/songInfo";
import Queue from "./components/queue";
import Header from "./components/header";
import './layout.css';

import SessionWrapper from "./components/sessionWrapper";
import { Suspense, useContext, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import Search from "./search/page";
import Home from "./page";
import { ScrollProvider } from "./components/scrollContext";
import { ScrollContext } from './components/scrollContext';


const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {

    const [searchResults, setSearchResults] = useState();

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
        <SessionWrapper>
            <html lang="en">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="manifest" href="/manifest.json" id="manifest" />

                <body className={inter.className} >
                    <AudioProvider>
                        <ScrollProvider>
                            <div id='page' className='pb-0 md:pb-2 grid h-full w-full md:p-2 gap-2 mobile-layout md:desktop-layout'>
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
                                    {usePathname() == "/search" ? (
                                        <Search searchResults={searchResults}></Search>
                                    ) : (
                                        children
                                    )}
                                </main>
                            </div>
                        </ScrollProvider>
                    </AudioProvider>
                </body>
            </html>
        </SessionWrapper>
    );
}