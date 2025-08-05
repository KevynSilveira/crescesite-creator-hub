"use client";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 160, height = 32 }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Ícone simples */}
      <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L12 6H9V12H7V6H4L8 2Z"
            fill="white"
          />
        </svg>
      </div>
      
      {/* Texto */}
      <span className="text-xl font-bold text-white">
        CresceSite
      </span>
    </div>
  );
}