
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
    //     async signIn({ user, account, profile, email, credentials }) {
    //         console.log("signIn", user, account, profile, email, credentials)
    //         return true
    //     },
    //     async redirect({ url, baseUrl }) {
    //         console.log("redirect", url, baseUrl)
    //         return baseUrl
    //     },
    //     async session({ session, user, token }) {
    //         console.log("session", session, user, token)
    //         return session
    //     },
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //         console.log("jwt", token, user, account, profile, isNewUser)
    //         return token
    //     }
    // }
}