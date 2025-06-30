
"use client";
import Auth from "../../components/Auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();
    return <Auth isLogin={false} onSuccess={()=>router.push("/login")} onError={(error)=>alert(error)}/>
}
