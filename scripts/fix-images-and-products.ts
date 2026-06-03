import mongoose from 'mongoose';
import Product from '../modules/products/product.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ratacueva';
const IMG = (name: string) => `https://placehold.co/400x400/1a1a2e/e94560?text=${encodeURIComponent(name)}`;

const SECTIONS = {
  Components: 'Components',
  Peripherals: 'Peripherals',
  Monitors: 'Monitors',
  Consoles: 'Consoles',
  Networking: 'Networking',
  Accessories: 'Accessories',
} as const;

type ProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  section: string;
  category: string;
  subcategory: string;
  specs: Record<string, string | number>;
  discountPercentage: number;
  isFeatured: boolean;
  isNewProduct: boolean;
};

const NEW_PRODUCTS: ProductInput[] = [
  // === Graphics Cards (have 4, need 1) ===
  {
    name: 'AMD Radeon RX 9070 XT',
    description: 'Nueva generación RDNA 4 con 16 GB GDDR7 y 4096 Stream Processors. FSR 4 con upscaling AI, Ray Tracing mejorado. Rendimiento comparable a una RTX 5070 Ti a un precio más competitivo. Ideal para gaming 4K.',
    price: 15999, stock: 12, brand: 'AMD',
    section: SECTIONS.Components, category: 'Graphics Cards', subcategory: 'Not Applicable',
    specs: { 'Stream Processors': 4096, Memory: '16 GB GDDR7', 'Memory Bus': '256-bit', 'Game Clock': '2.4 GHz', TDP: '330W' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  // === Processors (have 3, need 2) ===
  {
    name: 'Intel Core Ultra 7 265K',
    description: 'Procesador Arrow Lake de alto rendimiento con 20 núcleos (8P+12E), frecuencia turbo de 5.3 GHz. NPU integrada de 13 TOPS. Perfecto para gaming y productividad con excelente eficiencia energética. Socket LGA1851.',
    price: 8499, stock: 15, brand: 'Intel',
    section: SECTIONS.Components, category: 'Processors', subcategory: 'Not Applicable',
    specs: { Cores: '20 (8P+12E)', Threads: 20, 'Max Turbo': '5.3 GHz', Cache: '30 MB L3', TDP: '125W', Socket: 'LGA1851' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'AMD Ryzen 5 9600X',
    description: 'Procesador Zen 5 de 6 núcleos y 12 hilos ideal para gaming sin comprometer el presupuesto. Frecuencia turbo de 5.4 GHz. Excelente relación rendimiento/precio. Socket AM5, 65W TDP. Incluye cooler Wraith Stealth.',
    price: 4599, stock: 25, brand: 'AMD',
    section: SECTIONS.Components, category: 'Processors', subcategory: 'Not Applicable',
    specs: { Cores: '6C/12T', 'Base Clock': '3.9 GHz', 'Boost Clock': '5.4 GHz', Cache: '38 MB', TDP: '65W', Socket: 'AM5' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Motherboards (have 3, need 2) ===
  {
    name: 'ASUS TUF Gaming B650-PLUS WiFi',
    description: 'Motherboard ATX confiable para gaming con chipset B650, socket AM5. VRM 14+2 fases, DDR5 hasta 6400+ MT/s, PCIe 5.0 para GPU y M.2. WiFi 6, 2.5G LAN. Diseño militar TUF con componentes duraderos.',
    price: 4999, stock: 18, brand: 'ASUS',
    section: SECTIONS.Components, category: 'Motherboards', subcategory: 'Not Applicable',
    specs: { Socket: 'AM5', Chipset: 'B650', 'Form Factor': 'ATX', Memory: 'DDR5-6400+ (4 slots)', 'PCIe': '5.0 x16', 'M.2 Slots': 3, Networking: 'WiFi 6 + 2.5G LAN' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'MSI MAG Z890 TOMAHAWK WiFi',
    description: 'Motherboard para Intel Core Ultra con chipset Z890, VRM 16+1+1 fases, DDR5 hasta 8400 MT/s, 4 M.2 slots con disipadores. WiFi 7, 5G LAN. Diseño militar con PCB de 8 capas.',
    price: 7499, stock: 8, brand: 'MSI',
    section: SECTIONS.Components, category: 'Motherboards', subcategory: 'Not Applicable',
    specs: { Socket: 'LGA1851', Chipset: 'Z890', 'Form Factor': 'ATX', Memory: 'DDR5-8400+ (4 slots)', 'M.2 Slots': 4, Networking: 'WiFi 7 + 5G LAN' } as Record<string, string | number>,
    discountPercentage: 5, isFeatured: false, isNewProduct: true,
  },
  // === RAM Memory (have 2, need 3) ===
  {
    name: 'Kingston Fury Beast DDR5 32GB (2x16GB)',
    description: 'Kit DDR5 de alto rendimiento con perfiles Intel XMP 3.0 y AMD EXPO. Velocidad 5600MHz, CAS Latency CL36. Disipador de aluminio negro. Ideal para gaming y creación de contenido.',
    price: 1899, stock: 35, brand: 'Kingston',
    section: SECTIONS.Components, category: 'RAM Memory', subcategory: 'Not Applicable',
    specs: { Capacity: '32 GB (2x16)', Speed: '5600 MT/s', 'CAS Latency': 'CL36', Voltage: '1.25V', Format: 'DIMM DDR5', EXPO: 'Yes', 'XMP 3.0': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Corsair Dominator Titanium DDR5 96GB (2x48GB)',
    description: 'Kit de memoria DDR5 tope de gama con disipador de aluminio CNC y RGB Dinámico. Velocidad 6600MHz CL32. Ideal para estaciones de trabajo, edición de video 8K, VMs y cargas de trabajo profesionales.',
    price: 11999, stock: 5, brand: 'Corsair',
    section: SECTIONS.Components, category: 'RAM Memory', subcategory: 'Not Applicable',
    specs: { Capacity: '96 GB (2x48)', Speed: '6600 MT/s', 'CAS Latency': 'CL32', Voltage: '1.40V', RGB: 'Yes (Dynamic)', EXPO: 'Yes', 'XMP 3.0': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'TEAMGROUP T-Force Delta RGB DDR5 32GB (2x16GB)',
    description: 'Kit DDR5 económico con RGB LED de arcoíris. Velocidad 6000MHz CL30 con soporte AMD EXPO. Disipador de aleación de aluminio. Gran relación precio-rendimiento para gamers.',
    price: 2199, stock: 28, brand: 'TEAMGROUP',
    section: SECTIONS.Components, category: 'RAM Memory', subcategory: 'Not Applicable',
    specs: { Capacity: '32 GB (2x16)', Speed: '6000 MT/s', 'CAS Latency': 'CL30', Voltage: '1.35V', RGB: 'Yes', EXPO: 'Yes' } as Record<string, string | number>,
    discountPercentage: 10, isFeatured: false, isNewProduct: false,
  },
  // === Solid State Drives (have 2, need 3) ===
  {
    name: 'Crucial T705 2TB PCIe 5.0 NVMe',
    description: 'El SSD PCIe 5.0 más rápido de Crucial con velocidades de lectura 14,500 MB/s y escritura 12,700 MB/s. Controlador Phison E26, 3D NAND de 232 capas. Ideal para edición de video 8K ProRes y cargas de trabajo profesionales extremas.',
    price: 8999, stock: 8, brand: 'Crucial',
    section: SECTIONS.Components, category: 'Solid State Drives', subcategory: 'Not Applicable',
    specs: { Capacity: '2 TB', 'Form Factor': 'M.2 2280', Interface: 'PCIe 5.0 x4 NVMe', 'Read Speed': '14500 MB/s', 'Write Speed': '12700 MB/s', 'NAND': 'Micron 232L 3D NAND' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: true, isNewProduct: true,
  },
  {
    name: 'Samsung 870 EVO 4TB SATA III',
    description: 'SSD SATA de gran capacidad para almacenamiento masivo. Lectura 560 MB/s, escritura 530 MB/s. Controlador Samsung MKX, V-NAND 3-bit MLC. Ideal como disco de juegos secundario o almacenamiento de contenido.',
    price: 5899, stock: 14, brand: 'Samsung',
    section: SECTIONS.Components, category: 'Solid State Drives', subcategory: 'Not Applicable',
    specs: { Capacity: '4 TB', 'Form Factor': '2.5"', Interface: 'SATA III 6 Gbps', 'Read Speed': '560 MB/s', 'Write Speed': '530 MB/s' } as Record<string, string | number>,
    discountPercentage: 5, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'WD Blue SN580 1TB NVMe PCIe 4.0',
    description: 'SSD NVMe económico con velocidades de lectura 4150 MB/s. Controlador WD SiliconDrive, NAND BiCS5 3D. Ideal para laptops y builds donde se busca buena velocidad a precio accesible. Bajo consumo energético.',
    price: 1599, stock: 30, brand: 'Western Digital',
    section: SECTIONS.Components, category: 'Solid State Drives', subcategory: 'Not Applicable',
    specs: { Capacity: '1 TB', 'Form Factor': 'M.2 2280', Interface: 'PCIe 4.0 x4 NVMe', 'Read Speed': '4150 MB/s', 'Write Speed': '4150 MB/s' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Power Supplies (have 2, need 3) ===
  {
    name: 'Corsair RM850x (2024) 850W 80+ Gold',
    description: 'Fuente de poder fully modular 850W 80+ Gold. Capacitores japoneses, ventilador de 135mm con modo Zero RPM. Compatible con ATX 3.1 y PCIe 5.1 12V-2x6. Ideal para builds de gama alta con una sola GPU.',
    price: 2899, stock: 20, brand: 'Corsair',
    section: SECTIONS.Components, category: 'Power Supplies', subcategory: 'Not Applicable',
    specs: { Wattage: '850W', Efficiency: '80+ Gold', Modular: 'Fully Modular', Fan: '135mm (Zero RPM)', 'ATX 3.1': 'Yes', 'Protection': 'OCP/OVP/UVP/SCP/OTP' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'EVGA SuperNOVA 1000 G7 1000W 80+ Gold',
    description: 'Fuente de poder 1000W 80+ Gold completamente modular con ventilador FDB de 135mm. Construcción con capacitores japoneses, protección completa, diseño de riel único. Garantía EVGA de 10 años.',
    price: 3999, stock: 12, brand: 'EVGA',
    section: SECTIONS.Components, category: 'Power Supplies', subcategory: 'Not Applicable',
    specs: { Wattage: '1000W', Efficiency: '80+ Gold', Modular: 'Fully Modular', Fan: '135mm FDB', Rails: 'Single +12V', Warranty: '10 years' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'be quiet! Dark Power 13 1000W 80+ Titanium',
    description: 'Fuente de poder silenciosa 80+ Titanium con eficiencia de hasta 94%. Ventilador Silent Wings 4 de 135mm, refrigeración líquida interna. Cable management modular, riel OVP. La fuente más silenciosa de su clase.',
    price: 6499, stock: 6, brand: 'be quiet!',
    section: SECTIONS.Components, category: 'Power Supplies', subcategory: 'Not Applicable',
    specs: { Wattage: '1000W', Efficiency: '80+ Titanium', Modular: 'Fully Modular', Fan: '135mm Silent Wings 4', Rails: '4x +12V (OVP)', Noise: '~18 dBA' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  // === Cases (have 2, need 3) ===
  {
    name: 'Lian Li O11 Dynamic EVO RGB',
    description: 'Gabinete dual-chamber con panel de vidrio templado curvo y soporte para hasta 10 ventiladores. Compatible con radiadores de 360mm superior e inferior. Diseño invertible (GPU vertical o estándar). Incluye controlador RGB.',
    price: 4299, stock: 10, brand: 'Lian Li',
    section: SECTIONS.Components, category: 'Cases', subcategory: 'Not Applicable',
    specs: { 'Form Factor': 'Mid-Tower Dual Chamber', 'Motherboard Support': 'E-ATX, ATX, mATX, ITX', 'Max GPU Length': '455mm', 'Max Cooler Height': '167mm', 'Fan Support': '10 fans total', 'Radiator Support': '360mm (Top/Bottom)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: true, isNewProduct: true,
  },
  {
    name: 'Fractal Design North XL Charcoal',
    description: 'Gabinete mid-tower con panel frontal de madera natural y flujo de aire optimizado. Diseño elegante tipo escritorio. Soporta radiadores de hasta 360mm frontal. 2 ventiladores Aspect 140mm incluidos. Gestión de cables con cubiertas.',
    price: 3699, stock: 7, brand: 'Fractal Design',
    section: SECTIONS.Components, category: 'Cases', subcategory: 'Not Applicable',
    specs: { 'Form Factor': 'Mid-Tower', 'Motherboard Support': 'E-ATX, ATX, mATX, ITX', 'Max GPU Length': '355mm', 'Max Cooler Height': '185mm', 'Material': 'Steel + Wood + Tempered Glass' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Hyte Y70 Tactical',
    description: 'Gabinete premium con panel LCD táctil de 4.8" integrado en el panel frontal. Diseño dual-chamber con flujo de aire optimizado, vidrio templado curvo. Soporta radiadores de 360mm, GPU vertical. Ideal para showcases.',
    price: 5499, stock: 5, brand: 'HYTE',
    section: SECTIONS.Components, category: 'Cases', subcategory: 'Not Applicable',
    specs: { 'Form Factor': 'Mid-Tower Dual Chamber', 'Display': '4.8" LCD Touch', 'Motherboard Support': 'E-ATX, ATX, mATX, ITX', 'Max GPU Length': '370mm', 'Radiator Support': '360mm (Top/Side)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  // === Liquid Cooling/AIO (have 1, need 4) ===
  {
    name: 'Corsair iCUE H150i ELITE LCD XT',
    description: 'Kit AIO de 360mm con pantalla LCD IPS personalizable de 2.1". Bomba de alto flujo, ventiladores AF120 RGB ELITE. Compatible con Intel LGA1851/LGA1700 y AMD AM5. Refrigeración líquida de alto rendimiento con iCUE.',
    price: 4999, stock: 9, brand: 'Corsair',
    section: SECTIONS.Accessories, category: 'Liquid Cooling/AIO', subcategory: 'Not Applicable',
    specs: { Radiator: '360mm (x3 120mm fans)', Display: '2.1" LCD IPS', Pump: 'High Flow Series', 'Fan Speed': '550-2100 RPM', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 5, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'ARCTIC Liquid Freezer III 420',
    description: 'AIO de 420mm con radiador masivo de 3x140mm para máxima disipación térmica. Ventiladores P140 PWM PST, bomba VRM integrada. Eficiencia extrema para CPUs de alto TDP como Intel Core Ultra 9 o AMD Ryzen 9.',
    price: 4599, stock: 4, brand: 'ARCTIC',
    section: SECTIONS.Accessories, category: 'Liquid Cooling/AIO', subcategory: 'Not Applicable',
    specs: { Radiator: '420mm (x3 140mm fans)', Pump: 'VRM Fan Integrated', 'Fan Speed': '200-1700 RPM', Socket: 'AM5, LGA1851, LGA1700', Noise: '~26 dBA' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Deepcool LE720 360mm AIO',
    description: 'Refrigeración líquida AIO de 360mm con cabezal de bomba RGB infinito espejado. Ventiladores FC120 RGB con rodamiento FDB, 4 pines PWM. Excelente relación calidad-precio para refrigeración líquida de alto rendimiento.',
    price: 2999, stock: 16, brand: 'Deepcool',
    section: SECTIONS.Accessories, category: 'Liquid Cooling/AIO', subcategory: 'Not Applicable',
    specs: { Radiator: '360mm (x3 120mm fans)', Pump: 'Mirror Infinity RGB', 'Fan Speed': '500-1800 RPM', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Cooler Master MasterLiquid ML240L',
    description: 'AIO compacta de 240mm con bomba RGB de tercera generación y ventiladores SickleFlow 120 PWM. Ideal para CPUs de gama media como Ryzen 5 o Core i5. Fácil instalación, excelente para builds compactos.',
    price: 1699, stock: 22, brand: 'Cooler Master',
    section: SECTIONS.Accessories, category: 'Liquid Cooling/AIO', subcategory: 'Not Applicable',
    specs: { Radiator: '240mm (x2 120mm fans)', Pump: 'Gen 3 RGB', 'Fan Speed': '650-1800 RPM', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 10, isFeatured: false, isNewProduct: false,
  },
  // === CPU Air Coolers (have 1, need 4) ===
  {
    name: 'be quiet! Dark Rock Pro 5',
    description: 'Cooler de aire dual-torre ultra silencioso con 7 heatpipes de cobre y ventiladores Silent Wings 4 de 135/120mm. 250W TDP de disipación. Ideal para CPUs de alta potencia sin ruido. Cubierta de aluminio negra.',
    price: 2899, stock: 10, brand: 'be quiet!',
    section: SECTIONS.Accessories, category: 'CPU Air Coolers', subcategory: 'Not Applicable',
    specs: { Height: '168mm', Fans: '2x Silent Wings 4 (135+120mm)', Heatpipes: 7, 'TDP Rating': '250W', Noise: '~24.3 dBA', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Cooler Master Hyper 620S',
    description: 'Cooler de aire dual-torre económico con 6 heatpipes de cobre y dos ventiladores SickleFlow 120mm. 220W TDP. Compatible con todos los sockets modernos. Excelente opción para CPUs de gama media.',
    price: 1299, stock: 25, brand: 'Cooler Master',
    section: SECTIONS.Accessories, category: 'CPU Air Coolers', subcategory: 'Not Applicable',
    specs: { Height: '157mm', Fans: '2x 120mm PWM', Heatpipes: 6, 'TDP Rating': '220W', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Deepcool AK620 Digital',
    description: 'Cooler dual-torre con pantalla LED en la parte superior que muestra temperatura y carga de CPU. 6 heatpipes, ventiladores FK120 de 120mm, 260W TDP. Diseño elegante con cubierta negra texturizada.',
    price: 2199, stock: 14, brand: 'Deepcool',
    section: SECTIONS.Accessories, category: 'CPU Air Coolers', subcategory: 'Not Applicable',
    specs: { Height: '160mm', Fans: '2x FK120 120mm PWM', Heatpipes: 6, 'TDP Rating': '260W', Display: 'LED Temperature', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Thermalright Peerless Assassin 120 SE',
    description: 'El mejor cooler relación precio-rendimiento del mercado. Dual-torre con 7 heatpipes, dos ventiladores C12C de 120mm PWM. 245W TDP. Competencia directa de coolers mucho más caros. Silencioso y efectivo.',
    price: 899, stock: 35, brand: 'Thermalright',
    section: SECTIONS.Accessories, category: 'CPU Air Coolers', subcategory: 'Not Applicable',
    specs: { Height: '155mm', Fans: '2x C12C 120mm PWM', Heatpipes: 7, 'TDP Rating': '245W', Socket: 'AM5, LGA1851, LGA1700' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Monitors (have 3, need 2) ===
  {
    name: 'Dell Alienware AW2725DF 27" 360Hz QD-OLED',
    description: 'Monitor gaming QD-OLED de 27 pulgadas con 360Hz y 0.03ms. Resolución 2560x1440, color DCI-P3 99%, HDR400 True Black. Disipador de grafeno avanzado anti-burn-in. G-Sync Compatible y FreeSync Premium Pro.',
    price: 16999, stock: 6, brand: 'Dell',
    section: SECTIONS.Monitors, category: 'Monitors', subcategory: 'Not Applicable',
    specs: { Size: '27"', Resolution: '2560x1440', Panel: 'QD-OLED (Samsung Display)', 'Refresh Rate': '360Hz', 'Response Time': '0.03ms GtG', HDR: 'VESA DisplayHDR 400 True Black' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: true, isNewProduct: true,
  },
  {
    name: 'GIGABYTE M28U 28" 4K 144Hz',
    description: 'Monitor gaming 4K IPS de 28 pulgadas con 144Hz y 1ms. HDMI 2.1, KVM integrado, SS IPS. Ideal para quienes buscan 4K gaming sin gastar en OLED. FreeSync Premium Pro, G-Sync Compatible.',
    price: 7999, stock: 15, brand: 'GIGABYTE',
    section: SECTIONS.Monitors, category: 'Monitors', subcategory: 'Not Applicable',
    specs: { Size: '28"', Resolution: '3840x2160 (4K UHD)', Panel: 'SS IPS', 'Refresh Rate': '144Hz', 'Response Time': '1ms MPRT', HDR: 'VESA DisplayHDR 400' } as Record<string, string | number>,
    discountPercentage: 12, isFeatured: false, isNewProduct: false,
  },
  // === Mouse (have 2, need 3) ===
  {
    name: 'ASUS ROG Harpe Ace Aim Lab Edition',
    description: 'Ratón inalámbrico ultraliviano de 54g con sensor ROG AimPoint de 36,000 DPI y tecnología SpeedNova Wireless. Colaboración con Aim Lab para configuración óptima. 90 horas de batería, PTFE feet. Ideal para esports.',
    price: 2899, stock: 14, brand: 'ASUS',
    section: SECTIONS.Peripherals, category: 'Mouse', subcategory: 'Not Applicable',
    specs: { Weight: '54g', Sensor: 'ROG AimPoint 36K', Connectivity: 'SpeedNova + Bluetooth + USB-C', Battery: '90 hours', Switches: 'ROG Micro (70M clicks)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Lamzu Maya X (4K Edition)',
    description: 'Ratón ultraliviano de 47g con forma ergonómica para claw grip. Sensor PAW3395 de 26,000 DPI, polling rate nativo de 4000Hz. Switches ópticos, batería de 300mAh. Diseño honeycomb cubierto. Ideal para FPS.',
    price: 2599, stock: 10, brand: 'Lamzu',
    section: SECTIONS.Peripherals, category: 'Mouse', subcategory: 'Not Applicable',
    specs: { Weight: '47g', Sensor: 'PAW3395 (26K DPI)', Connectivity: 'Wireless 4K + USB-C', Battery: '300mAh (70h)', Switches: 'Optical (80M clicks)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'ZOWIE EC2-CW',
    description: 'Ratón inalámbrico para esports con forma ergonómica para diestros. Sensor 3370 de 3200 DPI (sin aceleración), polling rate 1000Hz. Switches Huano de 60M clics. 55g. Diseño probado en torneos de CS2 y VALORANT.',
    price: 3299, stock: 8, brand: 'ZOWIE (BenQ)',
    section: SECTIONS.Peripherals, category: 'Mouse', subcategory: 'Not Applicable',
    specs: { Weight: '55g', Sensor: '3370 (3200 DPI)', Connectivity: 'Wireless (2.4GHz)', Battery: '60 hours', Switches: 'Huano (60M clicks)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Keyboards (have 2, need 3) ===
  {
    name: 'Logitech G Pro X TKL (2024)',
    description: 'Teclado mecánico TKL profesional con switches GX Blue/Brown/Red ópticos. Teclas PBT doubleshot, cable USB-C desmontable. Construcción en aleación de aluminio, gasket mount. Layout profesional para esports.',
    price: 3299, stock: 15, brand: 'Logitech',
    section: SECTIONS.Peripherals, category: 'Keyboards', subcategory: 'Not Applicable',
    specs: { Layout: 'TKL (87 keys)', Switches: 'GX Optical (Blue/Brown/Red)', Keycaps: 'PBT Doubleshot', Connection: 'USB-C Detachable', Construction: 'Aluminum + Gasket Mount' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Keychron Q1 Max QMK/VIA 75%',
    description: 'Teclado mecánico premium 75% con QMK/VIA programable, switches Gateron Jupiter, hot-swap, lubricado de fábrica. Construcción en aluminio CNC, gasket mount, knob de volumen. Conexión triple (USB-C / BT / 2.4GHz).',
    price: 4299, stock: 10, brand: 'Keychron',
    section: SECTIONS.Peripherals, category: 'Keyboards', subcategory: 'Not Applicable',
    specs: { Layout: '75% (82 keys)', Switches: 'Gateron Jupiter (Hot-swap)', Keycaps: 'PBT OSA', Connection: 'USB-C + BT 5.1 + 2.4GHz', Construction: 'CNC Aluminum + Gasket Mount' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Epomaker TH80 Pro',
    description: 'Teclado mecánico 75% inalámbrico económico con switches Gateron, hot-swap. Construcción en plástico con gasket mount, RGB, knob. Conexión triple (USB-C / BT / 2.4GHz). Ideal para empezar en el hobby.',
    price: 1699, stock: 25, brand: 'Epomaker',
    section: SECTIONS.Peripherals, category: 'Keyboards', subcategory: 'Not Applicable',
    specs: { Layout: '75% (82 keys)', Switches: 'Gateron (Hot-swap)', Keycaps: 'PBT Dye-sub', Connection: 'USB-C + BT 5.0 + 2.4GHz', Battery: '4000mAh' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Headphones/Headsets (have 2, need 3) ===
  {
    name: 'Sony INZONE H9',
    description: 'Headset inalámbrico premium con cancelación activa de ruido ANC líder en su clase. Drivers de 40mm, sonido envolvente 360 Spatial Sound. Micrófono flexible con AI Noise Rejection. 32 horas de batería, compatible con PS5 3D Audio.',
    price: 5999, stock: 10, brand: 'Sony',
    section: SECTIONS.Peripherals, category: 'Headphones/Headsets', subcategory: 'Not Applicable',
    specs: { Type: 'Wireless (2.4GHz + Bluetooth)', Driver: '40mm Neodymium', ANC: 'Yes (Dual Noise Sensor)', Battery: '32 hours', Mic: 'Flexible (AI Noise Rejection)', '360 Spatial Sound': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Corsair Virtuoso Pro',
    description: 'Headset abierto con drivers de 50mm graphene, sonido Hi-Res de 20-40,000 Hz. Micrófono desmontable Broadcast Quality. Diseño ligero de 320g con almohadillas de tela transpirable. Ideal para gaming competitivo y streaming.',
    price: 4299, stock: 8, brand: 'Corsair',
    section: SECTIONS.Peripherals, category: 'Headphones/Headsets', subcategory: 'Not Applicable',
    specs: { Type: 'Open-back Wired (USB-C + 3.5mm)', Driver: '50mm Graphene', 'Frequency Response': '20-40,000 Hz', Mic: 'Detachable Broadcast', Weight: '320g' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Logitech G733 Lightspeed',
    description: 'Headset inalámbrico colorido con iluminación RGB y micrófono Blue VO!CE con filtros de voz. Drivers 40mm, DTS Headphone:X 2.0 surround. 29 horas de batería. Cómodo para sesiones largas con 278g de peso.',
    price: 2499, stock: 20, brand: 'Logitech',
    section: SECTIONS.Peripherals, category: 'Headphones/Headsets', subcategory: 'Not Applicable',
    specs: { Type: 'Wireless (LIGHTSPEED)', Driver: '40mm', 'Frequency Response': '20-20,000 Hz', Battery: '29 hours', RGB: 'Yes', 'Surround': 'DTS Headphone:X 2.0', Weight: '278g' } as Record<string, string | number>,
    discountPercentage: 15, isFeatured: false, isNewProduct: false,
  },
  // === Capture Cards/Streaming (have 1, need 4) ===
  {
    name: 'Elgato HD60 X',
    description: 'Capturadora de video externa USB 3.0 con passthrough 4K60 HDR10. Captura 1080p60 con latencia ultrabaja. Compatible con OBS, Streamlabs, Twitch Studio. Ideal para streaming de consolas en 1080p60.',
    price: 2999, stock: 15, brand: 'Elgato',
    section: SECTIONS.Accessories, category: 'Capture Cards/Streaming', subcategory: 'Not Applicable',
    specs: { Interface: 'USB 3.0 (USB-C)', 'Passthrough': '4K60 HDR10', Capture: '1080p60', Latency: 'Ultra-low', Compatibility: 'OBS, Streamlabs, Twitch Studio' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Elgato 4K60 Pro Mk.2',
    description: 'Capturadora interna PCIe 4.0 para captura 4K60 HDR10. Grabación sin comprimir, latencia insignificante. Ideal para streamers profesionales que necesitan la máxima calidad con múltiples cámaras y escenas.',
    price: 4999, stock: 5, brand: 'Elgato',
    section: SECTIONS.Accessories, category: 'Capture Cards/Streaming', subcategory: 'Not Applicable',
    specs: { Interface: 'PCIe 4.0 x4', Capture: '4K60 HDR10', Passthrough: '4K60 HDR10', Latency: 'Near-zero', 'Software': '4K Capture Utility + OBS' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'AVerMedia Live Gamer Ultra 2.1',
    description: 'Capturadora externa HDMI 2.1 con passthrough 4K144 y captura 4K60. VRR (Variable Refresh Rate) passthrough. USB-C 3.2 Gen 2. Ideal para streaming de PC y consolas next-gen a alta tasa de refresco.',
    price: 3999, stock: 7, brand: 'AVerMedia',
    section: SECTIONS.Accessories, category: 'Capture Cards/Streaming', subcategory: 'Not Applicable',
    specs: { Interface: 'USB-C 3.2 Gen 2', 'Passthrough': '4K144 VRR', Capture: '4K60', 'HDMI Version': '2.1', Compatibility: 'OBS, Streamlabs, RECentral' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Razer Ripsaw HD',
    description: 'Capturadora externa compacta con passthrough 4K60 y captura 1080p60. Micrófono integrado para game chat, sin necesidad de cable adicional. Compatible con OBS, XSplit. Plug and play, no requiere drivers.',
    price: 2199, stock: 12, brand: 'Razer',
    section: SECTIONS.Accessories, category: 'Capture Cards/Streaming', subcategory: 'Not Applicable',
    specs: { Interface: 'USB-C 3.0', 'Passthrough': '4K60', Capture: '1080p60', 'Built-in Mic': 'Yes (Game Chat)', Compatibility: 'OBS, XSplit, Streamlabs' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Play Station (have 1, need 4) ===
  {
    name: 'PlayStation 5 Slim (Digital Edition)',
    description: 'Consola PlayStation 5 Slim edición digital con 1TB SSD. GPU RDNA 2, 16 GB GDDR6, soporte para 4K 120Hz, HDMI 2.1, ray tracing. Incluye mando DualSense. Más compacta que la original, mismo rendimiento.',
    price: 8999, stock: 20, brand: 'Sony',
    section: SECTIONS.Consoles, category: 'Play Station', subcategory: 'Not Applicable',
    specs: { Storage: '1TB NVMe SSD', GPU: 'RDNA 2 (10.3 TFLOPS)', RAM: '16 GB GDDR6', Resolution: 'Up to 4K 120Hz', 'Ray Tracing': 'Yes', 'HDMI': '2.1' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'DualSense Edge Wireless Controller',
    description: 'Mando profesional para PS5 con palancas intercambiables, gatillos ajustables, botones traseros personalizables. Perfiles de control intercambiables, cable USB-C trenzado de 3m. Estuche de carga incluido.',
    price: 3499, stock: 18, brand: 'Sony',
    section: SECTIONS.Consoles, category: 'Play Station', subcategory: 'Not Applicable',
    specs: { Connectivity: 'Wireless + USB-C', Features: 'Interchangeable sticks, Adjustable triggers, Rear buttons', Profiles: 'Custom (hot-swap)', 'Cable': 'USB-C braided 3m', Battery: '~6 hours' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'PlayStation VR2',
    description: 'Realidad virtual de nueva generación para PS5. Pantalla OLED 4K HDR (2000x2040 por ojo), 90/120Hz, seguimiento eye-tracking, feedback háptico en el headset. 110° FOV. Incluye mandos Sense con gatillos adaptativos.',
    price: 10999, stock: 6, brand: 'Sony',
    section: SECTIONS.Consoles, category: 'Play Station', subcategory: 'Not Applicable',
    specs: { Display: 'OLED 4K HDR (2000x2040/eye)', 'Refresh Rate': '90/120Hz', FOV: '110°', 'Eye Tracking': 'Yes', 'Haptic Feedback': 'Yes (headset + controllers)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Pulse 3D Wireless Headset (PS5)',
    description: 'Headset inalámbrico oficial para PlayStation 5 con Tempest 3D AudioTech. Drivers de 40mm, micrófono doble con cancelación de ruido. 12 horas de batería, carga USB-C. Diseño que combina con la PS5.',
    price: 2499, stock: 25, brand: 'Sony',
    section: SECTIONS.Consoles, category: 'Play Station', subcategory: 'Not Applicable',
    specs: { Type: 'Wireless (USB adapter)', Driver: '40mm', Audio: 'Tempest 3D AudioTech', Battery: '12 hours', Mic: 'Dual Noise Cancelling' } as Record<string, string | number>,
    discountPercentage: 10, isFeatured: false, isNewProduct: false,
  },
  // === XBOX (have 1, need 4) ===
  {
    name: 'Xbox Series S 1TB (Carbon Black)',
    description: 'Consola Xbox Series S con 1TB SSD, color Carbon Black. GPU RDNA 2 de 4 TFLOPS, 10 GB GDDR6. Quick Resume, soporte hasta 1440p 120Hz, upscaling a 4K. La consola más compacta y económica de Microsoft.',
    price: 5999, stock: 18, brand: 'Microsoft',
    section: SECTIONS.Consoles, category: 'XBOX', subcategory: 'Not Applicable',
    specs: { Storage: '1TB NVMe SSD', GPU: '4 TFLOPS RDNA 2', RAM: '10 GB GDDR6', Resolution: 'Up to 1440p 120Hz (4K upscaling)', 'Quick Resume': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Xbox Wireless Controller (Astral Purple)',
    description: 'Mando inalámbrico Xbox con diseño Astral Purple. Gatillos y palancas con textura, botón Share dedicado, conexión a Xbox y PC. Batería AA (o recargable). Compatible con Xbox Series X|S, One, PC, Android e iOS.',
    price: 1599, stock: 30, brand: 'Microsoft',
    section: SECTIONS.Consoles, category: 'XBOX', subcategory: 'Not Applicable',
    specs: { Connectivity: 'Xbox Wireless + Bluetooth 5.1', 'Battery': 'AA (up to 40h)', Features: 'Textured triggers, Share button', Compatibility: 'Xbox X|S, One, PC, Mobile' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Xbox Game Pass Ultimate (12 meses)',
    description: 'Suscripción Xbox Game Pass Ultimate por 12 meses. Acceso a cientos de juegos en Xbox y PC, EA Play incluido, Xbox Cloud Gaming. Nuevos juegos de Microsoft el día de lanzamiento. Juega en consola, PC, nube y mobile.',
    price: 2999, stock: 50, brand: 'Microsoft',
    section: SECTIONS.Consoles, category: 'XBOX', subcategory: 'Not Applicable',
    specs: { Duration: '12 months', Platform: 'Xbox + PC + Cloud + Mobile', 'Day 1 Releases': 'Yes', 'EA Play': 'Included', 'Cloud Gaming': 'Included' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Xbox Elite Wireless Controller Series 2 Core',
    description: 'Mando profesional con palancas de tensión ajustable, gatillos hair trigger locks, pad direccional intercambiable. 40 horas de batería, cable USB-C, sticks y paddles intercambiables. Estuche de carga incluido.',
    price: 3999, stock: 10, brand: 'Microsoft',
    section: SECTIONS.Consoles, category: 'XBOX', subcategory: 'Not Applicable',
    specs: { Connectivity: 'Xbox Wireless + Bluetooth', Battery: '40 hours', 'Customization': 'Interchangeable sticks, D-pad, paddles', 'Hair Triggers': 'Yes', 'Case': 'Carrying case included' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  // === Nintendo (have 1, need 4) ===
  {
    name: 'Nintendo Switch OLED (White)',
    description: 'Nintendo Switch OLED con pantalla de 7 pulgadas OLED vibrante, 64GB interno, dock con puerto LAN. Ideal para jugar en casa y portátil. Incluye mandos Joy-Con blancos. Amplia biblioteca de juegos exclusivos.',
    price: 6499, stock: 15, brand: 'Nintendo',
    section: SECTIONS.Consoles, category: 'Nintendo', subcategory: 'Not Applicable',
    specs: { Display: '7" OLED 720p (1080p docked)', Storage: '64GB', Battery: '~9 hours', Dock: 'With LAN port', JoyCon: 'White included' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Nintendo Switch Pro Controller',
    description: 'Mando inalámbrico profesional para Nintendo Switch con agarre ergonómico, controles de movimiento, vibración HD, NFC para amiibo. 40 horas de batería, carga USB-C. Ideal para sesiones largas de juego.',
    price: 1799, stock: 25, brand: 'Nintendo',
    section: SECTIONS.Consoles, category: 'Nintendo', subcategory: 'Not Applicable',
    specs: { Connectivity: 'Wireless', Battery: '40 hours', Features: 'Motion controls, HD Rumble, NFC', Charging: 'USB-C', Compatibility: 'Switch, Switch OLED, Switch 2' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'La épica secuela de Breath of the Wild. Descubre los misterios de las Islas del Cielo y las Profundidades. Nuevas habilidades como Ultrahand y Fuse. Mundo abierto masivo con física y creatividad sin límites.',
    price: 1599, stock: 30, brand: 'Nintendo',
    section: SECTIONS.Consoles, category: 'Nintendo', subcategory: 'Not Applicable',
    specs: { Platform: 'Nintendo Switch', Genre: 'Action-Adventure / Open World', Players: 1, 'File Size': '18.2 GB', 'ESRB': 'E10+' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Nintendo Switch Online + Expansion Pack (12m)',
    description: 'Suscripción anual a Nintendo Switch Online + Expansion Pack. Juego online, biblioteca de juegos NES/SNES/N64/Genesis, DLC de Animal Crossing: Happy Home Paradise y Mario Kart 8 Deluxe Booster Course Pass.',
    price: 999, stock: 50, brand: 'Nintendo',
    section: SECTIONS.Consoles, category: 'Nintendo', subcategory: 'Not Applicable',
    specs: { Duration: '12 months', 'Online Play': 'Yes', 'Classic Games': 'NES, SNES, N64, Genesis', DLC: 'Included (selected titles)', 'Cloud Saves': 'Yes' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Routers (have 1, need 4) ===
  {
    name: 'TP-Link Archer AX11000 Pro',
    description: 'Router gaming WiFi 6E tribanda con velocidad total de 11,000 Mbps. Procesador quad-core 2.2 GHz, 2 puertos 2.5G, 1 puerto 10G SFP+. VPN, HomeShield Pro, soporte VLAN. Cobertura masiva con 8 antenas.',
    price: 8499, stock: 5, brand: 'TP-Link',
    section: SECTIONS.Networking, category: 'Routers', subcategory: 'Not Applicable',
    specs: { Standard: 'WiFi 6E (802.11ax)', Bands: 'Tri-band (2.4+5+6 GHz)', Speed: 'Up to 11000 Mbps', CPU: 'Quad-Core 2.2 GHz', Ports: '1x 10G SFP+ + 2x 2.5G + 4x Gigabit' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Google Nest WiFi Pro (3-pack)',
    description: 'Sistema mesh WiFi 6E tribanda con cobertura para toda la casa. Velocidad hasta 5.4 Gbps. Configuración simple con Google Home. Compatibilidad con Thread y Matter para smart home. Cobertura hasta 200m² por pack.',
    price: 9999, stock: 8, brand: 'Google',
    section: SECTIONS.Networking, category: 'Routers', subcategory: 'Not Applicable',
    specs: { Standard: 'WiFi 6E (802.11ax)', Bands: 'Tri-band mesh', Coverage: '~200m² (3-pack)', 'Smart Home': 'Thread + Matter', Setup: 'Google Home app' } as Record<string, string | number>,
    discountPercentage: 5, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Ubiquiti UniFi 6 Pro Access Point',
    description: 'Access Point WiFi 6 empresarial con velocidad de 5.3 Gbps (2.4+5 GHz). Perfecto para montar en techo/pared. Alimentación PoE+ (inyector incluido). Gestión con UniFi Network. Ideal para oficinas y gamers exigentes.',
    price: 2399, stock: 15, brand: 'Ubiquiti',
    section: SECTIONS.Networking, category: 'Routers', subcategory: 'Not Applicable',
    specs: { Standard: 'WiFi 6 (802.11ax)', Bands: 'Dual-band (2.4+5 GHz)', Speed: 'Up to 5.3 Gbps', Power: 'PoE+ (injector included)', Management: 'UniFi Network (self-hosted/Cloud)' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'TP-Link Deco XE75 (3-pack)',
    description: 'Sistema mesh WiFi 6E tribanda de alta velocidad. Cada unidad cubre hasta 250m². Puertos 2.5G, ideal para gaming y streaming 4K/8K. Configuración sencilla con app Deco. Conexión estable para 200+ dispositivos.',
    price: 7499, stock: 10, brand: 'TP-Link',
    section: SECTIONS.Networking, category: 'Routers', subcategory: 'Not Applicable',
    specs: { Standard: 'WiFi 6E (802.11ax)', Bands: 'Tri-band mesh', 'Per Unit Coverage': '~250m²', Ports: '2x Gigabit per unit', 'Device Limit': '200+ devices' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
  // === Chairs (have 1, need 4) ===
  {
    name: 'Herman Miller x Logitech G Embody',
    description: 'La silla de oficina más ergonómica del mundo diseñada en colaboración con Logitech G. Backfit ajustable, Pixelated Support para distribución de presión, soporte lumbar PostureFit. Conocida como la mejor silla para gaming y trabajo.',
    price: 33999, stock: 3, brand: 'Herman Miller',
    section: SECTIONS.Accessories, category: 'Chairs', subcategory: 'Not Applicable',
    specs: { Type: 'Ergonomic Office/Gaming', Material: 'Rhythm fabric + foam', Lumbar: 'PostureFit SL', Arms: 'Adjustable 4D', Back: 'Pixelated Support', Weight: '~45kg', Warranty: '12 years' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: true, isNewProduct: false,
  },
  {
    name: 'Razer Iskur V2',
    description: 'Silla gaming ergonómica con soporte lumbar ajustable de 6 posiciones. Espuma de alta densidad molded, reposabrazos 4D, respaldo reclinable 152°. Tapizado PCU (Policloruro de vinilo) resistente y fácil de limpiar.',
    price: 10499, stock: 8, brand: 'Razer',
    section: SECTIONS.Accessories, category: 'Chairs', subcategory: 'Not Applicable',
    specs: { Type: 'Gaming Chair', Material: 'PCU Leather', Lumbar: '6-position adjustable', Arms: '4D', Recline: '152°', 'Weight Capacity': '~136kg' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: true,
  },
  {
    name: 'Corsair T3 Rush (Grey/White)',
    description: 'Silla gaming con tela transpirable en lugar de cuero, ideal para climas cálidos. Espuma molded de alta densidad, reposabrazos 4D, soporte lumbar ajustable. Base de acero con ruedas silenciosas. Peso máximo 136kg.',
    price: 7499, stock: 10, brand: 'Corsair',
    section: SECTIONS.Accessories, category: 'Chairs', subcategory: 'Not Applicable',
    specs: { Type: 'Gaming Chair', Material: 'Breathable Fabric', Lumbar: 'Adjustable', Arms: '4D', Recline: '180°', 'Weight Capacity': '136kg' } as Record<string, string | number>,
    discountPercentage: 10, isFeatured: false, isNewProduct: false,
  },
  {
    name: 'Noblechair Hero Series (Black/Red)',
    description: 'Silla gaming robusta con espuma Cold Cure, reposabrazos 4D ajustables, soporte lumbar integrado con masaje. Respaldo reclinable hasta 160°. Base de aluminio, ruedas de 60mm. Construcción metálica reforzada.',
    price: 8999, stock: 6, brand: 'Noblechairs',
    section: SECTIONS.Accessories, category: 'Chairs', subcategory: 'Not Applicable',
    specs: { Type: 'Gaming Chair', Material: 'PU Leather (Cold Cure foam)', Lumbar: 'Integrated + massage', Arms: '4D', Recline: '160°', Base: 'Aluminum', 'Weight Capacity': '150kg' } as Record<string, string | number>,
    discountPercentage: 0, isFeatured: false, isNewProduct: false,
  },
];

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db!;

  // 1. Update ALL existing product images to placehold.co
  const existingProducts = await Product.find({});
  console.log(`Found ${existingProducts.length} existing products. Updating images...`);

  for (const product of existingProducts) {
    const shortName = product.name.substring(0, 25).replace(/&/g, 'and');
    const newImages = [IMG(shortName)];
    await Product.updateOne({ _id: product._id }, { $set: { images: newImages } });
  }
  console.log('✓ All existing product images updated.');

  // 2. Count current products per category
  const counts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c: { _id: string; count: number }) => { countMap[c._id] = c.count; });

  console.log('\nCurrent counts:');
  for (const [cat, count] of Object.entries(countMap).sort()) {
    console.log(`  ${cat}: ${count}`);
  }

  // 3. Insert new products
  const existingNames = new Set((await Product.find({}, 'name').lean()).map(p => p.name));
  let inserted = 0;

  for (const prod of NEW_PRODUCTS) {
    if (existingNames.has(prod.name)) {
      console.log(`  Skipping (already exists): ${prod.name}`);
      continue;
    }
    const shortName = prod.name.substring(0, 25).replace(/&/g, 'and');
    await Product.create({
      ...prod,
      images: [IMG(shortName)],
      videos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inserted++;
  }

  console.log(`\n✓ Inserted ${inserted} new products.`);

  // 4. Final counts
  const finalCounts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log('\nFinal counts per category:');
  let allOk = true;
  for (const c of finalCounts) {
    const ok = c.count >= 5 ? '✓' : '✗';
    if (c.count < 5) allOk = false;
    console.log(`  ${ok} ${c._id}: ${c.count}`);
  }
  console.log(allOk ? '\n✅ All categories have at least 5 products!' : '\n⚠️  Some categories still need more products.');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
