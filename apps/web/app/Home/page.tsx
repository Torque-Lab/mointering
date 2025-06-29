import { Sidebar } from "../../components/SideBar";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import WebsiteTable from '../../components/dashboard/WebsiteTable';


export default async function Home() {
  // Check authentication on server side
  const cookieStore =  await cookies();
  const token = cookieStore.get('access_token');
  
  if (!token) {
    redirect('/login');
  }

  // Fetch data on the server
  const websites = await getWebsites();

  return (
    <div className="flex min-h-screen bg-[#182636] min-w-fit">
      <Sidebar />
      <WebsiteTable initialData={websites} />
    </div>
  );
}

async function getWebsites() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websites`, {
      credentials: 'include',
  
      next: { revalidate: 300 }
    });

    console.log(response,"response");

    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
   

    return await response.json();
  } catch (error) {
    console.error('Error fetching websites:', error);
    return null;
  }
}
