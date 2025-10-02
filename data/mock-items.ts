export interface Item {
  id: string;
  name: string;
  location: string;
  value: number;
  image: string;
  photo: string; // Alias for image
  createdAt: string;
  description?: string;
}

export const mockItems: Item[] = [
  {
    id: "1",
    name: "Nintendo Switch Lite",
    location: "Stockholm, Sverige",
    value: 1899,
    image: "https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop",
    createdAt: "2 dagar sedan",
    description: "Nyskick. Nästan inte använd, kommer med laddare. Perfekt för bärbar gaming."
  },
  {
    id: "2",
    name: "MacBook Air M2",
    location: "Göteborg, Sverige",
    value: 8999,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    createdAt: "3 dagar sedan",
    description: "Utmärkt skick. Bra batteritid. Används för skolprojekt."
  },
  {
    id: "3",
    name: "Bose Noise-Canceling Headphones",
    location: "Malmö, Sverige",
    value: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    createdAt: "1 vecka sedan",
    description: "Premium ljudkvalitet. Utmärkt ljuddämpning för studier och resor."
  },
  {
    id: "4",
    name: "iPad Pro 11-tum",
    location: "Uppsala, Sverige",
    value: 7499,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    createdAt: "5 dagar sedan",
    description: "Bra för kreativa projekt och anteckningar. Kompatibel med Apple Pencil."
  },
  {
    id: "5",
    name: "DJI Mini 3 Drone",
    location: "Linköping, Sverige",
    value: 5499,
    image: "https://images.unsplash.com/photo-1534471776661-c82ec3ee43b3?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1534471776661-c82ec3ee43b3?w=400&h=300&fit=crop",
    createdAt: "1 dag sedan",
    description: "Lätt och kompakt. Perfekt för flygfotografi och nybörjare."
  },
  {
    id: "6",
    name: "Canon EOS R6 Kamera",
    location: "Norrköping, Sverige",
    value: 24999,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    createdAt: "4 dagar sedan",
    description: "Professionell kamera med utmärkt lågjusprestanda. Perfekt för fotografi-enthusiaster."
  }
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
