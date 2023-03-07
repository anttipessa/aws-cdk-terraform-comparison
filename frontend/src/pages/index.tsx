import { useSession, signIn, signOut } from 'next-auth/react';
export default function Home() {

  // Give session DefaultSession type
  interface DefaultSession extends Record<string, unknown> {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
    expires?: string
  }
  

  const { data: session, status: loading } = useSession();

  //f (loading) return null;

  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
