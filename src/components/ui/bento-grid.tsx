import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-3xl p-6 bg-circuit-surface/40 border border-muted-steel/20 hover:border-copper-trace/40 transition duration-300 shadow-xl flex flex-col justify-between cursor-pointer group/bento hover:shadow-[0_0_24px_rgba(212,145,90,0.08)]",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1.5 transition duration-200 mt-4">
        {icon}
        <div className="font-display font-bold text-pulse-text text-lg mb-2 mt-2">
          {title}
        </div>
        <div className="font-body text-sm text-muted-steel leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
