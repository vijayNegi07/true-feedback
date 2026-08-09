import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    sessionOptions:{

    },
    plugins: [
        emailOTPClient() 
    ]
})