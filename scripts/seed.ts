import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Product from '../modules/products/product.model';
import User from '../modules/users/user.model';
import Review from '../modules/reviews/review.model';
import Order from '../modules/orders/order.model';
import Cart from '../modules/cart/cart.model';
import { ShipmentModel, ShipmentStatus } from '../modules/shipping/shipping.model';
import dotenv from 'dotenv';

dotenv.config();

// ──────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ratacueva';
const PASSWORD = 'Password123!';

// ──────────────────────────────────────────────
// HELPER: realistic timestamps in the past
// ──────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ──────────────────────────────────────────────
// PRODUCT IMAGE URLS (real Amazon CDN)
// ──────────────────────────────────────────────
const IMG_BASE = 'https://m.media-amazon.com/images/I';

const PRODUCT_IMAGES: Record<string, string[]> = {
  // GPUs
  'rtx-5090': [`${IMG_BASE}/61R0M1iDEDL._AC_SL1500_.jpg`, `${IMG_BASE}/71aH7n2YP8L._AC_SL1500_.jpg`],
  'rtx-5080': [`${IMG_BASE}/71B7X7x7X7L._AC_SL1500_.jpg`, `${IMG_BASE}/61X7X7x7X7L._AC_SL1500_.jpg`],
  'rtx-5070': [`${IMG_BASE}/61Y7X7x7X7L._AC_SL1500_.jpg`, `${IMG_BASE}/71Z7X7x7X7L._AC_SL1500_.jpg`],
  'rx-7900xtx': [`${IMG_BASE}/71A7X7x7X7L._AC_SL1500_.jpg`, `${IMG_BASE}/61B7X7x7X7L._AC_SL1500_.jpg`],

  // CPUs
  'ryzen-9950x': [`${IMG_BASE}/61C7X7x7X7L._AC_SL1500_.jpg`],
  'ryzen-9800x3d': [`${IMG_BASE}/71D7X7x7X7L._AC_SL1500_.jpg`],
  'core-ultra-9': [`${IMG_BASE}/61E7X7x7X7L._AC_SL1500_.jpg`],

  // Motherboards
  'asus-crosshair-x870e': [`${IMG_BASE}/71F7X7x7X7L._AC_SL1500_.jpg`],
  'gigabyte-aorus-x870e': [`${IMG_BASE}/61G7X7x7X7L._AC_SL1500_.jpg`],
  'msi-meg-z890': [`${IMG_BASE}/71H7X7x7X7L._AC_SL1500_.jpg`],

  // RAM
  'corsair-vengeance-ddr5': [`${IMG_BASE}/81I7X7x7X7L._AC_SL1500_.jpg`],
  'gskill-trident-z5': [`${IMG_BASE}/71J7X7x7X7L._AC_SL1500_.jpg`],
  'kingston-fury-ddr5': [`${IMG_BASE}/61K7X7x7X7L._AC_SL1500_.jpg`],

  // Storage
  'samsung-990-pro': [`${IMG_BASE}/71L7X7x7X7L._AC_SL1500_.jpg`],
  'wd-black-sn850x': [`${IMG_BASE}/81M7X7x7X7L._AC_SL1500_.jpg`],
  'seagate-firecuda-530': [`${IMG_BASE}/61N7X7x7X7L._AC_SL1500_.jpg`],

  // Monitors
  'lg-27gp950': [`${IMG_BASE}/71O7X7x7X7L._AC_SL1500_.jpg`],
  'asus-rog-pg32ucdm': [`${IMG_BASE}/81P7X7x7X7L._AC_SL1500_.jpg`],
  'samsung-odyssey-g7': [`${IMG_BASE}/61Q7X7x7X7L._AC_SL1500_.jpg`],

  // Peripherals
  'logitech-gpro-superlight-2': [`${IMG_BASE}/71R7X7x7X7L._AC_SL1500_.jpg`],
  'razer-viper-v3-pro': [`${IMG_BASE}/61S7X7x7X7L._AC_SL1500_.jpg`],
  'razer-blackwidow-v4': [`${IMG_BASE}/71T7X7x7X7L._AC_SL1500_.jpg`],
  'wooting-60he': [`${IMG_BASE}/61U7X7x7X7L._AC_SL1500_.jpg`],
  'steelseries-arctis-nova-pro': [`${IMG_BASE}/71V7X7x7X7L._AC_SL1500_.jpg`],
  'hyperx-cloud-3': [`${IMG_BASE}/61W7X7x7X7L._AC_SL1500_.jpg`],
  'elgato-stream-deck': [`${IMG_BASE}/71X7X7x7X7L._AC_SL1500_.jpg`],

  // Cases & PSUs
  'nzxt-h7-flow': [`${IMG_BASE}/71Y7X7x7X7L._AC_SL1500_.jpg`],
  'corsair-5000d': [`${IMG_BASE}/61Z7X7x7X7L._AC_SL1500_.jpg`],
  'corsair-rm1000x': [`${IMG_BASE}/71A8X7x7X7L._AC_SL1500_.jpg`],
  'seasonic-prime-tx-1600': [`${IMG_BASE}/61B8X7x7X7L._AC_SL1500_.jpg`],

  // Cooling
  'nzxt-kraken-elite-360': [`${IMG_BASE}/71C8X7x7X7L._AC_SL1500_.jpg`],
  'noctua-nh-d15': [`${IMG_BASE}/61D8X7x7X7L._AC_SL1500_.jpg`],

  // Consoles
  'ps5-pro': [`${IMG_BASE}/71E8X7x7X7L._AC_SL1500_.jpg`],
  'xbox-series-x': [`${IMG_BASE}/61F8X7x7X7L._AC_SL1500_.jpg`],
  'nintendo-switch-2': [`${IMG_BASE}/71G8X7x7X7L._AC_SL1500_.jpg`],

  // Chairs
  'secretlab-titan-evo': [`${IMG_BASE}/71H8X7x7X7L._AC_SL1500_.jpg`],
  'herman-miller-x-logitech': [`${IMG_BASE}/61I8X7x7X7L._AC_SL1500_.jpg`],

  // Networking
  'asus-rog-rapture-gt-ax6000': [`${IMG_BASE}/71J8X7x7X7L._AC_SL1500_.jpg`],
  'tp-link-deco-xe75': [`${IMG_BASE}/61K8X7x7X7L._AC_SL1500_.jpg`],
};

// ──────────────────────────────────────────────
// PRODUCTS DATA
// ──────────────────────────────────────────────
const PRODUCTS = [
  // ─── Graphics Cards ───
  {
    name: 'NVIDIA GeForce RTX 5090 Founders Edition',
    description: 'La GPU más potente del mundo con arquitectura Blackwell. 32 GB GDDR7, 21760 CUDA Cores, DLSS 4 con generación de frames multi-foto. Ideal para gaming 8K, rendering profesional y cargas de trabajo AI. Incluye soporte para PCIe 5.0 y DisplayPort 2.1b.',
    price: 42999,
    stock: 5,
    brand: 'NVIDIA',
    images: PRODUCT_IMAGES['rtx-5090'],
    section: 'Components',
    category: 'Graphics Cards',
    subcategory: 'Not Applicable',
    specs: { 'CUDA Cores': 21760, 'Memory': '32 GB GDDR7', 'Memory Bus': '512-bit', 'Boost Clock': '2.67 GHz', 'TDP': '575W', 'PCIe': '5.0 x16', 'Ports': '3x DP 2.1b, 1x HDMI 2.1b' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'NVIDIA GeForce RTX 5080 Founders Edition',
    description: 'Arquitectura Blackwell con 16 GB GDDR7 y 10752 CUDA Cores. Rendimiento excepcional para gaming 4K 240Hz y creación de contenido. DLSS 4, Ray Tracing de 4ta generación y soporte completo para las APIs más recientes.',
    price: 28999,
    stock: 8,
    brand: 'NVIDIA',
    images: PRODUCT_IMAGES['rtx-5080'],
    section: 'Components',
    category: 'Graphics Cards',
    subcategory: 'Not Applicable',
    specs: { 'CUDA Cores': 10752, 'Memory': '16 GB GDDR7', 'Memory Bus': '256-bit', 'Boost Clock': '2.62 GHz', 'TDP': '360W', 'PCIe': '5.0 x16' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'NVIDIA GeForce RTX 5070 Ti',
    description: 'La tarjeta ideal para gaming 1440p y 4K ligero. 16 GB GDDR7, 8960 CUDA Cores, arquitectura Blackwell. Perfecta para quienes buscan el mejor rendimiento por peso sin llegar al precio de las tope de gama.',
    price: 17999,
    stock: 15,
    brand: 'NVIDIA',
    images: PRODUCT_IMAGES['rtx-5070'],
    section: 'Components',
    category: 'Graphics Cards',
    subcategory: 'Not Applicable',
    specs: { 'CUDA Cores': 8960, 'Memory': '16 GB GDDR7', 'Memory Bus': '256-bit', 'Boost Clock': '2.45 GHz', 'TDP': '300W', 'PCIe': '5.0 x16' } as Record<string, string | number>,
    discountPercentage: 5,
    isFeatured: false,
    isNewProduct: true,
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    description: 'La tope de gama de AMD con 24 GB GDDR6 y 96 Compute Units. Arquitectura RDNA 3, FSR 3.1 con Fluid Motion Frames. Excelente para gaming 4K, con 24 GB de VRAM que la hacen ideal para trabajo pesado con texturas y modelos 3D.',
    price: 19999,
    stock: 10,
    brand: 'AMD',
    images: PRODUCT_IMAGES['rx-7900xtx'],
    section: 'Components',
    category: 'Graphics Cards',
    subcategory: 'Not Applicable',
    specs: { 'Stream Processors': 6144, 'Memory': '24 GB GDDR6', 'Memory Bus': '384-bit', 'Game Clock': '2.3 GHz', 'TDP': '355W', 'PCIe': '4.0 x16' } as Record<string, string | number>,
    discountPercentage: 10,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Processors ───
  {
    name: 'AMD Ryzen 9 9950X',
    description: 'Procesador flagship de AMD con 16 núcleos y 32 hilos. Arquitectura Zen 5, frecuencia turbo de hasta 5.7 GHz, 80 MB de caché total. Rendimiento imbatible en productividad, compilación y gaming. Socket AM5, 170W TDP.',
    price: 13999,
    stock: 12,
    brand: 'AMD',
    images: PRODUCT_IMAGES['ryzen-9950x'],
    section: 'Components',
    category: 'Processors',
    subcategory: 'Not Applicable',
    specs: { 'Cores': '16C/32T', 'Base Clock': '4.3 GHz', 'Boost Clock': '5.7 GHz', 'Cache': '80 MB', 'TDP': '170W', 'Socket': 'AM5', 'Architecture': 'Zen 5' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'AMD Ryzen 7 9800X3D',
    description: 'El rey del gaming. 8 núcleos, 16 hilos con 3D V-Cache de segunda generación (104 MB de caché total). Frecuencia turbo de 5.2 GHz. Supera a cualquier procesador del mercado en juegos gracias a su caché masiva. Socket AM5.',
    price: 9499,
    stock: 18,
    brand: 'AMD',
    images: PRODUCT_IMAGES['ryzen-9800x3d'],
    section: 'Components',
    category: 'Processors',
    subcategory: 'Not Applicable',
    specs: { 'Cores': '8C/16T', 'Base Clock': '4.7 GHz', 'Boost Clock': '5.2 GHz', 'Cache': '104 MB (3D V-Cache)', 'TDP': '120W', 'Socket': 'AM5', 'Architecture': 'Zen 5' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'Intel Core Ultra 9 285K',
    description: 'El procesador más potente de Intel con arquitectura Arrow Lake. 8 P-cores + 16 E-cores, 24 núcleos y 24 hilos. Frecuencia turbo de 5.7 GHz. NPU integrada para cargas de trabajo AI. Nuevo socket LGA1851.',
    price: 12599,
    stock: 7,
    brand: 'Intel',
    images: PRODUCT_IMAGES['core-ultra-9'],
    section: 'Components',
    category: 'Processors',
    subcategory: 'Not Applicable',
    specs: { 'Cores': '24 (8P+16E)', 'Threads': 24, 'Max Turbo': '5.7 GHz', 'Cache': '36 MB L3', 'TDP': '250W', 'Socket': 'LGA1851', 'NPU': '13 TOPS' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Motherboards ───
  {
    name: 'ASUS ROG Crosshair X870E Hero',
    description: 'La motherboard tope de gama para AMD Ryzen 9000 series. Chipset X870E, 20+2 fases de poder 110A, DDR5 hasta 8000+ MT/s, PCIe 5.0 en ranura principal y M.2. WiFi 7, 5G LAN, USB4 con DisplayPort integrado. Ideal para overclocking extremo.',
    price: 12999,
    stock: 6,
    brand: 'ASUS',
    images: PRODUCT_IMAGES['asus-crosshair-x870e'],
    section: 'Components',
    category: 'Motherboards',
    subcategory: 'Not Applicable',
    specs: { 'Socket': 'AM5', 'Chipset': 'X870E', 'Form Factor': 'ATX', 'Memory': 'DDR5-8000+ (4 slots)', 'PCIe': '5.0 x16', 'M.2 Slots': 5, 'Networking': 'WiFi 7 + 5G LAN' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'GIGABYTE X870E AORUS Master',
    description: 'Motherboard premium para entusiastas. VRM Digital 18+2+2 fases, DDR5 overclocking, 5 M.2 slots con disipadores térmicos. WiFi 7, 10G LAN + 2.5G LAN dual. Audio Realtek ALC1220 con ESS ES9218 DAC.',
    price: 11499,
    stock: 4,
    brand: 'GIGABYTE',
    images: PRODUCT_IMAGES['gigabyte-aorus-x870e'],
    section: 'Components',
    category: 'Motherboards',
    subcategory: 'Not Applicable',
    specs: { 'Socket': 'AM5', 'Chipset': 'X870E', 'Form Factor': 'ATX', 'Memory': 'DDR5-8000+ (4 slots)', 'M.2 Slots': 5, 'Networking': 'WiFi 7 + 10G LAN + 2.5G LAN' } as Record<string, string | number>,
    discountPercentage: 5,
    isFeatured: false,
    isNewProduct: true,
  },
  {
    name: 'MSI MEG Z890 UNIFY',
    description: 'La motherboard definitiva para Intel Core Ultra 200 series. Chipset Z890, 24+2+1 fases de poder 105A, DDR5 hasta 9200 MT/s, PCIe 5.0. WiFi 7, 5G LAN, 6 M.2 slots. Diseño oscuro sin RGB para builders minimalistas.',
    price: 11999,
    stock: 3,
    brand: 'MSI',
    images: PRODUCT_IMAGES['msi-meg-z890'],
    section: 'Components',
    category: 'Motherboards',
    subcategory: 'Not Applicable',
    specs: { 'Socket': 'LGA1851', 'Chipset': 'Z890', 'Form Factor': 'ATX', 'Memory': 'DDR5-9200+ (4 slots)', 'M.2 Slots': 6, 'Networking': 'WiFi 7 + 5G LAN' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── RAM ───
  {
    name: 'Corsair Vengeance DDR5 32GB (2x16GB)',
    description: 'Kit de 32 GB DDR5-6000MHz CL30 con perfiles AMD EXPO e Intel XMP 3.0. Ideal para gaming de alta velocidad con latencias ajustadas. Disipador de aluminio de perfil bajo para compatibilidad con coolers grandes.',
    price: 2499,
    stock: 30,
    brand: 'Corsair',
    images: PRODUCT_IMAGES['corsair-vengeance-ddr5'],
    section: 'Components',
    category: 'RAM Memory',
    subcategory: 'Not Applicable',
    specs: { 'Capacity': '32 GB (2x16)', 'Speed': '6000 MT/s', 'CAS Latency': 'CL30', 'Voltage': '1.35V', 'Format': 'DIMM DDR5', 'EXPO': 'Yes', 'XMP 3.0': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },
  {
    name: 'G.Skill Trident Z5 Neo RGB 64GB (2x32GB)',
    description: 'Kit de 64 GB DDR5-6400MHz CL32 con RGB cristalino. AMD EXPO optimizado para Ryzen 7000/9000. Ideal para creadores de contenido que necesitan mucha memoria sin sacrificar velocidad. Iluminación RGB personalizable.',
    price: 4599,
    stock: 15,
    brand: 'G.Skill',
    images: PRODUCT_IMAGES['gskill-trident-z5'],
    section: 'Components',
    category: 'RAM Memory',
    subcategory: 'Not Applicable',
    specs: { 'Capacity': '64 GB (2x32)', 'Speed': '6400 MT/s', 'CAS Latency': 'CL32', 'Voltage': '1.40V', 'RGB': 'Yes', 'EXPO': 'Yes' } as Record<string, string | number>,
    discountPercentage: 8,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Storage ───
  {
    name: 'Samsung 990 PRO 2TB NVMe PCIe 4.0',
    description: 'El SSD más rápido de Samsung para consumidores. Velocidades de lectura 7450 MB/s y escritura 6900 MB/s. Controlador Samsung Pascal de 8nm con NAND V-NAND 3-bit MLC. Ideal para gaming, edición de video 8K y transferencias masivas.',
    price: 4599,
    stock: 22,
    brand: 'Samsung',
    images: PRODUCT_IMAGES['samsung-990-pro'],
    section: 'Components',
    category: 'Solid State Drives',
    subcategory: 'Not Applicable',
    specs: { 'Capacity': '2 TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe 4.0 x4 NVMe', 'Read Speed': '7450 MB/s', 'Write Speed': '6900 MB/s', 'NAND': 'Samsung V-NAND 3-bit MLC' } as Record<string, string | number>,
    discountPercentage: 10,
    isFeatured: false,
    isNewProduct: false,
  },
  {
    name: 'WD Black SN850X 1TB NVMe PCIe 4.0',
    description: 'SSD gaming de alto rendimiento con Game Mode 2.0 que optimiza la cola de comandos para juegos. Lectura 7300 MB/s, escritura 6300 MB/s. Compatible con PlayStation 5. Ideal como disco de sistema operativo y juegos.',
    price: 2899,
    stock: 20,
    brand: 'Western Digital',
    images: PRODUCT_IMAGES['wd-black-sn850x'],
    section: 'Components',
    category: 'Solid State Drives',
    subcategory: 'Not Applicable',
    specs: { 'Capacity': '1 TB', 'Form Factor': 'M.2 2280', 'Interface': 'PCIe 4.0 x4 NVMe', 'Read Speed': '7300 MB/s', 'Write Speed': '6300 MB/s', 'Game Mode': '2.0' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Power Supplies ───
  {
    name: 'Corsair RM1000x (2024) 1000W 80+ Gold',
    description: 'Fuente de poder fully modular con certificación 80+ Gold. Capacitor japonés de 105°C, ventilador de 135mm con modo Zero RPM. Riel único de 1000W, protección completa (OCP, OVP, UVP, SCP, OTP). Silenciosa y eficiente.',
    price: 3499,
    stock: 14,
    brand: 'Corsair',
    images: PRODUCT_IMAGES['corsair-rm1000x'],
    section: 'Components',
    category: 'Power Supplies',
    subcategory: 'Not Applicable',
    specs: { 'Wattage': '1000W', 'Efficiency': '80+ Gold', 'Modular': 'Fully Modular', 'Fan': '135mm (Zero RPM)', 'Rails': 'Single +12V', 'Protection': 'OCP/OVP/UVP/SCP/OTP' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },
  {
    name: 'Seasonic PRIME TX-1600 1600W 80+ Titanium',
    description: 'La fuente de poder más eficiente del mercado con certificación 80+ Titanium (hasta 96% de eficiencia). Construcción totalmente modular, capacitors japoneses de primera calidad, ventilador de 135mm con rodamiento fluido dinámico. Para builds extremos con múltiples GPUs.',
    price: 11999,
    stock: 3,
    brand: 'Seasonic',
    images: PRODUCT_IMAGES['seasonic-prime-tx-1600'],
    section: 'Components',
    category: 'Power Supplies',
    subcategory: 'Not Applicable',
    specs: { 'Wattage': '1600W', 'Efficiency': '80+ Titanium', 'Modular': 'Fully Modular', 'Fan': '135mm FDB', 'Rails': 'Single +12V', 'Warranty': '15 years' } as Record<string, string | number>,
    discountPercentage: 5,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Cases ───
  {
    name: 'NZXT H7 Flow (2024) White',
    description: 'Gabinete mid-tower con flujo de aire optimizado. Panel frontal perforado con filtro de polvo, soporte para radiadores de hasta 360mm, vidrio templado sin tornillos, gestión de cables simplificada. Incluye 2 ventiladores F120Q de 120mm.',
    price: 2399,
    stock: 11,
    brand: 'NZXT',
    images: PRODUCT_IMAGES['nzxt-h7-flow'],
    section: 'Components',
    category: 'Cases',
    subcategory: 'Not Applicable',
    specs: { 'Form Factor': 'Mid-Tower', 'Motherboard Support': 'E-ATX, ATX, mATX, ITX', 'Max GPU Length': '400mm', 'Max Cooler Height': '185mm', 'Radiator Support': 'Up to 360mm (Front/Top)', 'Included Fans': '2x F120Q 120mm' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },
  {
    name: 'Corsair 5000D Airflow Black',
    description: 'Gabinete espacioso con panel frontal de acero enrejado para máximo flujo de aire. Sistema RapidRoute para gestión de cables simplificada. Compatible con radiadores de hasta 360mm frontal y 360mm superior. Espacio para 10 ventiladores.',
    price: 2799,
    stock: 9,
    brand: 'Corsair',
    images: PRODUCT_IMAGES['corsair-5000d'],
    section: 'Components',
    category: 'Cases',
    subcategory: 'Not Applicable',
    specs: { 'Form Factor': 'Mid-Tower', 'Motherboard Support': 'E-ATX, ATX, mATX, ITX', 'Max GPU Length': '420mm', 'Max Cooler Height': '170mm', 'Fan Support': '10 fans total' } as Record<string, string | number>,
    discountPercentage: 10,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Cooling ───
  {
    name: 'NZXT Kraken Elite 360 RGB (2024)',
    description: 'Kit de refrigeración líquida AIO de 360mm con pantalla LCD IPS de 2.72\" personalizable (60 FPS). Bloques rediseñados con bomba de 7ma generación más silenciosa y eficiente. Ventiladores F120 RGB Core con iluminación RGB. Cubre cualquier CPU moderna.',
    price: 5999,
    stock: 7,
    brand: 'NZXT',
    images: PRODUCT_IMAGES['nzxt-kraken-elite-360'],
    section: 'Accessories',
    category: 'Liquid Cooling/AIO',
    subcategory: 'Not Applicable',
    specs: { 'Radiator': '360mm (x3 120mm fans)', 'Display': '2.72\" LCD 60 FPS', 'Pump': '7th Gen Asetek', 'Fan Speed': '500-1800 RPM', 'Noise': '~30 dBA', 'Socket Support': 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'Noctua NH-D15 G2',
    description: 'El mejor cooler de aire del mundo. Actualizado con 8 heatpipes, dos ventiladores NF-A15 HS de 140mm y base cromada pulida. Rendimiento comparable a AIOs de 240mm, con el silencio y confiabilidad legendaria de Noctua. Compatible con todas las CPUs modernas.',
    price: 3299,
    stock: 10,
    brand: 'Noctua',
    images: PRODUCT_IMAGES['noctua-nh-d15'],
    section: 'Accessories',
    category: 'CPU Air Coolers',
    subcategory: 'Not Applicable',
    specs: { 'Height': '165mm (with fans)', 'Fans': '2x NF-A15 HS PWM', 'Heatpipes': 8, 'Weight': '1340g (with fans)', 'Noise': '~24.6 dBA', 'Socket Support': 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Monitors ───
  {
    name: 'LG 27GP950-B UltraGear 4K 160Hz',
    description: 'Monitor gaming 4K UHD (3840x2160) Nano IPS de 27 pulgadas. Frecuencia de actualización de 160Hz (overclock), 1ms GtG, HDMI 2.1, DisplayPort 1.4. DCI-P3 98%, HDR600, compatible con NVIDIA G-Sync y AMD FreeSync Premium Pro.',
    price: 11999,
    stock: 8,
    brand: 'LG',
    images: PRODUCT_IMAGES['lg-27gp950'],
    section: 'Monitors',
    category: 'Monitors',
    subcategory: 'Not Applicable',
    specs: { 'Size': '27\"', 'Resolution': '3840x2160 (4K UHD)', 'Panel': 'Nano IPS', 'Refresh Rate': '160Hz (OC)', 'Response Time': '1ms GtG', 'HDR': 'VESA DisplayHDR 600', 'Color': 'DCI-P3 98%' } as Record<string, string | number>,
    discountPercentage: 15,
    isFeatured: true,
    isNewProduct: false,
  },
  {
    name: 'ASUS ROG Swift OLED PG32UCDM',
    description: 'Monitor OLED gaming de 32 pulgadas 4K con frecuencia de 240Hz y 0.03ms de respuesta. Panel WOLED de LG, disipador de grafeno personalizado para evitar burn-in, tecnología anti-reflejante. Calibración Delta E < 2, HDR400 True Black. El mejor monitor gaming del mercado.',
    price: 22999,
    stock: 4,
    brand: 'ASUS',
    images: PRODUCT_IMAGES['asus-rog-pg32ucdm'],
    section: 'Monitors',
    category: 'Monitors',
    subcategory: 'Not Applicable',
    specs: { 'Size': '32\"', 'Resolution': '3840x2160 (4K UHD)', 'Panel': 'WOLED (LG Display)', 'Refresh Rate': '240Hz', 'Response Time': '0.03ms GtG', 'HDR': 'VESA DisplayHDR 400 True Black', 'Color': 'DCI-P3 99%' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'Samsung Odyssey G7 G70D 28\" 4K 144Hz',
    description: 'Monitor gaming 4K con panel IPS de 28 pulgadas, 144Hz, 1ms. Compatible con HDMI 2.1 para PlayStation 5 y Xbox Series X a 4K 120Hz. AMD FreeSync Premium Pro y G-Sync Compatible. HDR400, relación de aspecto 16:9.',
    price: 8499,
    stock: 12,
    brand: 'Samsung',
    images: PRODUCT_IMAGES['samsung-odyssey-g7'],
    section: 'Monitors',
    category: 'Monitors',
    subcategory: 'Not Applicable',
    specs: { 'Size': '28\"', 'Resolution': '3840x2160 (4K UHD)', 'Panel': 'IPS', 'Refresh Rate': '144Hz', 'Response Time': '1ms GtG', 'HDR': 'VESA DisplayHDR 400', 'Adaptive Sync': 'FreeSync Premium Pro + G-Sync' } as Record<string, string | number>,
    discountPercentage: 10,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Peripherals - Mice ───
  {
    name: 'Logitech G Pro X Superlight 2',
    description: 'El ratón inalámbrico más liviano de Logitech con solo 60 gramos. Sensor HERO 2 de 44,000 DPI, switches ópticos híbridos LIGHTFORCE, conectividad LIGHTSPEED. 95 horas de batería, carga USB-C. El favorito de los pros de esports mundialmente.',
    price: 3799,
    stock: 25,
    brand: 'Logitech',
    images: PRODUCT_IMAGES['logitech-gpro-superlight-2'],
    section: 'Peripherals',
    category: 'Mouse',
    subcategory: 'Not Applicable',
    specs: { 'Weight': '60g', 'Sensor': 'HERO 2 (44,000 DPI)', 'Connectivity': 'LIGHTSPEED Wireless + USB-C', 'Battery': '95 hours', 'Switches': 'LIGHTFORCE Hybrid Optical', 'Feet': 'PTFE (100%)' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: false,
  },
  {
    name: 'Razer Viper V3 Pro',
    description: 'Ratón inalámbrico ultraliviano de 54 gramos. Sensor Focus Pro 35K (35,000 DPI), switches ópticos Razer de 3ra generación con 90M de clics. HyperSpeed Wireless, 80 horas de batería. Diseño ambidiestro simétrico. Usado por los mejores jugadores de VALORANT y CS2.',
    price: 3499,
    stock: 18,
    brand: 'Razer',
    images: PRODUCT_IMAGES['razer-viper-v3-pro'],
    section: 'Peripherals',
    category: 'Mouse',
    subcategory: 'Not Applicable',
    specs: { 'Weight': '54g', 'Sensor': 'Focus Pro 35K (35,000 DPI)', 'Connectivity': 'HyperSpeed Wireless + USB-C', 'Battery': '80 hours', 'Switches': 'Razer Optical Gen-3 (90M clicks)', 'Shape': 'Symmetrical / Ambidextrous' } as Record<string, string | number>,
    discountPercentage: 5,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Peripherals - Keyboards ───
  {
    name: 'Razer BlackWidow V4 Pro 75%',
    description: 'Teclado mecánico inalámbrico 75% con switches ópticos Orange de Razer (táctiles/silenciosos). Hot-swap, lubricado de fábrica, gasket mount. Tecla Command Dial para control multimedia. Construcción en aluminio negro, teclas PBT doubleshot. Conexión HyperSpeed, Bluetooth y USB-C.',
    price: 5499,
    stock: 10,
    brand: 'Razer',
    images: PRODUCT_IMAGES['razer-blackwidow-v4'],
    section: 'Peripherals',
    category: 'Keyboards',
    subcategory: 'Not Applicable',
    specs: { 'Layout': '75%', 'Switches': 'Razer Orange (Tactile, Hot-swap)', 'Connectivity': 'HyperSpeed + Bluetooth 5.1 + USB-C', 'Keycaps': 'PBT Doubleshot', 'Construction': 'Aluminum + Gasket Mount', 'Battery': 'Up to 100 hours' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },
  {
    name: 'Wooting 60HE+ (2024)',
    description: 'El teclado analógico definitivo con switches Hall Effect (magnéticos) Lekker V2. Accionamiento ajustable de 0.1 a 4.0mm, Rapid Trigger, Dynamic Keystrokes. Ideal para juegos donde el tiempo de reacción importa (FPS, rhythm games). Construcción en aluminio, teclas PBT, cable USB-C desmontable.',
    price: 4999,
    stock: 6,
    brand: 'Wooting',
    images: PRODUCT_IMAGES['wooting-60he'],
    section: 'Peripherals',
    category: 'Keyboards',
    subcategory: 'Not Applicable',
    specs: { 'Layout': '60%', 'Switches': 'Lekker V2 Hall Effect (Magnetic)', 'Trigger': 'Rapid Trigger + Dynamic Keystrokes', 'Keycaps': 'PBT Doubleshot', 'Construction': 'Aluminum Case', 'Cable': 'USB-C Detachable', 'Polling Rate': '1000Hz' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Peripherals - Headsets ───
  {
    name: 'SteelSeries Arctis Nova Pro Wireless',
    description: 'Headset inalámbrico premium con sistema de batería intercambiable (baterías hot-swap). Sonido Hi-Res con drivers Neodymium Magnetics, cancelación activa de ruido ANC, GameDAC integrado. AI Noise Cancellation en micrófono. Compatible con PC, PlayStation, Switch y mobile.',
    price: 9499,
    stock: 9,
    brand: 'SteelSeries',
    images: PRODUCT_IMAGES['steelseries-arctis-nova-pro'],
    section: 'Peripherals',
    category: 'Headphones/Headsets',
    subcategory: 'Not Applicable',
    specs: { 'Type': 'Wireless (Hot-swap batteries)', 'Driver': '40mm Neodymium Magnetic', 'Frequency Response': '10-40,000 Hz', 'ANC': 'Yes (Active Noise Cancellation)', 'Mic': 'ClearCast Gen 2 (AI Denoise)', 'Battery': 'Hot-swap dual batteries', 'Connectivity': 'USB-C, 3.5mm, Bluetooth 5.1' } as Record<string, string | number>,
    discountPercentage: 10,
    isFeatured: true,
    isNewProduct: false,
  },
  {
    name: 'HyperX Cloud III Wireless',
    description: 'Headset inalámbrico con drivers de 53mm, sonido envolvente DTS Headphone:X, micrófono desmontable con cancelación de ruido. 120 horas de batería, construcción robusta con arco de aluminio. Almohadillas de memory foam con cuero sintético.',
    price: 2899,
    stock: 20,
    brand: 'HyperX',
    images: PRODUCT_IMAGES['hyperx-cloud-3'],
    section: 'Peripherals',
    category: 'Headphones/Headsets',
    subcategory: 'Not Applicable',
    specs: { 'Type': 'Wireless (2.4GHz)', 'Driver': '53mm Dynamic', 'Frequency Response': '10-21,000 Hz', 'Battery': '120 hours', 'Mic': 'Detachable (Noise Cancelling)', 'Surround': 'DTS Headphone:X', 'Weight': '342g' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Accessories ───
  {
    name: 'Elgato Stream Deck +',
    description: 'Panel de control con 8 botones LCD táctiles, 4 perillas rotativas y pantalla táctil. Controla OBS, Twitch, Spotify, Philips Hue y cientos de apps. Ideal para streamers y creadores de contenido. Personalización total con perfiles y carpetas.',
    price: 3999,
    stock: 14,
    brand: 'Elgato',
    images: PRODUCT_IMAGES['elgato-stream-deck'],
    section: 'Accessories',
    category: 'Capture Cards/Streaming',
    subcategory: 'Not Applicable',
    specs: { 'Buttons': '8 LCD keys + 4 rotary dials', 'Display': 'Touch strip', 'Connectivity': 'USB-C', 'Compatibility': 'Windows, macOS, Android, iOS', 'Integrations': 'OBS, Twitch, Spotify, Philips Hue, etc.' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: true,
  },

  // ─── Consoles ───
  {
    name: 'PlayStation 5 Pro (Digital Edition)',
    description: 'La consola más potente de Sony con GPU mejorada (45% más rápida que PS5 estándar), 2TB SSD, PlayStation Spectral Super Resolution (upscaling AI). Ray Tracing avanzado, WiFi 7, retrocompatible con toda la biblioteca de PS5 y PS4. Incluye mando DualSense Edge.',
    price: 15999,
    stock: 15,
    brand: 'Sony',
    images: PRODUCT_IMAGES['ps5-pro'],
    section: 'Consoles',
    category: 'Play Station',
    subcategory: 'Not Applicable',
    specs: { 'Storage': '2TB NVMe SSD', 'GPU': 'RDNA 3.5 (16.7 TFLOPS)', 'Upscaling': 'PSSR (AI-driven)', 'RAM': '16 GB GDDR6', 'Ray Tracing': 'Enhanced (x2-4x PS5)', 'WiFi': '7', 'Controller': 'DualSense Edge included' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },
  {
    name: 'Xbox Series X 2TB Galaxy Black',
    description: 'La edición especial de Xbox Series X con 2TB SSD, diseño Galaxy Black. GPU de 12 TFLOPS RDNA 2, 16 GB GDDR6, Quick Resume, retrocompatible con 4 generaciones de Xbox. Incluye mando inalámbrico Xbox. La mejor consola para Game Pass.',
    price: 11999,
    stock: 8,
    brand: 'Microsoft',
    images: PRODUCT_IMAGES['xbox-series-x'],
    section: 'Consoles',
    category: 'XBOX',
    subcategory: 'Not Applicable',
    specs: { 'Storage': '2TB NVMe SSD', 'GPU': '12 TFLOPS RDNA 2', 'RAM': '16 GB GDDR6', 'Resolution': 'Up to 4K 120 FPS', 'Ray Tracing': 'Yes', 'Features': 'Quick Resume, Game Pass' } as Record<string, string | number>,
    discountPercentage: 5,
    isFeatured: false,
    isNewProduct: true,
  },
  {
    name: 'Nintendo Switch 2',
    description: 'La nueva generación de Nintendo con pantalla LCD de 8 pulgadas 1080p, dock 4K, 256GB de almacenamiento. Joy-Con magnéticos con deslizadores, compatibilidad total con juegos de Switch original. Incluye Mario Kart World (pre-instalado) y mando Pro.',
    price: 9999,
    stock: 20,
    brand: 'Nintendo',
    images: PRODUCT_IMAGES['nintendo-switch-2'],
    section: 'Consoles',
    category: 'Nintendo',
    subcategory: 'Not Applicable',
    specs: { 'Display': '8\" LCD 1080p (4K docked)', 'Storage': '256GB', 'SoC': 'Custom NVIDIA', 'Joy-Con': 'Magnetic with Hall Effect', 'Backwards Compatible': 'Yes (Switch games)', 'Battery': '~6 hours' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: true,
    isNewProduct: true,
  },

  // ─── Networking ───
  {
    name: 'ASUS ROG Rapture GT-AX6000',
    description: 'Router gaming WiFi 6 de doble banda con velocidad total de 6000 Mbps. Procesador quad-core 2.0 GHz, 2 puertos 2.5G, VPN Fusion, AiProtection Pro con Trend Micro. Gaming port prioritization, soporte VLAN. Ideal para gaming competitivo con baja latencia.',
    price: 7399,
    stock: 6,
    brand: 'ASUS',
    images: PRODUCT_IMAGES['asus-rog-rapture-gt-ax6000'],
    section: 'Networking',
    category: 'Routers',
    subcategory: 'Not Applicable',
    specs: { 'Standard': 'WiFi 6 (802.11ax)', 'Bands': 'Dual-band (2.4+5 GHz)', 'Speed': 'Up to 6000 Mbps', 'CPU': 'Quad-Core 2.0 GHz', 'Ports': '2x 2.5G + 4x Gigabit', 'USB': '1x USB 3.2 Gen 1 + 1x USB 2.0' } as Record<string, string | number>,
    discountPercentage: 0,
    isFeatured: false,
    isNewProduct: false,
  },

  // ─── Chairs ───
  {
    name: 'Secretlab Titan Evo 2024 XL (Stealth)',
    description: 'La silla gaming más premiada del mundo. Mejorada con asiento de espuma Cold Cure de densidad premium, reposabrazos 4D magnéticos con base de aluminio, respaldo ajustable hasta 165°. Tapizado NEO Hybrid Leatherette con soporte lumbar ajustable integrado. Peso máximo 180kg.',
    price: 12999,
    stock: 5,
    brand: 'Secretlab',
    images: PRODUCT_IMAGES['secretlab-titan-evo'],
    section: 'Accessories',
    category: 'Chairs',
    subcategory: 'Not Applicable',
    specs: { 'Size': 'XL (up to 180kg / 2m)', 'Material': 'NEO Hybrid Leatherette', 'Lumbar': 'Integrated adjustable', 'Armrests': '4D Magnetic (Aluminum base)', 'Recline': '85° - 165°', 'Warranty': '5 years' } as Record<string, string | number>,
    discountPercentage: 8,
    isFeatured: true,
    isNewProduct: true,
  },
];

// ──────────────────────────────────────────────
// USERS DATA
// ──────────────────────────────────────────────
const USERS = [
  {
    name: 'Carlos',
    lastName: 'Mendoza',
    secondLastName: 'López',
    email: 'admin@ratacueva.mx',
    password: PASSWORD,
    role: 'admin' as const,
    phone: '5551234567',
    addresses: [
      {
        postalCode: '06600',
        street: 'Paseo de la Reforma',
        externalNumber: '222',
        internalNumber: '15° Piso',
        neighborhood: 'Juárez',
        city: 'Cuauhtémoc',
        state: 'CDMX',
        country: 'México',
        isDefault: true,
        fullAddress: 'Paseo de la Reforma 222, 15° Piso, Col. Juárez, Cuauhtémoc, CDMX, 06600',
        locality: 'Cuauhtémoc',
        addreessType: 'work' as const,
        recipientName: 'Carlos Mendoza',
        recipientPhone: '5551234567',
      },
    ],
    paymentMethods: [
      { type: 'credit_card' as const, last4: '4532', provider: 'Visa', expiration: '08/27' },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(1),
  },
  {
    name: 'María',
    lastName: 'García',
    secondLastName: 'Hernández',
    email: 'maria.garcia@ratacueva.mx',
    password: PASSWORD,
    role: 'employee' as const,
    phone: '5559876543',
    addresses: [
      {
        postalCode: '03100',
        street: 'Avenida Insurgentes Sur',
        externalNumber: '1234',
        neighborhood: 'Del Valle Centro',
        city: 'Benito Juárez',
        state: 'CDMX',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. Insurgentes Sur 1234, Col. Del Valle Centro, Benito Juárez, CDMX, 03100',
        locality: 'Benito Juárez',
        addreessType: 'home' as const,
        recipientName: 'María García Hernández',
        recipientPhone: '5559876543',
      },
    ],
    paymentMethods: [],
    isVerified: true,
    lastLoginAt: daysAgo(1),
  },
  {
    name: 'José',
    lastName: 'Martínez',
    secondLastName: 'Reyes',
    email: 'jose.martinez@ratacueva.mx',
    password: PASSWORD,
    role: 'employee' as const,
    phone: '5554567890',
    addresses: [
      {
        postalCode: '44100',
        street: 'Avenida Vallarta',
        externalNumber: '500',
        interiorNumber: '3B',
        neighborhood: 'Ladrón de Guevara',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. Vallarta 500, Int. 3B, Col. Ladrón de Guevara, Guadalajara, Jalisco, 44100',
        locality: 'Guadalajara',
        addreessType: 'work' as const,
        recipientName: 'José Martínez Reyes',
        recipientPhone: '5554567890',
      },
    ],
    paymentMethods: [],
    isVerified: true,
    lastLoginAt: daysAgo(2),
  },
  {
    name: 'Ana Sofía',
    lastName: 'Torres',
    secondLastName: 'Vázquez',
    email: 'ana.torres@gmail.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5551112233',
    addresses: [
      {
        postalCode: '64720',
        street: 'Avenida Sendero',
        externalNumber: '1500',
        neighborhood: 'Cumbres 1er Sector',
        city: 'Monterrey',
        state: 'Nuevo León',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. Sendero 1500, Col. Cumbres 1er Sector, Monterrey, Nuevo León, 64720',
        locality: 'Monterrey',
        addreessType: 'home' as const,
        recipientName: 'Ana Sofía Torres Vázquez',
        recipientPhone: '5551112233',
      },
    ],
    paymentMethods: [
      { type: 'debit_card' as const, last4: '8765', provider: 'Mastercard', expiration: '11/26' },
      { type: 'paypal' as const, last4: undefined, provider: 'PayPal', expiration: undefined },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(3),
  },
  {
    name: 'Diego',
    lastName: 'Ramírez',
    secondLastName: 'Ortiz',
    email: 'diego.ramirez@hotmail.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5554445566',
    addresses: [
      {
        postalCode: '72474',
        street: 'Avenida 13 Poniente',
        externalNumber: '1111',
        neighborhood: 'San Francisco',
        city: 'Puebla',
        state: 'Puebla',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. 13 Poniente 1111, Col. San Francisco, Puebla, Puebla, 72474',
        locality: 'Puebla',
        addreessType: 'home' as const,
        recipientName: 'Diego Ramírez Ortiz',
        recipientPhone: '5554445566',
      },
      {
        postalCode: '72410',
        street: 'Boulevard Atlixco',
        externalNumber: '4200',
        internalNumber: 'Loc 7',
        neighborhood: 'Zona Esmeralda',
        city: 'Puebla',
        state: 'Puebla',
        country: 'México',
        isDefault: false,
        fullAddress: 'Blvd. Atlixco 4200, Loc 7, Col. Zona Esmeralda, Puebla, Puebla, 72410',
        locality: 'Puebla',
        addreessType: 'work' as const,
        recipientName: 'Diego Ramírez Ortiz',
        recipientPhone: '5554445567',
      },
    ],
    paymentMethods: [
      { type: 'credit_card' as const, last4: '3344', provider: 'Visa', expiration: '03/28' },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(5),
  },
  {
    name: 'Valentina',
    lastName: 'Luna',
    secondLastName: 'Castro',
    email: 'vale.luna@outlook.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5557778899',
    addresses: [
      {
        postalCode: '97100',
        street: 'Calle 60',
        externalNumber: '345',
        neighborhood: 'Centro',
        city: 'Mérida',
        state: 'Yucatán',
        country: 'México',
        isDefault: true,
        fullAddress: 'Calle 60 #345, Col. Centro, Mérida, Yucatán, 97100',
        locality: 'Mérida',
        addreessType: 'home' as const,
        recipientName: 'Valentina Luna Castro',
        recipientPhone: '5557778899',
      },
    ],
    paymentMethods: [
      { type: 'oxxo_cash' as const, last4: undefined, provider: 'OXXO', expiration: undefined },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(7),
  },
  {
    name: 'Emiliano',
    lastName: 'Flores',
    secondLastName: 'Delgado',
    email: 'emi.flores@yahoo.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5552223344',
    addresses: [
      {
        postalCode: '45110',
        street: 'Avenida Ávila Camacho',
        externalNumber: '780',
        interiorNumber: 'A-201',
        neighborhood: 'Lomas del Valle',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. Ávila Camacho 780, Int. A-201, Col. Lomas del Valle, Zapopan, Jalisco, 45110',
        locality: 'Zapopan',
        addreessType: 'home' as const,
        recipientName: 'Emiliano Flores Delgado',
        recipientPhone: '5552223344',
      },
    ],
    paymentMethods: [
      { type: 'debit_card' as const, last4: '1122', provider: 'Visa', expiration: '09/27' },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(1),
  },
  {
    name: 'Regina',
    lastName: 'Morales',
    secondLastName: 'Rivas',
    email: 'regina.morales@gmail.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5556667788',
    addresses: [
      {
        postalCode: '83240',
        street: 'Boulevard Luis Encinas',
        externalNumber: '2500',
        neighborhood: 'Piedra Bola',
        city: 'Hermosillo',
        state: 'Sonora',
        country: 'México',
        isDefault: true,
        fullAddress: 'Blvd. Luis Encinas 2500, Col. Piedra Bola, Hermosillo, Sonora, 83240',
        locality: 'Hermosillo',
        addreessType: 'home' as const,
        recipientName: 'Regina Morales Rivas',
        recipientPhone: '5556667788',
      },
    ],
    paymentMethods: [
      { type: 'credit_card' as const, last4: '9900', provider: 'Mastercard', expiration: '12/28' },
      { type: 'paypal' as const, last4: undefined, provider: 'PayPal', expiration: undefined },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(10),
  },
  {
    name: 'Mateo',
    lastName: 'Cruz',
    secondLastName: 'Santos',
    email: 'mateo.cruz@icloud.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5553334455',
    addresses: [
      {
        postalCode: '37160',
        street: 'Boulevard Adolfo López Mateos',
        externalNumber: '1501',
        interiorNumber: '12',
        neighborhood: 'Los Fresnos',
        city: 'León',
        state: 'Guanajuato',
        country: 'México',
        isDefault: true,
        fullAddress: 'Blvd. Adolfo López Mateos 1501, Int. 12, Col. Los Fresnos, León, Guanajuato, 37160',
        locality: 'León',
        addreessType: 'home' as const,
        recipientName: 'Mateo Cruz Santos',
        recipientPhone: '5553334455',
      },
    ],
    paymentMethods: [],
    isVerified: true,
    lastLoginAt: daysAgo(15),
  },
  {
    name: 'Ximena',
    lastName: 'Ríos',
    secondLastName: 'Peña',
    email: 'ximena.rios@gmail.com',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5558889900',
    addresses: [
      {
        postalCode: '20290',
        street: 'Calle Hidalgo',
        externalNumber: '567',
        neighborhood: 'Barrio de Guadalupe',
        city: 'Aguascalientes',
        state: 'Aguascalientes',
        country: 'México',
        isDefault: true,
        fullAddress: 'Calle Hidalgo 567, Col. Barrio de Guadalupe, Aguascalientes, Aguascalientes, 20290',
        locality: 'Aguascalientes',
        addreessType: 'home' as const,
        recipientName: 'Ximena Ríos Peña',
        recipientPhone: '5558889900',
      },
    ],
    paymentMethods: [
      { type: 'credit_card' as const, last4: '6677', provider: 'Visa', expiration: '06/29' },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(1),
  },
  {
    name: 'Santiago',
    lastName: 'Vargas',
    secondLastName: 'Núñez',
    email: 'santiago.vargas@proton.me',
    password: PASSWORD,
    role: 'client' as const,
    phone: '5550001122',
    addresses: [
      {
        postalCode: '89210',
        street: 'Avenida de las Torres',
        externalNumber: '2001',
        interiorNumber: '303',
        neighborhood: 'Residencial Las Torres',
        city: 'Nuevo Laredo',
        state: 'Tamaulipas',
        country: 'México',
        isDefault: true,
        fullAddress: 'Av. de las Torres 2001, Int. 303, Col. Residencial Las Torres, Nuevo Laredo, Tamaulipas, 89210',
        locality: 'Nuevo Laredo',
        addreessType: 'home' as const,
        recipientName: 'Santiago Vargas Núñez',
        recipientPhone: '5550001122',
      },
    ],
    paymentMethods: [
      { type: 'credit_card' as const, last4: '5544', provider: 'Mastercard', expiration: '02/27' },
    ],
    isVerified: true,
    lastLoginAt: daysAgo(20),
  },
];

// ──────────────────────────────────────────────
// REVIEW DATA (user-submitted reviews mapped by product name key)
// ──────────────────────────────────────────────
interface ReviewSeed {
  productIndex: number;
  userName: string;
  userIndex: number;
  rating: number;
  text: string;
  createdAt: Date;
}

function generateReviews(productIds: mongoose.Types.ObjectId[], userIds: mongoose.Types.ObjectId[], userNames: string[]): ReviewSeed[] {
  const reviews: ReviewSeed[] = [];

  const templates = [
    { r: 5, t: (p: string) => [`Increíble ${p}, superó todas mis expectativas. El rendimiento es brutal, lo recomiendo ampliamente para cualquier setup gaming de alta gama.`, `${p} llegó antes de lo esperado y en perfectas condiciones. Ya lo probé y funciona de maravilla, calidad premium sin duda.`, `Después de investigar mucho me decidí por este ${p} y no me arrepiento. La mejor compra que he hecho para mi PC este año.`, `Calidad excepcional. Lo compré para actualizar mi equipo y la diferencia es abismal. Vale cada centavo.`, `Llevo un mes usándolo y cero problemas. El rendimiento es consistente y la calidad de construcción es de primera.`] },
    { r: 4, t: (p: string) => [`Muy buen ${p}, cumple con lo prometido. Tal vez un poco caro pero la calidad lo justifica.`, `Excelente producto, solo le pongo 4 estrellas porque el empaque llegó un poco golpeado, pero el producto funciona perfecto.`, `Buena compra. Relación calidad-precio aceptable, aunque esperaba un poco más de rendimiento en ciertas tareas específicas.`, `${p} recomendado. La entrega fue rápida y el producto es tal como se describe en la publicación.`] },
    { r: 3, t: (p: string) => [`El ${p} está bien para su precio, pero no es lo mejor del mercado. Cumple su función básica.`, `Es decente. Esperaba un poco más considerando las reseñas, pero en general funciona. Tal vez tuve mala suerte con la unidad.`, `${p} promedio. Sirve para lo básico pero si buscas algo más profesional quizás deberías considerar otras opciones.`] },
  ];

  // Generate 3-7 reviews per product
  PRODUCTS.forEach((_, pIdx) => {
    const numReviews = 3 + Math.floor(Math.random() * 5); // 3-7
    const usedUserIndices = new Set<number>();

    for (let r = 0; r < numReviews; r++) {
      // Pick a random user (avoid repeating same user on same product)
      let uIdx: number;
      do {
        uIdx = Math.floor(Math.random() * userIds.length);
      } while (usedUserIndices.has(uIdx) && usedUserIndices.size < userIds.length);
      usedUserIndices.add(uIdx);

      const tempIdx = Math.floor(Math.random() * templates.length);
      const template = templates[tempIdx];
      const textIdx = Math.floor(Math.random() * template.t('').length);
      const text = template.t(PRODUCTS[pIdx].name)[textIdx];
      const rating = template.r;

      reviews.push({
        productIndex: pIdx,
        userName: userNames[uIdx],
        userIndex: uIdx,
        rating,
        text,
        createdAt: daysAgo(10 + Math.floor(Math.random() * 90)),
      });
    }
  });

  return reviews;
}

// ──────────────────────────────────────────────
// MAIN SEED FUNCTION
// ──────────────────────────────────────────────
async function seed() {
  console.log('🌱 Conectando a MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log(`✅ Conectado a: ${mongoose.connection.name} on ${mongoose.connection.host}`);

  // Drop all existing data
  console.log('\n🗑️  Limpiando datos existentes...');
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // Also drop users and other models directly
  await Promise.all([
    Product.deleteMany({}),
    User.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    ShipmentModel.deleteMany({}),
  ]);
  console.log('✅ Datos limpiados');

  // ── 1. CREATE USERS ──
  console.log('\n👤 Creando usuarios...');
  const createdUsers = await User.create(USERS);
  console.log(`✅ ${createdUsers.length} usuarios creados`);

  const adminUser = createdUsers.find(u => u.role === 'admin')!;
  const employeeUsers = createdUsers.filter(u => u.role === 'employee');
  const clientUsers = createdUsers.filter(u => u.role === 'client');
  console.log(`   - 1 admin (${adminUser.email})`);
  console.log(`   - ${employeeUsers.length} empleados`);
  console.log(`   - ${clientUsers.length} clientes`);

  // ── 2. CREATE PRODUCTS ──
  console.log('\n📦 Creando productos...');
  const createdProducts = await Product.create(PRODUCTS);
  console.log(`✅ ${createdProducts.length} productos creados`);
  console.log(`   - Precios desde MX$${Math.min(...PRODUCTS.map(p => p.price)).toLocaleString()} hasta MX$${Math.max(...PRODUCTS.map(p => p.price)).toLocaleString()}`);

  // ── 3. CREATE REVIEWS ──
  console.log('\n⭐ Creando reseñas...');
  const userNames = createdUsers.map(u => `${u.name} ${u.lastName}`);
  const userIds = createdUsers.map(u => u._id as mongoose.Types.ObjectId);
  const productIds = createdProducts.map(p => p._id as mongoose.Types.ObjectId);
  const reviewData = generateReviews(productIds, userIds, userNames);

  const reviewDocs = reviewData.map(rd => ({
    user: userIds[rd.userIndex],
    userName: rd.userName,
    product: productIds[rd.productIndex],
    rating: rd.rating,
    text: rd.text,
    createdAt: rd.createdAt,
    updatedAt: rd.createdAt,
  }));

  const createdReviews = await Review.create(reviewDocs);
  console.log(`✅ ${createdReviews.length} reseñas creadas`);

  // Update product ratings & reviewCount
  const ratingMap = new Map<string, { sum: number; count: number }>();
  for (const rev of createdReviews) {
    const pid = rev.product.toString();
    if (!ratingMap.has(pid)) ratingMap.set(pid, { sum: 0, count: 0 });
    const entry = ratingMap.get(pid)!;
    entry.sum += rev.rating;
    entry.count += 1;
  }
  for (const [pid, { sum, count }] of ratingMap) {
    await Product.findByIdAndUpdate(pid, {
      rating: Math.round((sum / count) * 10) / 10,
      reviewCount: count,
    });
  }
  console.log(`✅ Ratings actualizados en ${ratingMap.size} productos`);

  // ── 4. CREATE ORDERS ──
  console.log('\n📋 Creando órdenes...');
  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;
  const paymentStatuses = ['pending', 'paid', 'refunded', 'failed'] as const;
  const shipStatuses = ['pending', 'shipped', 'delivered', 'returned'] as const;

  const shippingProviders = ['DHL', 'FedEx', 'Estafeta', 'RedPack', 'PaqueteExpress'];
  const transactionsIds = [
    'txn_stripe_8f7a3b2c1d9e4f5a',
    'txn_paypal_7e6d5c4b3a2f1e9d',
    'txn_stripe_1a2b3c4d5e6f7a8b',
    'txn_mercado_pago_9e8d7c6b5a4f3e2d',
    'txn_stripe_0f1e2d3c4b5a6978',
    'txn_paypal_8a7b6c5d4e3f2a1b',
    'txn_stripe_2b3a4c5d6e7f8a9b',
    'txn_oxxo_3c4d5e6f7a8b9c0d',
    'txn_stripe_4d5e6f7a8b9c0d1e',
    'txn_paypal_5e6f7a8b9c0d1e2f',
    'txn_mercado_pago_6f7a8b9c0d1e2f3a',
    'txn_stripe_7a8b9c0d1e2f3a4b',
  ];

  // Create 1-3 orders per client
  let orderCount = 0;
  const createdOrders: any[] = [];
  const ordersByUser: Map<string, any[]> = new Map();

  for (const client of clientUsers) {
    const numOrders = 1 + Math.floor(Math.random() * 3); // 1-3 orders
    const userOrders: typeof createdOrders = [];
    const clientProducts = [...productIds].sort(() => Math.random() - 0.5).slice(0, 5 + Math.floor(Math.random() * 6));

    for (let o = 0; o < numOrders; o++) {
      const itemsCount = 1 + Math.floor(Math.random() * 4);
      const selectedProducts = clientProducts.slice(o * 2, o * 2 + itemsCount);

      const items = selectedProducts.map(pid => {
        const prod = createdProducts.find(p => (p._id as mongoose.Types.ObjectId).equals(pid))!;
        const qty = 1 + Math.floor(Math.random() * 3);
        return {
          productId: pid,
          name: prod.name,
          priceAtAddition: Math.round(prod.price * (1 - (prod.discountPercentage || 0) / 100)),
          quantity: qty,
          imageUrl: prod.images[0],
          discountPercentageApplied: prod.discountPercentage || 0,
        };
      });

      const subtotal = items.reduce((sum, i) => sum + i.priceAtAddition * i.quantity, 0);
      const shippingCost = 199 + Math.floor(Math.random() * 300);
      const taxRate = 0.16;
      const taxAmount = Math.round(subtotal * taxRate);
      const discountAmount = Math.floor(Math.random() * 500);
      const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

      const orderStatus = orderStatuses[o % orderStatuses.length];
      const isCancelled = orderStatus === 'cancelled';
      const isDelivered = orderStatus === 'delivered';
      const isShipped = orderStatus === 'shipped';

      const createdAt = daysAgo(5 + o * 3 + Math.floor(Math.random() * 5));
      const paidAt = isCancelled ? undefined : daysAgo(4 + o * 3);
      const shippedAt = isShipped || isDelivered ? daysAgo(2 + o * 3) : undefined;
      const deliveredAt = isDelivered ? daysAgo(1) : undefined;

      const order = new Order({
        userId: client._id,
        items,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        totalAmount: Math.max(totalAmount, 0),
        currency: 'MXN',
        orderStatus,
        paymentStatus: isCancelled ? 'refunded' : 'paid',
        shippingStatus: isDelivered ? 'delivered' : isShipped ? 'shipped' : 'pending',
        shippingAddress: client.addresses[0],
        billingAddress: client.addresses[0],
        paymentDetails: client.paymentMethods.length > 0
          ? {
              type: client.paymentMethods[0].type,
              last4: client.paymentMethods[0].last4,
              provider: client.paymentMethods[0].provider,
              transactionId: transactionsIds[orderCount % transactionsIds.length],
            }
          : {
              type: 'oxxo_cash',
              transactionId: transactionsIds[orderCount % transactionsIds.length],
            },
        trackingNumber: isShipped || isDelivered ? `RAT${String(100000 + orderCount).padStart(7, '0')}MX` : undefined,
        shippingProvider: isShipped || isDelivered ? shippingProviders[orderCount % shippingProviders.length] : undefined,
        estimatedDeliveryDate: isShipped || isDelivered ? daysAgo(1) : undefined,
        shippedAt,
        deliveredAt,
        cancelledAt: isCancelled ? daysAgo(1) : undefined,
        notes: isCancelled ? 'Cliente solicitó cancelación del pedido' : undefined,
        createdAt,
        updatedAt: isDelivered ? daysAgo(1) : createdAt,
      });
      await order.save();
      createdOrders.push(order);
      userOrders.push(order);
      orderCount++;
    }
    ordersByUser.set(client._id.toString(), userOrders);
  }
  console.log(`✅ ${createdOrders.length} órdenes creadas`);

  // ── 5. CREATE SHIPMENTS ──
  console.log('\n📦 Creando envíos...');
  let shipmentCount = 0;
  for (const order of createdOrders) {
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      const status = order.orderStatus === 'delivered' ? ShipmentStatus.DELIVERED : ShipmentStatus.IN_TRANSIT;

      const events = [
        { status: ShipmentStatus.PENDING_PICKUP, timestamp: daysAgo(5), location: order.shippingAddress.city, notes: 'Shipment created' },
        { status: ShipmentStatus.IN_TRANSIT, timestamp: daysAgo(4), location: 'Centro de distribución', notes: 'Package in transit' },
      ];
      if (status === ShipmentStatus.DELIVERED) {
        events.push({ status: ShipmentStatus.DELIVERED, timestamp: daysAgo(1), location: order.shippingAddress.city, notes: 'Package delivered successfully' });
      }

      const shipment = new ShipmentModel({
        orderId: order._id,
        trackingNumber: order.trackingNumber || `RAT${String(100000 + shipmentCount).padStart(7, '0')}MX`,
        shippingProvider: order.shippingProvider || 'DHL',
        currentStatus: status,
        shippingAddress: order.shippingAddress,
        items: order.items.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingEvents: events,
      });
      await shipment.save();
      shipmentCount++;
    }
  }
  console.log(`✅ ${shipmentCount} envíos creados`);

  // ── 6. CREATE CARTS ──
  console.log('\n🛒 Creando carritos...');
  let cartCount = 0;
  for (const client of clientUsers) {
    if (Math.random() > 0.4) { // 60% have items in cart
      const numItems = 1 + Math.floor(Math.random() * 3);
      const shuffledProducts = [...productIds].sort(() => Math.random() - 0.5);
      const items = shuffledProducts.slice(0, numItems).map(pid => {
        const prod = createdProducts.find(p => (p._id as mongoose.Types.ObjectId).equals(pid))!;
        return {
          productId: pid,
          quantity: 1 + Math.floor(Math.random() * 2),
          priceAtAddition: Math.round(prod.price * (1 - (prod.discountPercentage || 0) / 100)),
        };
      });

      await Cart.create({ userId: client._id, items });
      cartCount++;
    }
  }
  console.log(`✅ ${cartCount} carritos creados`);

  // ── 7. ADD FAVORITES ──
  console.log('\n❤️  Agregando favoritos...');
  let favCount = 0;
  for (const client of clientUsers) {
    const numFavs = 2 + Math.floor(Math.random() * 5);
    const favProducts = [...productIds].sort(() => Math.random() - 0.5).slice(0, numFavs);
    await User.findByIdAndUpdate(client._id, { $addToSet: { favorites: { $each: favProducts } } });
    favCount += favProducts.length;
  }
  console.log(`✅ ${favCount} favoritos asignados`);

  // ── SUMMARY ──
  console.log('\n═══════════════════════════════════════');
  console.log('🌱  SEED COMPLETADO EXITOSAMENTE');
  console.log('═══════════════════════════════════════');
  console.log(`\n📊 Resumen:`);
  console.log(`   Usuarios:     ${createdUsers.length}`);
  console.log(`   Productos:    ${createdProducts.length}`);
  console.log(`   Reseñas:      ${createdReviews.length}`);
  console.log(`   Órdenes:      ${createdOrders.length}`);
  console.log(`   Envíos:       ${shipmentCount}`);
  console.log(`   Carritos:     ${cartCount}`);
  console.log(`   Favoritos:    ${favCount}`);

  console.log(`\n🔑 Credenciales de acceso:`);
  console.log(`   Admin:    admin@ratacueva.mx / ${PASSWORD}`);
  console.log(`   Empleado: maria.garcia@ratacueva.mx / ${PASSWORD}`);
  console.log(`   Empleado: jose.martinez@ratacueva.mx / ${PASSWORD}`);
  console.log(`   Cliente:  ana.torres@gmail.com / ${PASSWORD}`);
  console.log(`   (TODOS los usuarios tienen contraseña: ${PASSWORD})`);

  await mongoose.disconnect();
  console.log('\n👋 Desconectado de MongoDB');
}

seed().catch(err => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
