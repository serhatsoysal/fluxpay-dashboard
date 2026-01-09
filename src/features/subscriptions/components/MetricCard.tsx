import { FC } from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    changePercent: string;
    changeDirection: 'up' | 'down';
    sparklineData?: number[];
    sparklineType?: 'bars' | 'line';
}

export const MetricCard: FC<MetricCardProps> = ({
    title,
    value,
    changePercent,
    changeDirection,
    sparklineData = [30, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100],
    sparklineType = 'bars',
}) => {
    const isPositive = changeDirection === 'up';

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                    isPositive 
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                    <span className="material-symbols-outlined text-[14px]">
                        {isPositive ? 'trending_up' : 'arrow_downward'}
                    </span>
                    {changePercent}
                </span>
            </div>

            {sparklineType === 'bars' ? (
                <div className="h-10 w-full flex items-end gap-1 opacity-50">
                    {sparklineData.map((height, i) => (
                        <div
                            key={i}
                            className="w-1/12 bg-primary rounded-t-sm"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-10 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <path
                            d="M0 30 Q 20 35, 40 20 T 100 25"
                            fill="none"
                            stroke="#64748b"
                            strokeDasharray="4 2"
                            strokeLinecap="round"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

