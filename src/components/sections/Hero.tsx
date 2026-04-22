import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Download, Play, Sparkles, Code, Shield, Smartphone, Zap, FileText } from 'lucide-react';
import myImages from '../../assets/images/medium-1750698796.jpg';
import { motion } from 'framer-motion';

// Particle Background Component
const ParticlesBackground: React.FC = () => {
  const particles = Array(30).fill(0);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * -20;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        
        return (
          <div 
            key={i}
            className="absolute rounded-full bg-[#22c825]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `-20px`,
              opacity: opacity,
              animation: `float ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const Hero: React.FC = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  const taglines = [
    { text: "Full Stack Developer", icon: <Code className="inline-block mr-2" />, color: "text-[#22c825]" },
    { text: "Mobile App Creator", icon: <Smartphone className="inline-block mr-2" />, color: "text-blue-400" },
    { text: "Security Expert", icon: <Shield className="inline-block mr-2" />, color: "text-purple-400" },
    { text: "Problem Solver", icon: <Zap className="inline-block mr-2" />, color: "text-yellow-400" }
  ];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [taglines.length]);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-20 pb-12 px-4"
    >
      <ParticlesBackground />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040404] via-[#0a0a0a] to-[#111] opacity-90" />
      
      <div className="relative z-10 text-center space-y-12 max-w-6xl mx-auto">
        {/* Profile Section */}
        <motion.div 
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${-mousePosition.x * 10}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="relative inline-block mb-8">
            {/* Animated rings around profile image */}
            <div className="absolute inset-0 rounded-full border-2 border-[#22c825] opacity-70" 
                 style={{
                   animation: 'pulse 4s ease-in-out infinite',
                   transform: 'scale(1.05)'
                 }} />
            <div className="absolute inset-0 rounded-full border-2 border-[#22c825] opacity-40" 
                 style={{
                   animation: 'pulse 4s ease-in-out 0.5s infinite',
                   transform: 'scale(1.1)'
                 }} />
            
            {/* Profile image */}
            <motion.div
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/10 shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <img 
                src={myImages} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Animated sparkles */}
            <motion.div 
              className="absolute -top-4 -right-2 text-[#22c825]"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1.2, 1.3, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: 'loop' as const
              }}
            >
              <Sparkles size={32} className="fill-current" />
            </motion.div>
          </div>

          {/* Greeting and Title */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Hi, I'm <span className="text-[#22c825]">Rohit</span>
            </h1>
            
            <div className="h-12 md:h-16 flex items-center justify-center">
              <motion.div
                key={currentTagline}
                className={`text-xl md:text-2xl font-medium ${taglines[currentTagline].color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {taglines[currentTagline].icon}
                {taglines[currentTagline].text}
              </motion.div>
            </div>
            
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Crafting exceptional digital experiences with clean, efficient code and innovative solutions.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={scrollToAbout}
              className="px-8 py-3 bg-gradient-to-r from-[#22c825] to-emerald-500 text-white rounded-full font-medium flex items-center gap-2 group"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34, 200, 37, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get In Touch</span>
              <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/10 text-white rounded-full font-medium border border-white/20 flex items-center gap-2 group hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              <span>View Resume</span>
            </motion.a>


          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-[#22c825]" />
          </motion.div>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default Hero;