'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from './components/audioContext';
import SongInfo from "./components/songInfo";
import Queue from "./components/queue";
import Header from "./components/header";
import './layout.css';

import SessionWrapper from "./components/sessionWrapper";
import { useState } from "react";

import { metadata } from "./components/metadata";
import { Children } from "react";
import { cloneElement } from "react";
import { usePathname } from "next/navigation";
import Search from "./search/page";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {

    const [searchResults, setSearchResults] = useState('asdfg');

    const handleSearch = async (query) => {

        console.log(query)

        // Perform fetch request here with the search query
        try {
            const response = await fetch(`https://api.music.rockhosting.org/api/search?q=${query}`);
            const data = await response.json();
            console.log(data)
            setSearchResults(data); // Assuming your API returns results
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };


    // const childrenWithProps = Children.map(children, (child) => {
    //     return cloneElement(child, {
    //         // searchQuery: searchQuery,
    //         searchResults: searchResults
    //     });
    // });

    return (
        <SessionWrapper>
            <html lang="en">
                <body className={inter.className}>
                    <AudioProvider>
                        <div id='page' className='grid grid-rows-2 h-full'>
                            <header className='bg-slate-100'>
                                <Header handleSearch={handleSearch}></Header>
                            </header>
                            <div id='song-info' className="overflow-hidden relative">
                                <SongInfo></SongInfo>
                            </div>
                            <div id='queue' className="overflow-y-scroll overflow-x-hidden">
                                <Queue></Queue>
                            </div>
                            {usePathname() == "/search" ? (
                                <main className="overflow-y-scroll overflow-x-hidden">
                                    <Search searchResults={searchResults}></Search>
                                </main>
                            ) : (
                                <main className="overflow-y-scroll overflow-x-hidden">
                                    {children}
                                </main>
                            )}
                        </div>
                    </AudioProvider>
                </body>
            </html>
        </SessionWrapper>
    );
}
