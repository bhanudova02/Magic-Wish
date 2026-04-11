import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="text-gray-800 antialiased min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/books" element={<BooksPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
