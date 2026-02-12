import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
        >
            <div className="relative">
                {/* Outer Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
                />

                {/* Main Clock Icon */}
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="relative z-10 p-8 rounded-[2.5rem] bg-card border border-primary/10 shadow-2xl"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Clock className="h-16 w-16 text-primary" strokeWidth={1.5} />
                    </motion.div>

                    {/* Animated Progress Ring */}
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="100 100"
                            className="text-primary/20"
                        />
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="0 100"
                            animate={{ strokeDasharray: ["0 100", "100 100"] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="text-primary"
                        />
                    </svg>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default LoadingScreen;
