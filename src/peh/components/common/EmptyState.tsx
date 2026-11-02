import React from 'react';
import { Icon } from './Icon';

interface EmptyStateProps {
  iconName: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-300 rounded-xl bg-neutral-50/50 my-6">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 mb-4 border border-neutral-200">
        <Icon name={iconName} size={22} className="stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md mb-6 leading-relaxed">{description}</p>
      
      <div className="flex items-center gap-3">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Icon name="Plus" size={14} />
            <span>{actionLabel}</span>
          </button>
        )}
        {secondaryLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <span>{secondaryLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
