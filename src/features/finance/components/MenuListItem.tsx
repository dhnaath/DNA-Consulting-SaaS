import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

export function MenuListItem({
  icon: Icon,
  title,
  desc,
  subtitle,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  desc?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full h-full flex flex-col bg-card rounded-2xl p-6 text-left relative overflow-hidden group hover:bg-accent transition-colors border border-transparent hover:border-border shadow-lg text-foreground group-hover:text-foreground"
    >
      <div className="flex justify-between items-start mb-4 w-full">
        <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center shrink-0 border border-border">
          <Icon size={24} className="theme-icon" />
        </div>
        <ChevronRight className="opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
      <h2 className="text-lg font-medium">{title}</h2>
      {subtitle && <div className="text-xs text-muted-foreground mb-1">{subtitle}</div>}
      {desc && <p className="text-xs text-muted-foreground pr-2 leading-relaxed mt-2">{desc}</p>}
    </motion.button>
  );
}
