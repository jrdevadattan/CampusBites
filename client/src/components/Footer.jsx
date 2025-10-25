import React from 'react'
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";
import { GiBroadsword } from "react-icons/gi";

const Footer = () => {
    return (
        <footer className='border-t mt-6 sm:mt-10'>
                <div className='container mx-auto px-4 py-6 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
            <p className='flex items-center justify-center gap-2'>
              <span>Trademarked by Pankaj Khatana</span>
              <GiBroadsword className="w-5 h-5" />
            </p>
                        {/** Hidden on mobile; visible from md and up */}
                        <p className='hidden md:flex items-center justify-center gap-2 text-sm opacity-90'>
                            <span>Built by J R Deva Dattan</span>
                            <FaCode className="w-4 h-4" />
                        </p>

            <div className='flex items-center gap-4 justify-center text-2xl'>
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
    </footer>
  )
}

export default Footer
