import React from 'react';

const Bubbles: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large Bubble */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-rose-200/30 to-pink-200/30 dark:from-rose-400/30 dark:to-pink-400/30 rounded-full animate-float" 
        style={{ 
          animationDelay: '0s',
          animationDuration: '15s',
          animationTimingFunction: 'ease-in-out'
        }} 
      />
      
      {/* Medium Bubble */}
      <div 
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 dark:from-amber-400/30 dark:to-yellow-400/30 rounded-full animate-float" 
        style={{ 
          animationDelay: '2s',
          animationDuration: '12s',
          animationTimingFunction: 'ease-in-out'
        }} 
      />
      
      {/* Small Bubble */}
      <div 
        className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-sky-200/30 to-blue-200/30 dark:from-sky-400/30 dark:to-blue-400/30 rounded-full animate-float" 
        style={{ 
          animationDelay: '4s',
          animationDuration: '10s',
          animationTimingFunction: 'ease-in-out'
        }} 
      />
      
      {/* Extra Small Bubble */}
      <div 
        className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 dark:from-teal-400/30 dark:to-emerald-400/30 rounded-full animate-float" 
        style={{ 
          animationDelay: '6s',
          animationDuration: '8s',
          animationTimingFunction: 'ease-in-out'
        }} 
      />
      
      {/* Tiny Bubble */}
      <div 
        className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-violet-200/30 dark:from-purple-400/30 dark:to-violet-400/30 rounded-full animate-float" 
        style={{ 
          animationDelay: '8s',
          animationDuration: '6s',
          animationTimingFunction: 'ease-in-out'
        }} 
      />
    </div>
  );
};

export default Bubbles; 