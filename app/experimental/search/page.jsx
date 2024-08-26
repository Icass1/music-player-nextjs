import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SearchView() {

    return (
        <ScrollArea className='h-full'>

            <div className="p-6 space-y-6">
                <div className="max-w-2xl mx-auto">
                    <Input type="search" placeholder="Search for songs, artists, or albums" className="w-full" />
                </div>

                <section>
                    <h3 className="text-2xl font-semibold mb-4">Top Genres</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {['Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country'].map((genre) => (
                            <div key={genre} className="bg-card rounded-lg p-4 text-center">
                                <p className="font-medium">{genre}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-semibold mb-4">Browse All</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {['New Releases', 'Charts', 'Concerts', 'Made for You', 'At Home', 'Workout', 'Chill', 'Focus'].map((category) => (
                            <div key={category} className="bg-card rounded-lg p-4 space-y-2">
                                <div className="aspect-square bg-muted rounded-md"></div>
                                <p className="font-medium">{category}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </ScrollArea>
    )
}