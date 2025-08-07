import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'orange' | 'green' | 'red' | 'purple';
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    orange: 'bg-orange-500 text-orange-700 bg-orange-50',
    green: 'bg-green-500 text-green-700 bg-green-50',
    red: 'bg-red-500 text-red-700 bg-red-50',
    purple: 'bg-purple-500 text-purple-700 bg-purple-50'
  };

  const colorClass = colorClasses[color];
  const [bgColor, textColor, cardBg] = colorClass ? colorClass.split(' ') : ['bg-gray-500', 'text-gray-700', 'bg-gray-50'];

  return (
    <div className={`${cardBg} rounded-xl p-6 transition-all duration-200 hover:shadow-md border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
          <p className="text-gray-500 text-xs mt-1">{description}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;