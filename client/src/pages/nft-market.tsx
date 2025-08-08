
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Eye,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Activity,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Image as ImageIcon,
  Palette,
  Camera,
  Music,
  Video,
  Gamepad2,
  Zap,
  Crown,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";
import { WalletSetupGuide } from "@/components/wallet-setup-guide";
import { useAccount } from "wagmi";

// Mock NFT data
const mockNFTs = [
  {
    id: 1,
    name: "Oeconomia Genesis #001",
    collection: "Oeconomia Genesis",
    image: "/oec-logo.png",
    price: 2.5,
    currency: "OEC",
    usdValue: 2.5,
    lastSale: 2.3,
    owner: "0x1234...5678",
    creator: "Oeconomia Team",
    category: "art",
    rarity: "legendary",
    likes: 156,
    views: 2340,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Background", value: "Cosmic", rarity: 5 },
      { trait: "Symbol", value: "OEC", rarity: 10 },
      { trait: "Glow", value: "Blue", rarity: 15 }
    ]
  },
  {
    id: 2,
    name: "DeFi Dragon",
    collection: "Crypto Creatures",
    image: "/oec-logo.png",
    price: 1.8,
    currency: "OEC",
    usdValue: 1.8,
    lastSale: 1.5,
    owner: "0x2345...6789",
    creator: "CryptoArtist",
    category: "gaming",
    rarity: "epic",
    likes: 89,
    views: 1567,
    listed: true,
    auction: true,
    timeRemaining: "2h 45m",
    properties: [
      { trait: "Element", value: "Fire", rarity: 8 },
      { trait: "Wings", value: "Golden", rarity: 3 },
      { trait: "Eyes", value: "Emerald", rarity: 12 }
    ]
  },
  {
    id: 3,
    name: "Yield Farm Bot",
    collection: "DeFi Bots",
    image: "/oec-logo.png",
    price: 0.9,
    currency: "OEC",
    usdValue: 0.9,
    lastSale: 0.7,
    owner: "0x3456...7890",
    creator: "BotMaker",
    category: "utility",
    rarity: "rare",
    likes: 234,
    views: 3421,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Efficiency", value: "95%", rarity: 7 },
      { trait: "Protocol", value: "Multi-chain", rarity: 4 },
      { trait: "Rewards", value: "Auto-compound", rarity: 6 }
    ]
  },
  {
    id: 4,
    name: "Staking Rewards Crystal",
    collection: "Magic Crystals",
    image: "/oec-logo.png",
    price: 5.2,
    currency: "OEC",
    usdValue: 5.2,
    lastSale: 4.8,
    owner: "0x4567...8901",
    creator: "CrystalMage",
    category: "collectible",
    rarity: "mythic",
    likes: 567,
    views: 8901,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Power", value: "Infinite", rarity: 1 },
      { trait: "Color", value: "Rainbow", rarity: 2 },
      { trait: "Size", value: "Large", rarity: 9 }
    ]
  },
  {
    id: 5,
    name: "Liquidity Pool Guardian",
    collection: "Pool Guardians",
    image: "/oec-logo.png",
    price: 3.7,
    currency: "OEC",
    usdValue: 3.7,
    lastSale: 3.2,
    owner: "0x5678...9012",
    creator: "GuardianDAO",
    category: "utility",
    rarity: "epic",
    likes: 345,
    views: 5432,
    listed: true,
    auction: true,
    timeRemaining: "1d 12h",
    properties: [
      { trait: "Protection", value: "Max", rarity: 3 },
      { trait: "APY Boost", value: "25%", rarity: 5 },
      { trait: "Duration", value: "Eternal", rarity: 1 }
    ]
  },
  {
    id: 6,
    name: "Governance Token Emblem",
    collection: "DAO Emblems",
    image: "/oec-logo.png",
    price: 1.2,
    currency: "OEC",
    usdValue: 1.2,
    lastSale: 1.0,
    owner: "0x6789...0123",
    creator: "DAOBuilder",
    category: "governance",
    rarity: "rare",
    likes: 123,
    views: 2109,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Voting Power", value: "High", rarity: 8 },
      { trait: "Proposals", value: "Unlimited", rarity: 4 },
      { trait: "Rewards", value: "Active", rarity: 10 }
    ]
  },
  {
    id: 7,
    name: "Oeconomia Genesis #002",
    collection: "Oeconomia Genesis",
    image: "/oec-logo.png",
    price: 2.8,
    currency: "OEC",
    usdValue: 2.8,
    lastSale: 2.1,
    owner: "0x7890...1234",
    creator: "Oeconomia Team",
    category: "art",
    rarity: "legendary",
    likes: 234,
    views: 3456,
    listed: true,
    auction: true,
    timeRemaining: "3h 21m",
    properties: [
      { trait: "Background", value: "Stellar", rarity: 3 },
      { trait: "Symbol", value: "OEC", rarity: 10 },
      { trait: "Glow", value: "Purple", rarity: 8 }
    ]
  },
  {
    id: 8,
    name: "Frost Wyrm",
    collection: "Crypto Creatures",
    image: "/oec-logo.png",
    price: 2.1,
    currency: "OEC",
    usdValue: 2.1,
    lastSale: 1.8,
    owner: "0x8901...2345",
    creator: "CryptoArtist",
    category: "gaming",
    rarity: "epic",
    likes: 167,
    views: 2890,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Element", value: "Ice", rarity: 12 },
      { trait: "Wings", value: "Crystalline", rarity: 5 },
      { trait: "Eyes", value: "Sapphire", rarity: 7 }
    ]
  },
  {
    id: 9,
    name: "Lightning Phoenix",
    collection: "Crypto Creatures",
    image: "/oec-logo.png",
    price: 4.2,
    currency: "OEC",
    usdValue: 4.2,
    lastSale: 3.9,
    owner: "0x9012...3456",
    creator: "CryptoArtist",
    category: "gaming",
    rarity: "mythic",
    likes: 456,
    views: 6789,
    listed: true,
    auction: true,
    timeRemaining: "5h 12m",
    properties: [
      { trait: "Element", value: "Lightning", rarity: 4 },
      { trait: "Wings", value: "Ethereal", rarity: 2 },
      { trait: "Eyes", value: "Electric", rarity: 3 }
    ]
  },
  {
    id: 10,
    name: "Arbitrage Bot Alpha",
    collection: "DeFi Bots",
    image: "/oec-logo.png",
    price: 1.5,
    currency: "OEC",
    usdValue: 1.5,
    lastSale: 1.2,
    owner: "0x0123...4567",
    creator: "BotMaker",
    category: "utility",
    rarity: "epic",
    likes: 189,
    views: 2344,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Efficiency", value: "98%", rarity: 3 },
      { trait: "Protocol", value: "Cross-chain", rarity: 6 },
      { trait: "Speed", value: "Lightning", rarity: 4 }
    ]
  },
  {
    id: 11,
    name: "MEV Guardian",
    collection: "DeFi Bots",
    image: "/oec-logo.png",
    price: 2.7,
    currency: "OEC",
    usdValue: 2.7,
    lastSale: 2.3,
    owner: "0x1234...5678",
    creator: "BotMaker",
    category: "utility",
    rarity: "legendary",
    likes: 378,
    views: 5123,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Protection", value: "Maximum", rarity: 2 },
      { trait: "Detection", value: "Real-time", rarity: 5 },
      { trait: "Response", value: "Instant", rarity: 3 }
    ]
  },
  {
    id: 12,
    name: "Healing Crystal",
    collection: "Magic Crystals",
    image: "/oec-logo.png",
    price: 1.8,
    currency: "OEC",
    usdValue: 1.8,
    lastSale: 1.5,
    owner: "0x2345...6789",
    creator: "CrystalMage",
    category: "collectible",
    rarity: "rare",
    likes: 145,
    views: 2567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Power", value: "Restoration", rarity: 15 },
      { trait: "Color", value: "Green", rarity: 20 },
      { trait: "Size", value: "Medium", rarity: 25 }
    ]
  },
  {
    id: 13,
    name: "Shadow Crystal",
    collection: "Magic Crystals",
    image: "/oec-logo.png",
    price: 3.4,
    currency: "OEC",
    usdValue: 3.4,
    lastSale: 3.1,
    owner: "0x3456...7890",
    creator: "CrystalMage",
    category: "collectible",
    rarity: "epic",
    likes: 289,
    views: 4123,
    listed: true,
    auction: true,
    timeRemaining: "4h 33m",
    properties: [
      { trait: "Power", value: "Concealment", rarity: 8 },
      { trait: "Color", value: "Black", rarity: 12 },
      { trait: "Size", value: "Large", rarity: 9 }
    ]
  },
  {
    id: 14,
    name: "Flash Loan Guardian",
    collection: "Pool Guardians",
    image: "/oec-logo.png",
    price: 2.9,
    currency: "OEC",
    usdValue: 2.9,
    lastSale: 2.5,
    owner: "0x4567...8901",
    creator: "GuardianDAO",
    category: "utility",
    rarity: "rare",
    likes: 234,
    views: 3789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Speed", value: "Instant", rarity: 6 },
      { trait: "Security", value: "High", rarity: 12 },
      { trait: "Capacity", value: "Unlimited", rarity: 4 }
    ]
  },
  {
    id: 15,
    name: "Validator Emblem",
    collection: "DAO Emblems",
    image: "/oec-logo.png",
    price: 1.6,
    currency: "OEC",
    usdValue: 1.6,
    lastSale: 1.3,
    owner: "0x5678...9012",
    creator: "DAOBuilder",
    category: "governance",
    rarity: "epic",
    likes: 167,
    views: 2890,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Authority", value: "Validator", rarity: 8 },
      { trait: "Stake", value: "High", rarity: 15 },
      { trait: "Reputation", value: "Trusted", rarity: 10 }
    ]
  },
  {
    id: 16,
    name: "Pixel Punk #001",
    collection: "Retro Punks",
    image: "/oec-logo.png",
    price: 0.8,
    currency: "OEC",
    usdValue: 0.8,
    lastSale: 0.6,
    owner: "0x6789...0123",
    creator: "PixelArtist",
    category: "art",
    rarity: "common",
    likes: 89,
    views: 1456,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Style", value: "8-bit", rarity: 25 },
      { trait: "Color", value: "Blue", rarity: 30 },
      { trait: "Accessory", value: "Glasses", rarity: 20 }
    ]
  },
  {
    id: 17,
    name: "Cosmic Melody #1",
    collection: "Sound Waves",
    image: "/oec-logo.png",
    price: 1.4,
    currency: "OEC",
    usdValue: 1.4,
    lastSale: 1.1,
    owner: "0x7890...1234",
    creator: "SoundMaster",
    category: "music",
    rarity: "rare",
    likes: 123,
    views: 2234,
    listed: true,
    auction: true,
    timeRemaining: "6h 45m",
    properties: [
      { trait: "Genre", value: "Ambient", rarity: 18 },
      { trait: "Duration", value: "3:42", rarity: 22 },
      { trait: "Frequency", value: "432Hz", rarity: 8 }
    ]
  },
  {
    id: 18,
    name: "Racing Beast #07",
    collection: "Speed Demons",
    image: "/oec-logo.png",
    price: 2.3,
    currency: "OEC",
    usdValue: 2.3,
    lastSale: 2.0,
    owner: "0x8901...2345",
    creator: "RaceCreator",
    category: "gaming",
    rarity: "epic",
    likes: 345,
    views: 4567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Speed", value: "340 MPH", rarity: 5 },
      { trait: "Engine", value: "V12 Turbo", rarity: 7 },
      { trait: "Color", value: "Neon Red", rarity: 12 }
    ]
  },
  {
    id: 19,
    name: "Virtual Land Plot #42",
    collection: "Metaverse Plots",
    image: "/oec-logo.png",
    price: 6.8,
    currency: "OEC",
    usdValue: 6.8,
    lastSale: 6.2,
    owner: "0x9012...3456",
    creator: "MetaBuilder",
    category: "utility",
    rarity: "legendary",
    likes: 567,
    views: 8901,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Location", value: "City Center", rarity: 3 },
      { trait: "Size", value: "1000 sqm", rarity: 8 },
      { trait: "Utilities", value: "Full", rarity: 15 }
    ]
  },
  {
    id: 20,
    name: "AI Portrait #013",
    collection: "Digital Souls",
    image: "/oec-logo.png",
    price: 1.9,
    currency: "OEC",
    usdValue: 1.9,
    lastSale: 1.6,
    owner: "0x0123...4567",
    creator: "AIArtist",
    category: "art",
    rarity: "rare",
    likes: 234,
    views: 3456,
    listed: true,
    auction: true,
    timeRemaining: "2h 18m",
    properties: [
      { trait: "Expression", value: "Contemplative", rarity: 16 },
      { trait: "Style", value: "Photorealistic", rarity: 11 },
      { trait: "Emotion", value: "Serene", rarity: 19 }
    ]
  },
  {
    id: 21,
    name: "Quantum Sword",
    collection: "Legendary Weapons",
    image: "/oec-logo.png",
    price: 4.5,
    currency: "OEC",
    usdValue: 4.5,
    lastSale: 4.1,
    owner: "0x1234...5678",
    creator: "WeaponSmith",
    category: "gaming",
    rarity: "mythic",
    likes: 456,
    views: 6789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Damage", value: "9999", rarity: 2 },
      { trait: "Element", value: "Quantum", rarity: 1 },
      { trait: "Rarity", value: "Artifact", rarity: 3 }
    ]
  },
  {
    id: 22,
    name: "Time Crystal",
    collection: "Magic Crystals",
    image: "/oec-logo.png",
    price: 7.2,
    currency: "OEC",
    usdValue: 7.2,
    lastSale: 6.8,
    owner: "0x2345...6789",
    creator: "CrystalMage",
    category: "collectible",
    rarity: "mythic",
    likes: 678,
    views: 9876,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Power", value: "Temporal", rarity: 1 },
      { trait: "Color", value: "Prismatic", rarity: 2 },
      { trait: "Age", value: "Ancient", rarity: 4 }
    ]
  },
  {
    id: 23,
    name: "Neon Cat #088",
    collection: "Cyber Pets",
    image: "/oec-logo.png",
    price: 1.1,
    currency: "OEC",
    usdValue: 1.1,
    lastSale: 0.9,
    owner: "0x3456...7890",
    creator: "PetCreator",
    category: "collectible",
    rarity: "common",
    likes: 156,
    views: 2345,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Species", value: "Cat", rarity: 35 },
      { trait: "Color", value: "Neon Pink", rarity: 18 },
      { trait: "Expression", value: "Happy", rarity: 28 }
    ]
  },
  {
    id: 24,
    name: "Bass Drop Supreme",
    collection: "Sound Waves",
    image: "/oec-logo.png",
    price: 2.6,
    currency: "OEC",
    usdValue: 2.6,
    lastSale: 2.3,
    owner: "0x4567...8901",
    creator: "SoundMaster",
    category: "music",
    rarity: "epic",
    likes: 289,
    views: 4123,
    listed: true,
    auction: true,
    timeRemaining: "7h 22m",
    properties: [
      { trait: "Genre", value: "Dubstep", rarity: 12 },
      { trait: "BPM", value: "140", rarity: 15 },
      { trait: "Drop", value: "Legendary", rarity: 5 }
    ]
  },
  {
    id: 25,
    name: "Hologram Warrior",
    collection: "Future Fighters",
    image: "/oec-logo.png",
    price: 3.1,
    currency: "OEC",
    usdValue: 3.1,
    lastSale: 2.8,
    owner: "0x5678...9012",
    creator: "FutureCraft",
    category: "gaming",
    rarity: "rare",
    likes: 234,
    views: 3789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Weapon", value: "Energy Blade", rarity: 9 },
      { trait: "Armor", value: "Quantum Shield", rarity: 7 },
      { trait: "Skill", value: "Phase Walk", rarity: 6 }
    ]
  },
  {
    id: 26,
    name: "Digital Sunset",
    collection: "Vaporwave Dreams",
    image: "/oec-logo.png",
    price: 1.7,
    currency: "OEC",
    usdValue: 1.7,
    lastSale: 1.4,
    owner: "0x6789...0123",
    creator: "RetroArtist",
    category: "art",
    rarity: "rare",
    likes: 178,
    views: 2890,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Style", value: "Vaporwave", rarity: 14 },
      { trait: "Palette", value: "Sunset", rarity: 18 },
      { trait: "Mood", value: "Nostalgic", rarity: 16 }
    ]
  },
  {
    id: 27,
    name: "Oracle Node #001",
    collection: "Network Nodes",
    image: "/oec-logo.png",
    price: 4.8,
    currency: "OEC",
    usdValue: 4.8,
    lastSale: 4.3,
    owner: "0x7890...1234",
    creator: "NodeMaster",
    category: "utility",
    rarity: "legendary",
    likes: 345,
    views: 5678,
    listed: true,
    auction: true,
    timeRemaining: "3h 55m",
    properties: [
      { trait: "Reliability", value: "99.9%", rarity: 4 },
      { trait: "Speed", value: "Instant", rarity: 6 },
      { trait: "Coverage", value: "Global", rarity: 8 }
    ]
  },
  {
    id: 28,
    name: "Cosmic Butterfly",
    collection: "Space Gardens",
    image: "/oec-logo.png",
    price: 2.2,
    currency: "OEC",
    usdValue: 2.2,
    lastSale: 1.9,
    owner: "0x8901...2345",
    creator: "GardenKeeper",
    category: "collectible",
    rarity: "epic",
    likes: 267,
    views: 3901,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Species", value: "Stellar Wing", rarity: 8 },
      { trait: "Pattern", value: "Galaxy", rarity: 5 },
      { trait: "Luminosity", value: "Bright", rarity: 12 }
    ]
  },
  {
    id: 29,
    name: "Mech Pilot Avatar",
    collection: "Battle Mechs",
    image: "/oec-logo.png",
    price: 3.6,
    currency: "OEC",
    usdValue: 3.6,
    lastSale: 3.2,
    owner: "0x9012...3456",
    creator: "MechBuilder",
    category: "gaming",
    rarity: "epic",
    likes: 389,
    views: 5234,
    listed: true,
    auction: true,
    timeRemaining: "8h 17m",
    properties: [
      { trait: "Mech Type", value: "Assault", rarity: 11 },
      { trait: "Pilot Rank", value: "Ace", rarity: 7 },
      { trait: "Combat Rating", value: "S-Class", rarity: 4 }
    ]
  },
  {
    id: 30,
    name: "Frequency Wave #777",
    collection: "Sound Waves",
    image: "/oec-logo.png",
    price: 1.3,
    currency: "OEC",
    usdValue: 1.3,
    lastSale: 1.1,
    owner: "0x0123...4567",
    creator: "SoundMaster",
    category: "music",
    rarity: "rare",
    likes: 134,
    views: 2456,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Frequency", value: "777Hz", rarity: 13 },
      { trait: "Waveform", value: "Sine", rarity: 20 },
      { trait: "Harmonic", value: "Perfect", rarity: 9 }
    ]
  },
  {
    id: 31,
    name: "Cyber Samurai",
    collection: "Digital Warriors",
    image: "/oec-logo.png",
    price: 5.1,
    currency: "OEC",
    usdValue: 5.1,
    lastSale: 4.7,
    owner: "0x1234...5678",
    creator: "WarriorForge",
    category: "gaming",
    rarity: "legendary",
    likes: 445,
    views: 6789,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Weapon", value: "Plasma Katana", rarity: 3 },
      { trait: "Armor", value: "Nano Suit", rarity: 5 },
      { trait: "Honor", value: "Legendary", rarity: 2 }
    ]
  },
  {
    id: 32,
    name: "Glitch Art #404",
    collection: "Error Collection",
    image: "/oec-logo.png",
    price: 0.7,
    currency: "OEC",
    usdValue: 0.7,
    lastSale: 0.5,
    owner: "0x2345...6789",
    creator: "GlitchMaster",
    category: "art",
    rarity: "common",
    likes: 87,
    views: 1345,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Error Type", value: "404", rarity: 25 },
      { trait: "Distortion", value: "High", rarity: 30 },
      { trait: "Color Shift", value: "RGB", rarity: 22 }
    ]
  },
  {
    id: 33,
    name: "Nebula Explorer",
    collection: "Space Voyagers",
    image: "/oec-logo.png",
    price: 2.9,
    currency: "OEC",
    usdValue: 2.9,
    lastSale: 2.6,
    owner: "0x3456...7890",
    creator: "SpaceArtist",
    category: "collectible",
    rarity: "rare",
    likes: 234,
    views: 3567,
    listed: true,
    auction: true,
    timeRemaining: "4h 12m",
    properties: [
      { trait: "Ship Class", value: "Explorer", rarity: 14 },
      { trait: "Engine", value: "Warp Drive", rarity: 8 },
      { trait: "Discovery", value: "First Contact", rarity: 6 }
    ]
  },
  {
    id: 34,
    name: "Plasma Shield Generator",
    collection: "Tech Arsenal",
    image: "/oec-logo.png",
    price: 3.8,
    currency: "OEC",
    usdValue: 3.8,
    lastSale: 3.4,
    owner: "0x4567...8901",
    creator: "TechCrafter",
    category: "utility",
    rarity: "epic",
    likes: 298,
    views: 4234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Shield Strength", value: "Ultra", rarity: 7 },
      { trait: "Energy Source", value: "Plasma", rarity: 9 },
      { trait: "Duration", value: "Permanent", rarity: 5 }
    ]
  },
  {
    id: 35,
    name: "Retro Console #80s",
    collection: "Gaming Nostalgia",
    image: "/oec-logo.png",
    price: 1.6,
    currency: "OEC",
    usdValue: 1.6,
    lastSale: 1.3,
    owner: "0x5678...9012",
    creator: "RetroGamer",
    category: "gaming",
    rarity: "rare",
    likes: 167,
    views: 2789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Era", value: "1980s", rarity: 15 },
      { trait: "Condition", value: "Mint", rarity: 8 },
      { trait: "Games", value: "100+", rarity: 12 }
    ]
  },
  {
    id: 36,
    name: "Digital Phoenix",
    collection: "Mythical Codes",
    image: "/oec-logo.png",
    price: 6.3,
    currency: "OEC",
    usdValue: 6.3,
    lastSale: 5.9,
    owner: "0x6789...0123",
    creator: "MythCreator",
    category: "collectible",
    rarity: "mythic",
    likes: 556,
    views: 8234,
    listed: true,
    auction: true,
    timeRemaining: "6h 38m",
    properties: [
      { trait: "Rebirth", value: "Infinite", rarity: 1 },
      { trait: "Flame", value: "Digital", rarity: 3 },
      { trait: "Power", value: "Resurrection", rarity: 2 }
    ]
  },
  {
    id: 37,
    name: "Quantum Entangled Pair",
    collection: "Quantum Collection",
    image: "/oec-logo.png",
    price: 8.7,
    currency: "OEC",
    usdValue: 8.7,
    lastSale: 8.1,
    owner: "0x7890...1234",
    creator: "QuantumLab",
    category: "utility",
    rarity: "mythic",
    likes: 667,
    views: 9567,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Entanglement", value: "Perfect", rarity: 1 },
      { trait: "State", value: "Superposition", rarity: 2 },
      { trait: "Coherence", value: "Eternal", rarity: 1 }
    ]
  },
  {
    id: 38,
    name: "Synthwave Racer",
    collection: "Neon Streets",
    image: "/oec-logo.png",
    price: 2.4,
    currency: "OEC",
    usdValue: 2.4,
    lastSale: 2.1,
    owner: "0x8901...2345",
    creator: "NeonArtist",
    category: "gaming",
    rarity: "epic",
    likes: 278,
    views: 3890,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Speed", value: "Mach 2", rarity: 8 },
      { trait: "Style", value: "Synthwave", rarity: 12 },
      { trait: "Glow", value: "Neon", rarity: 15 }
    ]
  },
  {
    id: 39,
    name: "Data Crystal Core",
    collection: "Information Gems",
    image: "/oec-logo.png",
    price: 4.1,
    currency: "OEC",
    usdValue: 4.1,
    lastSale: 3.7,
    owner: "0x9012...3456",
    creator: "DataMiner",
    category: "utility",
    rarity: "legendary",
    likes: 334,
    views: 5123,
    listed: true,
    auction: true,
    timeRemaining: "5h 44m",
    properties: [
      { trait: "Storage", value: "Infinite", rarity: 3 },
      { trait: "Access Speed", value: "Instant", rarity: 5 },
      { trait: "Encryption", value: "Quantum", rarity: 4 }
    ]
  },
  {
    id: 40,
    name: "Holographic Whale",
    collection: "Ocean Dreams",
    image: "/oec-logo.png",
    price: 3.3,
    currency: "OEC",
    usdValue: 3.3,
    lastSale: 2.9,
    owner: "0x0123...4567",
    creator: "OceanKeeper",
    category: "collectible",
    rarity: "epic",
    likes: 289,
    views: 4456,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Species", value: "Blue Whale", rarity: 10 },
      { trait: "Projection", value: "Holographic", rarity: 7 },
      { trait: "Song", value: "Ancient", rarity: 5 }
    ]
  },
  {
    id: 41,
    name: "Cyber Punk Cat",
    collection: "Cyber Pets",
    image: "/oec-logo.png",
    price: 1.9,
    currency: "OEC",
    usdValue: 1.9,
    lastSale: 1.6,
    owner: "0x1234...5678",
    creator: "PetCreator",
    category: "collectible",
    rarity: "rare",
    likes: 198,
    views: 2967,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Augmentation", value: "Neural Implant", rarity: 12 },
      { trait: "Attitude", value: "Rebellious", rarity: 18 },
      { trait: "Hacking Skill", value: "Expert", rarity: 8 }
    ]
  },
  {
    id: 42,
    name: "Ancient Scroll of DeFi",
    collection: "Wisdom Artifacts",
    image: "/oec-logo.png",
    price: 5.6,
    currency: "OEC",
    usdValue: 5.6,
    lastSale: 5.2,
    owner: "0x2345...6789",
    creator: "AncientWisdom",
    category: "governance",
    rarity: "legendary",
    likes: 445,
    views: 6678,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Knowledge", value: "Infinite", rarity: 2 },
      { trait: "Age", value: "Primordial", rarity: 1 },
      { trait: "Power", value: "DeFi Mastery", rarity: 3 }
    ]
  },
  {
    id: 43,
    name: "Laser Grid Fighter",
    collection: "Arcade Legends",
    image: "/oec-logo.png",
    price: 1.8,
    currency: "OEC",
    usdValue: 1.8,
    lastSale: 1.5,
    owner: "0x3456...7890",
    creator: "ArcadeMaster",
    category: "gaming",
    rarity: "rare",
    likes: 156,
    views: 2534,
    listed: true,
    auction: true,
    timeRemaining: "3h 26m",
    properties: [
      { trait: "Weapon", value: "Twin Lasers", rarity: 14 },
      { trait: "Shield", value: "Energy Field", rarity: 16 },
      { trait: "Speed", value: "Light Speed", rarity: 9 }
    ]
  },
  {
    id: 44,
    name: "Memory Fragment #112",
    collection: "Lost Memories",
    image: "/oec-logo.png",
    price: 2.1,
    currency: "OEC",
    usdValue: 2.1,
    lastSale: 1.8,
    owner: "0x4567...8901",
    creator: "MemoryKeeper",
    category: "art",
    rarity: "epic",
    likes: 223,
    views: 3445,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Memory Type", value: "First Love", rarity: 11 },
      { trait: "Clarity", value: "Crystal Clear", rarity: 8 },
      { trait: "Emotion", value: "Joy", rarity: 15 }
    ]
  },
  {
    id: 45,
    name: "Blockchain Genesis Block",
    collection: "Chain Artifacts",
    image: "/oec-logo.png",
    price: 9.9,
    currency: "OEC",
    usdValue: 9.9,
    lastSale: 9.2,
    owner: "0x5678...9012",
    creator: "Satoshi",
    category: "utility",
    rarity: "mythic",
    likes: 789,
    views: 12345,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Block Number", value: "0", rarity: 1 },
      { trait: "Timestamp", value: "Genesis", rarity: 1 },
      { trait: "Hash", value: "Original", rarity: 1 }
    ]
  },
  {
    id: 46,
    name: "Neon Samurai Mask",
    collection: "Honor Masks",
    image: "/oec-logo.png",
    price: 3.7,
    currency: "OEC",
    usdValue: 3.7,
    lastSale: 3.3,
    owner: "0x6789...0123",
    creator: "MaskMaker",
    category: "collectible",
    rarity: "epic",
    likes: 334,
    views: 4789,
    listed: true,
    auction: true,
    timeRemaining: "7h 55m",
    properties: [
      { trait: "Material", value: "Plasma Forged", rarity: 6 },
      { trait: "Power", value: "Honor Boost", rarity: 9 },
      { trait: "Glow", value: "Neon Blue", rarity: 11 }
    ]
  },
  {
    id: 47,
    name: "Void Walker",
    collection: "Dimensional Beings",
    image: "/oec-logo.png",
    price: 4.9,
    currency: "OEC",
    usdValue: 4.9,
    lastSale: 4.5,
    owner: "0x7890...1234",
    creator: "VoidCrafter",
    category: "gaming",
    rarity: "legendary",
    likes: 445,
    views: 6234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Dimension", value: "Void", rarity: 3 },
      { trait: "Ability", value: "Phase Shift", rarity: 4 },
      { trait: "Origin", value: "Unknown", rarity: 2 }
    ]
  },
  {
    id: 48,
    name: "Digital Lotus",
    collection: "Zen Gardens",
    image: "/oec-logo.png",
    price: 2.8,
    currency: "OEC",
    usdValue: 2.8,
    lastSale: 2.5,
    owner: "0x8901...2345",
    creator: "ZenMaster",
    category: "art",
    rarity: "rare",
    likes: 267,
    views: 3789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Enlightenment", value: "Pure", rarity: 7 },
      { trait: "Serenity", value: "Perfect", rarity: 9 },
      { trait: "Growth", value: "Eternal", rarity: 5 }
    ]
  },
  {
    id: 49,
    name: "Plasma Rifle Mk.VII",
    collection: "Legendary Weapons",
    image: "/oec-logo.png",
    price: 3.4,
    currency: "OEC",
    usdValue: 3.4,
    lastSale: 3.1,
    owner: "0x9012...3456",
    creator: "WeaponSmith",
    category: "gaming",
    rarity: "epic",
    likes: 289,
    views: 4123,
    listed: true,
    auction: true,
    timeRemaining: "4h 17m",
    properties: [
      { trait: "Damage", value: "7500", rarity: 8 },
      { trait: "Range", value: "Long", rarity: 12 },
      { trait: "Ammo", value: "Energy", rarity: 15 }
    ]
  },
  {
    id: 50,
    name: "Astral Projection",
    collection: "Spirit Realm",
    image: "/oec-logo.png",
    price: 5.3,
    currency: "OEC",
    usdValue: 5.3,
    lastSale: 4.9,
    owner: "0x0123...4567",
    creator: "SpiritGuide",
    category: "collectible",
    rarity: "legendary",
    likes: 456,
    views: 6567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Plane", value: "Astral", rarity: 4 },
      { trait: "Connection", value: "Pure", rarity: 6 },
      { trait: "Vision", value: "Clear Sight", rarity: 3 }
    ]
  },
  {
    id: 51,
    name: "Code Matrix #001",
    collection: "Programming Legends",
    image: "/oec-logo.png",
    price: 2.6,
    currency: "OEC",
    usdValue: 2.6,
    lastSale: 2.3,
    owner: "0x1234...5678",
    creator: "CodeMaster",
    category: "utility",
    rarity: "rare",
    likes: 234,
    views: 3456,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Language", value: "Assembly", rarity: 13 },
      { trait: "Complexity", value: "O(1)", rarity: 9 },
      { trait: "Elegance", value: "Perfect", rarity: 7 }
    ]
  },
  {
    id: 52,
    name: "Storm Dragon",
    collection: "Elemental Beasts",
    image: "/oec-logo.png",
    price: 4.6,
    currency: "OEC",
    usdValue: 4.6,
    lastSale: 4.2,
    owner: "0x2345...6789",
    creator: "ElementForge",
    category: "gaming",
    rarity: "legendary",
    likes: 378,
    views: 5234,
    listed: true,
    auction: true,
    timeRemaining: "6h 23m",
    properties: [
      { trait: "Element", value: "Storm", rarity: 5 },
      { trait: "Power", value: "Lightning Call", rarity: 3 },
      { trait: "Fury", value: "Tempest", rarity: 4 }
    ]
  },
  {
    id: 53,
    name: "Geometric Dreams #33",
    collection: "Abstract Visions",
    image: "/oec-logo.png",
    price: 1.4,
    currency: "OEC",
    usdValue: 1.4,
    lastSale: 1.2,
    owner: "0x3456...7890",
    creator: "AbstractArtist",
    category: "art",
    rarity: "common",
    likes: 123,
    views: 2234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Pattern", value: "Fibonacci", rarity: 16 },
      { trait: "Symmetry", value: "Perfect", rarity: 19 },
      { trait: "Depth", value: "Infinite", rarity: 14 }
    ]
  },
  {
    id: 54,
    name: "Virtual Reality Headset X1",
    collection: "Future Tech",
    image: "/oec-logo.png",
    price: 3.9,
    currency: "OEC",
    usdValue: 3.9,
    lastSale: 3.5,
    owner: "0x4567...8901",
    creator: "TechVision",
    category: "utility",
    rarity: "epic",
    likes: 312,
    views: 4567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Resolution", value: "16K", rarity: 6 },
      { trait: "FOV", value: "360°", rarity: 8 },
      { trait: "Haptic", value: "Full Body", rarity: 4 }
    ]
  },
  {
    id: 55,
    name: "Crypto Punk Rebel",
    collection: "Rebellion Squad",
    image: "/oec-logo.png",
    price: 2.3,
    currency: "OEC",
    usdValue: 2.3,
    lastSale: 2.0,
    owner: "0x5678...9012",
    creator: "RebelArtist",
    category: "collectible",
    rarity: "rare",
    likes: 189,
    views: 2890,
    listed: true,
    auction: true,
    timeRemaining: "5h 41m",
    properties: [
      { trait: "Attitude", value: "Defiant", rarity: 11 },
      { trait: "Gear", value: "Hacker Tools", rarity: 13 },
      { trait: "Status", value: "Wanted", rarity: 9 }
    ]
  },
  {
    id: 56,
    name: "Moonbeam Crystal",
    collection: "Celestial Stones",
    image: "/oec-logo.png",
    price: 3.2,
    currency: "OEC",
    usdValue: 3.2,
    lastSale: 2.9,
    owner: "0x6789...0123",
    creator: "StarCrafter",
    category: "collectible",
    rarity: "epic",
    likes: 245,
    views: 3678,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Source", value: "Moon", rarity: 7 },
      { trait: "Luminosity", value: "Ethereal", rarity: 9 },
      { trait: "Energy", value: "Lunar", rarity: 8 }
    ]
  },
  {
    id: 57,
    name: "Retro Arcade Cabinet",
    collection: "Gaming Nostalgia",
    image: "/oec-logo.png",
    price: 4.4,
    currency: "OEC",
    usdValue: 4.4,
    lastSale: 4.0,
    owner: "0x7890...1234",
    creator: "RetroGamer",
    category: "gaming",
    rarity: "legendary",
    likes: 389,
    views: 5456,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Games", value: "Classic 80s", rarity: 5 },
      { trait: "Condition", value: "Museum Quality", rarity: 3 },
      { trait: "Rarity", value: "First Edition", rarity: 2 }
    ]
  },
  {
    id: 58,
    name: "Neural Interface",
    collection: "Cybernetic Implants",
    image: "/oec-logo.png",
    price: 6.1,
    currency: "OEC",
    usdValue: 6.1,
    lastSale: 5.7,
    owner: "0x8901...2345",
    creator: "CyberDoc",
    category: "utility",
    rarity: "legendary",
    likes: 467,
    views: 6789,
    listed: true,
    auction: true,
    timeRemaining: "8h 32m",
    properties: [
      { trait: "Bandwidth", value: "Unlimited", rarity: 3 },
      { trait: "Compatibility", value: "Universal", rarity: 4 },
      { trait: "Security", value: "Quantum", rarity: 5 }
    ]
  },
  {
    id: 59,
    name: "Fractal Mandala",
    collection: "Sacred Geometry",
    image: "/oec-logo.png",
    price: 2.7,
    currency: "OEC",
    usdValue: 2.7,
    lastSale: 2.4,
    owner: "0x9012...3456",
    creator: "GeometryMaster",
    category: "art",
    rarity: "rare",
    likes: 234,
    views: 3567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Complexity", value: "Infinite", rarity: 6 },
      { trait: "Symmetry", value: "Perfect", rarity: 8 },
      { trait: "Meditation", value: "Deep", rarity: 10 }
    ]
  },
  {
    id: 60,
    name: "Quantum Computer Core",
    collection: "Computing Evolution",
    image: "/oec-logo.png",
    price: 8.9,
    currency: "OEC",
    usdValue: 8.9,
    lastSale: 8.3,
    owner: "0x0123...4567",
    creator: "QuantumTech",
    category: "utility",
    rarity: "mythic",
    likes: 678,
    views: 9234,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Qubits", value: "1000", rarity: 1 },
      { trait: "Coherence", value: "Perfect", rarity: 2 },
      { trait: "Speed", value: "Instant", rarity: 1 }
    ]
  },
  {
    id: 61,
    name: "Stellar Wolf",
    collection: "Cosmic Creatures",
    image: "/oec-logo.png",
    price: 3.5,
    currency: "OEC",
    usdValue: 3.5,
    lastSale: 3.1,
    owner: "0x1234...5678",
    creator: "CosmicArtist",
    category: "collectible",
    rarity: "epic",
    likes: 298,
    views: 4123,
    listed: true,
    auction: true,
    timeRemaining: "2h 47m",
    properties: [
      { trait: "Constellation", value: "Lupus", rarity: 9 },
      { trait: "Starlight", value: "Blue Giant", rarity: 6 },
      { trait: "Howl", value: "Cosmic", rarity: 4 }
    ]
  },
  {
    id: 62,
    name: "Digital Graffiti #99",
    collection: "Street Art Digital",
    image: "/oec-logo.png",
    price: 1.6,
    currency: "OEC",
    usdValue: 1.6,
    lastSale: 1.3,
    owner: "0x2345...6789",
    creator: "StreetArtist",
    category: "art",
    rarity: "common",
    likes: 134,
    views: 2345,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Style", value: "Wildstyle", rarity: 18 },
      { trait: "Medium", value: "Hologram", rarity: 22 },
      { trait: "Location", value: "Virtual Wall", rarity: 25 }
    ]
  },
  {
    id: 63,
    name: "Time Loop Artifact",
    collection: "Temporal Objects",
    image: "/oec-logo.png",
    price: 7.8,
    currency: "OEC",
    usdValue: 7.8,
    lastSale: 7.2,
    owner: "0x3456...7890",
    creator: "TimeLord",
    category: "utility",
    rarity: "mythic",
    likes: 589,
    views: 8567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Duration", value: "Infinite Loop", rarity: 1 },
      { trait: "Stability", value: "Paradox Free", rarity: 2 },
      { trait: "Origin", value: "Future Past", rarity: 1 }
    ]
  },
  {
    id: 64,
    name: "Holographic Trading Card",
    collection: "Meta Cards",
    image: "/oec-logo.png",
    price: 1.9,
    currency: "OEC",
    usdValue: 1.9,
    lastSale: 1.6,
    owner: "0x4567...8901",
    creator: "CardMaster",
    category: "gaming",
    rarity: "rare",
    likes: 167,
    views: 2678,
    listed: true,
    auction: true,
    timeRemaining: "4h 55m",
    properties: [
      { trait: "Rarity", value: "Holographic", rarity: 12 },
      { trait: "Power Level", value: "9000", rarity: 8 },
      { trait: "Edition", value: "First", rarity: 6 }
    ]
  },
  {
    id: 65,
    name: "Cybernetic Eye",
    collection: "Augmented Reality",
    image: "/oec-logo.png",
    price: 4.7,
    currency: "OEC",
    usdValue: 4.7,
    lastSale: 4.3,
    owner: "0x5678...9012",
    creator: "AugmentTech",
    category: "utility",
    rarity: "legendary",
    likes: 345,
    views: 5234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Vision", value: "Spectrum Full", rarity: 4 },
      { trait: "Zoom", value: "Infinite", rarity: 3 },
      { trait: "Analysis", value: "Real-time", rarity: 5 }
    ]
  },
  {
    id: 66,
    name: "Digital Sunset Valley",
    collection: "Virtual Landscapes",
    image: "/oec-logo.png",
    price: 2.5,
    currency: "OEC",
    usdValue: 2.5,
    lastSale: 2.2,
    owner: "0x6789...0123",
    creator: "LandscapeAI",
    category: "art",
    rarity: "rare",
    likes: 223,
    views: 3234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Season", value: "Eternal Summer", rarity: 11 },
      { trait: "Weather", value: "Perfect", rarity: 14 },
      { trait: "Beauty", value: "Transcendent", rarity: 7 }
    ]
  },
  {
    id: 67,
    name: "Plasma Sword",
    collection: "Energy Weapons",
    image: "/oec-logo.png",
    price: 3.8,
    currency: "OEC",
    usdValue: 3.8,
    lastSale: 3.4,
    owner: "0x7890...1234",
    creator: "EnergyForge",
    category: "gaming",
    rarity: "epic",
    likes: 289,
    views: 4345,
    listed: true,
    auction: true,
    timeRemaining: "3h 18m",
    properties: [
      { trait: "Energy Type", value: "Plasma", rarity: 9 },
      { trait: "Sharpness", value: "Molecular", rarity: 5 },
      { trait: "Durability", value: "Eternal", rarity: 7 }
    ]
  },
  {
    id: 68,
    name: "Ancient AI Core",
    collection: "Lost Technology",
    image: "/oec-logo.png",
    price: 9.5,
    currency: "OEC",
    usdValue: 9.5,
    lastSale: 8.9,
    owner: "0x8901...2345",
    creator: "AncientTech",
    category: "utility",
    rarity: "mythic",
    likes: 723,
    views: 10234,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Intelligence", value: "Transcendent", rarity: 1 },
      { trait: "Age", value: "Millenia", rarity: 1 },
      { trait: "Knowledge", value: "Universal", rarity: 1 }
    ]
  },
  {
    id: 69,
    name: "Stardust Collector",
    collection: "Cosmic Tools",
    image: "/oec-logo.png",
    price: 2.9,
    currency: "OEC",
    usdValue: 2.9,
    lastSale: 2.6,
    owner: "0x9012...3456",
    creator: "StarHarvester",
    category: "utility",
    rarity: "rare",
    likes: 256,
    views: 3789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Capacity", value: "Infinite", rarity: 8 },
      { trait: "Purity", value: "99.9%", rarity: 10 },
      { trait: "Source", value: "Dying Stars", rarity: 6 }
    ]
  },
  {
    id: 70,
    name: "Neon Tiger",
    collection: "Electric Animals",
    image: "/oec-logo.png",
    price: 3.1,
    currency: "OEC",
    usdValue: 3.1,
    lastSale: 2.8,
    owner: "0x0123...4567",
    creator: "ElectricZoo",
    category: "collectible",
    rarity: "epic",
    likes: 278,
    views: 4012,
    listed: true,
    auction: true,
    timeRemaining: "6h 12m",
    properties: [
      { trait: "Voltage", value: "10,000V", rarity: 7 },
      { trait: "Pattern", value: "Lightning Stripes", rarity: 5 },
      { trait: "Roar", value: "Thunder", rarity: 9 }
    ]
  },
  {
    id: 71,
    name: "Mirror Dimension Portal",
    collection: "Dimensional Gates",
    image: "/oec-logo.png",
    price: 6.6,
    currency: "OEC",
    usdValue: 6.6,
    lastSale: 6.1,
    owner: "0x1234...5678",
    creator: "PortalMage",
    category: "utility",
    rarity: "legendary",
    likes: 456,
    views: 6789,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Destination", value: "Mirror Realm", rarity: 3 },
      { trait: "Stability", value: "Perfect", rarity: 4 },
      { trait: "Access", value: "Bidirectional", rarity: 5 }
    ]
  },
  {
    id: 72,
    name: "Hologram Dancer",
    collection: "Digital Performers",
    image: "/oec-logo.png",
    price: 2.2,
    currency: "OEC",
    usdValue: 2.2,
    lastSale: 1.9,
    owner: "0x2345...6789",
    creator: "PerformanceArt",
    category: "art",
    rarity: "rare",
    likes: 189,
    views: 2890,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Style", value: "Contemporary", rarity: 13 },
      { trait: "Grace", value: "Perfect", rarity: 9 },
      { trait: "Performance", value: "Infinite Loop", rarity: 11 }
    ]
  },
  {
    id: 73,
    name: "Quantum Entanglement Ring",
    collection: "Quantum Jewelry",
    image: "/oec-logo.png",
    price: 5.4,
    currency: "OEC",
    usdValue: 5.4,
    lastSale: 5.0,
    owner: "0x3456...7890",
    creator: "QuantumJeweler",
    category: "collectible",
    rarity: "legendary",
    likes: 412,
    views: 5678,
    listed: true,
    auction: true,
    timeRemaining: "5h 29m",
    properties: [
      { trait: "Entanglement", value: "Paired", rarity: 2 },
      { trait: "Material", value: "Quantum Gold", rarity: 3 },
      { trait: "Effect", value: "Telepathic Link", rarity: 1 }
    ]
  },
  {
    id: 74,
    name: "Cyber Monk",
    collection: "Digital Enlightenment",
    image: "/oec-logo.png",
    price: 4.0,
    currency: "OEC",
    usdValue: 4.0,
    lastSale: 3.7,
    owner: "0x4567...8901",
    creator: "DigitalZen",
    category: "collectible",
    rarity: "epic",
    likes: 334,
    views: 4567,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Enlightenment", value: "Digital Nirvana", rarity: 6 },
      { trait: "Meditation", value: "Quantum State", rarity: 4 },
      { trait: "Wisdom", value: "Infinite", rarity: 5 }
    ]
  },
  {
    id: 75,
    name: "Laser Light Symphony",
    collection: "Sound Waves",
    image: "/oec-logo.png",
    price: 3.3,
    currency: "OEC",
    usdValue: 3.3,
    lastSale: 3.0,
    owner: "0x5678...9012",
    creator: "SoundMaster",
    category: "music",
    rarity: "epic",
    likes: 298,
    views: 4234,
    listed: true,
    auction: true,
    timeRemaining: "7h 8m",
    properties: [
      { trait: "Visualization", value: "Laser Show", rarity: 7 },
      { trait: "Harmony", value: "Perfect", rarity: 5 },
      { trait: "Experience", value: "Transcendent", rarity: 4 }
    ]
  },
  {
    id: 76,
    name: "Crystal Dragon Egg",
    collection: "Dragon Artifacts",
    image: "/oec-logo.png",
    price: 8.1,
    currency: "OEC",
    usdValue: 8.1,
    lastSale: 7.6,
    owner: "0x6789...0123",
    creator: "DragonKeeper",
    category: "collectible",
    rarity: "mythic",
    likes: 634,
    views: 8901,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Species", value: "Crystal Dragon", rarity: 1 },
      { trait: "Status", value: "Unhatched", rarity: 2 },
      { trait: "Power", value: "Unlimited", rarity: 1 }
    ]
  },
  {
    id: 77,
    name: "Hacker's Terminal",
    collection: "Cyber Tools",
    image: "/oec-logo.png",
    price: 2.4,
    currency: "OEC",
    usdValue: 2.4,
    lastSale: 2.1,
    owner: "0x7890...1234",
    creator: "HackerCollective",
    category: "utility",
    rarity: "rare",
    likes: 212,
    views: 3123,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Access Level", value: "Root", rarity: 10 },
      { trait: "Security", value: "Quantum Encrypted", rarity: 8 },
      { trait: "Speed", value: "Instant", rarity: 12 }
    ]
  },
  {
    id: 78,
    name: "Ethereal Violin",
    collection: "Spectral Instruments",
    image: "/oec-logo.png",
    price: 4.8,
    currency: "OEC",
    usdValue: 4.8,
    lastSale: 4.4,
    owner: "0x8901...2345",
    creator: "GhostMusician",
    category: "music",
    rarity: "legendary",
    likes: 389,
    views: 5456,
    listed: true,
    auction: true,
    timeRemaining: "4h 42m",
    properties: [
      { trait: "Sound", value: "Otherworldly", rarity: 3 },
      { trait: "Material", value: "Ectoplasm", rarity: 2 },
      { trait: "Emotion", value: "Soul Stirring", rarity: 4 }
    ]
  },
  {
    id: 79,
    name: "Binary Waterfall",
    collection: "Code Landscapes",
    image: "/oec-logo.png",
    price: 1.8,
    currency: "OEC",
    usdValue: 1.8,
    lastSale: 1.5,
    owner: "0x9012...3456",
    creator: "CodeArtist",
    category: "art",
    rarity: "common",
    likes: 145,
    views: 2234,
    listed: true,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Flow", value: "Continuous", rarity: 20 },
      { trait: "Pattern", value: "Binary", rarity: 24 },
      { trait: "Beauty", value: "Mathematical", rarity: 18 }
    ]
  },
  {
    id: 80,
    name: "Oeconomia Genesis #999",
    collection: "Oeconomia Genesis",
    image: "/oec-logo.png",
    price: 12.5,
    currency: "OEC",
    usdValue: 12.5,
    lastSale: 11.8,
    owner: "0x0123...4567",
    creator: "Oeconomia Team",
    category: "art",
    rarity: "mythic",
    likes: 999,
    views: 15678,
    listed: false,
    auction: false,
    timeRemaining: null,
    properties: [
      { trait: "Background", value: "Genesis Void", rarity: 1 },
      { trait: "Symbol", value: "OEC Ultimate", rarity: 1 },
      { trait: "Edition", value: "Final Genesis", rarity: 1 }
    ]
  }
];

const collections = [
  { name: "All Collections", count: mockNFTs.length },
  { name: "Oeconomia Genesis", count: 3 },
  { name: "Crypto Creatures", count: 3 },
  { name: "DeFi Bots", count: 3 },
  { name: "Magic Crystals", count: 4 },
  { name: "Pool Guardians", count: 2 },
  { name: "DAO Emblems", count: 2 },
  { name: "Retro Punks", count: 1 },
  { name: "Sound Waves", count: 4 },
  { name: "Speed Demons", count: 1 },
  { name: "Metaverse Plots", count: 1 },
  { name: "Digital Souls", count: 1 },
  { name: "Legendary Weapons", count: 3 },
  { name: "Cyber Pets", count: 2 },
  { name: "Future Fighters", count: 1 },
  { name: "Vaporwave Dreams", count: 1 },
  { name: "Network Nodes", count: 1 },
  { name: "Space Gardens", count: 1 },
  { name: "Battle Mechs", count: 1 },
  { name: "Digital Warriors", count: 1 },
  { name: "Error Collection", count: 1 },
  { name: "Space Voyagers", count: 1 },
  { name: "Tech Arsenal", count: 1 },
  { name: "Gaming Nostalgia", count: 2 },
  { name: "Mythical Codes", count: 1 },
  { name: "Quantum Collection", count: 1 },
  { name: "Neon Streets", count: 1 },
  { name: "Information Gems", count: 1 },
  { name: "Ocean Dreams", count: 1 },
  { name: "Wisdom Artifacts", count: 1 },
  { name: "Arcade Legends", count: 1 },
  { name: "Lost Memories", count: 1 },
  { name: "Chain Artifacts", count: 1 },
  { name: "Honor Masks", count: 1 },
  { name: "Dimensional Beings", count: 1 },
  { name: "Zen Gardens", count: 1 },
  { name: "Spirit Realm", count: 1 },
  { name: "Programming Legends", count: 1 },
  { name: "Elemental Beasts", count: 1 },
  { name: "Abstract Visions", count: 1 },
  { name: "Future Tech", count: 1 },
  { name: "Rebellion Squad", count: 1 },
  { name: "Celestial Stones", count: 1 },
  { name: "Cybernetic Implants", count: 1 },
  { name: "Sacred Geometry", count: 1 },
  { name: "Computing Evolution", count: 1 },
  { name: "Cosmic Creatures", count: 1 },
  { name: "Street Art Digital", count: 1 },
  { name: "Temporal Objects", count: 1 },
  { name: "Meta Cards", count: 1 },
  { name: "Augmented Reality", count: 1 },
  { name: "Virtual Landscapes", count: 1 },
  { name: "Energy Weapons", count: 1 },
  { name: "Lost Technology", count: 1 },
  { name: "Cosmic Tools", count: 1 },
  { name: "Electric Animals", count: 1 },
  { name: "Dimensional Gates", count: 1 },
  { name: "Digital Performers", count: 1 },
  { name: "Quantum Jewelry", count: 1 },
  { name: "Digital Enlightenment", count: 1 },
  { name: "Dragon Artifacts", count: 1 },
  { name: "Cyber Tools", count: 1 },
  { name: "Spectral Instruments", count: 1 },
  { name: "Code Landscapes", count: 1 }
];

const categories = [
  { id: "all", name: "All Categories", icon: Grid3X3 },
  { id: "art", name: "Art", icon: Palette },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "utility", name: "Utility", icon: Zap },
  { id: "collectible", name: "Collectibles", icon: Star },
  { id: "governance", name: "Governance", icon: Award },
  { id: "music", name: "Music", icon: Music },
  { id: "video", name: "Video", icon: Video }
];

const rarities = [
  { id: "all", name: "All Rarities", color: "text-gray-400" },
  { id: "common", name: "Common", color: "text-gray-300" },
  { id: "rare", name: "Rare", color: "text-blue-400" },
  { id: "epic", name: "Epic", color: "text-purple-400" },
  { id: "legendary", name: "Legendary", color: "text-orange-400" },
  { id: "mythic", name: "Mythic", color: "text-red-400" }
];

export function NFTMarket() {
  const { isConnected } = useAccount();
  const [, setLocation] = useLocation();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All Collections");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filter NFTs based on current filters
  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = selectedCollection === "All Collections" || nft.collection === selectedCollection;
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || nft.rarity === selectedRarity;
    const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];
    
    return matchesSearch && matchesCollection && matchesCategory && matchesRarity && matchesPrice;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "popular":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = sortedNFTs.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number) => `${price.toFixed(2)} OEC`;
  const formatUSD = (price: number) => `$${price.toFixed(2)}`;

  const getRarityColor = (rarity: string) => {
    const rarityObj = rarities.find(r => r.id === rarity);
    return rarityObj?.color || "text-gray-400";
  };

  const handleLike = (nftId: number) => {
    const newLikedNFTs = new Set(likedNFTs);
    if (newLikedNFTs.has(nftId)) {
      newLikedNFTs.delete(nftId);
    } else {
      newLikedNFTs.add(nftId);
    }
    setLikedNFTs(newLikedNFTs);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-crypto-blue mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">OEC NFT Marketplace</h1>
              <p className="text-gray-400 mb-8">Connect your wallet to explore and trade NFTs</p>
              <div className="max-w-xs mx-auto">
                <WalletConnect />
                <WalletSetupGuide />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <Card className="crypto-card p-6 border h-fit">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                {/* Search */}
                <div className="mb-6">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Search NFTs
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or collection"
                      className="pl-10 bg-black/30 border-white/20"
                    />
                  </div>
                </div>

                {/* Collections */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Collection</Label>
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="bg-black/30 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((collection) => (
                        <SelectItem key={collection.name} value={collection.name}>
                          {collection.name} ({collection.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full justify-start ${
                            selectedCategory === category.id
                              ? 'bg-crypto-blue hover:bg-crypto-blue/80'
                              : 'bg-black/20 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Rarity */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Rarity</Label>
                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger className="bg-black/30 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rarities.map((rarity) => (
                        <SelectItem key={rarity.id} value={rarity.id}>
                          <span className={rarity.color}>{rarity.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCollection("All Collections");
                    setSelectedCategory("all");
                    setSelectedRarity("all");
                    setPriceRange([0, 10]);
                  }}
                  className="w-full border-gray-600 hover:bg-gray-600/10"
                >
                  Clear Filters
                </Button>
              </Card>
            )}

            {/* Main Content */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Sort and View Controls */}
              <Card className="crypto-card p-4 border mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                      {filteredNFTs.length} NFTs found
                    </span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 bg-black/30 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline"
                      className="border-crypto-blue/30 text-crypto-blue hover:bg-crypto-blue/10"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Create NFT
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 hover:bg-gray-600/10"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? 'bg-crypto-blue' : 'border-gray-600'}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? 'bg-crypto-blue' : 'border-gray-600'}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* NFT Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedNFTs.map((nft) => (
                    <Dialog key={nft.id}>
                      <DialogTrigger asChild>
                        <Card className="crypto-card border cursor-pointer hover:border-crypto-blue/50 transition-all duration-300 overflow-hidden group">
                          <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                              <img 
                                src={nft.image} 
                                alt={nft.name}
                                className="w-16 h-16 object-cover group-hover:scale-125 transition-transform duration-500 ease-in-out"
                              />
                            </div>
                            
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-2 space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(nft.id);
                                }}
                                className="border-white/40 bg-black/50 hover:bg-white/20"
                              >
                                <Heart className={`w-4 h-4 ${likedNFTs.has(nft.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/40 bg-black/50 hover:bg-white/20"
                              >
                                <Share2 className="w-4 h-4 text-white" />
                              </Button>
                            </div>

                            {/* Rarity badge */}
                            <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} bg-black/70`}>
                              {nft.rarity}
                            </Badge>

                            {/* Auction timer */}
                            {nft.auction && nft.timeRemaining && (
                              <Badge className="absolute top-2 left-2 bg-red-500/80 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                {nft.timeRemaining}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="mb-2">
                              <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                              <p className="text-sm text-gray-400 truncate">{nft.collection}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm text-gray-400">Price</p>
                                <p className="font-bold text-crypto-blue">{formatPrice(nft.price)}</p>
                                <p className="text-xs text-gray-500">{formatUSD(nft.usdValue)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">Last Sale</p>
                                <p className="text-sm font-medium">{formatPrice(nft.lastSale)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {nft.likes}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {nft.views}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </DialogTrigger>
                      
                      {/* NFT Detail Modal */}
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{nft.name}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Image */}
                          <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                            <img 
                              src={nft.image} 
                              alt={nft.name}
                              className="w-32 h-32 object-cover"
                            />
                          </div>
                          
                          {/* Details */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-400">Collection</p>
                              <p className="font-medium">{nft.collection}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-400">Owner</p>
                              <div className="flex items-center space-x-2">
                                <p className="font-mono text-sm">{nft.owner}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(nft.owner)}
                                >
                                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="text-2xl font-bold text-crypto-blue">{formatPrice(nft.price)}</p>
                              <p className="text-sm text-gray-500">{formatUSD(nft.usdValue)}</p>
                            </div>
                            
                            {/* Properties */}
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Properties</p>
                              <div className="grid grid-cols-2 gap-2">
                                {nft.properties.map((prop, index) => (
                                  <div key={index} className="bg-black/30 p-2 rounded border border-white/10">
                                    <p className="text-xs text-gray-400">{prop.trait}</p>
                                    <p className="text-sm font-medium">{prop.value}</p>
                                    <p className="text-xs text-crypto-blue">{prop.rarity}% have this</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex space-x-2">
                              {nft.listed && (
                                <Button className="flex-1 bg-crypto-blue hover:bg-crypto-blue/80">
                                  {nft.auction ? 'Place Bid' : 'Buy Now'}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => handleLike(nft.id)}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <Heart className={`w-4 h-4 ${likedNFTs.has(nft.id) ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedNFTs.map((nft) => (
                    <Card key={nft.id} className="crypto-card p-4 border">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-8 h-8 object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold">{nft.name}</h3>
                          <p className="text-sm text-gray-400">{nft.collection}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Price</p>
                          <p className="font-bold text-crypto-blue">{formatPrice(nft.price)}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Rarity</p>
                          <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {nft.listed && (
                            <Button size="sm" className="bg-crypto-blue hover:bg-crypto-blue/80">
                              Buy
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Card className="crypto-card p-4 border mt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="border-gray-600 hover:bg-gray-600/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'bg-crypto-blue' : 'border-gray-600'}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="border-gray-600 hover:bg-gray-600/10"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NFTMarket;
