"use client";
import {useEffect, useState} from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function Dashboard(){
  const router = useRouter();

  const [restaurant,setRestaurant] = useState<any[]>([]);
  const [name,setName] = useState("");
  const [location,setLocation] = useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const user = api.user.getProfile.useQuery();
  const fetchRestaurants = api.restaurant.getByUser.useQuery();

  const logout = api.user.logout.useMutation({
    onSuccess:()=>{
      router.refresh();
      router.push("/login");
    }
  })

  const createRestaurant = api.restaurant.create.useMutation({
    onSuccess:(restaurant)=>{
      setRestaurant((prev)=>[...prev,restaurant]);
      setName("");
      setLocation("");
    },
    onError:(err:any)=>setError(err.message),
  })

  useEffect(()=>{
    if(!fetchRestaurants.data) return;
    setRestaurant(fetchRestaurants.data);
  },[fetchRestaurants.data]);
  

  if(user.isLoading) return <p>Loading...</p>;

  if(!user.data) {
    router.push("/login");
    return null;
  }
  const profile = user.data;

  const handleCreate = async ()=>{
    if(!name||!location) return setError("Name and location are required");
    setError("");
    setLoading(true);
    try{
      await createRestaurant.mutateAsync({name,location});
    }catch(err:any){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }


  if(loading) return <p>Loading restaurants...</p>

  return (
    <main className="p-6 max-w-md mx-auto">

      {/* USER PROFILE SECTION */}
      {/* ----------------------- */}
      <div className="mb-6 p-4 border rounded bg-white shadow text-center">
        <h2 className="text-xl font-semibold mb-2">👤 Profile</h2>

        <p><span className="font-medium">Name:</span> {profile?.name}</p>
        <p><span className="font-medium">Country:</span> {profile?.country ?? "Not added"}</p>

        <button
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push("/profile")}
        >
          Edit Profile
        </button>
        <button onClick={()=>logout.mutate()} className="bg-red-600 text-white px-4 py-2 ml-1 rounded" disabled={logout.isPending}>{logout.isPending?"Logging out...":"Logout"}</button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Your Restaurants</h1>

      {/* Create Restaurant Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Restaurant Name"
          className="border p-2 w-full mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full mb-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white p-2 w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </div>

      {/* List of Restaurants */}
      <ul>
        {restaurant?.map((r) => (
          <li key={r.id} className="border p-2 mb-2 rounded flex justfiy-between items-center cursor-pointer hover:bg-gray-100">
            <div
          onClick={()=>router.push(`/restaurant/${r.id}/menu`)}>
            {r.name} - {r.location}</div>
            {/*QR Button*/}
            <button onClick={()=>router.push(`/restaurant/${r.id}/qr`)} className="ml-2 px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">QR</button>
          </li>
        ))}
      </ul>
    </main>
  );
}