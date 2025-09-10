'use client'
import { useUser } from '@clerk/nextjs';
import { ArrowRight, FileText, Database, MessageSquare, Upload, Zap, Shield, Users, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from "next/link";
import LiquidEther from '@/components/LiquidEther';

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const handleChatNavigation = () => {
    if (!isSignedIn) {
      return toast.error("Please sign in to chat", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/sign-in"),
        },
      });
    }
    return router.push('/home')
  }

  return (
    <div className="min-h-screen text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 ">
        <LiquidEther
          colors={['#00ff00', '#a7f00f', '#2dce35']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <div className="relative z-10">
              {isSignedIn && (
                <p className="text-2xl text-white p-5">
                  Hey {user.firstName}, welcome back!
                </p>
              )}

              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-400 via-green-200 to-lime-500 bg-clip-text text-transparent">
                Chat with Your Documents
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto">
                Upload PDFs, CSVs, or web URLs and have intelligent conversations with your content.
                Powered by advanced AI to understand and answer questions about your documents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button onClick={handleChatNavigation} className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 cursor-pointer shadow-lg shadow-green-500/25 hover:shadow-green-400/30">
                  <span>Try RootLM Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black/40 backdrop-blur-sm border-t border-green-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Everything you need to unlock insights from your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-green-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600/30 transition-colors border border-green-500/30">
                <FileText className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">PDF Support</h3>
              <p className="text-white">
                Upload and analyze PDF documents of any size. Extract text, understand structure, and get intelligent answers.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors border border-emerald-500/30">
                <Database className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">CSV Analysis</h3>
              <p className="text-white">
                Import CSV files and perform complex data analysis through natural language queries and conversations.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-lime-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lime-600/30 transition-colors border border-lime-500/30">
                <LinkIcon className="h-8 w-8 text-lime-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Web URL Processing</h3>
              <p className="text-white">
                Paste any web URL and instantly start chatting with the content from websites, articles, and more.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-green-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600/30 transition-colors border border-green-500/30">
                <Zap className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
              <p className="text-white">
                Get instant responses powered by state-of-the-art AI models optimized for document understanding.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors border border-emerald-500/30">
                <Shield className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Secure & Private</h3>
              <p className="text-white">
                Your documents are processed securely with enterprise-grade encryption and privacy protection.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="bg-lime-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-lime-600/30 transition-colors border border-lime-500/30">
                <Users className="h-8 w-8 text-lime-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Team Collaboration</h3>
              <p className="text-white">
                Share sources and collaborate with your team. Build knowledge bases that everyone can access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <Upload className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Upload Your Content</h3>
              <p className="text-white">
                Drag and drop PDFs, upload CSV files, or paste web URLs. We support multiple formats and large files.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-600 to-lime-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. AI Processing</h3>
              <p className="text-white">
                Our advanced AI analyzes your content, understanding context, structure, and key information automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-lime-600 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lime-500/30">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Start Chatting</h3>
              <p className="text-white">
                Ask questions, request summaries, or explore your documents through natural conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-sm border-t border-green-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-white mb-10">
            Join thousands of users who are already chatting with their documents and unlocking insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={handleChatNavigation} className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cursor-pointer shadow-lg shadow-green-500/25 hover:shadow-green-400/30">
              <span>Try RootLM Now</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-green-500/30 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-8 w-8 text-green-300" />
                <span className="text-2xl font-bold text-white">Root LM</span>
              </div>
              <p className="text-white">
                Intelligent document chat powered by advanced AI technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-white">
                <li><Link href="#" className="hover:text-green-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-white">
                <li><Link href="#" className="hover:text-green-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-white">
                <li><Link href="#" className="hover:text-green-400 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/api/health" className="hover:text-green-400 transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-500/30 mt-12 pt-8 text-center text-white">
            <p>&copy; 2025 Root LM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}