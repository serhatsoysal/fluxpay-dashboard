import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Subscription } from '../types/subscription.types';
import { formatCurrency } from '@/shared/utils/currencyHelpers';
import { formatDate } from '@/shared/utils/dateHelpers';
import { Badge } from '@/shared/components/ui/badge';

interface SubscriptionCardProps {
    subscription: Subscription;
    onClick?: () => void;
}

export const SubscriptionCard: FC<SubscriptionCardProps> = ({ subscription, onClick }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'past_due':
                return 'bg-yellow-500';
            case 'canceled':
                return 'bg-red-500';
            case 'trialing':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{subscription.productName}</CardTitle>
                    <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                    </Badge>
                </div>
                <CardDescription>{subscription.customerName}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-semibold">
                            {formatCurrency(subscription.amount, subscription.currency)} /{' '}
                            {subscription.interval}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Period</span>
                        <span className="text-sm">
                            {formatDate(subscription.currentPeriodStart)} -{' '}
                            {formatDate(subscription.currentPeriodEnd)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
