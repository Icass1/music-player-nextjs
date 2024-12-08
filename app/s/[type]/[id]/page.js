"use client";

import React, { useState, useEffect, useContext } from "react";
import DefaultListPage from "@/app/components/listPage";
import { apiFetch } from "@/app/utils/apiFetch";

export default function SearchListPage({ params }) {
    const [musicData, setMusicData] = useState({
        songs: [],
        author: "",
        id: "",
        name: "",
        type: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await apiFetch(
                `/api/s/${params.type}/${params.id}`,
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            if (data.type == "Album") {
                data.songs = data.songs.map((song) =>
                    Object.assign({}, song, {
                        search: song.title.toUpperCase(),
                    }),
                );
            } else {
                data.songs = data.songs.map((song) =>
                    Object.assign({}, song, {
                        search:
                            song.title.toUpperCase() +
                            " " +
                            song.artist.toUpperCase() +
                            " " +
                            song.album.toUpperCase() +
                            " " +
                            song.genre.toUpperCase(),
                    }),
                );
            }

            setMusicData(data);
        };
        fetchData();
    }, [params]);

    return (
        <DefaultListPage
            listId={params.id}
            musicData={musicData}
            setMusicData={setMusicData}
        />
    );
}
