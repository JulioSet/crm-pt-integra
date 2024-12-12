import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { SessionPayload } from './definitions'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
   try {
      const { payload } = await jwtVerify(session, encodedKey, {
         algorithms: ['HS256'],
      })
      return payload
   } catch (error) {
      console.log('Failed to verify session', error)
   }
}

export async function createSession(name: string, role: string) {
   const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000) // hours * minutes * seconds * milliseconds 
   const session = await encrypt({ name, role, expiresAt })
   const cookieStore = await cookies()
   
   cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
   })
}

export async function deleteSession() {
   const cookieStore = await cookies()
   cookieStore.delete('session')
}

export async function getSession() {
   const cookie = (await cookies()).get('session')?.value;
   if (!cookie) {
      return 403;
   }

   const session = await decrypt(cookie);
   return session;
}