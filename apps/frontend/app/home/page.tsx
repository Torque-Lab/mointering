import { Sidebar } from "../components/SideBar";
import { redirect } from 'next/navigation';

import WebsiteTable from '../components/dashboard/WebsiteTable';
import getSessionInServer from '../Providers/session-server';
import { NEXT_PUBLIC_URL } from '../lib/config';

export default async function Home() {
const token = await getSessionInServer();
  
  if (!token) {
    redirect('/login');
  }
  const websites = await getWebsites(token);

  return (
    <div className="flex min-h-screen bg-[#182636] min-w-fit">
      <Sidebar />
      <WebsiteTable initialData={websites} />
    </div>
  );
}

async function getWebsites(token:string) {
  try {
    const response = await fetch(`${NEXT_PUBLIC_URL}/api/websites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
   

    return await response.json();
  } catch (error) {
    console.error('Error fetching websites:', error);
    return null;
  }
}
