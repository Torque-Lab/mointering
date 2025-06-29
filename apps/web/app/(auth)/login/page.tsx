
"use client";
import Auth from "../../../components/Auth";
import { useRouter } from "next/navigation";

export  default function LoginPage() {
    const router = useRouter();
    return <Auth isLogin={true} onSuccess={()=>router.push("/home")} onError={(error)=>alert(error)}/>
}       