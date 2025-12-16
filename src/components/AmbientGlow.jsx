import React from 'react';

const AmbientGlow = () => {
    return (
        <>
            {/* Left Edge - Cool Blue/Cyan Haze */}
            <div className="fixed top-0 left-0 h-full w-[15vw] min-w-[150px] max-w-[300px] pointer-events-none z-0">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/5 to-transparent blur-[80px] opacity-60" />
            </div>

            {/* Right Edge - Mystical Purple/Green Haze */}
            <div className="fixed top-0 right-0 h-full w-[15vw] min-w-[150px] max-w-[300px] pointer-events-none z-0">
                <div className="w-full h-full bg-gradient-to-l from-purple-500/5 to-transparent blur-[80px] opacity-60" />
            </div>
        </>
    );
};

export default AmbientGlow;
