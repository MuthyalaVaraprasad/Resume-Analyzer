import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowLeft } from 'lucide-react';

export const Fonts: React.FC = () => {
  const { activeFont, setActiveFont, setActiveTab } = useApp();

  const fonts = [
    { name: "Inter", type: "Sans-Serif", sample: "Clean geometric curves suited for digital scanning systems." },
    { name: "Poppins", type: "Sans-Serif", sample: "Rounded structural paths adding modern premium aesthetics." },
    { name: "Roboto", type: "Sans-Serif", sample: "Neutral, friendly styling compliant with corporate grids." },
    { name: "Montserrat", type: "Sans-Serif", sample: "Bold editorial headlines with elegant capital letters." },
    { name: "Nunito", type: "Sans-Serif", sample: "Warm, rounded structures emphasizing soft, readable nodes." },
    { name: "Lato", type: "Sans-Serif", sample: "Warm corporate tracking with classic uppercase letterings." },
    { name: "Open Sans", type: "Sans-Serif", sample: "Neutral, highly legible text nodes parsed easily on scanners." },
    { name: "Merriweather", type: "Serif", sample: "Classic serif typography creating highly sophisticated layouts." },
    { name: "Playfair Display", type: "Serif", sample: "Luxury editorial styling perfect for executive levels." },
    { name: "DM Sans", type: "Sans-Serif", sample: "Low-contrast modern design suited for tech application letters." },
    { name: "Ubuntu", type: "Sans-Serif", sample: "Distinct curves that emphasize creative, tech-focused CV details." },
    { name: "Work Sans", type: "Sans-Serif", sample: "Quirky, clean layout tracking optimal for design portfolios." },
    { name: "Source Sans 3", type: "Sans-Serif", sample: "Highly legible details developed for cold corporate audits." },
    { name: "Raleway", type: "Sans-Serif", sample: "Elegant, thin structures making headings look premium." },
    { name: "Lora", type: "Serif", sample: "Contemporary serif style with soft curves and high legibility." },
    // 15 New Fonts
    { name: "Bitter", type: "Serif", sample: "A contemporary serif designed for comfortable reading on screens." },
    { name: "Outfit", type: "Sans-Serif", sample: "A beautiful, geometric typeface suited for modern tech branding." },
    { name: "Cinzel", type: "Serif", sample: "Classical proportions suited for luxury, editorial portfolios." },
    { name: "Space Grotesk", type: "Sans-Serif", sample: "A versatile, tech-focused geometric typeface with raw edges." },
    { name: "Oswald", type: "Sans-Serif", sample: "Condensed, high-impact headings built for screen scanning." },
    { name: "PT Sans", type: "Sans-Serif", sample: "Universal sans-serif with classic Russian structural proportions." },
    { name: "PT Serif", type: "Serif", sample: "Elegant companion to PT Sans designed for text clarity." },
    { name: "Fira Sans", type: "Sans-Serif", sample: "Open-source, highly legible sans-serif from Mozilla." },
    { name: "Cormorant Garamond", type: "Serif", sample: "Prestigious, classical serif showing extreme luxury." },
    { name: "Josefin Sans", type: "Sans-Serif", sample: "Thin, vintage geometric proportions with elegant numbers." },
    { name: "Cabin", type: "Sans-Serif", sample: "A humanistic sans-serif inspired by classical type design." },
    { name: "Archivo", type: "Sans-Serif", sample: "A utilitarian typeface designed for high performance screen grids." },
    { name: "Quicksand", type: "Sans-Serif", sample: "A friendly geometric face with rounded terminals." },
    { name: "Libre Baskerville", type: "Serif", sample: "Classic writing style optimized for body text layouts." },
    { name: "Cardo", type: "Serif", sample: "A high-quality classical scholar face for academic compliance." }
  ];

  const handleSelectFont = (name: string) => {
    setActiveFont(name);
    setActiveTab('builder');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header bar with Back button */}
      <div className="pb-4 border-b border-zinc-900 flex items-center space-x-3">
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight text-white">Font Library</h2>
          <p className="text-xs text-zinc-500 mt-1">Select from 30 web-optimized fonts. Renders live updates on builder templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fonts.map((fnt, i) => {
          const isSelected = activeFont === fnt.name;
          return (
            <div 
              key={i}
              onClick={() => handleSelectFont(fnt.name)}
              className={`glass-panel rounded-2xl p-5 cursor-pointer relative group flex flex-col justify-between transition ${
                isSelected 
                  ? 'border-purple-500 bg-purple-950/5 shadow-[0_0_20px_rgba(168,85,247,0.08)]' 
                  : 'glass-panel-hover'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                    {fnt.type}
                  </span>
                  {isSelected && <span className="text-xs text-purple-400 font-bold flex items-center space-x-1"><Check className="w-3.5 h-3.5" /> <span>Active</span></span>}
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition" style={{ fontFamily: `'${fnt.name}', sans-serif` }}>
                    {fnt.name}
                  </h4>
                  <p 
                    className="text-zinc-400 text-xs leading-relaxed mt-2" 
                    style={{ fontFamily: `'${fnt.name}', sans-serif` }}
                  >
                    {fnt.sample}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
                <span>Google Font API</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition font-sans">Apply Font →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
