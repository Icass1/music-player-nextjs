'use client';

import Image from "next/image";
import Link from "next/link";

export default function Search({ searchResults }) {

    return (
        <div className="flex flex-col w-full h-full gap-6 m-2">
            {/* <label>{JSON.stringify(searchResults)}</label> */}
            <div>
                <label className="text-4xl font-bold">Albums</label>
                <div className="overflow-x-scroll mt-2">
                    <div className="inline-flex flex-row gap-4">
                        {searchResults?.albums?.map((album, index) => (


                            <Link key={index} className="flex flex-col w-[220px] h-[290px] bg-neutral-700 rounded-lg" href={`/s/album/${album.id}`}>
                                <Image
                                    className='rounded-lg'
                                    src={album.image_url}
                                    width={220}
                                    height={220}
                                    alt=""
                                    title={album.name + " - " + album.artists.map((artist) => (artist.name)).join("/")}
                                />

                                <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0 mt-1" title={album.name}>{album.name}</label>
                                <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={album.artists.map((artist) => (artist.name)).join("/")}>{album.artists.map((artist) => (artist.name)).join(" /")}</label>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="text-4xl font-bold">Playlists</label>
                <div className="overflow-x-scroll mt-2">
                    <div className="inline-flex flex-row gap-2">
                        {searchResults?.playlists?.map((playlist, index) => (
                            <Link key={index} className="flex flex-col w-[220px] h-[290px] bg-neutral-700 rounded-lg" href={`/s/playlist/${playlist.id}`}>
                                <Image
                                    className='ml-auto mr-auto mt-2 rounded-md'
                                    src={playlist.image_url}
                                    width={200}
                                    height={200}
                                    alt=""
                                    title={playlist.name + " - " + playlist.artists.map((artist) => (artist.name)).join("/")}
                                />

                                <label className="text-2xl font-bold fade-out-neutral-100 min-w-0 max-w-full m-2 mb-0" title={playlist.name}>{playlist.name}</label>
                                <label className="text-xl fade-out-neutral-100 min-w-0 max-w-full m-2 mt-0" title={playlist.artists.map((artist) => (artist.name)).join("/")}>{playlist.artists.map((artist) => (artist.name)).join(" /")}</label>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>



            <div className="flex flex-row bg-red-400">
            </div>


        </div>
    )
}



// {
//     "albums": [
//         {
//             "name": "Asdfmovie11 Song",
//             "type": "album",
//             "release_date": "2018-08-10",
//             "total_tracks": 1,
//             "spotify_url": "https://open.spotify.com/album/0pAlSKoF8cgRBJMliGbhKG",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b2738ff32ebd18dd16e0a8090d58",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "The Muffin Song (asdfmovie)",
//             "type": "album",
//             "release_date": "2018-05-11",
//             "total_tracks": 1,
//             "spotify_url": "https://open.spotify.com/album/1xLAKvimOSxxHUZycTA40G",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273a0a6306033ab5306e4b9cedf",
//             "artists": [
//                 {
//                     "name": "The Gregory Brothers",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "TomSka",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "Asdfmovie12 Song",
//             "type": "album",
//             "release_date": "2019-08-30",
//             "total_tracks": 2,
//             "spotify_url": "https://open.spotify.com/album/72BAeKjkHc5VN2W0n02WLA",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27307cf1ec3d3037a674ac075f6",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "asdf - random hits",
//             "type": "album",
//             "release_date": "2023-02-17",
//             "total_tracks": 96,
//             "spotify_url": "https://open.spotify.com/album/0gPsp40sci2u94zpUwHVvX",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273ea4d2c41913ac1d0327ef34f",
//             "artists": [
//                 {
//                     "name": "Various Artists",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "Tom's Dog (asdfmovie5 theme)",
//             "type": "album",
//             "release_date": "2012-05-11",
//             "total_tracks": 2,
//             "spotify_url": "https://open.spotify.com/album/48LPT6CdvYyZskQFLEU2as",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273d14f388797997ac95299f4da",
//             "artists": [
//                 {
//                     "name": "The Living Tombstone",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "Asdfmovie Song (Instrumental)",
//             "type": "album",
//             "release_date": "2011-05-05",
//             "total_tracks": 1,
//             "spotify_url": "https://open.spotify.com/album/0OljL8hXZnyfNXXYgeQsqk",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273787246a1b8b0bcf991c6f30d",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "Tom's Dog (asdfmovie5 theme)",
//             "type": "album",
//             "release_date": "2012-05-11",
//             "total_tracks": 2,
//             "spotify_url": "https://open.spotify.com/album/37GEoUEng5BougpedfKSOs",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27370d3b218cd946ff12844d2a1",
//             "artists": [
//                 {
//                     "name": "The Living Tombstone",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "Asdfmovie9 Song",
//             "type": "album",
//             "release_date": "2015-08-07",
//             "total_tracks": 2,
//             "spotify_url": "https://open.spotify.com/album/5LkFFYK86yGi1vgTwmKVf0",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27318ffe5a3d77d39eb01981436",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "asdfmovie7 song",
//             "type": "album",
//             "release_date": "2013-10-03",
//             "total_tracks": 1,
//             "spotify_url": "https://open.spotify.com/album/68IUHPdBclz7HwpT7t38aN",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b2735024976a9449a380e062631b",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ]
//         },
//         {
//             "name": "asdfasdf",
//             "type": "album",
//             "release_date": "2015-04-28",
//             "total_tracks": 7,
//             "spotify_url": "https://open.spotify.com/album/3sDL6nKWhVCm9fwSp3OBmZ",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273652ca439c0a1ff336b441ae9",
//             "artists": [
//                 {
//                     "name": "Katie Dey",
//                     "type": "artist"
//                 }
//             ]
//         }
//     ],
//     "playlists": [
//         {
//             "name": "ASDF Movie Songs",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 13,
//             "spotify_url": "https://open.spotify.com/playlist/5TQTOu0kdqdUAREhL67ECi",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebbad771419f271989c571ff3a1",
//             "artists": [
//                 {
//                     "name": "Logan601"
//                 }
//             ]
//         },
//         {
//             "name": "pov: youtube raised you (2006-2016 OLD YOUTUBE NOSTALGIA)",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 138,
//             "spotify_url": "https://open.spotify.com/playlist/7EWWlOt9dBQCrVuKPF2v7S",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebb5986b88139ce166576d0aebd",
//             "artists": [
//                 {
//                     "name": "jazz!!"
//                 }
//             ]
//         },
//         {
//             "name": "The Muffin Song (asdfmovie) Radio",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 50,
//             "spotify_url": "https://open.spotify.com/playlist/37i9dQZF1E8HeFOlyMBOC8",
//             "image_url": "https://seeded-session-images.scdn.co/v2/img/122/secondary/track/1LGv7Ah6TXp1soAAIzzuGC/en",
//             "artists": [
//                 {
//                     "name": "Spotify"
//                 }
//             ]
//         },
//         {
//             "name": "MOST ANNOYING SONGS IN THE UNIVERSE",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 870,
//             "spotify_url": "https://open.spotify.com/playlist/0wSavWCw7TzOVfi8NOS6IQ",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebb88f72e9a332339fdd7065e12",
//             "artists": [
//                 {
//                     "name": "skyslayer15"
//                 }
//             ]
//         },
//         {
//             "name": "INI LUCU LUCU BGT PLISS LAGUNYA ASDFGHJK",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 26,
//             "spotify_url": "https://open.spotify.com/playlist/3bqKuZfsESHmmThQHc7NtE",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebb6cb6b35e4a95ef2a8de8c970",
//             "artists": [
//                 {
//                     "name": "ADELINENAJWA"
//                 }
//             ]
//         },
//         {
//             "name": "qwertyuiopasdfghjklzxcvbnm1234567890@#$&*()\u2019\u201d%-+=/;:,.\u20ac\u00a3\u00a5_^[]{}\u00a7|~\u2026\\<>!?",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 3,
//             "spotify_url": "https://open.spotify.com/playlist/43neEXMfqjrNdXzRmujpGw",
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f",
//             "artists": [
//                 {
//                     "name": "Simar"
//                 }
//             ]
//         },
//         {
//             "name": "Best of deadmau5",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 29,
//             "spotify_url": "https://open.spotify.com/playlist/3DwPWVn2d51j1HTbasevy8",
//             "image_url": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000bebbada9086d229de402e8c25fb5",
//             "artists": [
//                 {
//                     "name": "mc.suchecki"
//                 }
//             ]
//         },
//         {
//             "name": "Old YouTube Music (2005-2012)",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 65,
//             "spotify_url": "https://open.spotify.com/playlist/0wp6lXnChWBq4tkO8qoiFP",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebbf29f4a5b3609c45c70bdf27e",
//             "artists": [
//                 {
//                     "name": "JDL"
//                 }
//             ]
//         },
//         {
//             "name": "\u2606 - An Eddsworld playlist !!",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 122,
//             "spotify_url": "https://open.spotify.com/playlist/4dFDZNBAmHjwINkPy1IEkF",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebbeedae9469903fa03f169bc64",
//             "artists": [
//                 {
//                     "name": "Cg \u2606"
//                 }
//             ]
//         },
//         {
//             "name": "ASDF movie (plus memes)",
//             "type": "playlist",
//             "release_date": null,
//             "total_tracks": 136,
//             "spotify_url": "https://open.spotify.com/playlist/2vVCyl9NMf5UbZHi0mrKfo",
//             "image_url": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000bebb20e35778e578fc97f45328f0",
//             "artists": [
//                 {
//                     "name": "willevans2907"
//                 }
//             ]
//         }
//     ],
//     "songs": [
//         {
//             "name": "The Muffin Song (asdfmovie)",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273a0a6306033ab5306e4b9cedf",
//             "artists": [
//                 {
//                     "name": "The Gregory Brothers",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "TomSka",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/1LGv7Ah6TXp1soAAIzzuGC"
//         },
//         {
//             "name": "Everybody Do The Flop",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273c0e1261482b34ed4f712f567",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/408zdC6qiLu1Zlbr9RVXGJ"
//         },
//         {
//             "name": "asdf",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b2731dc04ab63ca3dfb13102f907",
//             "artists": [
//                 {
//                     "name": "Windows 96",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "Gavriel",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/6Smj5ZZ1moQcUMpqB1ncMP"
//         },
//         {
//             "name": "Beep Beep I'm a Sheep",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273472bffac1ba2b106d650dc0b",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "TomSka",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "Black Gryph0n",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/6R15sXb3qRfJOsIbt1vS2a"
//         },
//         {
//             "name": "Asdfmovie Song",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273a9b7b1dad775d064dacba12a",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/2YorpKjHKhDBD0QOuucIrA"
//         },
//         {
//             "name": "Asdfmovie12 Song",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27307cf1ec3d3037a674ac075f6",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 },
//                 {
//                     "name": "EileMonty",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/3uvyMKTLtt8mtaWT93UTVb"
//         },
//         {
//             "name": "Asdfmovie9 Song",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27318ffe5a3d77d39eb01981436",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/5SFn7vpBSiLUBn1mDct8c9"
//         },
//         {
//             "name": "Asdfmovie6 Song",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273a9b7b1dad775d064dacba12a",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/4Umy8mk1bBdWYoxKB8354f"
//         },
//         {
//             "name": "I Like Trains",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b273a9b7b1dad775d064dacba12a",
//             "artists": [
//                 {
//                     "name": "LilDeuceDeuce",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/4Us5vMePI2R5VKoeYtIO3j"
//         },
//         {
//             "name": "Tom's Dog (asdfmovie5 theme)",
//             "type": "song",
//             "release_date": null,
//             "total_tracks": null,
//             "image_url": "https://i.scdn.co/image/ab67616d0000b27370d3b218cd946ff12844d2a1",
//             "artists": [
//                 {
//                     "name": "The Living Tombstone",
//                     "type": "artist"
//                 }
//             ],
//             "spotify_url": "https://open.spotify.com/track/6MUqvjHsxLPSfqFRaww9KZ"
//         }
//     ]
// }