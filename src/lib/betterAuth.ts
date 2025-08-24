
import  { betterAuth } from "better-auth"
import { magicLink} from "better-auth/plugins"
import { prismaAdapter} from "better-auth/adapters/prisma"

export const auth = betterAuth({
    adapter: prismaAdapter,
    secret: process.env.AUTH_SECRET!,
    baseURL: "http://localhost:3001",
    plugins: [
        magicLink({
            sendMagicLink: async ({email, url}, request) => {
                //send email to user
                console.log(`magic link for ${email}: ${url}`)
            }
        })
    ]
})
