
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
  }
];

const collections = [
  { name: "All Collections", count: mockNFTs.length },
  { name: "Oeconomia Genesis", count: 1 },
  { name: "Crypto Creatures", count: 1 },
  { name: "DeFi Bots", count: 1 },
  { name: "Magic Crystals", count: 1 },
  { name: "Pool Guardians", count: 1 },
  { name: "DAO Emblems", count: 1 }
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
                            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                              <img 
                                src={nft.image} 
                                alt={nft.name}
                                className="w-16 h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
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
