import BannerAboutUs from '@components/user/Banners/BannerAboutUs'
import AboutDetails from '@components/user/layout/AboutDetails'
import Footer from '@components/user/layout/Footer'
import Header from '@components/user/layout/Header'
import PageTransition from '@components/motion/PageTransition'
import React from 'react'

const page = () => {
    return (
        <PageTransition>
        <div className='w-full min-h-screen flex flex-col'>
            <Header />
            <BannerAboutUs />
            <AboutDetails />
            <Footer />
        </div>
        </PageTransition>
    );
}

export default page
