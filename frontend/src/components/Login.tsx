import { useSession, signIn } from 'next-auth/react';
import styles from '../styles/Login.module.css';

export default function Login() {
  const { data: session, status: loading } = useSession();

  if (session) {
    return (
      <div>
        Signed in as {session.user?.email || session.user?.name} <br />
        <button
          className={styles.btn}
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
      <button className={styles.btn} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
