import { useNavigate } from "react-router-dom"
import '../../styles/global.css'
function ConnectionStatusPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark via-darkHover to-darkSecondary flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-danger opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-warning opacity-10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
                <ConnectionError />
            </div>
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()
    const reloadPage = () => {
        window.location.reload()
    }

    const gotoHomePage = () => {
        navigate("/")
    }

    return (
        <div className="card p-8 max-w-md mx-auto text-center">
            <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-light mb-2">Connection Failed</h2>
                <p className="text-muted">
                    Oops! Something went wrong. Please try again or return to the homepage.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    className="btn-primary"
                    onClick={reloadPage}
                >
                    Try Again
                </button>
                <button
                    className="btn-secondary"
                    onClick={gotoHomePage}
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    )
}

export default ConnectionStatusPage
