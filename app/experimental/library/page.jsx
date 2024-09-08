'use client'

import { apiFetch } from "@/app/utils/apiFetch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List } from "lucide-react"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { MediaPlayerContext } from "@/app/components/audioContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "next-view-transitions";


function AddContextMneu({ children, item }) {

    const mediaPlayer = useContext(MediaPlayerContext)

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem inset>
                    Open
                </ContextMenuItem>
                <ContextMenuItem inset onClick={() => { console.log("play", item.id); mediaPlayer.handlePlayList(item.id) }}>
                    Play
                </ContextMenuItem>
                <ContextMenuItem inset>
                    Download
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset>
                    Add to queue
                </ContextMenuItem>
                <ContextMenuItem inset>
                    Add to bottom of queue
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset>
                    Remove from library
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem>
                            Copy ID
                        </ContextMenuItem>
                        <ContextMenuItem>Copy URL</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    )

}

function GridViewContainer({ item }) {

    const [coverLoaded, setCoverLoaded] = useState(false)

    return (

        <Link href={`/experimental/list/${item?.id}`}>
            <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md relative hover:scale-105 transition-[transform] cursor-pointer">

                <div className="bg-neutral-500 aspect-square w-full h-auto rounded overflow-hidden">
                </div>
                {item !== null ?
                    <Image
                        onLoad={() => { setCoverLoaded(true) }}
                        src={`https://api.music.rockhosting.org/api/list/image/${item.id}_300x300`}
                        className="absolute top-0 rounded h-auto w-full "
                        width={0}
                        height={0}
                        sizes="100vw"
                        alt="" />
                    :
                    <></>
                }

                {coverLoaded ?
                    <></>
                    :
                    <Skeleton className='top-0 absolute aspect-square w-full h-auto rounded' />
                }

                <div className="p-4">
                    {item !== null ?
                        <>
                            <h3 className="font-semibold text-nowrap text-ellipsis overflow-x-hidden">{item.name}</h3>
                            <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-x-hidden">{item.author}</p>
                        </>
                        :
                        <>
                            <div className="relative w-full h-4 bg-neutral-500 rounded-sm">
                                <Skeleton className='w-full h-full rounded-sm' />
                            </div>
                            <div className="relative w-9/12 h-3 bg-neutral-500 rounded-sm mt-2">
                                <Skeleton className='w-full h-full rounded-sm' />
                            </div>
                        </>
                    }
                </div>
            </div>
        </Link>
    )
}

function ListViewContainer({ item }) {
    const [coverLoaded, setCoverLoaded] = useState(false)

    return (
        <div className="flex items-center space-x-4 p-2 bg-card text-card-foreground rounded-lg max-w-[500px] hover:scale-105 transition-[transform] cursor-pointer">
            <div className="bg-neutral-500 h-16 w-16 relative rounded">
                {item !== null ?
                    < Image onLoad={() => { setCoverLoaded(true) }} src={`https://api.music.rockhosting.org/api/list/image/${item.id}_300x300`} className="left-0 absolute rounded" width={64} height={64} alt="" />
                    :
                    <></>
                }
                {coverLoaded ?
                    <></>
                    :
                    <Skeleton className='absolute  rounded aspect-square h-16 w-16' />
                }
            </div>

            <div className="max-w-[404px]">
                {item !== null ?
                    <>
                        <h3 className="font-semibold text-nowrap text-ellipsis overflow-x-hidden">{item.name}</h3>
                        <p className="text-sm text-muted-foreground text-nowrap text-ellipsis overflow-x-hidden">{item.author}</p>
                    </>
                    :
                    <>
                        <div className="relative w-full h-4 bg-neutral-500 rounded-sm">
                            <Skeleton className='w-full h-full rounded-sm' />
                        </div>
                        <div className="relative w-9/12 h-3 bg-neutral-500 rounded-sm mt-2">
                            <Skeleton className='w-full h-full rounded-sm' />
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default function UserLibrary() {
    const [libraryView, setLibraryView] = useState('grid');
    const [data, setData] = useState(null);
    const session = useSession();
    const scrollRef = useRef();

    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        console.log(session.status)
        if (session.status != "authenticated") { return }
        apiFetch("/api/user/get-lists", session).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)
                    setData(data)
                })
            } else {
                console.error("Response was not okey")
            }
        })
    }, [session])

    const showLists = () => {
        if (libraryView == "grid") {
            return (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {data.map((item) => (
                        <AddContextMneu key={item.id} item={item}>
                            <GridViewContainer item={item} />
                        </AddContextMneu>
                    ))}
                </div>)
        } else if (libraryView == "list") {
            return (
                <div className="space-y-2" >
                    {
                        data.map((item) => (
                            <AddContextMneu key={item.id} item={item}>
                                <ListViewContainer item={item} />
                            </AddContextMneu>
                        ))
                    }
                </div >
            )
        }
    }

    const showSkeleton = () => {
        if (libraryView == "grid") {
            return (
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                        <GridViewContainer key={item} item={null} />
                    ))}
                </div>)
        } else if (libraryView == "list") {
            return (
                <div className="space-y-2" >
                    {
                        [0, 1, 2, 3, 4].map((item) => (
                            <ListViewContainer key={item} item={null} />
                        ))
                    }
                </div >
            )
        }
    }

    return (
        <ScrollArea onScrollCapture={(e) => { setScrollTop(e.target.scrollTop) }} className='px-6 h-full relative'>
            <div className="flex justify-between items-center z-10 my-10">
                <h2 className="text-5xl font-semibold">Your Library</h2>
                {/* <h2 className="text-2xl font-semibold" style={{fontSize: '10px'}}>Your Library</h2> */}
                <div className="flex space-x-2 mr-10">
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
            {data == null ?
                showSkeleton()
                :
                showLists()
            }
        </ScrollArea>
    )
}