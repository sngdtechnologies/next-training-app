import NextAuth from "next-auth"
import { authOptions } from "@/shared/lib/config/authOptions";

export default NextAuth(authOptions)