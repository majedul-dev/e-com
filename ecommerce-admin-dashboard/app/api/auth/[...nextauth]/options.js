import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.BACKEND_URL}/api/signin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        throw new Error("Invalid credentials");
                    }
                    
                    const data = await res.json();

                    if (data.success && data.data) {
                        return data.data; // Ensure API returns expected structure
                    } else {
                        return null; // Return null instead of throwing an error
                    }

                } catch (error) {
                    throw new Error(error.message || "Something went wrong");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id 
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (!token) {
                return null
            } else {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
            }
            return session
        },  
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}