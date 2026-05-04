import React from 'react';
import { TwitterIcon, InstagramIcon, FacebookIcon } from './icons/SocialIcons';

const Footer: React.FC = () => {
    return (
        <footer className="mt-20 border-t border-oxblood/10 dark:border-parchment/10">
            <div className="container mx-auto px-6 py-12 flex flex-col items-center bg-parchment-texture">
                <div className="mb-8 flex flex-col items-center">
                    <span className="font-display font-black text-3xl italic text-ink dark:text-parchment uppercase tracking-tighter mb-1">Poéthra</span>
                    <div className="w-12 h-0.5 bg-oxblood opacity-20"></div>
                </div>

                <div className="flex justify-center space-x-10 mb-8">
                    <a 
                        href="https://www.instagram.com/poethra.rvu/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-stone-600 hover:text-oxblood dark:text-parchment/60 dark:hover:text-parchment transition-all duration-500 transform hover:scale-125"
                        aria-label="Follow Poéthra on Instagram"
                    >
                        <InstagramIcon />
                    </a>
                </div>

                <div className="text-center space-y-4">
                    <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-stone-600 dark:text-parchment/50">
                        &copy; {new Date().getFullYear()} Poéthra Creative Writing Club. <span className="mx-2 opacity-30">|</span> All Rights Reserved.
                    </p>
                    <p className="font-display italic text-lg text-stone-700 dark:text-parchment/80">
                        "Your stories are the ink that keeps our halls alive."
                    </p>
                    <div className="pt-4">
                        <a 
                            href="mailto:poethra.rvu@gmail.com" 
                            className="font-sans text-[10px] uppercase tracking-[0.2em] text-oxblood dark:text-lamplight/80 hover:text-black dark:hover:text-lamplight transition-colors border-b border-transparent hover:border-current pb-1 font-bold"
                        >
                            poethra.rvu@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
