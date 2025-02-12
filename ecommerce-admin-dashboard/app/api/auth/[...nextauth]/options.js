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
                    const res = await fetch(`https://8080-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io/api/signin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        credentials: "include", 
                    });

                    if (!res.ok) {
                        throw new Error("Invalid credentials");
                    }
                    
                    const data = await res.json();

                    if (data.success && data.user) {
                        return {
                          // Extract user details and token from data.data
                          id: data.user.id,
                          name: data.user.name,
                          email: data.user.email,
                          token: data.user.token, // <– Token is extracted here
                        };
                      } else {
                        return null;
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
                token = {
                  ...token,
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  accessToken: user.token, // Store the token as accessToken
                };
              }
              return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
              };
              session.accessToken = token.accessToken; // Token is available here
              return session;
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