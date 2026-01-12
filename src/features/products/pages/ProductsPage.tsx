import { FC, useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../api/productsQueries';
import { Product } from '../types/product.types';
import { CreateProductDialog } from '../components/CreateProductDialog';
import { EditProductDialog } from '../components/EditProductDialog';
import { ConfirmationDialog } from '@/shared/components/ui/ConfirmationDialog';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';

export const ProductsPage: FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('Any');
    const [createdFilter, setCreatedFilter] = useState<string>('Any time');
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isCreatedOpen, setIsCreatedOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [duplicateProduct, setDuplicateProduct] = useState<Product | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const [statusDropdownPos, setStatusDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [typeDropdownPos, setTypeDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [createdDropdownPos, setCreatedDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [actionMenuPos, setActionMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    
    const statusRef = useRef<HTMLDivElement>(null);
    const typeRef = useRef<HTMLDivElement>(null);
    const createdRef = useRef<HTMLDivElement>(null);
    const actionMenuRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
            if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
                setIsTypeOpen(false);
            }
            if (createdRef.current && !createdRef.current.contains(event.target as Node)) {
                setIsCreatedOpen(false);
            }
            if (openActionMenu) {
                const target = event.target as HTMLElement;
                const menuElement = target.closest('.product-action-menu');
                const menuButton = actionMenuRefs.current[openActionMenu];
                
                if (!menuElement && menuButton && !menuButton.contains(target)) {
                    setOpenActionMenu(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openActionMenu]);

    const { data: allProducts = [], isLoading } = useProducts();
    const deleteProductMutation = useDeleteProduct();

    const filteredProducts = useMemo(() => {
        let products = allProducts || [];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter((product: Product) =>
                (product.name || '').toLowerCase().includes(query) ||
                (product.productId || '').toLowerCase().includes(query) ||
                (product.plans || []).some((plan) => (plan.name || '').toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'All') {
            products = products.filter((product: Product) => (product.status || 'active') === statusFilter.toLowerCase());
        }

        if (typeFilter !== 'Any') {
            const typeMap: Record<string, string> = {
                'Platform': 'cloud_queue',
                'API': 'api',
                'Support': 'support_agent',
                'Archive': 'archive',
            };
            const icon = typeMap[typeFilter];
            if (icon) {
                products = products.filter((product: Product) => (product.icon || 'inventory_2') === icon);
            }
        }

        if (createdFilter !== 'Any time') {
            const now = new Date();
            products = products.filter((product: Product) => {
                if (!product.createdDate) return false;
                try {
                    const createdDate = new Date(product.createdDate);
                    if (isNaN(createdDate.getTime())) {
                        return false;
                    }
                    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    switch (createdFilter) {
                        case 'Last week':
                            return diffDays <= 7;
                        case 'Last month':
                            return diffDays <= 30;
                        case 'Last year':
                            return diffDays <= 365;
                        default:
                            return true;
                    }
                } catch {
                    return false;
                }
            });
        }

        return products;
    }, [allProducts, searchQuery, statusFilter, typeFilter, createdFilter]);

    const products = filteredProducts;

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
        setOpenActionMenu(null);
    };

    const handleDuplicate = (product: Product) => {
        setDuplicateProduct(product);
        setIsCreateDialogOpen(true);
        setOpenActionMenu(null);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
        setOpenActionMenu(null);
    };

    const handleDeleteConfirm = async () => {
        if (selectedProduct) {
            try {
                await deleteProductMutation.mutateAsync(selectedProduct.id);
                setIsDeleteDialogOpen(false);
                setSelectedProduct(null);
            } catch (error) {
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'paused':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'archived':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'paused': return 'bg-amber-500';
            case 'archived': return 'bg-slate-400';
            default: return 'bg-slate-400';
        }
    };

    const getIconColor = (icon: string) => {
        switch (icon) {
            case 'cloud_queue': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            case 'api': return 'bg-sky-100 text-sky-600 border-sky-200';
            case 'support_agent': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'archive': return 'bg-slate-100 text-slate-400 border-slate-200';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-7xl flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Product Catalog</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Product Catalog</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">Manage your subscription products, pricing tiers, and inventory.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setIsStatusOpen(false);
                            setIsTypeOpen(false);
                            setIsCreatedOpen(false);
                            setIsCreateDialogOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all min-w-[160px]"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        New product
                    </button>
                </div>
            </header>

            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1 flex flex-col sm:flex-row gap-2 overflow-visible">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 bg-transparent border-transparent focus:border-transparent focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 sm:text-sm font-medium"
                        placeholder="Search products by name, ID, or plan..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="h-auto w-px bg-slate-200 dark:bg-slate-700 my-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 px-2 overflow-visible">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-0">
                        <div ref={statusRef} className="relative z-[100] shrink-0">
                            <button
                                onClick={() => {
                                    if (statusRef.current) {
                                        const rect = statusRef.current.getBoundingClientRect();
                                        setStatusDropdownPos({ top: rect.bottom + 4, left: rect.left });
                                    }
                                    setIsStatusOpen(!isStatusOpen);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors"
                            >
                                <span>Status: {statusFilter}</span>
                                <span className={cn("material-symbols-outlined text-[18px] text-slate-400 transition-transform", isStatusOpen && "rotate-180")}>keyboard_arrow_down</span>
                            </button>
                            {isStatusOpen && (
                                <div className="fixed w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[9999]" style={{ top: `${statusDropdownPos.top}px`, left: `${statusDropdownPos.left}px` }}>
                                    {['All', 'Active', 'Paused', 'Archived'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsStatusOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                                statusFilter === status
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            )}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div ref={typeRef} className="relative z-[100] shrink-0">
                            <button
                                onClick={() => {
                                    if (typeRef.current) {
                                        const rect = typeRef.current.getBoundingClientRect();
                                        setTypeDropdownPos({ top: rect.bottom + 4, left: rect.left });
                                    }
                                    setIsTypeOpen(!isTypeOpen);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors"
                            >
                                <span>Type: {typeFilter}</span>
                                <span className={cn("material-symbols-outlined text-[18px] text-slate-400 transition-transform", isTypeOpen && "rotate-180")}>keyboard_arrow_down</span>
                            </button>
                            {isTypeOpen && (
                                <div className="fixed w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[9999]" style={{ top: `${typeDropdownPos.top}px`, left: `${typeDropdownPos.left}px` }}>
                                {['Any', 'Platform', 'API', 'Support', 'Archive'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setTypeFilter(type);
                                            setIsTypeOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                            typeFilter === type
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div ref={createdRef} className="relative z-[100] shrink-0">
                        <button
                            onClick={() => {
                                if (createdRef.current) {
                                    const rect = createdRef.current.getBoundingClientRect();
                                    setCreatedDropdownPos({ top: rect.bottom + 4, left: rect.left });
                                }
                                setIsCreatedOpen(!isCreatedOpen);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors"
                        >
                            <span>Created: {createdFilter}</span>
                            <span className={cn("material-symbols-outlined text-[18px] text-slate-400 transition-transform", isCreatedOpen && "rotate-180")}>keyboard_arrow_down</span>
                        </button>
                        {isCreatedOpen && (
                            <div className="fixed w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[9999]" style={{ top: `${createdDropdownPos.top}px`, left: `${createdDropdownPos.left}px` }}>
                                {['Any time', 'Last week', 'Last month', 'Last year'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            setCreatedFilter(time);
                                            setIsCreatedOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                                            createdFilter === time
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    </div>
                </div>
                <div className="h-auto w-px bg-slate-200 dark:bg-slate-700 my-2 hidden sm:block"></div>

                <div className="flex items-center px-2">
                    <button
                        onClick={() => {
                            setStatusFilter('All');
                            setTypeFilter('Any');
                            setCreatedFilter('Any time');
                            setSearchQuery('');
                        }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Clear all filters"
                    >
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                    <button
                        onClick={() => {
                            const csvContent = [
                                ['Product Name', 'Product ID', 'Status', 'Created Date', 'Created Time', 'Plans'].join(','),
                                ...products.map((product: Product) => [
                                    `"${product.name}"`,
                                    product.productId,
                                    product.status,
                                    product.createdDate,
                                    product.createdTime,
                                    `"${product.plans.map((p) => `${p.name} (${p.price})`).join('; ')}"`
                                ].join(','))
                            ].join('\n');
                            
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            const url = URL.createObjectURL(blob);
                            link.setAttribute('href', url);
                            link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Export to CSV"
                    >
                        <span className="material-symbols-outlined">download</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                <th className="px-6 py-4 w-[40%]">Product</th>
                                <th className="px-6 py-4">Pricing Plans</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500">Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No products found</td></tr>
                            ) : products.map((product) => (
                                <tr 
                                    key={product.id} 
                                    className={cn("group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer", product.status === 'archived' && 'opacity-60')}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button, .product-action-menu')) return;
                                        navigate(ROUTES.PRODUCT_DETAIL.replace(':id', product.id));
                                    }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-4">
                                            <div className={cn("size-10 rounded-lg flex items-center justify-center shrink-0 border", getIconColor(product.icon || 'inventory_2'))}>
                                                <span className="material-symbols-outlined">{product.icon || 'inventory_2'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                    {product.name || 'Unnamed Product'}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                                                        {product.productId || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            {(product.plans || []).map((plan, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs w-full max-w-[200px]">
                                                    <span className={cn("text-slate-700 dark:text-slate-300 font-medium", plan.isStrikethrough && "line-through text-slate-500")}>
                                                        {plan.name}
                                                    </span>
                                                    <span className={cn("text-slate-500 dark:text-slate-400", plan.isStrikethrough && "line-through text-slate-400")}>
                                                        {plan.price}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600 dark:text-slate-300">{product.createdDate || 'N/A'}</span>
                                        <p className="text-xs text-slate-400">{product.createdTime || ''}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", getStatusStyle(product.status || 'active'))}>
                                            <span className={cn("size-1.5 rounded-full", getStatusDot(product.status || 'active'))}></span>
                                            {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            ref={(el) => (actionMenuRefs.current[product.id] = el)}
                                            onClick={(e) => {
                                                const button = e.currentTarget;
                                                const rect = button.getBoundingClientRect();
                                                setActionMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
                                                setOpenActionMenu(openActionMenu === product.id ? null : product.id);
                                                e.stopPropagation();
                                            }}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                        </button>
                                        {openActionMenu === product.id && (
                                            <div
                                                className="product-action-menu fixed w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[10001]"
                                                style={{ top: `${actionMenuPos.top}px`, left: `${actionMenuPos.left}px` }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleEdit(product);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDuplicate(product);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                                    Duplicate
                                                </button>
                                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDelete(product);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors last:rounded-b-lg flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900 dark:text-white">1-{products.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{products.length}</span> products</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg cursor-not-allowed bg-slate-50 dark:bg-slate-800">Previous</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 transition-colors">Next</button>
                    </div>
                </div>
            </div>
            </div>
            <CreateProductDialog
                isOpen={isCreateDialogOpen}
                onClose={() => {
                    setIsCreateDialogOpen(false);
                    setDuplicateProduct(null);
                }}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    setDuplicateProduct(null);
                }}
                initialData={duplicateProduct ? {
                    name: `${duplicateProduct.name} (Copy)`,
                    description: duplicateProduct.description || '',
                    active: duplicateProduct.status === 'active',
                    metadata: {
                        featured: false,
                        category: (() => {
                            const iconToCategoryMap: Record<string, string> = {
                                'cloud_queue': 'subscription',
                                'shopping_cart': 'one-time',
                                'api': 'usage-based',
                                'add_box': 'addon',
                                'support_agent': 'addon',
                                'archive': 'subscription',
                            };
                            return iconToCategoryMap[duplicateProduct.icon || 'cloud_queue'] || 'subscription';
                        })(),
                    },
                } : undefined}
            />
            <EditProductDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedProduct(null);
                }}
                onSuccess={() => {
                    setIsEditDialogOpen(false);
                    setSelectedProduct(null);
                }}
                product={selectedProduct}
            />
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedProduct(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Product?"
                description={
                    selectedProduct ? (
                        <>
                            Are you sure you want to delete <span className="font-medium text-slate-900 dark:text-slate-200">{selectedProduct.name}</span>? This action cannot be undone.
                        </>
                    ) : (
                        'Are you sure you want to delete this product? This action cannot be undone.'
                    )
                }
                confirmText="Delete"
                cancelText="Cancel"
                icon="delete"
                confirmVariant="danger"
            />
        </div>
    );
};
