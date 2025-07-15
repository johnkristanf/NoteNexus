import Image from "next/image";

export default function Footer() {
    return (
        <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-black/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Image
                            src={'/note_nexus_logo.svg'}
                            width={50}
                            height={50}
                            alt="Note Nexus Logo"
                        />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Note Nexus
                        </span>
                    </div>
                    <p className="text-gray-300">© 2025 Note Nexus. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
