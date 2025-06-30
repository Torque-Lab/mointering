
import { cookies } from 'next/headers';
export default async function getSessionInServer() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (!token) return null;
  
   return token.value;

  }
  