import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white text-lg font-bold mb-4">StoreUniversal</h3>
                    <p className="text-sm text-gray-400">
                        La mejor tienda demostrativa construida con arquitectura modular y escalable.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-4">Enlaces</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                        <li><Link href="/shop" className="hover:text-white">Catálogo</Link></li>
                        <li><Link href="/about" className="hover:text-white">Nosotros</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-white">Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-white">Términos</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="text-sm">© {new Date().getFullYear()} E-commerce Project.</p>
                </div>
            </div>
        </footer>
    );
}