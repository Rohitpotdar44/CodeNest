import FormComponent from "@/components/forms/FormComponent"
import '../styles/global.css'
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-dark">
            {/* bg with gradients */}
            <div className="absolute inset-0">
                {/* main bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-[#0a0a0a]"></div>
                
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-dark/80"></div>
                
                {/* floating circles */}
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primaryLight/20 via-accent/15 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-accent/20 via-primaryLight/15 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primaryLight/10 via-accent/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
                
                {/* grid pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
                    backgroundSize: '60px 60px'
                }}></div>
                
                {/* lines */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>
            
            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-32 lg:gap-48 items-center">
                        
                        {/* left side */}
                        <div className="space-y-8 order-2 lg:order-1">
                            {/* title */}
                            <div className="space-y-6">
                                <div className="animate-slide-up">
                                    <h1 className="text-6xl lg:text-8xl font-bold font-heading leading-tight text-white">
                                        CodeNest
                                    </h1>
                                </div>
                                <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                                    <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-lg">
                                        Connect, Code, and Collaborate – All in Perfect Sync!
                                    </p>
                                </div>
                            </div>
                            
                            {/* feature cards */}
                            <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
                                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#262626] p-6 group hover:from-[#262626] hover:via-[#2a2a2a] hover:to-[#333333] transition-all duration-300 h-36 flex flex-col justify-between border border-[#333333] rounded-lg shadow-lg hover:shadow-xl">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🎨</div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Visual Coding</h3>
                                        <p className="text-sm text-gray-400">Drawing & whiteboard</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#262626] p-6 group hover:from-[#262626] hover:via-[#2a2a2a] hover:to-[#333333] transition-all duration-300 h-36 flex flex-col justify-between border border-[#333333] rounded-lg shadow-lg hover:shadow-xl">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">💬</div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Team Chat</h3>
                                        <p className="text-sm text-gray-400">Communication tools</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#262626] p-6 group hover:from-[#262626] hover:via-[#2a2a2a] hover:to-[#333333] transition-all duration-300 h-36 flex flex-col justify-between border border-[#333333] rounded-lg shadow-lg hover:shadow-xl">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">⚡</div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Real-time Sync</h3>
                                        <p className="text-sm text-gray-400">Lightning fast collaboration</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#262626] p-6 group hover:from-[#262626] hover:via-[#2a2a2a] hover:to-[#333333] transition-all duration-300 h-36 flex flex-col justify-between border border-[#333333] rounded-lg shadow-lg hover:shadow-xl">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">🚀</div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Instant Run</h3>
                                        <p className="text-sm text-gray-400">Execute code instantly</p>
                                    </div>
                                </div>
                            </div>
                </div>
                        
                        {/* right side - form */}
                        <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-start">
                            {/* form */}
                            <div className="w-full max-w-md animate-slide-up" style={{animationDelay: '0.2s'}}>
                    <FormComponent />
                </div>
            </div>
                    </div>
                </div>
            </div>
            
            {/* floating dots */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default HomePage
