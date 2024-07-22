
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    // callbacks: {
    //     async session(session, user) {
    //     //     // session.user.id = user.id;
    //         return session;
    //     },
    //     async jwt(token, user) {
    //         // console.log("jwt", token, user)
    //         // if (user) {
    //         //     token.id = user.id;
    //         // }  
    //         return token;
    //     }
    // },
    // secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log("signIn", user, account, profile, email, credentials)
            return true
        },
        async redirect({ url, baseUrl }) {
            // console.log("redirect", url, baseUrl)
            return baseUrl
        },
        async session({ session, user, token }) {
            // console.log("session", session, user, token)
            if (token?.sub) {
                session.user.id = token.sub;
            }

            const response = await fetch(`https://api.music.rockhosting.org/api/user/get`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token.sub}` // Pass user id in the headers
                },
            })

            if (response.ok) {
                const data = await response.json()
                // console.log("data", data)
                session.user.current_song = data.current_song
                session.user.current_list = data.current_list
                session.user.current_time = data.current_time
                session.user.queue = data.queue
                session.user.queue_index = data.queue_index
                session.user.volume = data.volume
                session.user.random_queue = data.random_queue
                session.user.show_lyrics = data.show_lyrics
            }

            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            // console.log("jwt", token, user, account, profile, isNewUser)

            if (token) {
                fetch(`https://api.music.rockhosting.org/api/user/set`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.sub}` // Pass user id in the headers
                    },
                    body: JSON.stringify({ 
                        username: token.name,
                        email: token.email,
                        picture_url: token.picture,
                        dev_user: process.env.NODE_ENV == "development" ? true : false
                    })
                })
            }

            return token
        }
    }
}