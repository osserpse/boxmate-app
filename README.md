# BoxMate - Local Marketplace App

A modern Next.js marketplace application for buying and selling items in your local community.

## Technologies Used

- **Next.js 14+** with App Router and TypeScript
- **React 18+** with Server Components by default
- **Tailwind CSS** for styling with custom theme
- **shadcn/ui** components for consistent design
- **Fira Sans** font from Google Fonts
- **Lucide React** for icons

## Design System

- **Primary Color**: Lime (energetic, friendly)
- **Secondary Color**: Stone (neutral backgrounds)
- **Accent Color**: Yellow (attention-grabbing highlights)
- **Style**: Light, airy, modern with a youthful and playful twist
- **Typography**: Fira Sans throughout the application

## Package Manager

This project uses **Yarn** as the package manager. Please use yarn commands:

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

## Development Setup

1. Clone the repository
2. Install dependencies: `yarn install`
3. Start the development server: `yarn dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main marketplace dashboard
│   ├── item/[id]/         # Dynamic item detail pages
│   ├── login/             # Login page
│   ├── sell/[id]/         # Item listing form
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── item-card.tsx     # Item card component
│   ├── item-image.tsx    # Image component with error handling
│   └── navigation.tsx    # Main navigation
├── data/                 # Mock data and types
│   └── mock-items.ts     # Sample items data
├── lib/                  # Utility functions
│   └── utils.ts         # Class name utilities
└── public/              # Static assets
```

## Features Implemented

### Pages
- **Dashboard** (`/dashboard`) - Main marketplace with item grid and search
- **Login** (`/login`) - Authentication page with demo access
- **Item Detail** (`/item/[id]`) - Detailed item view with seller info
- **Sell Item** (`/sell/[id]`) - Item listing form

### Components
- **Navigation** - Responsive header with logo, search, and user actions
- **ItemCard** - Card component for displaying items
- **ItemImage** - Image component with error handling
- **Button** - Multiple variants (primary, secondary, accent)

### Design Features
- Fully responsive design
- Smooth hover effects and transitions
- Image placeholders with error handling
- Modern card-based layout
- Clean typography with Fira Sans

## Sample Data

The application includes 6 sample items with realistic data:
- Nintendo Switch Lens
- MacBook Air M2
- Bose Headphones
- iPad Pro
- DJI Drone
- Canon Camera

Each item includes image, name, location, value, and description.

## Future Development

This project is structured and ready for:
- Supabase integration for backend functionality
- User authentication and profiles
- Real image upload and storage
- Search and filtering functionality
- Payment processing
- Mobile app development

## Scripts

All scripts are configured to work with yarn:

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

---

Built with ❤️ for the local community marketplace.