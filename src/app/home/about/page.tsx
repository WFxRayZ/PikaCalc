import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold text-xl text-gray-900 dark:text-white">PikaCalc</span>
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* About Section */}
                <section className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
                        About PikaCalc
                    </h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            PikaCalc is a comprehensive <span className="font-bold text-red-500">Pokémon stat calculator and team builder</span> designed to help trainers optimize their teams and master competitive gameplay.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            Whether you're a casual player looking to understand your Pokémon's potential or a competitive trainer fine-tuning EV distributions, PikaCalc provides the tools you need to make informed decisions about your team composition and stat optimization.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3">📊</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">EV/IV Calculator</h3>
                            <p className="text-gray-600 dark:text-gray-400">Calculate optimal Effort Values and Individual Values for your Pokémon</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3">⚔️</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Type Matchups</h3>
                            <p className="text-gray-600 dark:text-gray-400">Instantly see weaknesses, resistances, and immunities for any Pokémon</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="text-4xl mb-3">🎮</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Team Builder</h3>
                            <p className="text-gray-600 dark:text-gray-400">Build and analyze complete Pokémon teams with coverage analysis</p>
                        </div>
                    </div>
                </section>

                {/* Disclaimer Section */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Disclaimer</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                            <span className="font-bold">Important:</span> PikaCalc is provided "as is" without warranty of any kind, express or implied. The creators are not responsible for any errors, omissions, or results obtained from the use of this calculator.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            While we strive for accuracy, users should verify important calculations independently. This tool is intended for general purpose use and may not be suitable for professional or critical financial calculations. Always double-check calculations before making important decisions based on the results.
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center bg-linear-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Build Your Team?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Start optimizing your Pokémon team today with PikaCalc's powerful tools.
                    </p>
                    <Link
                        href="/calculator"
                        className="inline-block px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Launch Calculator
                    </Link>
                </section>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8 py-8 mt-20">
                <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>© 2026 PikaCalc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
