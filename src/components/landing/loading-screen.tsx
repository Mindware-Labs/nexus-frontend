'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Scroll lock during loading
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    // Percentage counter
    const duration = 3600 // reach 100% slightly before it disappears
    const interval = 30
    const steps = duration / interval
    let currentStep = 0

    const progressTimer = setInterval(() => {
      currentStep++
      // simple ease-out approximation for the percentage
      const t = currentStep / steps
      const easeOut = 1 - Math.pow(1 - t, 3) 
      const p = Math.min(100, Math.floor(easeOut * 100))
      
      setProgress(p)
      if (currentStep >= steps) {
        clearInterval(progressTimer)
      }
    }, interval)

    // Unmount after 4 seconds
    const unmountTimer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = 'unset'
    }, 4000)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(unmountTimer)
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202] overflow-hidden"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div className="absolute w-[800px] h-[800px] bg-nexus-purple/10 rounded-full blur-[150px] animate-[pulse_4s_ease-in-out_infinite]" />
            <div className="absolute w-[500px] h-[500px] bg-nexus-lavender/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-56 h-56 sm:w-72 sm:h-72 mb-16 rounded-full overflow-hidden flex items-center justify-center relative mix-blend-screen"
            >
              <video
                src="/Brain_circuit_logo_animation_202606182251.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.2]"
              />
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
                  Iniciando Nexus
                </span>
                <span className="text-xs font-mono font-bold text-nexus-lavender">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.6, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ad74c3] via-[#818cf8] to-[#34d399] rounded-full"
                  style={{ boxShadow: '0 0 12px rgba(173,116,195,0.6)' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
