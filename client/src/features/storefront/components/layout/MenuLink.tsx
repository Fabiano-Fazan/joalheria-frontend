import React from 'react';
import { ChevronRight } from 'lucide-react';
import { colors } from '../../theme';

type MenuLinkProps = {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function MenuLink({ icon, label, active, onClick }: MenuLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-3.5 rounded-2xl transition-all duration-300 active:translate-x-1 active:shadow-sm hover:translate-x-1 hover:shadow-sm ${
        active ? 'bg-[#F7F2E8] text-[#8F6720] ring-1 ring-[#B88A2E]/30' : `${colors.textNavy} hover:bg-[#FAF8F4]`
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: `w-4 h-4 ${active ? colors.textGoldDark : colors.textNavy}` })}
        <span className={`font-medium ${active ? colors.textGoldDark : colors.textNavy}`}>{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${active ? colors.textGoldDark : 'text-gray-400'}`} />
    </button>
  );
}
