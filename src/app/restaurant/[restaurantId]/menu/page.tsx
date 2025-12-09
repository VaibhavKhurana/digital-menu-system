"use client";

import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function MenuPage() {
  const { restaurantId } = useParams()
  const router = useRouter();
  const { data: restaurant, isLoading } = api.restaurant.getById.useQuery(restaurantId as string);
  const [open, setOpen] = useState<string | null>(null);

  if (isLoading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/restaurant/${restaurantId}/add-category`)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Category
          </button>

        </div>
      </div>

      {restaurant.categories.map((cat) => (
        <div key={cat.id} className="mb-4 border rounded shadow-sm">
          <div
            className="cursor-pointer flex justify-between p-3 bg-gray-100 rounded-t"
            onClick={() => setOpen(open === cat.id ? null : cat.id)}
          >
            <h2 className="text-xl font-medium">{cat.name}</h2>
            <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/restaurant/${restaurantId}/category/${cat.id}/add-dish`);
          }}
          className="bg-green-600 text-white px-2 py-1 rounded text-sm"
        >
          + Add Dish
        </button>

        <span className="font-bold">{open === cat.id ? "-" : "+"}</span>
      </div>
          </div>

          {open === cat.id && (
            <div className="p-3 space-y-4 bg-white rounded-b">
              {cat.dishes.length === 0 && (
                <p className="text-gray-500 italic">No dishes in this category yet.</p>
              )}

              {cat.dishes.map((dish) => (
                <div key={dish.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{dish.name}</p>
                    {dish.description && (
                      <p className="text-gray-600">{dish.description}</p>
                    )}
                    {dish.spiceLevel !== null && dish.spiceLevel !== undefined && (
                      <p className="text-red-500">Spice level: {dish.spiceLevel}</p>
                    )}
                  </div>
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
