'use client'
import { CURRENT_USER } from "@/lib/constants";
import { useRouter } from "next/navigation"
import { useEffect } from "react";


function MyProfile() {
  const router = useRouter();
  useEffect(()=>{
    router.push('/u/'+ CURRENT_USER.handle)
  },[router])
  
  
}

export default MyProfile