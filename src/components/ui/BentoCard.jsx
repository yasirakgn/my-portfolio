import React from 'react';
import { motion } from 'framer-motion';

export default function BentoCard({
    children,
    className = "",
    title,
    icon: Icon,
    delay = 0
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={`
        relative overflow-hidden
        bg-matte-dark/60 backdrop-blur-xl 
        border border-white/5 
        shadow-2xl shadow-black/50
        rounded-3xl
        group
        ${className}
      `}
        >
            {/* Glass Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col p-6">

                {/* Header (Optional) */}
                {(title || Icon) && (
                    <div className="flex items-center gap-3 mb-4 text-slate-300">
                        {Icon && (
                            <div className="p-2 rounded-lg bg-white/5 text-pastel-blue border border-white/5">
                                <Icon size={18} />
                            </div>
                        )}
                        {title && (
                            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400 group-hover:text-white transition-colors">
                                {title}
                            </h3>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-grow">
                    {children}
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-white/10" />
        </motion.div>
    );
}
