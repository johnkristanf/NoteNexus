'use client'

import React from 'react'
import {
    MessageCircle,
    FileText,
    StickyNote,
    Upload,
    Brain,
    Sparkles,
    ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'

export default function LandingPage() {
    const features = [
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: 'AI Chat Assistant',
            description:
                'Engage with our ChatGPT-like AI assistant for instant help with any learning topic. Get explanations, ask questions, and receive personalized guidance.',
            gradient: 'from-blue-500 to-violet-600',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Smart Document Analysis',
            description:
                'Upload PDFs and DOCX files to extract key concepts, summaries, and insights. Transform your learning materials into digestible knowledge.',
            gradient: 'from-violet-500 to-purple-600',
        },
        {
            icon: <StickyNote className="w-8 h-8" />,
            title: 'Digital Sticky Notes',
            description:
                'Create, organize, and manage your thoughts. Keep track of important ideas and insights.',
            gradient: 'from-purple-500 to-blue-600',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900 text-white">
            <NavBar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse">
                        <Sparkles className="w-16 h-16 mx-auto mb-6 text-violet-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                        Learn Smarter with AI
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
                        Transform your learning experience with our AI-powered platform. Chat with
                        ChatGPT-like AI, extract insights from documents, and organize your thoughts
                        seamlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={'/signin'}
                            className="bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Start Learning Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Everything you need to supercharge your learning journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div
                                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            See It In Action
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Upload Your Documents</h3>
                                    <p className="text-gray-300">
                                        PDF, DOCX, and more formats supported
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">AI Analysis</h3>
                                    <p className="text-gray-300">
                                        Extract key concepts and summaries instantly
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <StickyNote className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Organize & Study</h3>
                                    <p className="text-gray-300">
                                        Create notes and chat with AI for deeper understanding
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                            <div className="bg-gradient-to-br from-blue-900 to-violet-900 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-blue-500/20 rounded-lg p-3">
                                        <p className="text-sm">
                                            📄 Document uploaded: "Machine Learning Basics.pdf"
                                        </p>
                                    </div>
                                    <div className="bg-violet-500/20 rounded-lg p-3">
                                        <p className="text-sm">
                                            🧠 Key concepts extracted: Neural Networks, Supervised
                                            Learning, Feature Engineering
                                        </p>
                                    </div>
                                    <div className="bg-purple-500/20 rounded-lg p-3">
                                        <p className="text-sm">
                                            💬 AI: "I've analyzed your document. Would you like me
                                            to explain any of these concepts?"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-violet-600/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        Ready to Transform Your Learning?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of students already learning smarter with Note Nexus
                    </p>
                    <Link
                        href={'/signin'}
                        className="bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Get Started, It's Free
                        <ChevronRight className="w-5 h-5 ml-2 inline" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
