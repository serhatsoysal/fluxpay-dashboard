import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreateProduct } from '../api/productsQueries';

interface CreateProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: {
        name: string;
        description: string;
        active: boolean;
        metadata: {
            featured: boolean;
            category: string;
        };
    };
}

interface CreateProductFormData {
    name: string;
    description: string;
    active: boolean;
    metadata: {
        featured: boolean;
        category: string;
    };
}

export const CreateProductDialog: FC<CreateProductDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) => {
    const [formData, setFormData] = useState<CreateProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        active: initialData?.active ?? true,
        metadata: {
            featured: initialData?.metadata.featured || false,
            category: initialData?.metadata.category || 'subscription',
        },
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CreateProductFormData, string>>>({});
    const createProductMutation = useCreateProduct();

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                active: initialData.active,
                metadata: {
                    featured: initialData.metadata.featured,
                    category: initialData.metadata.category,
                },
            });
        } else {
            setFormData({
                name: '',
                description: '',
                active: true,
                metadata: {
                    featured: false,
                    category: 'subscription',
                },
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field: keyof CreateProductFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleMetadataChange = (field: keyof CreateProductFormData['metadata'], value: any) => {
        setFormData((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, [field]: value },
        }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateProductFormData, string>> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await createProductMutation.mutateAsync({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                active: formData.active,
                metadata: formData.metadata,
            });
            onSuccess();
            handleClose();
        } catch (error: any) {
            setErrors({ name: error.response?.data?.message || 'Failed to create product' });
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            active: true,
            metadata: {
                featured: false,
                category: 'subscription',
            },
        });
        setErrors({});
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={handleClose}
            ></div>

            <div className="relative w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 transform transition-all scale-100 opacity-100 flex flex-col overflow-hidden z-[10001]">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <div className="p-6 pt-8 sm:p-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex flex-col gap-5 mb-6">
                        <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]">add_box</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold leading-6 text-slate-900 dark:text-white tracking-tight">
                                Create New Product
                            </h3>
                            <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Add a new product to your catalog. Fill in the details below.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Product Name
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Pro Plan"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Description
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">description</span>
                                </span>
                                <textarea
                                    placeholder="Professional plan with advanced features"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={3}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 pl-10 pr-4 py-2.5 placeholder:text-slate-400 text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-slate-900 dark:text-gray-300 text-xs font-bold leading-normal uppercase tracking-wider">
                                Category
                            </span>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">category</span>
                                </span>
                                <select
                                    value={formData.metadata.category}
                                    onChange={(e) => handleMetadataChange('category', e.target.value)}
                                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-11 pl-10 pr-4 appearance-none cursor-pointer text-sm font-normal leading-normal focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                >
                                    <option value="subscription">Subscription</option>
                                    <option value="one-time">One-time</option>
                                    <option value="usage-based">Usage-based</option>
                                    <option value="addon">Add-on</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                                </span>
                            </div>
                        </label>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => handleChange('active', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Active
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.metadata.featured}
                                    onChange={(e) => handleMetadataChange('featured', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Featured
                                </span>
                            </label>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={createProductMutation.isPending}
                                className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createProductMutation.isPending}
                                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent"></div>
            </div>
        </div>,
        document.body
    );
};

