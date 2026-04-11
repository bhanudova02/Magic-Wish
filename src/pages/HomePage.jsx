import React from 'react';
import Hero from '../components/Hero';
import Bestsellers from '../components/Bestsellers';
import NewReleases from '../components/NewReleases';
import HowItWorks from '../components/HowItWorks';
import GirlsBooks from '../components/GirlsBooks';
import BoysBooks from '../components/BoysBooks';
import BrowseByAge from '../components/BrowseByAge';
import Faq from '../components/Faq';
import PhotoUploadBanner from '../components/PhotoUploadBanner';

export default function HomePage() {
    return (
        <>
            <Hero />
            <Bestsellers />
            <NewReleases />
            <HowItWorks />
            <GirlsBooks />
            <PhotoUploadBanner />
            <BoysBooks />
            <BrowseByAge />
            <Faq />
        </>
    );
}
