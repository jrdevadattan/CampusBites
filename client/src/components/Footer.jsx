import React from 'react'
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";
import { GiCrossedSwords } from "react-icons/gi";

const Footer = () => {
    return (
        <footer className='border-t dark:border-neutral-700 mt-6 sm:mt-10'>
            <div className='container mx-auto px-4 py-6 flex flex-col gap-4 dark:text-white'>
                <div className='flex flex-row w-full items-center justify-between'>
                    <div className='flex flex-col items-start gap-2'>
                        <span className='flex items-center gap-2 text-base font-extralight'>
                            Founder: 
                            <a href="https://www.linkedin.com/in/pankaj-khatana-a72380377/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary-100">Pankaj Khatana</a>
                            <GiCrossedSwords className="w-6 h-6" />
                        </span>
                        <span className='flex items-center gap-2 text-base font-extralight'>
                            Tech Lead: 
                            <a href="https://www.linkedin.com/in/jrdevadattan" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary-100">J R Deva Dattan</a>
                            <FaCode className="w-5 h-5" />
                        </span>
                    </div>
                    <div className='flex items-center gap-4 text-2xl'>
                        <a href='https://github.com/jrdevadattan' target='_blank' rel='noopener noreferrer' className='hover:text-primary-100' aria-label='GitHub'>
                            <FaGithub/>
                        </a>
                        <a href='https://linktr.ee/jrdevadattan' target='_blank' rel='noopener noreferrer' className='hover:text-primary-100' aria-label='Linktree'>
                            <SiLinktree/>
                        </a>
                        <a href='https://www.linkedin.com/in/jrdevadattan/' target='_blank' rel='noopener noreferrer' className='hover:text-primary-100' aria-label='LinkedIn'>
                            <FaLinkedin/>
                        </a>
                        <a href='https://x.com/jrdevadattan' target='_blank' rel='noopener noreferrer' className='hover:text-primary-100' aria-label='X (Twitter)'>
                            <FaXTwitter/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
