import { useEffect } from 'react';
import Lenis from 'lenis';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import Home from './pages/Home.jsx';
import Collections from './pages/Collections.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import products from '../data/products.json';
import content from '../data/content.json';

function getPage(route) {
    const { path, query } = route;

    if (path === '/' || path === '/home') {
        return <Home products={products} content={content} />;
    }

    if (path === '/collections') {
        return <Collections products={products} content={content} initialFilter={query.filter || 'all'} />;
    }

    if (path.startsWith('/product/')) {
        return <ProductDetails products={products} content={content} productId={path.replace('/product/', '')} />;
    }

    if (path === '/about') {
        return <About content={content} />;
    }

    if (path === '/contact') {
        return <Contact contact={content.contact} />;
    }

    return <ErrorPage message="We couldn't find the page you are looking for. Navigate back to Trimetra." />;
}

export default function App() {
    const route = useHashRoute();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [route.path]);

    return (
        <>
            <Header currentPath={route.path} />
            <main id="app-root">{getPage(route)}</main>
            <FloatingWhatsApp contact={content.contact} />
            <Footer content={content} />
        </>
    );
}
