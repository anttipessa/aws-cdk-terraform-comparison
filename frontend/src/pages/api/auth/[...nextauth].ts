import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID as any,
      clientSecret: process.env.COGNITO_CLIENT_SECRET as any,
      issuer: process.env.COGNITO_ISSUER,
      checks: 'nonce',
    }),
  ],
});
