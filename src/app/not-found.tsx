import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#050510] text-white">
            <Header alwaysDark />
            <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center relative z-10 max-w-md">
                    <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold mb-6">Profile Not Found?</h2>
                    <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                        Oops! It seems the page you are looking for has vanished into the Instagram abyss.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-500/20"
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/blog"
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Read Blog
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
