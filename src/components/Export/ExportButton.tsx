'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Button from '@/components/UI/Button';
import ExportModal from '@/components/Export/ExportModal';
import { Expense } from '@/types';
import { ExportOptions, exportExpenses } from '@/utils/exportUtils';

interface ExportButtonProps {
  expenses: Expense[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  expenses,
  variant = 'primary',
  size = 'md',
  label = 'Export'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = (filteredExpenses: Expense[], options: ExportOptions) => {
    exportExpenses(filteredExpenses, options);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        icon={<ArrowDownTrayIcon className="w-5 h-5" />}
      >
        {label}
      </Button>

      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenses={expenses}
        onExport={handleExport}
      />
    </>
  );
};

export default ExportButton;