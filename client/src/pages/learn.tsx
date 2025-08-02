import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ExternalLink, 
  PlayCircle, 
  FileText, 
  TrendingUp, 
  Users, 
  Shield, 
  Coins,
  Globe,
  Lightbulb,
  MessageSquare,
  Video
} from "lucide-react";

export default function Learn() {
  const learningCategories = [
    {
      title: "Oeconomia Ecosystem",
      description: "Learn about the OEC token, governance, and ecosystem features",
      icon: Coins,
      gradient: "from-blue-500 to-cyan-400",
      resources: [
        {
          title: "Oeconomia Whitepaper",
          description: "Complete technical documentation and roadmap",
          type: "PDF",
          icon: FileText,
          url: "https://oeconomia.tech/whitepaper"
        },
        {
          title: "Tokenomics Guide",
          description: "Understanding OEC token distribution and utility",
          type: "Article",
          icon: TrendingUp,
          url: "https://oeconomia.tech/tokenomics"
        },
        {
          title: "Governance Overview",
          description: "How to participate in protocol decisions",
          type: "Guide",
          icon: Users,
          url: "https://oeconomia.tech/governance"
        }
      ]
    },
    {
      title: "DApp Navigation",
      description: "Master the Oeconomia dashboard and all its features",
      icon: Globe,
      gradient: "from-purple-500 to-pink-400",
      resources: [
        {
          title: "Getting Started Guide",
          description: "Your first steps in the Oeconomia ecosystem",
          type: "Tutorial",
          icon: PlayCircle,
          url: "https://oeconomia.tech/getting-started"
        },
        {
          title: "Staking Tutorial",
          description: "How to stake OEC tokens and earn rewards",
          type: "Video",
          icon: Video,
          url: "https://oeconomia.tech/staking-guide"
        },
        {
          title: "Portfolio Management",
          description: "Track and optimize your DeFi positions",
          type: "Guide",
          icon: TrendingUp,
          url: "https://oeconomia.tech/portfolio"
        }
      ]
    },
    {
      title: "Blockchain Basics",
      description: "Essential knowledge for navigating the crypto space",
      icon: Shield,
      gradient: "from-green-500 to-emerald-400",
      resources: [
        {
          title: "What is DeFi?",
          description: "Introduction to decentralized finance concepts",
          type: "Article",
          icon: Lightbulb,
          url: "https://ethereum.org/en/defi/"
        },
        {
          title: "Wallet Security",
          description: "Best practices for keeping your crypto safe",
          type: "Guide",
          icon: Shield,
          url: "https://ethereum.org/en/security/"
        },
        {
          title: "Understanding Gas Fees",
          description: "How transaction costs work on blockchain",
          type: "Article",
          icon: Coins,
          url: "https://ethereum.org/en/developers/docs/gas/"
        }
      ]
    },
    {
      title: "News & Updates",
      description: "Stay informed about crypto and DeFi developments",
      icon: MessageSquare,
      gradient: "from-orange-500 to-red-400",
      resources: [
        {
          title: "CoinDesk",
          description: "Latest cryptocurrency news and analysis",
          type: "News",
          icon: ExternalLink,
          url: "https://coindesk.com"
        },
        {
          title: "DeFi Pulse",
          description: "DeFi analytics and protocol updates",
          type: "Analytics",
          icon: TrendingUp,
          url: "https://defipulse.com"
        },
        {
          title: "Oeconomia Blog",
          description: "Official updates and ecosystem news",
          type: "Blog",
          icon: MessageSquare,
          url: "https://medium.com/@oeconomia2025"
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white">Learning Center</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Expand your knowledge about Oeconomia, DeFi, and blockchain technology with our curated educational resources.
            </p>
          </div>

          {/* Learning Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {learningCategories.map((category, index) => (
              <Card key={index} className="crypto-card border hover:border-gray-600 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {category.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200 group cursor-pointer"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                            <resource.icon className="w-4 h-4 text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {resource.description}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
                              {resource.type}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Section */}
          <Card className="crypto-card border mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl text-white">
                <Users className="w-6 h-6 text-cyan-400" />
                <span>Join the Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                Connect with other Oeconomia users, ask questions, and stay updated with the latest developments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => window.open('https://discord.com/invite/XSgZgeVD', '_blank')}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discord Community</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => window.open('https://x.com/Oeconomia2025', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Twitter Updates</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => window.open('https://medium.com/@oeconomia2025', '_blank')}
                >
                  <FileText className="w-4 h-4" />
                  <span>Medium Blog</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="crypto-card border mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Need More Help?</h3>
                <p className="text-gray-400 mb-6">
                  Can't find what you're looking for? Our community and support team are here to help.
                </p>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  onClick={() => window.open('mailto:admin@oeconomia.io', '_blank')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}