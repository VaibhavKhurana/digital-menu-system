"use client";

import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AddDish() {
  const router = useRouter();
  const { restaurantId, categoryId } = useParams() as {
    restaurantId: string;
    categoryId: string;
  };

  const utils = api.useUtils();

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    spiceLevel: "",
  });

  const createDish = api.dish.create.useMutation({
    onSuccess: async () => {await utils.restaurant.getById.invalidate(restaurantId),
    router.push(`/restaurant/${restaurantId}/menu`);
    },
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    createDish.mutate({
      name:form.name,
      image:form.image,
      description:form.description,
      spiceLevel:form.spiceLevel?Number(form.spiceLevel):undefined,
      restaurantId,
      categoryIds:[categoryId],
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Add Dish</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 max-w-sm"
      >
        <input
          name="name"
          placeholder="Dish Name"
          className="border p-2"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          className="border p-2"
          value={form.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description (required)"
          className="border p-2"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="spiceLevel"
          type="number"
          placeholder="Spice Level (0–5)"
          className="border p-2"
          value={form.spiceLevel}
          onChange={handleChange}
        />

        <button className="px-4 py-2 bg-black text-white" disabled={createDish.isPending}>
          {createDish.isPending?"Creating Dish...":"Create Dish"}
        </button>
      </form>
      {createDish.error && (<p className="text-red-500 mt-2">{createDish.error.message}</p>)}
    </div>
  );
}
