import Footer from '@/components/footer'
import NavBar from '@/components/navbar'

export default function FeedbackPage() {
    const feedbacks = [
        {
            name: 'Sarah Chen',
            role: 'Computer Science Student',
            content:
                'StudyMind transformed how I study. The AI extracts perfect summaries from my textbooks!',
            avatar: 'SC',
        },
        {
            name: 'Michael Rodriguez',
            role: 'Medical Student',
            content:
                'The sticky notes feature helps me organize complex medical concepts beautifully.',
            avatar: 'MR',
        },
        {
            name: 'Emma Thompson',
            role: 'Graduate Researcher',
            content:
                "Best learning platform I've used. The AI chat is incredibly helpful for research.",
            avatar: 'ET',
        },
    ]
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900 text-white">
            <NavBar />

            {/* FEEDBACK UI */}
            <div className="py-36  px-4 sm:px-6 lg:px-8 ">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            What Students Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {feedbacks.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-gray-300 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
