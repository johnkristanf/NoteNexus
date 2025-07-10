import { Link, Mic, Send } from 'lucide-react'

export default function NewChatPage() {
    return (
        <div className="h-[80vh] flex items-center justify-center ">
            <div className="w-full flex flex-col gap-5">
                {/* NOTE NEXUS INTRODUCTION */}
                <div className="flex flex-col items-center gap-1">
                    <h1 className="font-bold text-3xl">
                        Hi, I am Note <span className="text-violet-600">Nexus.</span>
                    </h1>
                    <p className="text-lg text-gray-500">How can I help in your studies?</p>
                </div>

                {/* CHATBOX */}
                <div className="w-full p-2 border-t border-slate-700 bg-slate-800 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none "
                        />
                    </div>

                    <div className="flex justify-between">
                        <button className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg ">
                            <Link />
                        </button>

                        <div className="flex gap-2">
                            <button className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg ">
                                <Mic />
                            </button>

                            <button className="bg-violet-600 hover:bg-violet-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg ">
                                <Send />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
