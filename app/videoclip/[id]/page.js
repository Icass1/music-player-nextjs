'use client';

import React, { useState, useEffect, useContext } from 'react';
import DefaultListPage from '@/app/components/listPage';

export default function ListPage({ params }) {

    return (

        <>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/h85k-rdiREk?si=WNegXQvdZOg2O_9i"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                // allowfullscreen
            ></iframe>

            <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube-nocookie.com/embed/h85k-rdiREk?si=WNegXQvdZOg2O_9i&amp;controls=0" 
            title="YouTube video player" 
            // frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
            ></iframe>
        </>
    )
}