"use client";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function ProfilePage(){
  const {data:user,isLoading} = api.user.getProfile.useQuery();

  if(isLoading) return <p>Loading...</p>
  if(!user) return <p>No profile found.</p>

  return(
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Name:</strong>{user.name}</p>
        <p><strong>Email:</strong>{user.email}</p>
        <a href="/profile/edit"
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">Edit Profile</a>
      </div>
    </div>
  );
}