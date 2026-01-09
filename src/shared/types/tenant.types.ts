import { Tenant } from './common.types';

export interface TenantContextValue {
    currentTenant: Tenant | null;
    switchTenant: (tenantId: string) => void;
}
