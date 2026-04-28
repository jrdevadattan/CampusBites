import React, { useEffect, useState } from 'react'
import { MdFeedback } from 'react-icons/md'

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const formUrl = 'https://app.youform.com/forms/fsfvdr25?embedded=1'

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Give Feedback"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary-200 hover:bg-primary-100 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
                <MdFeedback className="text-lg" />
                Feedback
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6"
                    onClick={() => setIsOpen(false)}
                    role="presentation"
                >
                    <div
                        className="relative h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close feedback form"
                            className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                        >
                            Close
                        </button>
                        <iframe
                            title="YouForm feedback form"
                            src={formUrl}
                            className="h-full w-full border-0"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default FeedbackButton
