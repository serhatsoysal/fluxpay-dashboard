import { FC, useState } from 'react';

interface RevenueMonth {
    month: string;
    recognized: number;
    deferred: number;
    total: number;
}

export const RevenueRecognitionChart: FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const revenueData: RevenueMonth[] = [
        { month: 'Aug', recognized: 45000, deferred: 18000, total: 63000 },
        { month: 'Sep', recognized: 52000, deferred: 21000, total: 73000 },
        { month: 'Oct', recognized: 80000, deferred: 32000, total: 112000 },
    ];

    const maxValue = Math.max(...revenueData.map(d => d.total));

    return (
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Recognition</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ASC 606 / IFRS 15 Compliance</p>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">View Report</button>
            </div>

            <div className="flex items-end h-32 gap-4">
                {revenueData.map((item, index) => {
                    const totalHeight = (item.total / maxValue) * 100;
                    const isActive = index === 2;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={item.month}
                            className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={`text-xs text-center text-slate-400 mb-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}>
                                ${(item.total / 1000).toFixed(0)}k
                            </div>
                            <div
                                className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-md relative overflow-hidden transition-all group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                                style={{ height: `${Math.max(totalHeight, 10)}%` }}
                            >
                                <div
                                    className={`absolute bottom-0 left-0 w-full transition-all ${isActive
                                            ? 'bg-primary h-[65%] shadow-[0_0_15px_rgba(60,131,246,0.3)]'
                                            : 'bg-primary/40 h-[50%] group-hover:bg-primary/50'
                                        }`}
                                />
                            </div>
                            <div className={`text-xs text-center font-medium ${isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
                                }`}>
                                {item.month}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Recognized</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary/40" />
                    <span className="text-xs text-slate-600 dark:text-slate-300">Deferred</span>
                </div>
            </div>
        </div>
    );
};

