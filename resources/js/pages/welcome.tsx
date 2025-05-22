import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Aplikasi Disposisi Surat BPS Tasikmalaya">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#fdf6e3] to-[#f1f5f9] dark:from-[#0a0a0a] dark:to-[#23272e] p-4">

                <main className="flex flex-col md:flex-row w-full max-w-4xl items-center justify-center gap-8 animate-fade-in border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-2 md:px-8 md:gap-2">
                        <AppLogoIcon className="w-24 h-24 mb-6 animate-float" />
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-blue-700 dark:text-blue-300 animate-fade-in-up">Aplikasi Disposisi Surat</h1>
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 animate-fade-in-up delay-100">
                            <span className='font-extrabold'>BADAN PUSAT STATISTIK</span>
                            <br />
                            Kabupaten Tasikmalaya
                        </h2>
                        <nav className="flex gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-blue-600 text-white px-4 py-1.5 text-sm font-medium shadow hover:bg-blue-700 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-blue-600 text-white px-4 py-1.5 text-xl font-medium shadow hover:bg-blue-700 transition"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                    <div className="flex-1 flex items-center justify-center w-full max-w-xs md:max-w-sm aspect-[4/5] rounded-r-2xl overflow-hidden shadow-lg animate-in">
                        <img
                            src="/bgbps.jpg"
                            alt="BPS Illustration"
                            className="w-full h-full object-cover rounded-r-2xl shadow-lg animate-fade-in"
                            style={{ aspectRatio: '4/5' }}
                        />
                    </div>
                </main>
                <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 1s ease;
                    }
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 1s cubic-bezier(.4,0,.2,1);
                    }
                    .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
                    .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-12px); }
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    );
}
