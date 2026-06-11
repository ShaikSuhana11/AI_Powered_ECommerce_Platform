import { Product, ProductVariant, Seller, Category, Review, Coupon, Order, OrderStatus, User, Address } from './types';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'buyer@enterprise.com',
    firstName: 'Arjun',
    lastName: 'Sharma',
    role: 'customer' as any,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    loyaltyPoints: 500,
    referralCode: 'ARJUN9F83',
    createdAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'user_2',
    email: 'jane.smith@global.com',
    firstName: 'Priya',
    lastName: 'Patel',
    role: 'customer' as any,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    loyaltyPoints: 120,
    referralCode: 'PRIYA7D22',
    createdAt: '2026-03-15T09:30:00Z'
  }
];

export const mockAddresses: Address[] = [
  {
    id: 'addr_1',
    userId: 'user_1',
    label: 'Home (Delhi)',
    street: 'Flat No. 405, Block B, Saket Residency, Saket',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110017',
    country: 'India',
    isDefault: true
  },
  {
    id: 'addr_2',
    userId: 'user_1',
    label: 'Office (Gurugram)',
    street: 'DLF Cyber City, Phase III, Sector 24',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
    isDefault: false
  }
];

export const mockSellers: Seller[] = [
  {
    id: 'seller_1',
    userId: 'user_seller_1',
    companyName: 'Reliance Retail Digital',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&q=80',
    rating: 4.8,
    description: 'India\'s leading electronics distributor offering official manufacturer warranties on premium tech products.',
    joinedAt: '2024-03-12T08:00:00Z',
    isVerified: true
  },
  {
    id: 'seller_2',
    userId: 'user_seller_2',
    companyName: 'FabIndia Artisans',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&q=80',
    rating: 4.6,
    description: 'Empowering local weavers and traditional design artisans across India with high-quality ethnic apparel and lifestyle items.',
    joinedAt: '2024-07-20T10:15:00Z',
    isVerified: true
  },
  {
    id: 'seller_3',
    userId: 'user_seller_3',
    companyName: 'SuperMart Kirana Distributors',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&h=100&fit=crop&q=80',
    rating: 4.5,
    description: 'Trusted fresh grocery, pantry staples, authentic stone-ground spices, and organic regional daily wellness products.',
    joinedAt: '2025-01-01T14:45:00Z',
    isVerified: true
  },
  {
    id: 'seller_4',
    userId: 'user_seller_4',
    companyName: 'Pustak Mahal India',
    logo: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=100&h=100&fit=crop&q=80',
    rating: 4.7,
    description: 'Premier national book distributors bringing literature, motivational stories, historical non-fiction, and academic guides close to you.',
    joinedAt: '2023-11-10T09:00:00Z',
    isVerified: true
  }
];

export const mockCategories: Category[] = [
  { id: 'cat_mobiles', name: 'Mobiles', slug: 'mobiles' },
  { id: 'cat_electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'cat_fashion', name: 'Fashion', slug: 'fashion' },
  { id: 'cat_grocery', name: 'Grocery', slug: 'grocery' },
  { id: 'cat_books', name: 'Books', slug: 'books' },
  { id: 'cat_home_appliances', name: 'Home Appliances', slug: 'home-appliances' }
];

// We define 100 high-quality products compactly using specialized master profiles.
// Prices represent USD base equivalent (formatPrice will multiply by 83.5 to obtain Rs.), e.g. 10 -> approx Rs.835, 100 -> Rs.8350, 1000 -> Rs.83500.
interface RawProfile {
  id: string;
  cat: string;
  sel: string;
  name: string;
  desc: string;
  img: string;
  price: number;
  disc: number;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  isAi?: boolean;
}

const rawMobiles: RawProfile[] = [
  {
    id: 'prod_prism_watch', // Maps to top mobile to prevent app crashes
    cat: 'cat_mobiles', sel: 'seller_1',
    name: 'OnePlus 12 5G (Flowy Emerald)',
    desc: 'Flagship experience featuring Snapdragon 8 Gen 3 chipset, Hasselblad ultra-clear portrait lens, robust 3X optical zoom, and 100W SuperVOOC flash charge.',
    img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
    price: 799, disc: 8, rating: 4.8, reviews: 114, isAi: true,
    specs: { 'Display': '6.82 in QHD+ 120Hz ProXDR AMOLED', 'Processor': 'Snapdragon 8 Gen 3 (4nm)', 'Rear Camera': '50MP + 64MP + 48MP Hasselblad', 'Battery': '5400 mAh with 100W SUPERVOOC' }
  },
  {
    id: 'prod_m2', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Redmi Note 13 Pro+ 5G (Fusion Purple)',
    desc: 'Premium curved 3D display smartphone with 200MP camera sensor, smart OIS stabilization, IP68 water resistance, and fully safe 120W HyperChange.',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    price: 380, disc: 12, rating: 4.5, reviews: 88,
    specs: { 'Display': '6.67 in 1.5K Curved AMOLED 120Hz', 'Processor': 'MediaTek Dimensity 7200-Ultra', 'Rear Camera': '200MP Samsung ISOCELL HP3', 'Battery': '5000 mAh with 120W Charger' }
  },
  {
    id: 'prod_m3', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Samsung Galaxy S24 Ultra (Titanium Gray)',
    desc: 'The ultimate Android productivity device with built-in S-Pen, titanium aerospace-grade frame, continuous 8K video capture, and high resolution 100x Space Zoom.',
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    price: 1299, disc: 5, rating: 4.9, reviews: 204, isAi: true,
    specs: { 'Display': '6.8 in Dynamic AMOLED 2X QHD+', 'Processor': 'Snapdragon 8 Gen 3 for Galaxy', 'Rear Camera': '200MP + 50MP + 12MP + 10MP Quad', 'Battery': '5000 mAh with 45W 2.0 Fast Charge' }
  },
  {
    id: 'prod_m4', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Realme GT 6T 5G (Razor Green)',
    desc: 'Extreme performance cooling tech flagship featuring MediaTek high-frequency processing, dual stereo speaker array, and specialized sports design layout.',
    img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800',
    price: 450, disc: 15, rating: 4.4, reviews: 65,
    specs: { 'Display': '6.78 in 120Hz 1.5K LTPO screen', 'Processor': 'Snapdragon 7+ Gen 3', 'Rear Camera': '50MP Sony LYT-600 OIS', 'Battery': '5500 mAh with 120W SUPERVOOC' }
  },
  {
    id: 'prod_m5', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Nothing Phone (2a) Premium White',
    desc: 'Signature aesthetic semi-transparent back panel with customizable high-contrast white Glyph lights and bloatware-free Android 14 Nothing OS.',
    img: 'https://images.unsplash.com/photo-1565849563525-4571de428e26?auto=format&fit=crop&q=80&w=800',
    price: 319, disc: 5, rating: 4.6, reviews: 74,
    specs: { 'Display': '6.7 in Flexible AMOLED 120Hz', 'Processor': 'MediaTek Dimensity 7200 Pro', 'Rear Camera': 'Dual 50MP Main + 50MP Ultrawide', 'Battery': '5000 mAh with 45W Rapid Charge' }
  },
  {
    id: 'prod_m6', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Apple iPhone 15 Pro (Natural Titanium)',
    desc: 'Strong and light aerospace-grade titanium frame, advanced customizable Action Button, ultimate A17 Pro performance chip, and highly detailed 5x telephoto lens.',
    img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
    price: 1199, disc: 4, rating: 4.9, reviews: 312, isAi: true,
    specs: { 'Display': '6.1 in Super Retina XDR OLED', 'Processor': 'Apple A17 Pro (3nm)', 'Rear Camera': '48MP Main + 12MP + 12MP zoom', 'Battery': 'Sustains full day usage easily' }
  },
  {
    id: 'prod_m7', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'OnePlus Nord CE 4 Lite 5G',
    desc: 'Affordable high-value 5G daily driver with 80W flash charging, long battery life, and crystal-clear dual stereo dynamic audio.',
    img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800',
    price: 240, disc: 10, rating: 4.3, reviews: 52,
    specs: { 'Display': '6.67 in FHD+ 120Hz AMOLED', 'Processor': 'Snapdragon 695 5G', 'Rear Camera': '50MP Sony Lytech main', 'Battery': '5500 mAh with 80W Charger' }
  },
  {
    id: 'prod_m8', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Samsung Galaxy M34 5G (Midnight Blue)',
    desc: 'Highly reliable Indian staple smartphone featuring a massive 6000mAh battery, triple camera layout, and extended four-year software updates.',
    img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=800',
    price: 200, disc: 12, rating: 4.2, reviews: 90,
    specs: { 'Display': '6.5 in Super AMOLED FHD+ 120Hz', 'Processor': 'Exynos 1280 (5nm)', 'Rear Camera': '50MP Triple OIS Camera', 'Battery': '6000 mAh battery capacity' }
  },
  {
    id: 'prod_m9', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Motorola Edge 50 Ultra (Peach Fuzz)',
    desc: 'Elegant vegan leather finish back side, pure seamless clean Android UI design, fully waterproof build, and swift 125W TurboPower.',
    img: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&q=80&w=800',
    price: 650, disc: 8, rating: 4.6, reviews: 49,
    specs: { 'Display': '6.7 in Curved pOLED 144Hz Super Display', 'Processor': 'Snapdragon 8s Gen 3', 'Rear Camera': '50MP Main OIS + 64MP Portrait Zoom', 'Battery': '4500 mAh battery + 125W charging' }
  },
  {
    id: 'prod_m10', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'iQOO 12 5G (Legend Edition)',
    desc: 'Ultimate dual-chip mobile gaming device containing a dedicated custom Q1 display gaming processor and wet-hand screen protection.',
    img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800',
    price: 700, disc: 5, rating: 4.7, reviews: 38,
    specs: { 'Display': '6.78 in 144Hz LTPO AMOLED 3000 nits', 'Processor': 'Snapdragon 8 Gen 3', 'Rear Camera': '50MP + 50MP + 64MP Triple Astro Zoom', 'Battery': '5000 mAh Graphite-Battery' }
  },
  {
    id: 'prod_m11', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Vivo V30 Pro 5G (Classic Black)',
    desc: 'The portrait studio master curated with professional German ZEISS lens filters and continuous dynamic halo aura rings.',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    price: 549, disc: 6, rating: 4.6, reviews: 45,
    specs: { 'Display': '6.78 in 3D Curved 1.5K AMOLED', 'Processor': 'MediaTek Dimensity 8200', 'Rear Camera': '50MP Front & 50MP ZEISS Back Sensor', 'Battery': '5000 mAh with 80W Charger' }
  },
  {
    id: 'prod_m12', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Oppo Reno 11 Pro 5G (Pearl White)',
    desc: 'Stunning luxury pearl textured glass back phone, sleek and thin body, and highly cinematic portrait focusing mode.',
    img: 'https://images.unsplash.com/photo-1565849563525-4571de428e26?auto=format&fit=crop&q=80&w=800',
    price: 480, disc: 10, rating: 4.4, reviews: 31,
    specs: { 'Display': '6.7 in FHD+ Curved 120Hz display', 'Processor': 'MediaTek Dimensity 8200', 'Rear Camera': '50MP IMX890 OIS + 32MP Portrait OIS', 'Battery': '4600 mAh with 80W Flash charge' }
  },
  {
    id: 'prod_m13', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'POCO X6 Pro 5G (Racing Yellow)',
    desc: 'Extreme processor performance beast featuring high speed storage protocols, dual cooling chambers, and customized custom gamer triggers.',
    img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800',
    price: 310, disc: 15, rating: 4.5, reviews: 82,
    specs: { 'Display': '6.67 in Flow AMOLED 120Hz', 'Processor': 'MediaTek Dimensity 8300-Ultra', 'Rear Camera': '64MP Triple OIS', 'Battery': '5000 mAh with 67W Charger' }
  },
  {
    id: 'prod_m14', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Google Pixel 8a (Bay Blue)',
    desc: 'The best of Google pure Android software experience, custom AI photo magic eraser tools, and water-resistant scratch-free body.',
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    price: 520, disc: 8, rating: 4.7, reviews: 106,
    specs: { 'Display': '6.1 in Actua 120Hz OLED', 'Processor': 'Google Tensor G3 security core', 'Rear Camera': '64MP Main + 13MP ultra-wide lens', 'Battery': 'Sustains 24+ hours adaptive battery' }
  },
  {
    id: 'prod_m15', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Lava Agni 2 5G (Glass Viridian)',
    desc: 'Proudly made-in-India premium smartphone boasting a super-premium curved AMOLED screen, glass back finish, and pure clean UI with zero ads.',
    img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800',
    price: 230, disc: 10, rating: 4.4, reviews: 63,
    specs: { 'Display': '6.78 in FHD+ 3D Curved 120Hz AMOLED', 'Processor': 'MediaTek Dimensity 7050', 'Rear Camera': '50MP Quad camera setup', 'Battery': '4700 mAh with 66W charging support' }
  },
  {
    id: 'prod_m16', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Tecno Pova 6 Pro 5G (Comet Green)',
    desc: 'Stunning futuristic cyber design with multi-mode mini LED lights strip, extreme RAM expander, and fully dual gaming stereo speaker.',
    img: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&q=80&w=800',
    price: 220, disc: 5, rating: 4.2, reviews: 33,
    specs: { 'Display': '6.78 in FHD+ AMOLED 120Hz', 'Processor': 'MediaTek Dimensity 6080', 'Rear Camera': '108MP Dual AI shooter', 'Battery': '6000 mAh battery + 70W Ultra Charge' }
  },
  {
    id: 'prod_m17', cat: 'cat_mobiles', sel: 'seller_1',
    name: 'Infinix Note 40 Pro 5G (Vintage Green)',
    desc: 'Affordable wireless charging pioneer featuring professional magnetic charging ring, curved screen, and specialized sound by JBL.',
    img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=800',
    price: 260, disc: 10, rating: 4.3, reviews: 40,
    specs: { 'Display': '6.78 in 120Hz 3D Curved AMOLED', 'Processor': 'MediaTek Dimensity 7020 5G', 'Rear Camera': '108MP OIS Zoom', 'Battery': '5000 mAh battery + 45W wire / 20W mag charging' }
  }
];

const rawElectronics: RawProfile[] = [
  {
    id: 'prod_e1', cat: 'cat_electronics', sel: 'seller_1',
    name: 'boAt Airdopes 131 Pro Wireless Earbuds',
    desc: 'India\'s crowd favorite true wireless earbuds engineered with signature heavy bass, IPX4 sweat shield, 40 hours long backup, and instant wake-and-pair Bluetooth tech.',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    price: 22, disc: 30, rating: 4.4, reviews: 812,
    specs: { 'Drivers': '11mm Dynamic Signature Drivers', 'Sustenance': 'Up to 40 hours with charging dock case', 'Latency': 'Beast mode 60ms minimal audio delay', 'Protection': 'IPX4 Splash and sweat defense shell' }
  },
  {
    id: 'prod_e2', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Sony WH-1000XM5 Premium Noise Cancelling Headphone',
    desc: 'Award-winning active noise cancelling headphones equipped with independent dual processor auto VC technology, and smart atmospheric pressure adaptation.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    price: 349, disc: 10, rating: 4.9, reviews: 145, isAi: true,
    specs: { 'Noise Cancelling': 'HD Noise Cancelling Processor QN1', 'Microphones': '8 multi-directional voice isolation mics', 'Audio Quality': 'LDAC and Hi-Res Wireless Certified', 'Smart Voice': 'Speak-to-Chat automatic sensor pause' }
  },
  {
    id: 'prod_e3', cat: 'cat_electronics', sel: 'seller_1',
    name: 'HP Pavilion 15 (Ryzen 5 Productivity Edition)',
    desc: 'Sleek, lightweight executive laptop packing AMD processor power, micro-edge anti-glare display, premium backlighting, and dual audio by B&O.',
    img: 'https://images.unsplash.com/photo-1496181130204-7552cc154bb5?auto=format&fit=crop&q=80&w=800',
    price: 599, disc: 12, rating: 4.6, reviews: 110,
    specs: { 'Processor': 'AMD Ryzen 5 5625U (Up to 4.3 GHz)', 'Storage': '16GB DDR4 RAM + 512GB PCIe NVMe SSD', 'Display': '15.6 in Full HD IPS anti-glare micro-edge', 'OS': 'Pre-installed Windows 11 Home & MS Office 2021' }
  },
  {
    id: 'prod_e4', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Noise ColorFit Pulse 3 Smartwatch',
    desc: 'Elegant lifestyle smartwatch tracking real-time SPO2 blood levels, heart metrics, daily footsteps, sleep cycles, and customizable 150+ aesthetic dial faces.',
    img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
    price: 29, disc: 20, rating: 4.3, reviews: 254,
    specs: { 'Display': '1.96 in Vibrant Color TFT touch display', 'Battery': 'Up to 7 continuous days with active logging', 'Health Track': '24x7 Heart-rate monitoring, Stress meter', 'Sports Mode': '100+ multi-sport athletic log modes' }
  },
  {
    id: 'prod_e5', cat: 'cat_electronics', sel: 'seller_1',
    name: 'SanDisk Extreme 1TB Portable Rugged SSD',
    desc: 'Tough pocket-sized NVMe solid state drive with high read/write speed, robust IP55 water and dust defenses, and secure hardware encryption tool.',
    img: 'https://images.unsplash.com/photo-1597872200319-382d74619a6c?auto=format&fit=crop&q=80&w=800',
    price: 115, disc: 5, rating: 4.8, reviews: 201,
    specs: { 'Read Speed': 'Up to 1050 MB/s high durability', 'Write Speed': 'Up to 1000 MB/s continuous writing', 'Drop Protection': 'Up to 3-meter shock resistance shell', 'Encryption': '256-bit AES cryptographic locked software' }
  },
  {
    id: 'prod_e6', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    desc: 'Highly acclaimed developer, designer and productivity mouse with electromagnetic scrolling wheel, silent click, and precise 8K DPI tracking.',
    img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800',
    price: 99, disc: 0, rating: 4.8, reviews: 94,
    specs: { 'Tracking': 'Darkfield sensor tracking up to 8000 DPI', 'Scroller': 'Bespoke MagSpeed Electromagnetic Wheel', 'Battery': 'Rechargeable USB-C last 70 days on full charge', 'Custom Controls': 'Gestures and app-specific software bindings' }
  },
  {
    id: 'prod_e7', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Apple iPad Air 11-Inch (M2 Power Chip)',
    desc: 'Uncompromised performance packing Apple’s M2 graphics engine, high-res Liquid Retina panel, compatible Apple Pencil support, and full-day battery life.',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    price: 599, disc: 5, rating: 4.9, reviews: 118, isAi: true,
    specs: { 'Processor': 'Apple M2 octacore ultra chip', 'Display': '11 in Liquid Retina with True Tone wide color', 'Front Camera': 'Landscape 12MP Ultra Wide with Center Stage', 'Wireless': 'Superfast WiFi 6E + cellular options' }
  },
  {
    id: 'prod_e8', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Canon EOS R100 Mirrorless Content Camera',
    desc: 'Compact beginner-friendly mirrorless system with large CMOS sensor, fast eye tracking auto-focus, and dual wireless phone synchronization app.',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    price: 499, disc: 12, rating: 4.5, reviews: 39,
    specs: { 'Sensor': '24.1 Megapixel APS-C CMOS high resolution', 'Lens System': 'Integrated RF-S 18-45mm F4.5-6.3 IS STM', 'Video Capabilities': 'Smooth 4K video recording up to 24p', 'Connectivity': 'Built-in Bluetooth and high fidelity WiFi' }
  },
  {
    id: 'prod_e9', cat: 'cat_electronics', sel: 'seller_1',
    name: 'TP-Link Deco S7 AC1900 Whole Home Mesh WiFi',
    desc: 'High speed coverage mesh routers that eliminate dead signal zones across villas, multi-floor bungalows or large Indian apartments.',
    img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: 119, disc: 15, rating: 4.6, reviews: 74,
    specs: { 'Speed Band': 'Dual Band AC1900 high wireless speed', 'Physical Ports': '3 Gigabit Ethernet ports per modular beacon Unit', 'Capacity': 'Supports connection up to 100 devices easily', 'Setup': 'Step-by-step guidance Deco smartphone GUI app' }
  },
  {
    id: 'prod_e10', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Boult Audio Z45 True Wireless Earbuds',
    desc: 'Tough regional gamer styled ear accessories with glowing chassis indicator, extreme fast-charging support, and built-in environmental noise cancellation.',
    img: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800',
    price: 19, disc: 20, rating: 4.1, reviews: 304,
    specs: { 'Bluetooth': 'Version 5.3 instant power-on pair', 'Latency': 'Ultra-low 45ms Combat Game Audio mode', 'Playtime': 'Holds up to 35 hours combined backup', 'Mic System': 'Quad mic system with smart noise cancel' }
  },
  {
    id: 'prod_e11', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Dell S2721QS 27-Inch 4K UHD IPS Monitor',
    desc: 'Stunning lifestyle monitor featuring elegant textured back side, fully adjustable height base, dual HDMI ports, and built-in certified audio speaker.',
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: 299, disc: 8, rating: 4.7, reviews: 65,
    specs: { 'Display': '27 in 4K IPS UHD resolution 3845x2160', 'Color Depth': '99% sRGB color coverage standard', 'Refresh Rate': 'AMD FreeSync smooth gameplay support', 'Protection': 'ComfortView certified flicker-free tech' }
  },
  {
    id: 'prod_e12', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Zebronics Zeb-Juke Bar 9700 Soundbar',
    desc: 'High fidelity audio bar with wireless subwoofer, certified Dolby Atmos integration, pristine vocal clarity presets, and modern HDMI-eARC connectivity.',
    img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    price: 179, disc: 15, rating: 4.4, reviews: 140,
    specs: { 'Output': '450W power packing deep ground subwoofer', 'Audio Decode': 'Dolby Atmos hardware cinematic decode', 'Inputs': 'True digital optical, USB, Bluetooth, HDMI-eARC', 'Drivers': 'Quad mid-range and dual dynamic tweeters' }
  },
  {
    id: 'prod_e13', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Portronics Ruffpad 15 Handheld Writing Slate',
    desc: 'Popular environmentally friendly rewritable digital board for family kids drawing, grocery quick listings, and student math notes calculations.',
    img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800',
    price: 15, disc: 10, rating: 4.3, reviews: 290,
    specs: { 'Screen Canvas': '15-inch robust paperless liquid crystal panel', 'Pen': 'Pressure sensitive precise drawing stylus pen', 'Sustenance': 'Replaceable CR2032 state coin energy cell', 'Ergonomics': 'One click instant clear screen button lock' }
  },
  {
    id: 'prod_e14', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Seagate Expansion 2TB External Hard Disk Drive',
    desc: 'Massive high capacity backup block designed for students and working professionals. Ready to use on Windows with high speed USB 3.0 cables.',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    price: 69, disc: 5, rating: 4.5, reviews: 122,
    specs: { 'Capacity': '2TB high security file volume space', 'Transfer': 'Plug-and-play USB 3.0 drag data streams', 'Weight': 'Ultra compact pocket sizing travel friendly', 'Warranty': 'Includes three years data recovery coverage service' }
  },
  {
    id: 'prod_e15', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Crucial 16GB DDR5 4800MHz Laptop RAM Memory',
    desc: 'Speed up compute loading, gaming loops, browser multitasking, and heavy local operations on laptop hardware.',
    img: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800',
    price: 55, disc: 0, rating: 4.7, reviews: 41,
    specs: { 'Capacity': '16GB memory hardware module stick', 'Core Speed': 'DDR5 4800MT/s high frequency', 'Bandwidth': '1.5x speed increase over legacy DDR4 RAM', 'Working Voltage': 'Low power 1.1V high-efficiency architecture' }
  },
  {
    id: 'prod_e16', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Sennheiser HD 599 Open Back Audiophile Headphone',
    desc: 'Premium open-backed acoustic architecture presenting exceptional three-dimensional lifelike soundscape, gold plated jacks, and luxury velour ear fittings.',
    img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
    price: 145, disc: 10, rating: 4.8, reviews: 72,
    specs: { 'Impedance': '50 Ohms professional soundstage standard', 'Transducers': '38mm custom high fidelity proprietary drivers', 'Cable Fit': '3-meter detachable audio jack cable included', 'Ear Cups': 'Replaceable plush brown velvet ear cushioning' }
  },
  {
    id: 'prod_e17', cat: 'cat_electronics', sel: 'seller_1',
    name: 'Razer BlackWidow V3 Mechanical Gaming Keyboard',
    desc: 'Ultra-responsive tactile clicking switches, rich customizable color accents, and soft padded wrist pillow backing for marathon gaming loops.',
    img: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&q=80&w=800',
    price: 129, disc: 5, rating: 4.6, reviews: 50,
    specs: { 'Switch Type': 'Razer Green tactile clicky switches', 'Illumination': 'Razer Chroma RGB custom profile bindings', 'Keycaps': 'Double-shot tough ABS wear-resistant caps', 'Interface': 'Durable braided USB wired network connection' }
  }
];

const rawFashion: RawProfile[] = [
  {
    id: 'prod_f1', cat: 'cat_fashion', sel: 'seller_2',
    name: 'FabIndia Handloom Fine Khadi Cotton Kurta',
    desc: 'Crafted from authentic hand-spun ethnic fine Indian cotton. Features a comfortable straight structure, traditional side pocket insertions, and breathable daily wear tailoring.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    price: 29, disc: 5, rating: 4.5, reviews: 142, isAi: true,
    specs: { 'Material': '100% Hand-woven Khadi craft Cotton', 'Weave Sourcing': 'In cooperation with village craft societies', 'Fit Style': 'Regular straight fit traditional design panel', 'Washing Rules': 'Gentle separate handwash with organic soap' }
  },
  {
    id: 'prod_f2', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Roadster Men Regular Casual Indigo Denim Shirt',
    desc: 'Timeless lightweight indigo denim dye, twin chest pocket compartments, and snap button fasteners giving the perfect casual outdoor layout.',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    price: 18, disc: 20, rating: 4.2, reviews: 310,
    specs: { 'Fabric Composition': '100% pure premium raw cotton denim', 'Neck Collar': 'Classic spread casual collar', 'Styling Pattern': 'Curved baseline, slim-fit silhouette', 'Fabric thickness': 'Medium heavy wash wear durability' }
  },
  {
    id: 'prod_f3', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Biba Embroidered Women Anarkali Ethnic Suit Set',
    desc: 'Celebrate auspicious festivals with luxurious thread-embroidered floor-length apparel, combined matching churidar bottoms and elegant designer sheer dupatta.',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    price: 72, disc: 15, rating: 4.7, reviews: 88, isAi: true,
    specs: { 'Textile Mix': 'Raw art silk coupled with fine mulmul lining', 'Handicraft': 'Traditional gota patti floral border work', 'Dupatta Material': '2.5-meter delicate georgette sheet with tassels', 'Aesthetic Code': 'Royal festive ruby gold design palette' }
  },
  {
    id: 'prod_f4', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Puma Smashic Retro Unisex Sneakers',
    desc: 'Inspired by iconic tennis models. Tough leather outer shield, signature clean Puma side strip, and cushioning soft-foam inner soles.',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    price: 49, disc: 10, rating: 4.4, reviews: 182,
    specs: { 'Outer Shell': 'High grade tumbled synthetic leather coat', 'Inner Cushion': 'SoftFoam+ optimal comfort walking pad', 'Tread Pattern': 'Fully non-slip vulcanized grip rubber sole', 'Styling Finish': 'Low profile clean street design' }
  },
  {
    id: 'prod_f5', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Safari Pentagon Polypropylene Cabin Trolley (65cm)',
    desc: 'Extremely resilient scratch-free hardshell rolling suitcase featuring security lock, dual smooth spinning wheels, and expandable central zipper.',
    img: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&q=80&w=800',
    price: 45, disc: 40, rating: 4.5, reviews: 290,
    specs: { 'Material': '100% Ultra resilient light polypropylene', 'Wheels Layout': '360-degree silent dynamic multi-spinner wheels', 'Safety Lock': 'Integrated TSA lock combo safe structure', 'Internal Divider': 'Internal mesh pocket organizers and belt straps' }
  },
  {
    id: 'prod_f6', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Titan Regalia Classic Chronograph Watch',
    desc: 'A gorgeous brass-gold mesh strap watch with sophisticated calendar dials, scratch-proof high reflection sapphire glass, and premium jewelry lock clasp.',
    img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    price: 110, disc: 8, rating: 4.7, reviews: 112,
    specs: { 'Engine Type': 'Precision battery analog quartz movement', 'Dial Color': 'Classic imperial beige dial face', 'Chassis Material': 'Anti rust stainless steel double gold plate', 'Water defenses': 'Holds up water seals up to 50 meters' }
  },
  {
    id: 'prod_f7', cat: 'cat_fashion', sel: 'seller_2',
    name: 'W for Woman Floral Printed Cotton Kurti',
    desc: 'Smart, contemporary round neck top tailored in comfortable cotton. Ideal for daily Indian summer office wear and college styling.',
    img: 'https://images.unsplash.com/photo-1609357518652-6cf0416f0cbe?auto=format&fit=crop&q=80&w=800',
    price: 24, disc: 5, rating: 4.3, reviews: 54,
    specs: { 'Fabric': '100% Breathable light weave cotton', 'Theme': 'Delicate floral block printing design', 'Sleeve Length': 'Smart three-quarter folding sleeve panels', 'Hemline Mode': 'A-line geometric flare side slits' }
  },
  {
    id: 'prod_f8', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Levi\'s Men 511 Slim Fit Stretchable Jeans',
    desc: 'The benchmark modern denim fit with comfortable stretch, anti-sagging premium fibers, and genuine copper rivets strengthening.',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    price: 39, disc: 12, rating: 4.5, reviews: 210,
    specs: { 'Blend Sourcing': '99% organic cotton combined with 1% elastane', 'Silhouette Model': 'Slightly tapered slim fit with zip fly', 'Stitch Detail': 'Heavy double edge gold contrast thread lines' }
  },
  {
    id: 'prod_f9', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Allen Solly Men Formal Oxford Dress Shirt',
    desc: 'Crisp, easy-to-iron pure formal button-down shirt designed with structural collar support for comfortable under-suit corporate wear.',
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    price: 28, disc: 10, rating: 4.4, reviews: 78,
    specs: { 'Cloth Type': 'Cotton-blend fine premium woven texture', 'Fitting Sizing': 'Clean slim corporate silhouette fitting', 'Collar style': 'Regular stiff spread executive collar' }
  },
  {
    id: 'prod_f10', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Woodland Rugged High-Ankle Leather Hiking Boots',
    desc: 'Indestructible nubuck leather boots designed with thick grooved slip-resistant soles, steel lace eyelets, and sweat absorbent interiors.',
    img: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800',
    price: 85, disc: 5, rating: 4.8, reviews: 145,
    specs: { 'Material': 'Genuine premium heavy thick animal hide hide', 'Sole Type': 'Deep tread lug TPR robust rubber padding', 'Ankle Guard': 'Inlaid high dense memory foam secure collar' }
  },
  {
    id: 'prod_f11', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Lavie Large Faux-Leather Dual-Strap Tote Bag',
    desc: 'Capacious women\'s workplace essential with three secure zippered chambers, gold-toned metal attachments, and soft textured exterior.',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    price: 32, disc: 20, rating: 4.3, reviews: 92,
    specs: { 'Material': 'Premium durable 100% vegan saffiano polyurethane', 'Storage Space': 'Includes two tablet slips and secret card vault', 'Belt straps': 'Comes with adjustable matching cross-sling strap' }
  },
  {
    id: 'prod_f12', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Ray-Ban Classic Gold Aviator Sunglasses',
    desc: 'World famous structural metal golden frames boasting custom certified green glass lenses blocking 100% harmful ultraviolet rays.',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    price: 149, disc: 5, rating: 4.8, reviews: 103,
    specs: { 'Frame Sizing': 'Medium 58mm metal sleek alloy frame', 'Lens coating': 'Non-polarized crystal protection film layer' }
  },
  {
    id: 'prod_f13', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Sabyasachi Heritage Silk Banarasi Saree',
    desc: 'Exquisite ceremonial pure silk masterpiece hand-loomed with gold and silver zari thread embroidery depicting legacy flora-fauna patterns.',
    img: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    price: 399, disc: 10, rating: 4.9, reviews: 34, isAi: true,
    specs: { 'Base Saree': '6.1-meter genuine premium mulberry silk', 'Zari Work': '24-karat copper wire gold gold-plated spool threads', 'Color Scheme': 'Royal vermillion crimson gold leaf motif' }
  },
  {
    id: 'prod_f14', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Campus OXYFIT Light-Jog Air Running Shoes',
    desc: 'Native Indian athletic shoes engineered with high breathable mesh holes, soft shock-absorbent spring soles, and low weight fit.',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
    price: 25, disc: 12, rating: 4.1, reviews: 120,
    specs: { 'Upper Fabric': 'Engineered single-sheet air-mesh web fabric', 'Midsole': 'Phylon spring responsive foam pad' }
  },
  {
    id: 'prod_f15', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Puma Gym Dry-Fit Men Sports Athletic Shorts',
    desc: 'Sweat-wicking micro-weave athletic shorts designed with internal drawcord adjustable band, secure phone zipper, and elastic groin stretch fabric.',
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    price: 18, disc: 15, rating: 4.3, reviews: 49,
    specs: { 'Material': 'Recycled polyester with smart drycell properties' }
  },
  {
    id: 'prod_f16', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Fastrack Reflex Beat Fitness smart band',
    desc: 'Trendy sports wearable boasting continuous sleep quality tracker, instant smart call notification vibration alerts, and IP67 splash safety.',
    img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=800',
    price: 35, disc: 5, rating: 4.2, reviews: 65,
    specs: { 'Display': '0.96 in customizable custom color touch panel' }
  },
  {
    id: 'prod_f17', cat: 'cat_fashion', sel: 'seller_2',
    name: 'Baggit Handheld Women Clutch Sling Bag',
    desc: 'Compact textured elegant leather alternative clutch featuring multiple cash card flaps, lightweight construction, and cross-body gold chain.',
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a6b0?auto=format&fit=crop&q=80&w=800',
    price: 22, disc: 8, rating: 4.4, reviews: 50,
    specs: { 'Interiors': 'Cruelty-free faux leather layout compartments' }
  }
];

const rawGrocery: RawProfile[] = [
  {
    id: 'prod_g1', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Ashirvaad Shudh Chakki Atta (10kg)',
    desc: '100% stone-ground whole wheat grain flour. Restores natural fibers and absolute cleanliness, ensuring soft, golden, puffed-up home chapatis daily.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    price: 8, disc: 5, rating: 4.7, reviews: 920,
    specs: { 'Net Weight': '10 kg heavy sack packing', 'Grains Source': 'Premium Sharbati fields, Madhya Pradesh, India', 'Nutrition': 'Full natural dietary bran fibers retained', 'Processing': 'Traditional mechanical stone grinding mills' }
  },
  {
    id: 'prod_g2', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Fortune Premium Kachi Ghani Mustard Oil (1L)',
    desc: 'Traditional high-pungency cold-pressed pure mustard oil. Essential for authentic, aromatic regional Indian cooking and vegetable pickle preservations.',
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    price: 3, disc: 10, rating: 4.6, reviews: 403,
    specs: { 'Volume': '1 Litre durable PET bottle', 'Extraction Method': 'Cold pressed raw yellow mustard seed processing', 'Acid Value': 'Zero additives, totally chemical free composition' }
  },
  {
    id: 'prod_g3', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Taj Mahal Premium Black Tea Jar (500g)',
    desc: 'The gold standard of Indian loose-leaf black tea. Matured tea leaves producing unmatched rich dark orange liquor and rich aroma hints.',
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    price: 6, disc: 5, rating: 4.8, reviews: 312, isAi: true,
    specs: { 'Format': '500g secure reusable plastic jar container', 'Leaves Blend': 'Selected premium early-born Assam garden leaves', 'Prepping style': 'Best brewed with fresh hot milk & cardamom spices' }
  },
  {
    id: 'prod_g4', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Tata Iodized Vacuum Evaporated Salt (1kg)',
    desc: 'Known as the trustworthy "Salt of India". Purified salt with essential required iodine supplement to take care of family metabolic growth.',
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    price: 0.5, disc: 0, rating: 4.9, reviews: 1012,
    specs: { 'Quantity': '1 kg standard safety pouch pack', 'Moisture Limit': 'Vacuum evaporated ultra-dry fine crystals' }
  },
  {
    id: 'prod_g5', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Catch Traditional Sambhar Masala Powder (100g)',
    desc: 'Made with authentic handpicked local Indian spices dried on low temperature systems to preserve their raw fragrance oils.',
    img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800',
    price: 1.5, disc: 10, rating: 4.5, reviews: 142,
    specs: { 'Net Weight': '100g cardboard pouch container packing', 'Spices Composition': 'Dry coriander, cumin seeds, raw curry leaves, fenugreek' }
  },
  {
    id: 'prod_g6', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Maggi 2-Minute Masala Noodles (Mega Pack of 12)',
    desc: 'India\'s beloved universal quick hot grain noodles. Indulge in classic comforting spices recipe ready within 2-3 minutes of boiling.',
    img: 'https://images.unsplash.com/photo-1612966608967-302fc37d941a?auto=format&fit=crop&q=80&w=800',
    price: 2.5, disc: 5, rating: 4.8, reviews: 812,
    specs: { 'Bundle Sizing': 'Mega Pack holding 12 single noodle blocks', 'Seasoning': 'Includes 12 signature tastemaker spice packets' }
  },
  {
    id: 'prod_g7', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Daawat Rozana Super Basmati Long Rice (5kg)',
    desc: 'Premium long grains that expand up to 2x on cooking, producing fluffy texture ideal for family vegetable pulao and biryani dishes.',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    price: 9, disc: 15, rating: 4.6, reviews: 290,
    specs: { 'Weight Volume': '5 kg heavy protection pouch bag', 'Rice Type': 'Rozana select mid-long Basmati grains' }
  },
  {
    id: 'prod_g8', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Amul Pure Indian Cow Ghee Tetrapack (1L)',
    desc: 'Aromatic clarified butter made from fresh dairy cream. Renowned across India for its delicious taste, pure golden grain texture, and immune support properties.',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    price: 12, disc: 4, rating: 4.9, reviews: 540, isAi: true,
    specs: { 'Pack Structure': '1 Litre airtight multi-layer tetrapack', 'Fats Depth': '99.7% pure milk fats with zero artificial preservatives' }
  },
  {
    id: 'prod_g9', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Direct From Farm Ground Turmeric Shards (250g)',
    desc: 'Pure, golden high-curcumin spice ground directly from solar dry turmeric shards. Anti-inflammatory spice perfect for daily family meals.',
    img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    price: 1.5, disc: 15, rating: 4.7, reviews: 93,
    specs: { 'Curcumin Content': 'Minimum 4.5% high healing properties' }
  },
  {
    id: 'prod_g10', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Haldiram\'s Nagpur Fine Kaju Katli (500g)',
    desc: 'Premium traditional Indian cashew diamonds cooked in pure clarified fat, decorated with real edible silver foil.',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    price: 11, disc: 5, rating: 4.8, reviews: 112,
    specs: { 'Quantity Weight': '500g elegant festive cardboard gift box' }
  },
  {
    id: 'prod_g11', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Dabur Honey Easy Squeezy Bottle (400g)',
    desc: '100% pure tested honey. Helps support metabolism, naturally sweet, packed in dynamic drip-free squeezy lock bottle.',
    img: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800',
    price: 4, disc: 10, rating: 4.5, reviews: 180,
    specs: { 'Packaging': '400g nozzle squeeze plastic dispenser' }
  },
  {
    id: 'prod_g12', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Nescafe Classic Instant Coffee Jar (100g)',
    desc: 'Classic visual dark coffee beans blended perfectly for morning instant dynamic energy. Rich double-roast coffee aroma.',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    price: 4.5, disc: 5, rating: 4.6, reviews: 290,
    specs: { 'Contents': '100% select Robusta coffee soluble granules' }
  },
  {
    id: 'prod_g13', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Saffola Gold Healthy Blended Cooking Oil (5L)',
    desc: 'Premium heart-healthy cooking helper blending 70% physical refined rice bran oil and 30% refined safflower oil.',
    img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    price: 13, disc: 8, rating: 4.5, reviews: 165,
    specs: { 'Capacity Volume': '5 Litre rugged handy plastic can container' }
  },
  {
    id: 'prod_g14', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Cadbury Dairy Milk Silk Chocolate (150g)',
    desc: 'Smooth, creamy, delicious chocolate silk bar. Made with high quality cocoa to indulge sweet tooth cravings instantly.',
    img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800',
    price: 2, disc: 0, rating: 4.8, reviews: 320,
    specs: { 'Weight': '150g golden foil outer wrap packaging' }
  },
  {
    id: 'prod_g15', cat: 'cat_grocery', sel: 'seller_3',
    name: 'MTR Ready-To-Eat Paneer Butter Masala (300g)',
    desc: 'Authentic Indian style cottage cheese cooked in buttery cream and tomato broth. No artificial colors. Simply heat and enjoy!',
    img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800',
    price: 2, disc: 12, rating: 4.3, reviews: 88,
    specs: { 'Portion Size': '300g retor pouch server (Serves 2-3)' }
  },
  {
    id: 'prod_g16', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Happilo Premium California Whole Almonds (200g)',
    desc: 'Crisp wholesome highly nutritious almonds rich in Vitamin E, minerals, and healthy fats. Vacuum packed dry snack.',
    img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6cd9?auto=format&fit=crop&q=80&w=800',
    price: 5, disc: 15, rating: 4.7, reviews: 132,
    specs: { 'Pack Type': '200g resealable freshness ziplock bag' }
  },
  {
    id: 'prod_g17', cat: 'cat_grocery', sel: 'seller_3',
    name: 'Real Activ 100% Orange Juice Tetrapack (1L)',
    desc: 'No added artificial cane sugars, zero preservative stabilizers. Loaded with natural pure visual citrus Vitamin C pulp.',
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=800',
    price: 2, disc: 10, rating: 4.4, reviews: 90,
    specs: { 'Packaging Volume': '1 Litre handy carton storage block' }
  }
];

const rawBooks: RawProfile[] = [
  {
    id: 'prod_b1', cat: 'cat_books', sel: 'seller_4',
    name: 'The God of Small Things by Arundhati Roy',
    desc: 'The historic classic Booker Prize-winning novel that beautifully portrays the twin lives of twins Estha and Rahel in rural Kerala, crafting structural prose and powerful emotional themes.',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 11, disc: 20, rating: 4.8, reviews: 145,
    specs: { 'Format': 'Paperback original print version', 'Publisher': 'Penguin India Modern Classics edition', 'Total Page Count': '340 pages readable volume', 'Language': 'English' }
  },
  {
    id: 'prod_b2', cat: 'cat_books', sel: 'seller_4',
    name: 'Wings of Fire: APJ Abdul Kalam Autobiography',
    desc: 'Inspiring personal history chronicle of Dr. APJ Abdul Kalam, tracing his rise from a humble island home town boy in Rameswaram to the father of Indian missile development technology and President.',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    price: 5.5, disc: 10, rating: 4.9, reviews: 450, isAi: true,
    specs: { 'Binding': 'Softcover paperback robust binding', 'Publisher': 'Universities Press India publication', 'Pages': '180 pages including historic raw photo inserts' }
  },
  {
    id: 'prod_b3', cat: 'cat_books', sel: 'seller_4',
    name: 'Train to Pakistan by Khushwant Singh (Illustrated)',
    desc: 'A grim, touching, and human story of a border town during the chaotic India Partition of 1947, depicting love, local loyalty, and tragedy beyond political lines.',
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    price: 4.9, disc: 15, rating: 4.7, reviews: 98,
    specs: { 'Format': 'Collector\'s illustrated luxury paper back', 'Publisher': 'Roli Books Private Limited', 'Total Pages': '208 print pages' }
  },
  {
    id: 'prod_b4', cat: 'cat_books', sel: 'seller_4',
    name: 'The White Tiger by Aravind Adiga (Harper India)',
    desc: 'Winner of the Man Booker Prize. A dark comedy narrative analyzing societal class battles, raw ambition, and village migration written in the form of letters.',
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    price: 9, disc: 20, rating: 4.5, reviews: 180,
    specs: { 'Format': 'Standard paperback classic style', 'Publisher': 'HarperCollins India publication' }
  },
  {
    id: 'prod_b5', cat: 'cat_books', sel: 'seller_4',
    name: 'Atomic Habits by James Clear (Indian Edition)',
    desc: 'The global blockbuster psychology workbook outlining dynamic micro frameworks to dismantle bad routines, construct continuous productive habits and optimize results.',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: 13, disc: 15, rating: 4.9, reviews: 910, isAi: true,
    specs: { 'Format': 'Special low-priced paper back, Indian subcontinent edition', 'Language': 'English' }
  },
  {
    id: 'prod_b6', cat: 'cat_books', sel: 'seller_4',
    name: 'Ignited Minds: Unleashing APJ Abdul Kalam',
    desc: 'A clarion call to action dedicated to the youth of India, discussing how to overcome self-doubts and rebuild the nation as a technological global superpower.',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    price: 6, disc: 5, rating: 4.8, reviews: 290,
    specs: { 'Publisher': 'Penguin Random House India', 'Pages': '220 pages text volume' }
  },
  {
    id: 'prod_b7', cat: 'cat_books', sel: 'seller_4',
    name: 'The Immortals of Meluha by Amish Tripathi',
    desc: 'Fascinating modern mythological re-imagining of Lord Shiva as a simple tribal warrior migrating to the advanced empire of Meluha.',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 8.5, disc: 10, rating: 4.6, reviews: 210,
    specs: { 'Format': 'Book 1 of Shiva Trilogy, soft back cover' }
  },
  {
    id: 'prod_b8', cat: 'cat_books', sel: 'seller_4',
    name: 'Chanakya Neeti translated by B. Chaturvedi',
    desc: 'Essential aphorisms of Chanakya, the great minister who founded the Maurya Empire. Filled with eternal pearls of statecraft, personal wealth, and ethics.',
    img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    price: 3.5, disc: 0, rating: 4.4, reviews: 93,
    specs: { 'Format': 'Compact student edition paper back, Diamond Books' }
  },
  {
    id: 'prod_b9', cat: 'cat_books', sel: 'seller_4',
    name: 'Rich Dad Poor Dad (Hindi Translation)',
    desc: 'The absolute bestseller classic on lessons of master financial literacy, investing, and cash flow assets creation.',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: 9.9, disc: 12, rating: 4.8, reviews: 140,
    specs: { 'Language': 'Hindi translation edition', 'Binding': 'Sleek paperback cover' }
  },
  {
    id: 'prod_b10', cat: 'cat_books', sel: 'seller_4',
    name: 'Sapiens: A Brief History of Humankind',
    desc: 'Yuval Noah Harari\'s sweeping narrative charting human evolutionary steps, from early stone age foragers to modern technology builders.',
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    price: 14.5, disc: 10, rating: 4.8, reviews: 310,
    specs: { 'Format': 'Vintage UK Premium Paper back, English' }
  },
  {
    id: 'prod_b11', cat: 'cat_books', sel: 'seller_4',
    name: 'Ikigai: Japanese Secret to Wealth & Health',
    desc: 'Unlock internal balance, discover daily meaningful occupation, and discover structural slow breathing routines for peaceful long lifespans.',
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    price: 9.9, disc: 8, rating: 4.7, reviews: 190,
    specs: { 'Binding': 'Luxury hardback aesthetic cover art, English' }
  },
  {
    id: 'prod_b12', cat: 'cat_books', sel: 'seller_4',
    name: 'An Era of Darkness: The British Empire in India',
    desc: 'Dr. Shashi Tharoor\'s brilliant study detailing the direct negative economic, cultural, and political impacts of historic colonization.',
    img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    price: 11, disc: 15, rating: 4.8, reviews: 88,
    specs: { 'Format': 'Aleph Book Company premium printing, 360 pages' }
  },
  {
    id: 'prod_b13', cat: 'cat_books', sel: 'seller_4',
    name: 'The Palace of Illusions by Chitra Divakaruni',
    desc: 'The immortal classic epic Mahabharata re-told from Draupadi\'s unique voice, capturing internal monologues, and tragic destiny.',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    price: 9, disc: 10, rating: 4.7, reviews: 54,
    specs: { 'Publisher': 'Picador India publication, Soft cover' }
  },
  {
    id: 'prod_b14', cat: 'cat_books', sel: 'seller_4',
    name: 'Malgudi Days by R.K. Narayan (Classic Edition)',
    desc: 'Drawn from classic old Indian magazine stories. Heartwarming simple tales detailing human behaviors in the nostalgic fictional town of Malgudi.',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    price: 6.9, disc: 5, rating: 4.8, reviews: 102,
    specs: { 'Publisher': 'Indian Thought Publications classical series wrapper' }
  },
  {
    id: 'prod_b15', cat: 'cat_books', sel: 'seller_4',
    name: 'Wise and Otherwise by Sudha Murty (Penguin)',
    desc: 'Treasury of touching non-fiction real narratives gathered during social fieldwork across rural Indian villages, highlighting rich human truths.',
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    price: 5.9, disc: 8, rating: 4.9, reviews: 75, isAi: true,
    specs: { 'Binding': 'Soft eco paper back, Penguin Non-Fiction series' }
  },
  {
    id: 'prod_b16', cat: 'cat_books', sel: 'seller_4',
    name: 'Think and Grow Rich (Original Indian Print)',
    desc: 'Napoleon Hill\'s iconic master manual on persistence, brain focus training, and achieving high levels of material and mental wealth.',
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    price: 4, disc: 0, rating: 4.5, reviews: 63,
    specs: { 'Publisher': 'Fingerprint! Publishing India paperback' }
  }
];

const rawHomeAppliances: RawProfile[] = [
  {
    id: 'prod_h1', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Prestige Picolo Induction Cooktop (1600W)',
    desc: 'Compact energy efficient smart glass induction stove featuring custom Indian menu buttons (Dosa/Chapati/Idli), power-saver technology, and child lock safety.',
    img: 'https://images.unsplash.com/photo-1584282479242-537a8435d933?auto=format&fit=crop&q=80&w=800',
    price: 42, disc: 15, rating: 4.4, reviews: 290,
    specs: { 'Power Sizing': '1600W fast heating copper coil', 'Safety Features': 'Anti-magnetic wall and automatic voltage surge shutoff', 'Pre-programmed Cook': 'Curry, Idli, Roti/Chappati, Boiling, Warm' }
  },
  {
    id: 'prod_h2', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Bajaj Majesty Mixer Grinder (750W Titanium)',
    desc: 'Heavy-duty food mixer grinder came with 3 stainless steel jars, tough high-speed steel blades, and double safety lock chassis protection.',
    img: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=800',
    price: 54, disc: 20, rating: 4.5, reviews: 182,
    specs: { 'Engine Rating': '750 Watt fully copper winding motor', 'Jar accessories': '1.5L liquidizing, 1.0L dry grinding, 0.4L chutney jar', 'Speed Levels': '3 speed control knob with micro pulse action' }
  },
  {
    id: 'prod_h3', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'LG 190L 4-Star Smart Refrigerator (Single Door)',
    desc: 'Smart direct-cool single-door refrigerator with eco inverter compressor, beautiful floral glass door design, and direct home solar panel support.',
    img: 'https://images.unsplash.com/photo-1571175484658-5122c4a5831a?auto=format&fit=crop&q=80&w=800',
    price: 249, disc: 12, rating: 4.7, reviews: 104, isAi: true,
    specs: { 'Storage Depth': '190 Liters visual capacity volume', 'Star Rating': '4-Star BEE energy savings certified', 'Compressor': 'Smart inverter compressor silent operation' }
  },
  {
    id: 'prod_h4', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Havells Instanio 3-Litre Instant Geyser Water Heater',
    desc: 'Compact dynamic bathroom water geyser with high density rust-free copper heaters, LED temperature indicator rings, and quick operation.',
    img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
    price: 59, disc: 10, rating: 4.6, reviews: 140,
    specs: { 'Capacity Volume': '3 Liters instant storage volume', 'Inner Tank': 'Heavy thick glass-line coated anti-rust tank', 'Heat Speed': 'Swift 3000W heating element spool' }
  },
  {
    id: 'prod_h5', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Crompton SilentPro Energy-Saver Ceiling Fan',
    desc: 'Brushless DC energy saving motor fan operated with smart remote controller, silent blade contour shape, and low energy draw.',
    img: 'https://images.unsplash.com/photo-1523039644558-2512171350fe?auto=format&fit=crop&q=80&w=800',
    price: 69, disc: 5, rating: 4.5, reviews: 211,
    specs: { 'Motor Principle': 'BLDC motor drawing only 28W at max speed', 'Air Delivery': 'High speed 240 CMM air sweep action', 'Control Type': 'Comes with compact remote controller holding speed timers' }
  },
  {
    id: 'prod_h6', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Philips Daily Collection 4.1L Air Fryer',
    desc: 'Prepare guilt-free crunchy samosas, pakoras and low-fat french fries using Rapid Air technology circulation allowing up to 90% less oil use.',
    img: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=800',
    price: 95, disc: 15, rating: 4.8, reviews: 320, isAi: true,
    specs: { 'Basket capacity': '4.1 Litre heavy grid safety steel basket', 'Cooking speed': 'Up to 1400W fast hot air flow cycle' }
  },
  {
    id: 'prod_h7', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Xiaomi Mi Smart Air Purifier 4 (HEPA Filter)',
    desc: 'High efficiency three-layer HEPA air purifier blocking 99.97% fine smoke particles, cooking exhaust, dust allergens and pet dander.',
    img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
    price: 139, disc: 8, rating: 4.7, reviews: 110,
    specs: { 'Coverage Area': 'Clean delivery CADR up to 400 cubic meters per hour', 'Control': 'Siri / Google Voice Assistant connectivity, Mi Home app control' }
  },
  {
    id: 'prod_h8', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Kent Grand Plus RO+UV Water Purifier',
    desc: 'The absolute standard of wall-mounted active drinking water purification leveraging triple RO, UV, and UF filtration screens.',
    img: 'https://images.unsplash.com/photo-1584282479242-537a8435d933?auto=format&fit=crop&q=80&w=800',
    price: 220, disc: 10, rating: 4.6, reviews: 180,
    specs: { 'Purifier Method': 'Active Reverse Osmosis + Ultra Violet + Mineral Restoring block' }
  },
  {
    id: 'prod_h9', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Eureka Forbes Trendy Steel Vacuum Cleaner',
    desc: 'Compact lightweight canister dry vacuum with powerful suction, blow dust function, and multiple accessory nozzles for keyboards and sofas.',
    img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
    price: 105, disc: 5, rating: 4.3, reviews: 65,
    specs: { 'Engine Suction': 'Powerful 1300W suction turbine motor' }
  },
  {
    id: 'prod_h10', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Sujata Dynamix Robust Mixer-Grinder (900W)',
    desc: 'Highly robust grinding machine popular with local Indian street juice centers. Engineered with continuous continuous use motor support.',
    img: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=800',
    price: 110, disc: 12, rating: 4.9, reviews: 110, isAi: true,
    specs: { 'Motor spec': 'Heavy duty 900W motor with double ball bearings' }
  },
  {
    id: 'prod_h11', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Morphy Richards 24L Oven Toaster Griller (OTG)',
    desc: 'Premium baking accessory featuring adjustable cooking wire grids, rotisserie accessories for skewering, and precise baking heat thermostat.',
    img: 'https://images.unsplash.com/photo-1571175484658-5122c4a5831a?auto=format&fit=crop&q=80&w=800',
    price: 115, disc: 10, rating: 4.5, reviews: 74,
    specs: { 'Chamber Volume': '24 Litre mirror finished steel internal volume' }
  },
  {
    id: 'prod_h12', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Voltas Beko 8 Place Settings Table Dishwasher',
    desc: 'Extremely convenient benchtop dishwasher designed specifically for oily Indian masala pans, steel plates, and food cookware.',
    img: 'https://images.unsplash.com/photo-1584282479242-537a8435d933?auto=format&fit=crop&q=80&w=800',
    price: 299, disc: 15, rating: 4.6, reviews: 42,
    specs: { 'Capacity layout': '8 place cutlery layouts, 6 unique wash programs' }
  },
  {
    id: 'prod_h13', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Godrej Eon 7kg Fully-Automatic Washing Machine',
    desc: 'Top loading clothes cleaning machine with stainless steel drum, multi-pulsator water wave, and smart fuzzy logic load balance sensors.',
    img: 'https://images.unsplash.com/photo-1582730147432-bfbf0166836e?auto=format&fit=crop&q=80&w=800',
    price: 260, disc: 10, rating: 4.4, reviews: 88,
    specs: { 'Washing Volume': '7 kg capacity dry clothes loading' }
  },
  {
    id: 'prod_h14', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'USHA Shriram Light Dry Iron (1000W)',
    desc: 'Classic lightweight heating iron with double-layered anti-stick black soleplate coating, simple thermostat wheel dials, and safety indicators.',
    img: 'https://images.unsplash.com/photo-1523039644558-2512171350fe?auto=format&fit=crop&q=80&w=800',
    price: 14, disc: 0, rating: 4.2, reviews: 201,
    specs: { 'Wattage Power': '1000W fast dry sheet heating filament' }
  },
  {
    id: 'prod_h15', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Dyson V8 Absolute Cordless Vacuum Cleaner',
    desc: 'Premium lightweight cordless vacuum with highly advanced visual anti-tangling engineering, continuous suction trigger, and wall docks.',
    img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
    price: 430, disc: 5, rating: 4.8, reviews: 106,
    specs: { 'Battery system': '6-cell high density lithium energy, 40 min run-time' }
  },
  {
    id: 'prod_h16', cat: 'cat_home_appliances', sel: 'seller_1',
    name: 'Panasonic 20L Solo Microwave Oven (Auto Cook)',
    desc: 'Compact solo microwave oven holding up 51 pre-programmed recipes, simple touch visual buttons, and multi-stage manual defrosting options.',
    img: 'https://images.unsplash.com/photo-1571175484658-5122c4a5831a?auto=format&fit=crop&q=80&w=800',
    price: 99, disc: 8, rating: 4.5, reviews: 120,
    specs: { 'Capacity Volume': '20 Litre volume chamber, 800W heating magnetron' }
  }
];

// Combine all raw arrays to obtain exactly 100 products.
// Let's create duplicates of these base templates with slight variations for each category
// to hit the exact target: 17 + 17 + 17 + 17 + 16 + 16 = 100 products.
const combinedRawProfiles: RawProfile[] = [
  ...rawMobiles,
  ...rawElectronics,
  ...rawFashion,
  ...rawGrocery,
  ...rawBooks,
  ...rawHomeAppliances
];

export const mockProducts: Product[] = combinedRawProfiles.map((p, idx) => {
  // Retain the actual template id
  const nameToSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: p.id,
    sellerId: p.sel,
    categoryId: p.cat,
    name: p.name,
    slug: nameToSlug,
    description: p.desc,
    images: [p.img],
    specs: p.specs,
    basePrice: p.price,
    currentDiscount: p.disc > 0 ? p.disc : undefined,
    averageRating: p.rating,
    reviewCount: p.reviews,
    isAiRecommended: p.isAi
  };
});

// Programmatic variants generation (at least one per product to ensure checkout is solid)
export const mockProductVariants: ProductVariant[] = combinedRawProfiles.flatMap((p) => {
  const isPrismWatch = p.id === 'prod_prism_watch';
  
  if (isPrismWatch) {
    return [
      {
        id: 'var_prism_titanium_space', // Keep name alignment to prevent app crashes
        productId: 'prod_prism_watch',
        sku: 'ONEPLUS-12-EMLD',
        color: 'Flowy Emerald (16GB RAM)',
        price: p.price,
        stock: 14
      },
      {
        id: 'var_prism_titanium_gold',
        productId: 'prod_prism_watch',
        sku: 'ONEPLUS-12-BLK',
        color: 'Silky Black (12GB RAM)',
        price: p.price - 40,
        stock: 6
      }
    ];
  }

  // Base general variants
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8).toUpperCase();
  const baseVar: ProductVariant = {
    id: `var_standard_${p.id}`,
    productId: p.id,
    sku: `IND-${slug}`,
    price: p.price,
    stock: p.id.charCodeAt(p.id.length - 1) % 5 === 0 ? 3 : 25 // low stock test
  };

  if (p.cat === 'cat_fashion') {
    baseVar.size = 'M';
    baseVar.color = 'Standard Colour';
  } else if (p.cat === 'cat_grocery') {
    baseVar.size = p.specs['Net Weight'] || p.specs['Volume'] || p.specs['Quantity'] || '1 Unit';
  }

  return [baseVar];
});

export const mockCoupons: Coupon[] = [
  { code: 'FESTIVE50', discountPercentage: 15, maxDiscountAmount: 30, minOrderValue: 80, expiresAt: '2026-12-31T23:59:59Z' },
  { code: 'DIWALI20', discountPercentage: 20, maxDiscountAmount: 100, minOrderValue: 200, expiresAt: '2026-11-15T23:59:59Z' },
  { code: 'WELCOME10', discountPercentage: 10, maxDiscountAmount: 20, minOrderValue: 30, expiresAt: '2026-07-01T23:59:59Z' }
];

export const mockReviews: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_prism_watch',
    userId: 'user_1',
    userName: 'Karan Mehra',
    rating: 5,
    comment: 'Exceptional flagship delivery. The Emerald model has this breathtaking marble shine. Phone loads heavy apps in milliseconds under Delhi summer. Simply amazing!',
    isVerifiedPurchase: true,
    helpfulVotes: 48,
    sentiment: 'positive',
    sentimentConfidence: 0.99,
    createdAt: '2026-05-20T14:22:00Z'
  },
  {
    id: 'rev_2',
    productId: 'prod_prism_watch',
    userId: 'user_2',
    userName: 'Sneha Rao',
    rating: 4,
    comment: 'Charging is incredibly fast! Literally goes from 10 to 100% in under 28 minutes. Dual Hasselblad cameras produce pristine raw portrait visuals.',
    isVerifiedPurchase: true,
    helpfulVotes: 12,
    sentiment: 'positive',
    sentimentConfidence: 0.92,
    createdAt: '2026-05-25T11:45:00Z'
  },
  {
    id: 'rev_spam',
    productId: 'prod_prism_watch',
    userId: 'user_spammer',
    userName: 'GetRichQuick999',
    rating: 5,
    comment: 'CLICK FAST PROMO FOR BONUS LOYALTY VOUCHER GOTO URL NOW FREE STUFF WOW SUPER SPEEDY CHEAP STUFF!',
    isVerifiedPurchase: false,
    helpfulVotes: 0,
    sentiment: 'positive',
    sentimentConfidence: 0.95,
    isFlaggedFake: true,
    aiReviewSummary: 'Flagged: Non-verified account, repeating aggressive click link patterns, spam keywords detected.',
    createdAt: '2026-06-01T15:10:00Z'
  },
  {
    id: 'rev_e1',
    productId: 'prod_e1',
    userId: 'user_1',
    userName: 'Rohit Deshmukh',
    rating: 5,
    comment: 'For this affordable price, boAt has nailed the bass! Heavy rumbling acoustics, holds full charge for three complete days of team meetings.',
    isVerifiedPurchase: true,
    helpfulVotes: 32,
    sentiment: 'positive',
    sentimentConfidence: 0.97,
    createdAt: '2026-06-03T10:00:00Z'
  },
  {
    id: 'rev_g1_1',
    productId: 'prod_g1',
    userId: 'user_2',
    userName: 'Amita Chawla',
    rating: 5,
    comment: 'Ashirvaad is always my default selection. Dough binds perfectly, doesn\'t dry up, and rottis come out super soft.',
    isVerifiedPurchase: true,
    helpfulVotes: 14,
    sentiment: 'positive',
    sentimentConfidence: 0.98,
    createdAt: '2026-06-04T09:12:00Z'
  },
  {
    id: 'rev_b2_1',
    productId: 'prod_b2',
    userId: 'user_1',
    userName: 'Kunal Sen',
    rating: 5,
    comment: 'This book should be mandatory in every Indian school curriculum. Extremely raw, inspiring, humble, and powerful narration by Dr. Kalam.',
    isVerifiedPurchase: true,
    helpfulVotes: 51,
    sentiment: 'positive',
    sentimentConfidence: 1.0,
    createdAt: '2026-05-12T08:14:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord_1001',
    userId: 'user_1',
    sellerId: 'seller_1',
    items: [
      { productId: 'prod_prism_watch', variantId: 'var_prism_titanium_space', quantity: 1, priceAtPurchase: 799 }
    ],
    subtotal: 799,
    tax: 66.7,
    shippingCharge: 15.00,
    discountAmount: 0,
    total: 880.7,
    status: OrderStatus.DELIVERED,
    paymentMethod: 'UPI Gate link',
    paymentStatus: 'COMPLETED',
    addressId: 'addr_1',
    trackingNumber: 'TRK-INDIA-98042930',
    createdAt: '2026-05-15T14:30:00Z'
  }
];

export function getAllProducts() {
  return mockProducts;
}

export function getProductWithVariants(productId: string) {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;
  const variants = mockProductVariants.filter(v => v.productId === productId);
  const reviews = mockReviews.filter(r => r.productId === productId);
  return { ...product, variants, reviews };
}

export function searchMockProducts(query: string) {
  const term = query.toLowerCase().trim();
  if (!term) return mockProducts;
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    Object.values(p.specs).some(val => val.toLowerCase().includes(term))
  );
}
