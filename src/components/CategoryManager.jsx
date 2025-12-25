import React, { useState } from 'react';
import { usePlanner } from '../hooks/usePlanner';
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';

const CategoryManager = () => {
    const { getCategories, addCategory, updateCategory, deleteCategory } = usePlanner();
    const categories = getCategories();

    const [editingName, setEditingName] = useState(null); // The name of the category currently being edited
    // Form states
    const [nameInput, setNameInput] = useState('');
    const [colorInput, setColorInput] = useState('#8884d8');

    // Create new states
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState('#8884d8');

    const startEditing = (cat) => {
        setEditingName(cat.name);
        setNameInput(cat.name);
        setColorInput(cat.color);
        setIsCreating(false);
    };

    const cancelEdit = () => {
        setEditingName(null);
        setNameInput('');
        setColorInput('#8884d8');
    };

    const handleUpdate = () => {
        if (!nameInput.trim()) return;
        updateCategory(editingName, { name: nameInput, color: colorInput });
        setEditingName(null);
    };

    const handleCreate = () => {
        if (!newName.trim()) return;
        addCategory(newName, newColor);
        setNewName('');
        setNewColor('#8884d8');
        setIsCreating(false);
    };

    return (
        <div className="category-manager" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Category Management</h2>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Customize your task categories and colors.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#4f46e5', color: 'white', border: 'none',
                            padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'
                        }}
                    >
                        <Plus size={18} /> New Category
                    </button>
                )}
            </div>

            {/* Create New Form */}
            {isCreating && (
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Create New Category</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Fitness"
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Color</label>
                            <input
                                type="color"
                                value={newColor}
                                onChange={e => setNewColor(e.target.value)}
                                style={{ width: '80px', height: '38px', padding: '0', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleCreate}
                                style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                style={{ padding: '8px 16px', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {categories.map(cat => (
                    <div key={cat.name} style={{
                        background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: '12px',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px',
                            background: cat.color
                        }}></div>

                        {editingName === cat.name ? (
                            // Edit Mode
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '12px' }}>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px' }}
                                />
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={colorInput}
                                        onChange={e => setColorInput(e.target.value)}
                                        style={{ width: '40px', height: '30px', padding: 0, border: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                        <button onClick={handleUpdate} style={{ padding: '4px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check size={16} /></button>
                                        <button onClick={cancelEdit} style={{ padding: '4px 8px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Display Mode
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '12px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>{cat.name}</h3>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{cat.color}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => startEditing(cat)}
                                        style={{ padding: '6px', color: '#6b7280', border: 'none', background: '#f3f4f6', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    {/* Optional Delete 
                                    <button 
                                        onClick={() => { if(confirm('Are you sure?')) deleteCategory(cat.name) }}
                                        style={{ padding: '6px', color: '#ef4444', border: 'none', background: '#fee2e2', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button> 
                                    */}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe', color: '#1e40af', fontSize: '14px' }}>
                <strong>Tip:</strong> Renaming a category here will automatically update all your historical tasks that used that category. Changing a color will instantly update all your charts.
            </div>
        </div>
    );
};

export default CategoryManager;
