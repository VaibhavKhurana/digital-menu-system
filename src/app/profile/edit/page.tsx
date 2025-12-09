"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = api.user.getProfile.useQuery();
  const updateMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/dashboard");
    },
  });

  const [form, setForm] = useState({
    name: "",
    country: "",
  });

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>No profile</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate(form);
        }}
        className="space-y-4 bg-white p-4 shadow rounded"
      >
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="border p-2 rounded w-full"
            defaultValue={user.name??""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
        <label className="block mb-1">Country</label>
        <input
            className="border p-2 rounded w-full"
            defaultValue={user.country ?? ""}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
