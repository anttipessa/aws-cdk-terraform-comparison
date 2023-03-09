import { useSession, signIn } from 'next-auth/react';

export default function Home() {
  const { data: session, status: loading } = useSession();

  if (session) {
    return (
      <div>
        Signed in as {session.user?.email || session.user?.name} <br />
        <button
          onClick={() => (window.location.href = '/api/auth/logout')}
        >
          Sign out
        </button>
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
