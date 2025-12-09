"use client";

import {QRCodeSVG} from "qrcode.react";
import {useParams} from "next/navigation";
import { useRouter } from "next/navigation";


export default function RestaurantQR(){
  const router = useRouter();

  const {restaurantId} = useParams();
  const baseUrl =   process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
  const url = `${baseUrl}/menu/${restaurantId}`;
  return(
    <div className="p-6 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl mb-4">Restaurant Menu QR</h1>
      <QRCodeSVG value={url} size={250}/>
      <p className="mt-4 text-sm text-gray-600 break-all text-center">{url}</p>
    </div>
  )
}