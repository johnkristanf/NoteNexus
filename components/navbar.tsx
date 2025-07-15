'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const scrollToFeatures = () => {
        const section = document.getElementById('features')
        section?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav className="fixed w-full top-0 z-50  bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* ICON AND NAME */}
                    <Link href={'/'} className="flex items-center space-x-2">
                        <Image
                            src={'/note_nexus_logo.svg'}
                            width={50}
                            height={50}
                            alt="Note Nexus Logo"
                        />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Note Nexus
                        </span>
                    </Link>

                    {/* NAVLINKS */}
                    <div className="hidden md:flex items-center gap-6 font-semibold">
                        <Link href={'/'} className="hover:text-violet-400 transition-colors">
                            Home
                        </Link>
                        <Link
                            href={'/feedback'}
                            className="hover:text-violet-400 transition-colors"
                        >
                            Feedback
                        </Link>
                    </div>

                    {/* GET STARTED AUTH LINK */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href={'/signin'}
                                className="hover:text-violet-400 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={'/signup'}
                                className="bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-100 text-gray-900  border-t border-white/20">
                    <div className="px-2 pt-2 pb-3  flex flex-col items-center gap-5 font-semibold">
                        <Link href={'/'} className="hover:text-violet-400 transition-colors">
                            Home
                        </Link>

                        <Link
                            href={'/feedback'}
                            className="hover:text-violet-400 transition-colors"
                        >
                            Feedback
                        </Link>

                        {/* GET STARTED AUTH LINK */}
                        <div className="flex flex-col items-center gap-5">
                            <Link
                                href={'/signin'}
                                className="hover:text-violet-400 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href={'/signup'}
                                className="text-white bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
