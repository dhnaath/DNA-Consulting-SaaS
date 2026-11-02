import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-4 h-4', size = 16, ...props }) => {
  // @ts-expect-error Lucide dynamic icon indexing
  const Component = Icons[name] || Icons.CircleDot;
  return <Component className={className} size={size} {...props} />;
};
