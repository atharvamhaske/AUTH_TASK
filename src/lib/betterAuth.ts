import { prisma } from "./prisma";
import  { betterAuth } from "better-auth"
import { magicLink} from "better-auth/plugins"
import { honoAdapter} from "better-auth/adapters/hono"

export const auth = betterAuth({
    adapter: honoAdapter(prisma),
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
