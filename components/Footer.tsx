import React from 'react';
import { TwitterIcon, InstagramIcon, FacebookIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-200 dark:bg-black/20 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-stone-600 dark:text-gray-400">
                <div className="flex justify-center space-x-6 mb-4">
                    <a href="#" className="hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"><TwitterIcon /></a>
                    <a href="#" className="hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"><InstagramIcon /></a>
                    <a href="#" className="hover:text-amber-700 dark:hover:text-yellow-500 transition-colors"><FacebookIcon /></a>
                </div>
                <p>&copy; {new Date().getFullYear()} Poéthra Creative Writing Club. All Rights Reserved.</p>
                <p className="text-sm mt-1">Contact us at: <a href="mailto:contact@poethra.com" className="underline hover:text-amber-700 dark:hover:text-yellow-500">contact@poethra.com</a></p>
            </div>
        </footer>
    );
};

export default Footer;
