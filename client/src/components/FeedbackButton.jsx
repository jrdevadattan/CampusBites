import React from 'react'
import { MdFeedback } from 'react-icons/md'

const FeedbackButton = () => {
    return (
        <button
            data-youform-open="fsfvdr25"
            data-youform-position="center"
            aria-label="Give Feedback"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary-200 hover:bg-primary-100 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
            <MdFeedback className="text-lg" />
            Feedback
        </button>
    )
}

export default FeedbackButton
