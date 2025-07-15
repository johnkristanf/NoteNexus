import Footer from '@/components/footer'
import NavBar from '@/components/navbar'
import { SignupForm } from '@/components/signup-form'

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900 text-white">
            <NavBar />
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-br from-blue-900 via-violet-900 to-purple-900 text-white">
                <div className="flex w-full max-w-sm pt-18 flex-col gap-6">
                    <SignupForm />
                </div>
            </div>
            <Footer />
        </div>
    )
}
