'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Home, HomeSystem, MaintenanceTask, ServiceRecord, Material, HomeSystemType, MaterialType } from '@/types/homeTracker';
import { generateMaintenanceTasks } from '@/data/boerneMaintenanceData';

const STORAGE_KEYS = {
  homes: 'bhh_homes',
  tasks: 'bhh_tasks',
  records: 'bhh_records',
  materials: 'bhh_materials',
};

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Safe localStorage access (SSR-safe)
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function useHomes() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setHomes(getFromStorage<Home[]>(STORAGE_KEYS.homes, []));
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      setToStorage(STORAGE_KEYS.homes, homes);
    }
  }, [homes, isLoaded]);

  const addHome = useCallback((homeData: Omit<Home, 'id' | 'createdAt' | 'updatedAt' | 'systems'>) => {
    const newHome: Home = {
      ...homeData,
      id: generateId(),
      systems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHomes(prev => [...prev, newHome]);
    return newHome;
  }, []);

  const updateHome = useCallback((id: string, updates: Partial<Home>) => {
    setHomes(prev => prev.map(home =>
      home.id === id
        ? { ...home, ...updates, updatedAt: new Date().toISOString() }
        : home
    ));
  }, []);

  const deleteHome = useCallback((id: string) => {
    setHomes(prev => prev.filter(home => home.id !== id));
  }, []);

  const getHome = useCallback((id: string) => {
    return homes.find(home => home.id === id);
  }, [homes]);

  const addSystem = useCallback((homeId: string, systemData: Omit<HomeSystem, 'id'>) => {
    const newSystem: HomeSystem = {
      ...systemData,
      id: generateId(),
    };
    setHomes(prev => prev.map(home =>
      home.id === homeId
        ? { ...home, systems: [...home.systems, newSystem], updatedAt: new Date().toISOString() }
        : home
    ));
    return newSystem;
  }, []);

  const updateSystem = useCallback((homeId: string, systemId: string, updates: Partial<HomeSystem>) => {
    setHomes(prev => prev.map(home =>
      home.id === homeId
        ? {
            ...home,
            systems: home.systems.map(sys =>
              sys.id === systemId ? { ...sys, ...updates } : sys
            ),
            updatedAt: new Date().toISOString(),
          }
        : home
    ));
  }, []);

  const deleteSystem = useCallback((homeId: string, systemId: string) => {
    setHomes(prev => prev.map(home =>
      home.id === homeId
        ? {
            ...home,
            systems: home.systems.filter(sys => sys.id !== systemId),
            updatedAt: new Date().toISOString(),
          }
        : home
    ));
  }, []);

  return {
    homes,
    isLoaded,
    addHome,
    updateHome,
    deleteHome,
    getHome,
    addSystem,
    updateSystem,
    deleteSystem,
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTasks(getFromStorage<MaintenanceTask[]>(STORAGE_KEYS.tasks, []));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToStorage(STORAGE_KEYS.tasks, tasks);
    }
  }, [tasks, isLoaded]);

  // Generate tasks for a home based on its systems
  const generateTasksForHome = useCallback((home: Home) => {
    const newTasks = generateMaintenanceTasks(home);
    setTasks(prev => {
      // Remove existing tasks for this home first
      const filtered = prev.filter(t => t.homeId !== home.id);
      return [...filtered, ...newTasks];
    });
  }, []);

  const completeTask = useCallback((taskId: string, completedDate?: string) => {
    const date = completedDate || new Date().toISOString();
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;

      // Calculate next due date
      const nextDue = new Date(date);
      nextDue.setMonth(nextDue.getMonth() + task.frequencyMonths);

      return {
        ...task,
        lastCompleted: date,
        nextDue: nextDue.toISOString(),
        status: 'upcoming' as const,
      };
    }));
  }, []);

  const getTasksForHome = useCallback((homeId: string) => {
    return tasks.filter(t => t.homeId === homeId);
  }, [tasks]);

  const getUpcomingTasks = useCallback((days: number = 30) => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return tasks
      .filter(t => {
        const dueDate = new Date(t.nextDue);
        return dueDate <= cutoff;
      })
      .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(t => new Date(t.nextDue) < now && t.status !== 'completed');
  }, [tasks]);

  // Update task statuses based on current date
  const refreshTaskStatuses = useCallback(() => {
    const now = new Date();
    setTasks(prev => prev.map(task => {
      const dueDate = new Date(task.nextDue);
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let status: MaintenanceTask['status'];
      if (daysUntilDue < 0) {
        status = 'overdue';
      } else if (daysUntilDue === 0) {
        status = 'due';
      } else if (daysUntilDue <= 14) {
        status = 'due-soon';
      } else {
        status = 'upcoming';
      }

      return { ...task, status };
    }));
  }, []);

  return {
    tasks,
    isLoaded,
    generateTasksForHome,
    completeTask,
    getTasksForHome,
    getUpcomingTasks,
    getOverdueTasks,
    refreshTaskStatuses,
  };
}

export function useServiceRecords() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRecords(getFromStorage<ServiceRecord[]>(STORAGE_KEYS.records, []));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToStorage(STORAGE_KEYS.records, records);
    }
  }, [records, isLoaded]);

  const addRecord = useCallback((recordData: Omit<ServiceRecord, 'id'>) => {
    const newRecord: ServiceRecord = {
      ...recordData,
      id: generateId(),
    };
    setRecords(prev => [...prev, newRecord]);
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<ServiceRecord>) => {
    setRecords(prev => prev.map(record =>
      record.id === id ? { ...record, ...updates } : record
    ));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  }, []);

  const getRecordsForHome = useCallback((homeId: string) => {
    return records
      .filter(r => r.homeId === homeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records]);

  const getRecordsForSystem = useCallback((homeId: string, systemType: HomeSystemType) => {
    return records
      .filter(r => r.homeId === homeId && r.systemType === systemType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records]);

  return {
    records,
    isLoaded,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsForHome,
    getRecordsForSystem,
  };
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMaterials(getFromStorage<Material[]>(STORAGE_KEYS.materials, []));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setToStorage(STORAGE_KEYS.materials, materials);
    }
  }, [materials, isLoaded]);

  const addMaterial = useCallback((materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMaterials(prev => [...prev, newMaterial]);
    return newMaterial;
  }, []);

  const updateMaterial = useCallback((id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material =>
      material.id === id
        ? { ...material, ...updates, updatedAt: new Date().toISOString() }
        : material
    ));
  }, []);

  const deleteMaterial = useCallback((id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  }, []);

  const getMaterialsForHome = useCallback((homeId: string) => {
    return materials
      .filter(m => m.homeId === homeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [materials]);

  const getMaterialsByRoom = useCallback((homeId: string, room: string) => {
    return materials
      .filter(m => m.homeId === homeId && m.room === room)
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [materials]);

  const getMaterialsByType = useCallback((homeId: string, type: MaterialType) => {
    return materials
      .filter(m => m.homeId === homeId && m.type === type)
      .sort((a, b) => a.room.localeCompare(b.room));
  }, [materials]);

  const getRoomsWithMaterials = useCallback((homeId: string) => {
    const rooms = new Set(materials.filter(m => m.homeId === homeId).map(m => m.room));
    return Array.from(rooms).sort();
  }, [materials]);

  return {
    materials,
    isLoaded,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialsForHome,
    getMaterialsByRoom,
    getMaterialsByType,
    getRoomsWithMaterials,
  };
}
