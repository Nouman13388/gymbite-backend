import React, { useState, useEffect } from 'react';
import { CRUDModal } from '../../views/components/ui/CRUDModal';
import { crudApi } from '../../services/api';
import type { MealFormData } from '../../schemas';

interface MealPlan {
    id: number;
    title: string;
    description?: string;
    category: string;
    imageUrl?: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    userId: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface MealFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MealFormData) => Promise<void>;
    meal?: MealPlan | null;
    isLoading?: boolean;
}

export const MealFormModal: React.FC<MealFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    meal
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [formData, setFormData] = useState({
        title: meal?.title || '',
        description: meal?.description || '',
        category: meal?.category || 'General',
        imageUrl: meal?.imageUrl || '',
        calories: meal?.calories || 0,
        protein: meal?.protein || 0,
        fat: meal?.fat || 0,
        carbs: meal?.carbs || 0,
        userId: meal?.userId || 0,
        meals: [] as { name: string; type: string; ingredients: string[]; calories: number; protein: number; description?: string; imageUrl?: string }[]
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const fetchedUsers = await crudApi.users.getAll();
                setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: meal?.title || '',
                description: meal?.description || '',
                category: meal?.category || 'General',
                imageUrl: meal?.imageUrl || '',
                calories: meal?.calories || 0,
                protein: meal?.protein || 0,
                fat: meal?.fat || 0,
                carbs: meal?.carbs || 0,
                userId: meal?.userId || 0,
                meals: []
            });
        }
    }, [isOpen, meal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'userId' || name === 'calories' || name === 'protein' || name === 'fat' || name === 'carbs'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a meal plan title');
            return;
        }

        if (!formData.category) {
            alert('Please select a category');
            return;
        }

        if (!formData.userId || formData.userId === 0) {
            alert('Please select a user');
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <CRUDModal
            isOpen={isOpen}
            onClose={onClose}
            title={meal ? 'Edit Meal Plan' : 'Create New Meal Plan'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                        Meal Plan Title *
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter meal plan title"
                        className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                        Category *
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Keto">Keto</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="General">General</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter meal plan description (optional)"
                        rows={3}
                        className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium text-white mb-2">
                            Calories
                        </label>
                        <input
                            id="calories"
                            name="calories"
                            type="number"
                            value={formData.calories}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                            className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="protein" className="block text-sm font-medium text-white mb-2">
                            Protein (g)
                        </label>
                        <input
                            id="protein"
                            name="protein"
                            type="number"
                            value={formData.protein}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="fat" className="block text-sm font-medium text-white mb-2">
                            Fat (g)
                        </label>
                        <input
                            id="fat"
                            name="fat"
                            type="number"
                            value={formData.fat}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="carbs" className="block text-sm font-medium text-white mb-2">
                            Carbs (g)
                        </label>
                        <input
                            id="carbs"
                            name="carbs"
                            type="number"
                            value={formData.carbs}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-white mb-2">
                        Assigned User *
                    </label>
                    <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border rounded-lg text-white bg-slate-700 border-slate-600 focus:border-blue-500"
                        disabled={loadingUsers}
                        required
                    >
                        <option value={0}>
                            {loadingUsers ? 'Loading users...' : 'Select a user'}
                        </option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {meal ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </CRUDModal>
    );
};
