import React from 'react'

const Arrow = () => {
  return (
    <div className="animate-pulse">
      <svg
        width="80"  
        height="100"
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-600 transition-all duration-500 ease-in-out hover:text-blue-800 hover:scale-110"
      >
   
        <path
          d="M25 25 L50 50 L75 25"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
          }}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,4; 0,0"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            keyTimes="0; 0.5; 1"
          />
          <animate
            attributeName="opacity"
            values="0.7; 1; 0.7"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            keyTimes="0; 0.5; 1"
          />
        </path>
   
        <path
          d="M25 55 L50 80 L75 55"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2))'
          }}
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,4; 0,0"
            dur="4s"
            begin="0.7s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            keyTimes="0; 0.5; 1"
          />
          <animate
            attributeName="opacity"
            values="0.5; 0.8; 0.5"
            dur="4s"
            begin="0.7s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            keyTimes="0; 0.5; 1"
          />
        </path>
      </svg>
    </div>
  )
}

export default Arrow
