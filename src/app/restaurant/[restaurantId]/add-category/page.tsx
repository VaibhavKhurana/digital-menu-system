"use client";
import { api } from "~/trpc/react";
import { useRouter,useParams } from "next/navigation";
import { useState } from "react";

export default function AddCategory(){
  const {restaurantId}=useParams();
  const router = useRouter();
  const [name,setName]=useState("");
  const utils = api.useUtils();

  const createCategory=api.category.create.useMutation({onSuccess:async ()=>{await utils.restaurant.getById.invalidate(restaurantId as string);
    router.push(`/restaurant/${restaurantId}/menu`);
    },
  });

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    createCategory.mutate({
      name,
      restaurantId:restaurantId as string,
    });
  };

  return(
    <div className="p-6">
      <h1 className="text-xl">Add Category</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" className="border p-2" placeholder="Category Name" value={name} onChange={(e)=>setName(e.target.value)}/>
        <button className="ml-2 px-4 py-2 bg-black text-white" disabled={createCategory.isPending}>{createCategory.isPending?"Adding...":"Add"}</button>
      </form>
      {createCategory.error && (<p className="text-red-500 mt-2">{createCategory.error.message}</p>)}
    </div>
  )
}