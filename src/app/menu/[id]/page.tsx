"use client";

import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PublicMenuPage() {
  const { id: restaurantId } = useParams();
  const restaurantQuery = api.restaurant.getById.useQuery(restaurantId as string);
  const restaurant = restaurantQuery.data;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scrollspy logic
  useEffect(() => {
    if (!restaurant) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActiveCategory(id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // middle of screen
    );

    restaurant.categories.forEach((cat) => {
      const el = categoryRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [restaurant]);

  if (restaurantQuery.isLoading) return <p className="p-4">Loading menu...</p>;
  if (!restaurant) return <p className="p-4">Restaurant not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      {/* Restaurant Name + Location */}
      <div className="flex gap-2 items-baseline mb-4">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <span className="text-gray-600">{restaurant.location}</span>
      </div>

      {/* Sticky Active Category */}
      {activeCategory && (
        <div className="sticky top-0 z-20 bg-white px-4 py-2 border-b font-bold text-center">
          {restaurant.categories.find((c) => c.id === activeCategory)?.name}
        </div>
      )}

      {/* Categories & Dishes */}
      <div className="space-y-8 mt-4">
  {restaurant.categories.map((cat) => (
    <div
      key={cat.id}
      id={cat.id}
      ref={(el) => {
        categoryRefs.current[cat.id] = el;
      }}
      className="space-y-4"
    >
      {/* Only render the header inside the list if it's NOT the active one */}
      <div className={activeCategory === cat.id ? "" : "sticky top-0 z-10 bg-white px-4 py-2 border-b font-bold text-center"}>
        {cat.name}
      </div>

      <div className="space-y-3">
        {cat.dishes.map((dish) => (
          <div key={dish.id} className="flex items-center gap-3 border-b pb-2">
            {dish.image && (
              <img
                src={dish.image}
                className="w-16 h-16 rounded object-cover"
                alt={dish.name}
              />
            )}
            <div>
              <p className="font-medium">{dish.name}</p>
              {dish.description && (
                <p className="text-sm opacity-70">{dish.description}</p>
              )}
              {dish.spiceLevel !== undefined && (
                <p className="text-xs text-red-600">
                  🌶 Spice: {dish.spiceLevel}/5
                </p>
                )}
              </div>
              </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-40"
        onClick={() => setShowPopup(true)}
      >
        Menu
      </button>

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/30 flex justify-center items-center z-30"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-lg max-w-xl w-full p-4 space-y-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {restaurant.categories.map((cat) => (
              <div key={cat.id}>
                <h3
                  className="text-lg font-semibold cursor-pointer hover:text-red-600"
                  onClick={() => {
                    setShowPopup(false);
                    document
                      .getElementById(cat.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {cat.name}
                </h3>
                <ul className="pl-4 mt-1 space-y-1">
                  {cat.dishes.map((dish) => (
                    <li key={dish.id} className="text-sm opacity-80">
                      {dish.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
