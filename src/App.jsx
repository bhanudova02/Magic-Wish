import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bestsellers from './components/Bestsellers';
import NewReleases from './components/NewReleases';
import HowItWorks from './components/HowItWorks';
import GirlsBooks from './components/GirlsBooks';
import BoysBooks from './components/BoysBooks';
import BrowseByAge from './components/BrowseByAge';
import Faq from './components/Faq';
import PhotoUploadBanner from './components/PhotoUploadBanner';
import Footer from './components/Footer';

function App() {
    return (
        <div className="text-gray-800 antialiased overflow-x-hidden">
            <Navbar />
            <Hero />
            <Bestsellers />
            <NewReleases />
            <HowItWorks />
            <GirlsBooks />
            <PhotoUploadBanner />
            <BoysBooks />
            <BrowseByAge />
            <Faq />
            <Footer />
        </div>
    );
}

export default App;
