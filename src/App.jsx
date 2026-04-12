import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import SupportPage from './pages/SupportPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ScrollToTop from './components/ScrollToTop';

import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import CartPage from './pages/CartPage';

function App() {
    return (
        <CartProvider>
            <Router>
                <ScrollToTop />
                <div className="text-gray-800 antialiased min-h-screen flex flex-col">
                    <Navbar />
                    <CartDrawer />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/books" element={<BooksPage />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/books/:id" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
