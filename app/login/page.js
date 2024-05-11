
'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {

    const githubLogin = () => {
        console.log("github login")
        signIn("github", {callbackUrl: '/'})
    }

    const googleLogin = () => {
        signIn("google", {callbackUrl: '/'})
        console.log("google login")
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-500">
            <Image
                alt=""
                src='/login-background.jpg'
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: '100%' }}
            />

            <div className=" bg-[#dcdcdc70] rounded-lg absolute left-1/2 top-1/2 w-96 h-auto -translate-x-1/2 -translate-y-1/2">

                <label className="relative block text-3xl text-[#2a272b] font-bold text-center w-full pt-4 select-none" style={{ textShadow: '1px 1px 2px #3b3b3b' }}>Login</label>

                <Image
                    alt="Login with Google"
                    className="ml-auto mr-auto mt-6 cursor-pointer select-none"
                    src='/web_neutral_sq_SI@2x.png'
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '250px', height: '60px' }}
                    onClick={googleLogin}
                />

                <div className="flex flex-row ml-auto mr-auto mt-6 w-[250px] h-[60px] bg-neutral-700 rounded-lg mb-4 cursor-pointer" onClick={githubLogin}>
                    <Image
                        alt="Github logo"
                        className="mt-auto mb-auto ml-4 cursor-pointer select-none"
                        src='/github-mark-white.png'
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '35px', height: '35px' }}
                    />
                    <label className="font-bold mt-auto mb-auto text-lg ml-2 cursor-pointer select-none">Sign in with GitHub</label>
                </div>
            </div>
        </div>
    )
}