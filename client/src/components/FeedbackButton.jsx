import React, { useState } from 'react'
import { MdFeedback, MdClose } from 'react-icons/md'

const FeedbackButton = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Give Feedback"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary-200 hover:bg-primary-100 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
                <MdFeedback className="text-lg" />
                Feedback
            </button>

            <div
                className={`fixed inset-0 z-50 flex items-end justify-end p-6 ${open ? '' : 'hidden'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Feedback form"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setOpen(false)}
                />

                {/* Form panel */}
                <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-900">
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close feedback form"
                        className="absolute top-3 right-3 z-10 text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors"
                    >
                        <MdClose className="text-2xl" />
                    </button>
                    <div
                        data-youform-embed
                        data-form="fsfvdr25"
                        data-base-url="https://app.youform.com"
                        data-width="100%"
                        data-height="700"
                    />
                </div>
            </div>
        </>
    )
}

export default FeedbackButton
