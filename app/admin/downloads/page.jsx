"use client";

import { useState } from "react";

export default function Downloads({}) {
    const [data, setData] = useState();
    const [loaded, setLoaded] = useState(false);

    if (!loaded) {
        return (
            <label className="ml-auto mr-auto w-fit block top-1/2 relative text-4xl font-bold text-neutral-200 h-fit">
                Loading...
            </label>
        );
    }

    return <div>Downloads</div>;
}
