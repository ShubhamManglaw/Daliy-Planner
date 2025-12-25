import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const STORAGE_KEY = 'daily-planner-v2';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getTodayDateString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

const DEFAULT_CATEGORIES = [];

const INITIAL_STATE = {
    // Schema: { 
    //   data: { [dateString]: { tasks: [], goals: [], notes: '' } },
    //   yearlyData: {},
    //   categories: [] // { name, color }
    // }
    data: {
        [getTodayDateString()]: {
            tasks: [],
            goals: [],
            notes: ''
        }
    },
    yearlyData: {},
    categories: DEFAULT_CATEGORIES
};

export const usePlanner = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);
    const [storageMode, setStorageMode] = useState('local'); // 'server', 'local', 'firebase'

    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setStorageMode('firebase');
                loadFromFirebase(currentUser.uid);
            } else {
                // If logged out, try server or local
                setStorageMode('local');
                loadFromLocal();
            }
        });
        return unsubscribe;
    }, []);

    const loadFromFirebase = async (uid) => {
        console.log("🔥 Loading from Firebase for user:", uid);
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setState(docSnap.data());
            } else {
                console.log("No such document! Starting fresh.");
            }
        } catch (e) {
            console.error("Error loading from Firebase", e);
        } finally {
            setIsLoaded(true);
        }
    };

    const loadFromLocal = () => {
        console.log("💻 Loading from LocalStorage");
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            try {
                setState(JSON.parse(localData));
            } catch (e) {
                console.error("Corrupt local data", e);
            }
        }
        setIsLoaded(true);
    };

    // Backfill Categories (Migration)
    useEffect(() => {
        if (!isLoaded) return;
        // Collect all unique categories currently in use by tasks
        const usedCategories = new Set();
        Object.values(state.data).forEach(day => {
            if (day.tasks) {
                day.tasks.forEach(t => {
                    if (t.category && t.category !== 'General') {
                        usedCategories.add(t.category);
                    }
                });
            }
        });
        // Check which ones are missing from state.categories
        const existingCategoryNames = new Set((state.categories || []).map(c => c.name));
        const missingCategories = [...usedCategories].filter(cat => !existingCategoryNames.has(cat));

        if (missingCategories.length > 0) {
            console.log("Migrating legacy categories:", missingCategories);
            const PALETTE = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#8884d8'];
            const newCategories = missingCategories.map((name, index) => ({
                name,
                color: PALETTE[index % PALETTE.length]
            }));
            setState(prev => ({
                ...prev,
                categories: [...(prev.categories || []), ...newCategories]
            }));
        }
    }, [isLoaded]);

    // Save on Change
    useEffect(() => {
        if (!isLoaded) return;

        const saveData = async () => {
            if (storageMode === 'firebase' && user) {
                try {
                    await setDoc(doc(db, "users", user.uid), state);
                } catch (e) {
                    console.error("Error saving to Firebase", e);
                }
            } else {
                // Local Mode
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            }
        };
        saveData();
    }, [state, isLoaded, storageMode, user]);


    const getDateData = (date) => {
        return state.data[date] || { tasks: [], goals: [], notes: '' };
    };

    const updateDateData = (date, updateFn) => {
        setState(prev => {
            const currentDayData = prev.data[date] || { tasks: [], goals: [], notes: '' };
            const newData = updateFn(currentDayData);
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [date]: newData
                }
            };
        });
    };

    // Tasks
    const addTask = (date, { title, time, category }) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            tasks: [...dayData.tasks, {
                id: generateId(),
                title,
                time: time || '--:--',
                category: category || 'General',
                completed: false
            }]
        }));
    };

    const toggleTask = (date, taskId) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            tasks: dayData.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        }));
    };

    const deleteTask = (date, taskId) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            tasks: dayData.tasks.filter(t => t.id !== taskId)
        }));
    };

    // Goals
    const addGoal = (date, text) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            goals: [...dayData.goals, { id: generateId(), text, completed: false }]
        }));
    };

    const toggleGoal = (date, goalId) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            goals: dayData.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
        }));
    };

    const deleteGoal = (date, goalId) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            goals: dayData.goals.filter(g => g.id !== goalId)
        }));
    };

    // Notes
    const updateNotes = (date, text) => {
        updateDateData(date, (dayData) => ({
            ...dayData,
            notes: text
        }));
    };

    // Yearly Goals
    const getYearlyGoals = (year) => {
        return state.yearlyData?.[year]?.goals || [];
    };

    const addYearlyGoal = (year, text) => {
        setState(prev => {
            const currentYearData = prev.yearlyData?.[year] || { goals: [] };
            return {
                ...prev,
                yearlyData: {
                    ...prev.yearlyData,
                    [year]: {
                        ...currentYearData,
                        goals: [...currentYearData.goals, { id: generateId(), text, completed: false }]
                    }
                }
            };
        });
    };

    const toggleYearlyGoal = (year, goalId) => {
        setState(prev => {
            const currentYearData = prev.yearlyData?.[year] || { goals: [] };
            return {
                ...prev,
                yearlyData: {
                    ...prev.yearlyData,
                    [year]: {
                        ...currentYearData,
                        goals: currentYearData.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
                    }
                }
            };
        });
    };

    const deleteYearlyGoal = (year, goalId) => {
        setState(prev => {
            const currentYearData = prev.yearlyData?.[year] || { goals: [] };
            return {
                ...prev,
                yearlyData: {
                    ...prev.yearlyData,
                    [year]: {
                        ...currentYearData,
                        goals: currentYearData.goals.filter(g => g.id !== goalId)
                    }
                }
            };
        });
    };

    // Categories
    const addCategory = (name, color) => {
        const currentCategories = state.categories || DEFAULT_CATEGORIES;
        // Avoid duplicates
        if (currentCategories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;

        setState(prev => ({
            ...prev,
            categories: [...(prev.categories || DEFAULT_CATEGORIES), { name, color }]
        }));
    };

    const deleteCategory = (name) => {
        setState(prev => ({
            ...prev,
            categories: (prev.categories || DEFAULT_CATEGORIES).filter(c => c.name !== name)
        }));
    };

    const updateCategory = (oldName, updates) => { // updates: { name, color }
        const newName = updates.name.trim();
        const newColor = updates.color;

        // Validation: If renaming, check if new name already exists (and isn't self)
        if (newName.toLowerCase() !== oldName.toLowerCase()) {
            const currentCategories = state.categories || DEFAULT_CATEGORIES;
            if (currentCategories.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
                console.warn(`Category "${newName}" already exists.`);
                return; // Prevent duplicate names
            }
        }

        setState(prev => {
            const currentCategories = prev.categories || DEFAULT_CATEGORIES;

            // 1. Update Category List
            const updatedCategories = currentCategories.map(c =>
                c.name === oldName ? { ...c, name: newName, color: newColor } : c
            );

            // 2. Cascade Update to Tasks (if name changed)
            let updatedData = prev.data;
            if (newName !== oldName) {
                updatedData = {};
                Object.keys(prev.data).forEach(dateStr => {
                    const dayData = prev.data[dateStr];
                    // Only process days that have tasks with this category
                    const hasTargetTask = dayData.tasks && dayData.tasks.some(t => t.category === oldName);

                    if (hasTargetTask) {
                        updatedData[dateStr] = {
                            ...dayData,
                            tasks: dayData.tasks.map(t =>
                                t.category === oldName ? { ...t, category: newName } : t
                            )
                        };
                    } else {
                        updatedData[dateStr] = dayData; // Keep reference if no change
                    }
                });
            }

            return {
                ...prev,
                categories: updatedCategories,
                data: updatedData
            };
        });
    };

    const getCategories = () => {
        return state.categories || DEFAULT_CATEGORIES;
    };

    // Analytics Helpers
    const getCategoryColor = (categoryName) => {
        const cat = (state.categories || DEFAULT_CATEGORIES).find(c => c.name === categoryName);
        return cat ? cat.color : '#d1d5db'; // Default gray if not found
    };

    const getDailyStats = (date) => {
        const dayData = getDateData(date);
        const total = dayData.tasks.length;
        if (total === 0) return [];

        const categoryCounts = {};

        dayData.tasks.forEach(task => {
            const cat = task.category || 'General';
            if (!categoryCounts[cat]) {
                categoryCounts[cat] = { name: cat, value: 0, completed: 0, color: getCategoryColor(cat) };
            }
            categoryCounts[cat].value += 1;
            if (task.completed) categoryCounts[cat].completed += 1;
        });

        return Object.values(categoryCounts);
    };

    const getWeeklyStats = (weekDaysArray, labelFormat = 'weekday') => {
        return weekDaysArray.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const stats = getDailyStats(dateStr);
            let label = '';
            if (labelFormat === 'day') {
                label = date.getDate().toString();
            } else {
                label = date.toLocaleDateString('en-US', { weekday: 'short' });
            }

            const daySummary = {
                name: label,
                date: dateStr
            };
            stats.forEach(catStat => {
                daySummary[catStat.name] = catStat.completed;
            });
            return daySummary;
        });
    };

    const getYearlyStats = (year) => {
        const stats = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        months.forEach((monthName, index) => {
            const monthStats = { name: monthName };
            (state.categories || DEFAULT_CATEGORIES).forEach(cat => monthStats[cat.name] = 0);
            const daysInMonth = new Date(year, index + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, index, d);
                const dateStr = date.toISOString().split('T')[0];
                const dayData = getDateData(dateStr);
                dayData.tasks.forEach(task => {
                    if (task.completed) {
                        const cat = task.category || 'General';
                        if (monthStats[cat] !== undefined) {
                            monthStats[cat] += 1;
                        }
                    }
                });
            }
            stats.push(monthStats);
        });
        return stats;
    };

    const addToGoogleCalendar = (task, date) => {
        const title = encodeURIComponent(task.title);
        const details = encodeURIComponent(`Category: ${task.category}\n\nAdded via Daily Planner`);
        const basicDate = date.replace(/-/g, '');
        const dates = `${basicDate}/${basicDate}`;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;

        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: url });
        } else {
            window.open(url, '_blank');
        }
    };

    return {
        state,
        getDateData,
        addTask,
        toggleTask,
        deleteTask,
        addGoal,
        toggleGoal,
        deleteGoal,
        updateNotes,
        getYearlyGoals,
        addYearlyGoal,
        toggleYearlyGoal,
        deleteYearlyGoal,
        getCategoryColor,
        getDailyStats,
        getWeeklyStats,
        getYearlyStats,
        addToGoogleCalendar,
        addCategory,
        deleteCategory,
        updateCategory,
        getCategories
    };
};
