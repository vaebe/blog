'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FullScreenLoadingProps {
  isLoading: boolean
  message?: string
}

export function FullScreenLoading ({ isLoading, message = 'Loading...' }:FullScreenLoadingProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}