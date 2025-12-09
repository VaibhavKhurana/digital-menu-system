"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const router = useRouter();
  const [email,setEmail] = useState("");
  const sendOTP = api.auth.sendOTP.useMutation({
    onSuccess:(data)=>{
      router.push(`/verify?email=${email}`)
      console.log("Test OTP: ",data.otp);
    },
  });

  return(
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>
      <input type="email" placeholder="Email" className="border p-2 mt-4 w-full" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <button className="bg-blue-500 text-white p-2 mt-4" onClick={()=>sendOTP.mutate({email})}>Send OTP</button>
    </main>
  );
}