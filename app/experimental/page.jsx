export default function HomeView() {
    return (
        <div className="p-6 space-y-8">
            <h2 className="text-3xl font-bold">Welcome to RockIT</h2>

            <section>
                <h3 className="text-2xl font-semibold mb-4">Recently Played</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="space-y-2">
                            <div className="aspect-square bg-muted rounded-md"></div>
                            <p className="font-medium truncate">Song Title</p>
                            <p className="text-sm text-muted-foreground truncate">Artist Name</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-semibold mb-4">Your Top Mixes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-card rounded-lg p-4 space-y-2">
                            <div className="aspect-video bg-muted rounded-md"></div>
                            <p className="font-medium">Mix Name</p>
                            <p className="text-sm text-muted-foreground">Based on your listening</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-semibold mb-4">New Releases for You</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="space-y-2">
                            <div className="aspect-square bg-muted rounded-md"></div>
                            <p className="font-medium truncate">Album Title</p>
                            <p className="text-sm text-muted-foreground truncate">Artist Name</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )

} 