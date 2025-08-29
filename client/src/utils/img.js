// ek safe image url resolve karta hai
export const getImageUrl = (p) =>
  p?.imageUrl ||
  (Array.isArray(p?.images) && p.images[0]?.url) ||
  "/placeholder.png";
