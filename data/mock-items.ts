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
    location: "San Francisco, CA",
    value: 199,
    image: "https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1606144042414-1a44d040c4c8?w=400&h=300&fit=crop",
    createdAt: "2 days ago",
    description: "Like new condition. Barely used, comes with charger. Perfect for portable gaming."
  },
  {
    id: "2",
    name: "MacBook Air M2",
    location: "Los Angeles, CA",
    value: 899,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    createdAt: "3 days ago",
    description: "Excellent working condition. Great battery life. Used for school projects."
  },
  {
    id: "3",
    name: "Bose Noise-Canceling Headphones",
    location: "Seattle, WA",
    value: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    createdAt: "1 week ago",
    description: "Premium sound quality. Excellent noise cancellation for studying and travel."
  },
  {
    id: "4",
    name: "iPad Pro 11-inch",
    location: "Denver, CO",
    value: 749,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    createdAt: "5 days ago",
    description: "Great for creative projects and note-taking. Comes with Apple Pencil compatibility."
  },
  {
    id: "5",
    name: "DJI Mini 3 Drone",
    location: "Austin, TX",
    value: 549,
    image: "https://images.unsplash.com/photo-1534471776661-c82ec3ee43b3?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1534471776661-c82ec3ee43b3?w=400&h=300&fit=crop",
    createdAt: "1 day ago",
    description: "Lightweight and compact. Perfect for aerial photography and beginners."
  },
  {
    id: "6",
    name: "Canon EOS R6 Camera",
    location: "New York, NY",
    value: 2499,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    photo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    createdAt: "4 days ago",
    description: "Professional-grade camera with excellent low-light performance. Great for photography enthusiasts."
  }
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
