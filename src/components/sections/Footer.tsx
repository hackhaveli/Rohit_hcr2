import React from 'react';
import { Code2, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#040404] to-[#0a0a0a] border-t border-[#22c825]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-[#22c825]" />
            <span className="text-[#22c825] font-mono text-lg font-bold">
              &lt; Rohit_hcr2 /&gt;
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[#c9c1c0]">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>by Rohit Sharma</span>
          </div>

          <div className="text-[#c9c1c0] text-sm">
            © 2026 All rights reserved
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#22c825]/20 text-center">
          <p className="text-gray-400 text-sm">
            "Code is poetry, and every bug is just a misplaced semicolon in the universe."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;