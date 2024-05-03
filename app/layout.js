import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from './audioContext';
import SongInfo from "./songInfo";
import Queue from "./queue";
import './layout.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Music Player",
    description: "Music Player",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AudioProvider>
                    <div id='page' className='grid grid-rows-2 h-full'>
                        <header className='bg-slate-100'></header>
                        <div id='song-info' className="overflow-hidden relative">
                            <SongInfo></SongInfo>
                        </div>
                        <div id='queue'>
                            <Queue></Queue>
                        </div>
                        <main className="overflow-y-scroll overflow-x-hidden">
                            {children}
                        </main>
                    </div>
                </AudioProvider>
            </body>
        </html>
    );
}
