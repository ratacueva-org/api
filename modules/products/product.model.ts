import mongoose, { Schema, Document } from "mongoose";

// Main Section Types
export const SectionValues = {
  VIDEO_GAMES: "Video Games", // Videojuegos
  COMPUTERS: "Computers", // Computadoras
  CONSOLES: "Consoles", // Consolas
  COMPONENTS: "Components", // Componentes
  STORAGE_FLASH: "Storage & Flash", // Almacenamiento y Flash
  ACCESSORIES: "Accessories", // Accesorios
  PERIPHERALS: "Peripherals", // Periféricos
  MONITORS: "Monitors", // Monitores
  CABLES_ADAPTERS: "Cables & Adapters", // Cables y Adaptadores
  POWER: "Power", // Energía
  NETWORKING: "Networking", // Redes
} as const;

export type SectionType = (typeof SectionValues)[keyof typeof SectionValues];

// Categories by Section
export const CategoryValues = {
  // Video Games
  PLATFORMS: "Platforms", // Plataformas
  POPULAR_GENRES: "Popular Genres", // Géneros Populares
  NICHE_GENRES: "Niche Genres", // Géneros de Nicho
  DISCOVER_BY_PRICE: "Discover by Price", // Descubrir por Precio

  // Computers
  WORKSTATIONS: "Workstations", // Estaciones de Trabajo
  LAPTOPS: "Laptops", // Laptops
  GAMING: "Gaming", // Gaming

  // Consoles
  ACCESSORIES: "Accessories", // Accesorios
  ARCADES: "Arcades", // Máquinas Arcade
  CONTROLLERS_JOYSTICKS: "Controllers/Joysticks", // Controles/Joysticks
  NINTENDO: "Nintendo", // Nintendo
  PLAY_STATION: "Play Station", // Play Station
  XBOX: "XBOX", // XBOX
  HANDHELDS: "Handhelds", // Portátiles

  // Components
  MOTHERBOARDS: "Motherboards", // Tarjetas Madre
  PROCESSORS: "Processors", // Procesadores
  RAM_MEMORY: "RAM Memory", // Memoria RAM
  HARD_DRIVES: "Hard Drives", // Discos Duros
  SSD: "Solid State Drives", // Unidades de Estado Sólido
  GRAPHICS_CARDS: "Graphics Cards", // Tarjetas Gráficas
  POWER_SUPPLIES: "Power Supplies", // Fuentes de Poder
  CASES: "Cases", // Gabinetes
  CASE_ACCESSORIES: "Case Accessories", // Accesorios para Gabinetes
  UPGRADE_COMBOS: "Upgrade Combos", // Combos para Actualización

  // Storage & Flash
  EXTERNAL_STORAGE: "External Storage", // Almacenamiento Externo
  USB_FLASH_DRIVES: "USB Flash Drives", // Memorias USB
  SD_MEMORY_CARDS: "SD Memory Cards", // Tarjetas de Memoria SD

  // Accessories
  DOCKS: "Docks", // Bases de Conexión
  CAPTURE_CARDS_STREAMING: "Capture Cards/Streaming", // Tarjetas de Captura/Streaming
  CPU_AIR_COOLERS: "CPU Air Coolers", // Enfriadores de Aire para CPU
  LIQUID_COOLING_AIO: "Liquid Cooling/AIO", // Enfriamiento Líquido/AIO
  DESKS: "Desks", // Escritorios
  LIGHTING: "Lighting", // Iluminación
  KEYCAPS_SWITCHES: "Keycaps/Mechanical Switches", // Keycaps/Switches Mecánicos
  CLEANING_MAINTENANCE: "Cleaning/Maintenance", // Limpieza/Mantenimiento
  BACKPACKS_CASES: "Backpacks/Cases", // Mochilas/Estuches
  OTHERS: "Others", // Otros
  CHAIRS: "Chairs", // Sillas

  // Peripherals
  HEADSET_ACCESSORIES: "Headset Accessories", // Accesorios para Audífonos
  HEADPHONES_HEADSETS: "Headphones/Headsets", // Audífonos/Headsets
  SPEAKERS: "Speakers", // Bocinas
  VIDEO_CAMERAS: "Video Cameras", // Cámaras de Video
  WEBCAMS: "Webcams", // Cámaras Web
  COMBOS: "Combos", // Combos
  HEADSETS: "Headsets", // Headsets
  MICROPHONES: "Microphones", // Micrófonos
  MOUSE: "Mouse", // Mouse
  SIMULATION_VR: "Simulation/VR", // Simulación/Realidad Virtual
  MOUSEPADS_WRIST_RESTS: "Mousepads/Wrist Rests", // Mousepads/Reposamuñecas
  KEYBOARDS: "Keyboards", // Teclados

  // Monitors
  MONITORS: "Monitors", // Monitores
  CURVED_MONITORS: "Curved Monitors", // Monitores Curvos
  VERTICAL_MONITORS: "Vertical Monitors", // Monitores Verticales
  PROJECTORS: "Projectors", // Proyectores

  // Cables & Adapters
  CABLES: "Cables", // Cables
  MULTIPORT_ADAPTERS: "Multi-Port Adapters", // Adaptadores Multipuerto

  // Power
  CHARGERS: "Chargers", // Cargadores
  POWER_BANKS: "Power Banks", // Baterías Portátiles
  VOLTAGE_REGULATORS_UPS: "Voltage Regulators/UPS", // Reguladores de Voltaje/UPS

  // Networking
  ADAPTERS: "Adapters", // Adaptadores
  WIFI_EXTENDERS: "Wi-Fi Extenders", // Extensores de Wi-Fi
  ROUTERS: "Routers", // Routers
  SWITCHES: "Switches", // Switches
} as const;

export type CategoryType = (typeof CategoryValues)[keyof typeof CategoryValues];

// Subcategories by Category
export const SubCategoryValues = {
  // Platforms
  STEAM: "Steam Games", // Juegos de Steam
  XBOX: "XBOX Games", // Juegos de XBOX
  PSN: "PSN Games", // Juegos de PSN
  MICROSOFT: "Microsoft Games", // Juegos de Microsoft
  NINTENDO_SWITCH: "Nintendo Switch Games", // Juegos de Nintendo Switch
  ORIGIN: "Origin Games", // Juegos de Origin
  UBISOFT: "Ubisoft Connect Games", // Juegos de Ubisoft Connect
  EPIC: "Epic Games", // Juegos de Epic
  GOG: "GOG Games", // Juegos de GOG
  BATTLENET: "Battle.net Games", // Juegos de Battle.net
  DLCS: "DLCs", // DLCs

  // Popular Genres
  SINGLE_PLAYER: "Single Player", // Un Jugador
  MULTIPLAYER: "Multiplayer", // Multijugador
  ACTION: "Action", // Acción
  FIRST_PERSON: "First Person", // Primera Persona
  THIRD_PERSON: "Third Person", // Tercera Persona
  SIMULATION: "Simulation", // Simulación
  SPORTS: "Sports", // Deportes
  COOP: "Co-Op", // Cooperativo
  FPS_TPS: "FPS/TPS", // FPS/TPS
  ADVENTURE: "Adventure", // Aventura
  STRATEGY: "Strategy", // Estrategia
  RACING: "Racing", // Carreras

  // Niche Genres
  INDIE: "Indie", // Indie
  RPG: "RPG", // RPG
  ISOMETRIC_VIEW: "Isometric View", // Vista Isométrica
  HORROR: "Horror", // Horror
  VR: "Virtual Reality", // Realidad Virtual
  PLATFORM: "Platform", // Plataformas
  HACK_SLASH: "Hack & Slash", // Hack & Slash
  FIGHTING: "Fighting", // Peleas
  PUZZLE: "Puzzle", // Puzzle
  MMO: "MMO", // MMO
  POINT_CLICK: "Point & Click", // Point & Click
  ARCADE: "Arcade", // Arcade

  // Discover by Price
  UNDER_10: "Under MX$10", // Menos de MX$10
  UNDER_20: "Under MX$20", // Menos de MX$20
  UNDER_50: "Under MX$50", // Menos de MX$50
  UNDER_100: "Under MX$100", // Menos de MX$100
  UNDER_250: "Under MX$250", // Menos de MX$250
  UNDER_500: "Under MX$500", // Menos de MX$500
  OVER_500: "Over MX$500", // Más de MX$500

  // No Subcategorie
  NOT_APPLICABLE: "Not Applicable",
} as const;

export type SubCategoryType =
  (typeof SubCategoryValues)[keyof typeof SubCategoryValues];

// Main Product Model
export interface IProduct extends Document {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  images: string[];
  videos?: string[]; // nuevo campo para videos
  section: SectionType;
  category: CategoryType;
  subcategory?: SubCategoryType;
  specs?: Record<string, string | number>;
  discountPercentage?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  isFeatured?: boolean;
  isNewProduct?: boolean; // renamed to avoid conflict with mongoose.Document's isNew
}

// MongoDB Schema for Product
const ProductSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    brand: { type: String },
    images: { type: [String], required: true },
    videos: { type: [String], required: false }, // videos como opcional
    section: {
      type: String,
      enum: Object.values(SectionValues),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(CategoryValues),
      required: true,
    },
    subcategory: {
      type: String,
      enum: Object.values(SubCategoryValues),
      required: false,
    },
    specs: { type: Schema.Types.Mixed },
    discountPercentage: { type: Number },
    rating: { type: Number },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false }, // renamed to match interface
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);