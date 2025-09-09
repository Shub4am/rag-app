'use client'
import { useUser } from '@clerk/nextjs';
import { ArrowRight, FileText, Database, Link, MessageSquare, Upload, Zap, Shield, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-gradient-to-br from-black/50 via-purple-950 to-indigo-950 text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
              <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
            </div>

            <div className="relative z-10">
              {isSignedIn && (
                <p className="text-2xl text-purple-300 p-5">
                  Hey {user.firstName}, welcome back!
                </p>
              )}

              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Chat with Your Documents
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-4xl mx-auto">
                Upload PDFs, CSVs, or web URLs and have intelligent conversations with your content.
                Powered by advanced AI to understand and answer questions about your documents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button onClick={handleChatNavigation} className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 cursor-pointer">
                  <span>Try RootLM Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Everything you need to unlock insights from your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600/30 transition-colors">
                <FileText className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">PDF Support</h3>
              <p className="text-purple-200">
                Upload and analyze PDF documents of any size. Extract text, understand structure, and get intelligent answers.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-indigo-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600/30 transition-colors">
                <Database className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">CSV Analysis</h3>
              <p className="text-purple-200">
                Import CSV files and perform complex data analysis through natural language queries and conversations.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-pink-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600/30 transition-colors">
                <Link className="h-8 w-8 text-pink-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Web URL Processing</h3>
              <p className="text-purple-200">
                Paste any web URL and instantly start chatting with the content from websites, articles, and more.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
                <Zap className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-purple-200">
                Get instant responses powered by state-of-the-art AI models optimized for document understanding.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-blue-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                <Shield className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Private</h3>
              <p className="text-purple-200">
                Your documents are processed securely with enterprise-grade encryption and privacy protection.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-orange-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600/30 transition-colors">
                <Users className="h-8 w-8 text-orange-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
              <p className="text-purple-200">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Upload Your Content</h3>
              <p className="text-purple-200">
                Drag and drop PDFs, upload CSV files, or paste web URLs. We support multiple formats and large files.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. AI Processing</h3>
              <p className="text-purple-200">
                Our advanced AI analyzes your content, understanding context, structure, and key information automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Start Chatting</h3>
              <p className="text-purple-200">
                Ask questions, request summaries, or explore your documents through natural conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-black/50 to-purple-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-purple-200 mb-10">
            Join thousands of users who are already chatting with their documents and unlocking insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={handleChatNavigation} className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cursor-pointer">
              <span>Try RootLM Now</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-8 w-8 text-purple-300" />
                <span className="text-2xl font-bold">Root LM</span>
              </div>
              <p className="text-purple-200">
                Intelligent document chat powered by advanced AI technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-800/30 mt-12 pt-8 text-center text-purple-200">
            <p>&copy; 2025 Root LM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}