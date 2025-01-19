import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/shared/lib/prisma/prisma";
import bcrypt from "bcrypt";
import { sequelize } from "./db";
import User from "@/shared/models/User";
import { IUser } from "@/shared/types/user.type";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // console.log("credential", credentials);

                if (credentials === undefined || !credentials.username || !credentials.password)
                    return null;

                try {
                    const user = await User.findOne({ where: { username: credentials.username } }) as unknown as IUser;

                    if (!user?.password) {
                        return null;
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (isCorrectPassword) {
                        // Any object returned will be saved in `user` property of the JWT
                        const newUser = {
                            ...user
                        };
                        return newUser as any
                    }

                    return null;
                } catch (error) {
                    return null;
                } finally {
                    await sequelize.close();
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // console.log('...token', { ...token });
            if (trigger === "update") {
                // console.log('...session.user', { ...session.user });
                return { ...token, ...session.user };
            }
            // console.log("...user", { ...user });
            return { ...token, ...user };
        },

        async session({ session, token }) {
            delete token.mdp;
            delete token.sub;
            delete token.exp;
            delete token.iat;
            session.user = token as any
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login'
    },
    debug: true,
    logger: {
        error(code, metadata) {
            console.error(code, metadata)
        },
        warn(code) {
            console.warn(code)
        },
        debug(code, metadata) {
            console.debug(code, metadata)
        }
    }
};