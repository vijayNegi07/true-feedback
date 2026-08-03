import {betterAuth} from "better-auth"
import { getClient} from "./dbConnect"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

const client = await getClient();

export const auth = betterAuth({
    database:mongodbAdapter(client),
    emailAndPassword:{
        enabled:true
    },
    plugins:[nextCookies()]
})