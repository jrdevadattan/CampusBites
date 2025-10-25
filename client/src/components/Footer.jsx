import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";

const Footer = () => {
  return (
    <footer className='border-t'>
        <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
            <p className='flex items-center justify-center gap-2'>
              <span>Trademarked by Pankaj Khatna</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M21.71 3.29a1 1 0 0 0-1.42 0l-5.79 5.8-1.5-1.5 5.8-5.79a1 1 0 0 0-1.42-1.42l-5.79 5.8-1.5-1.5 5.8-5.79a1 1 0 1 0-1.42-1.42l-6.5 6.5a1 1 0 0 0 0 1.42l1.5 1.5-7.59 7.58a3 3 0 0 0 4.24 4.24l7.59-7.58 1.5 1.5a1 1 0 0 0 1.42 0l6.5-6.5a1 1 0 0 0 0-1.42z"/>
              </svg>
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
