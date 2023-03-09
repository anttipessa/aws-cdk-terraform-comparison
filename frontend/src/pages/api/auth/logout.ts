import { NextApiRequest, NextApiResponse } from 'next';

const clearCookieOptions = `Max-Age=-1; Path=/; Secure; HttpOnly;`;

// https://github.com/nextauthjs/next-auth/discussions/3938

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = new URL('/logout', process.env.COGNITO_DOMAIN!);
  url.searchParams.set('client_id', process.env.COGNITO_CLIENT_ID!);
  url.searchParams.set('logout_uri', process.env.NEXTAUTH_URL!);

  const cookies = Object.keys(req.cookies ?? {}).map(
    (cookie) => `${cookie}=; ${clearCookieOptions}`
  );

  if (cookies.length) {
    res.setHeader('Set-Cookie', cookies);
  }

  res.redirect(url.href);
}
