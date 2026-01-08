type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  tagline?: string;
};

export const Logo = ({ size = 'md', showTagline = false, tagline }: LogoProps) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`font-bold ${sizes[size]} tracking-tight select-none`} style={{ fontFamily: 'Fredoka, sans-serif' }}>
        <span style={{ color: '#f8ad46' }}>s</span>
        <span style={{ color: '#28b09a' }}>t</span>
        <span style={{ color: '#02b5dd' }}>@</span>
        <span style={{ color: '#e9647f' }}>r</span>
        <span style={{ color: '#ad7eb2' }}>T</span>
        <span style={{ color: '#5a5960' }}>ech</span>
      </div>
      {showTagline && tagline && (
        <p className={`${taglineSizes[size]} text-slate-500 font-medium`}>
          {tagline}
        </p>
      )}
    </div>
  );
};

