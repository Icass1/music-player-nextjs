import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from './components/audioContext';
import SongInfo from "./components/songInfo";
import Queue from "./components/queue";
import Header from "./components/header";
import './layout.css';

import SessionWrapper from "./components/sessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Music Player",
    description: "Music Player",
};

export default function RootLayout({ children }) {
    return (
        <SessionWrapper>
            <html lang="en">
                <body className={inter.className}>
                    <AudioProvider>
                        <div id='page' className='grid grid-rows-2 h-full'>
                            <header className='bg-slate-100'>
                                <Header></Header>
                            </header>
                            <div id='song-info' className="overflow-hidden relative">
                                <SongInfo></SongInfo>
                            </div>
                            <div id='queue' className="overflow-y-scroll overflow-x-hidden">
                                <Queue></Queue>
                            </div>
                            <main className="overflow-y-scroll overflow-x-hidden">
                                {children}
                            </main>
                        </div>
                    </AudioProvider>
                </body>
            </html>
        </SessionWrapper>
    );
}
