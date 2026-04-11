'use client';

import { useState, useEffect, useCallback } from 'react';
import { useHomeownerAuth } from '@/contexts/HomeownerAuthContext';
import { homesApi, systemsApi, tasksApi, recordsApi, materialsApi } from '@/lib/homeTrackerApi';
import { generateMaintenanceTasks } from '@/data/boerneMaintenanceData';
import type {
  Home,
  HomeSystem,
  MaintenanceTask,
  ServiceRecord,
  Material,
  HomeSystemType,
} from '@/types/homeTracker';

// ============================================
// HOMES HOOK
// ============================================

export function useHomes() {
  const { user } = useHomeownerAuth();
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load homes from Supabase
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    if (!user) {
      setHomes([]);
      setIsLoaded(true);
      return;
    }

    const loadHomes = async () => {
      try {
        const data = await homesApi.list(user.id);
        if (mounted) {
          setHomes(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load homes:', err);
        if (mounted) {
          // Set empty homes on error to allow page to render
          setHomes([]);
          setError('Failed to load homes');
        }
      } finally {
        if (mounted) {
          setIsLoaded(true);
          clearTimeout(timeoutId);
        }
      }
    };

    // Add timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Homes loading timed out');
        setHomes([]);
        setIsLoaded(true);
      }
    }, 15000);

    loadHomes();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  const addHome = useCallback(async (
    homeData: Omit<Home, 'id' | 'createdAt' | 'updatedAt' | 'systems'>
  ): Promise<Home | null> => {
    if (!user) return null;

    try {
      const newHome = await homesApi.create(user.id, homeData);
      setHomes(prev => [newHome, ...prev]);
      return newHome;
    } catch (err) {
      console.error('Failed to add home:', err);
      setError('Failed to add home');
      return null;
    }
  }, [user]);

  const updateHome = useCallback(async (id: string, updates: Partial<Home>) => {
    try {
      await homesApi.update(id, updates);
      setHomes(prev => prev.map(home =>
        home.id === id ? { ...home, ...updates, updatedAt: new Date().toISOString() } : home
      ));
    } catch (err) {
      console.error('Failed to update home:', err);
      setError('Failed to update home');
    }
  }, []);

  const deleteHome = useCallback(async (id: string) => {
    try {
      await homesApi.delete(id);
      setHomes(prev => prev.filter(home => home.id !== id));
    } catch (err) {
      console.error('Failed to delete home:', err);
      setError('Failed to delete home');
    }
  }, []);

  const getHome = useCallback((id: string) => {
    return homes.find(home => home.id === id);
  }, [homes]);

  const addSystem = useCallback(async (
    homeId: string,
    systemData: Omit<HomeSystem, 'id'>
  ): Promise<HomeSystem | null> => {
    try {
      const newSystem = await systemsApi.create(homeId, systemData);
      setHomes(prev => prev.map(home =>
        home.id === homeId
          ? { ...home, systems: [...home.systems, newSystem], updatedAt: new Date().toISOString() }
          : home
      ));
      return newSystem;
    } catch (err) {
      console.error('Failed to add system:', err);
      setError('Failed to add system');
      return null;
    }
  }, []);

  const updateSystem = useCallback(async (
    homeId: string,
    systemId: string,
    updates: Partial<HomeSystem>
  ) => {
    try {
      await systemsApi.update(systemId, updates);
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
    } catch (err) {
      console.error('Failed to update system:', err);
      setError('Failed to update system');
    }
  }, []);

  const deleteSystem = useCallback(async (homeId: string, systemId: string) => {
    try {
      await systemsApi.delete(systemId);
      setHomes(prev => prev.map(home =>
        home.id === homeId
          ? {
              ...home,
              systems: home.systems.filter(sys => sys.id !== systemId),
              updatedAt: new Date().toISOString(),
            }
          : home
      ));
    } catch (err) {
      console.error('Failed to delete system:', err);
      setError('Failed to delete system');
    }
  }, []);

  return {
    homes,
    isLoaded,
    error,
    addHome,
    updateHome,
    deleteHome,
    getHome,
    addSystem,
    updateSystem,
    deleteSystem,
  };
}

// ============================================
// TASKS HOOK
// ============================================

export function useTasks() {
  const { user } = useHomeownerAuth();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all tasks for user's homes
  const loadTasksForHome = useCallback(async (homeId: string) => {
    try {
      const homeTasks = await tasksApi.listForHome(homeId);
      setTasks(prev => {
        const filtered = prev.filter(t => t.homeId !== homeId);
        return [...filtered, ...homeTasks];
      });
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, []);

  // Generate tasks for a home based on its systems
  const generateTasksForHome = useCallback(async (home: Home) => {
    try {
      // First delete existing tasks for this home
      await tasksApi.deleteForHome(home.id);

      // Generate new tasks
      const newTasks = generateMaintenanceTasks(home);

      // Save to database
      const savedTasks = await tasksApi.createMany(newTasks);

      setTasks(prev => {
        const filtered = prev.filter(t => t.homeId !== home.id);
        return [...filtered, ...savedTasks];
      });
    } catch (err) {
      console.error('Failed to generate tasks:', err);
      setError('Failed to generate tasks');
    }
  }, []);

  const completeTask = useCallback(async (taskId: string, completedDate?: string) => {
    try {
      await tasksApi.complete(taskId, completedDate);

      const date = completedDate || new Date().toISOString();
      setTasks(prev => prev.map(task => {
        if (task.id !== taskId) return task;

        const nextDue = new Date(date);
        nextDue.setMonth(nextDue.getMonth() + task.frequencyMonths);

        return {
          ...task,
          lastCompleted: date,
          nextDue: nextDue.toISOString(),
          status: 'upcoming' as const,
        };
      }));
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('Failed to complete task');
    }
  }, []);

  const getTasksForHome = useCallback((homeId: string) => {
    return tasks.filter(t => t.homeId === homeId);
  }, [tasks]);

  const getUpcomingTasks = useCallback((days: number = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    return tasks
      .filter(t => new Date(t.nextDue) <= cutoff)
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
    isLoaded: true, // Tasks are loaded per-home now
    error,
    loadTasksForHome,
    generateTasksForHome,
    completeTask,
    getTasksForHome,
    getUpcomingTasks,
    getOverdueTasks,
    refreshTaskStatuses,
  };
}

// ============================================
// SERVICE RECORDS HOOK
// ============================================

export function useServiceRecords() {
  const { user } = useHomeownerAuth();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecordsForHome = useCallback(async (homeId: string) => {
    try {
      const homeRecords = await recordsApi.listForHome(homeId);
      setRecords(prev => {
        const filtered = prev.filter(r => r.homeId !== homeId);
        return [...filtered, ...homeRecords];
      });
    } catch (err) {
      console.error('Failed to load records:', err);
    }
  }, []);

  const addRecord = useCallback(async (
    recordData: Omit<ServiceRecord, 'id'>
  ): Promise<ServiceRecord | null> => {
    try {
      const newRecord = await recordsApi.create(recordData);
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      console.error('Failed to add record:', err);
      setError('Failed to add record');
      return null;
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<ServiceRecord>) => {
    try {
      await recordsApi.update(id, updates);
      setRecords(prev => prev.map(record =>
        record.id === id ? { ...record, ...updates } : record
      ));
    } catch (err) {
      console.error('Failed to update record:', err);
      setError('Failed to update record');
    }
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      await recordsApi.delete(id);
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
      setError('Failed to delete record');
    }
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
    isLoaded: true,
    error,
    loadRecordsForHome,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsForHome,
    getRecordsForSystem,
  };
}

// ============================================
// MATERIALS HOOK
// ============================================

export function useMaterials() {
  const { user } = useHomeownerAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMaterialsForHome = useCallback(async (homeId: string) => {
    try {
      const homeMaterials = await materialsApi.listForHome(homeId);
      setMaterials(prev => {
        const filtered = prev.filter(m => m.homeId !== homeId);
        return [...filtered, ...homeMaterials];
      });
    } catch (err) {
      console.error('Failed to load materials:', err);
    }
  }, []);

  const addMaterial = useCallback(async (
    materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Material | null> => {
    try {
      const newMaterial = await materialsApi.create(materialData);
      setMaterials(prev => [newMaterial, ...prev]);
      return newMaterial;
    } catch (err) {
      console.error('Failed to add material:', err);
      setError('Failed to add material');
      return null;
    }
  }, []);

  const updateMaterial = useCallback(async (id: string, updates: Partial<Material>) => {
    try {
      await materialsApi.update(id, updates);
      setMaterials(prev => prev.map(material =>
        material.id === id
          ? { ...material, ...updates, updatedAt: new Date().toISOString() }
          : material
      ));
    } catch (err) {
      console.error('Failed to update material:', err);
      setError('Failed to update material');
    }
  }, []);

  const deleteMaterial = useCallback(async (id: string) => {
    try {
      await materialsApi.delete(id);
      setMaterials(prev => prev.filter(material => material.id !== id));
    } catch (err) {
      console.error('Failed to delete material:', err);
      setError('Failed to delete material');
    }
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

  const getMaterialsByType = useCallback((homeId: string, type: Material['type']) => {
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
    isLoaded: true,
    error,
    loadMaterialsForHome,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialsForHome,
    getMaterialsByRoom,
    getMaterialsByType,
    getRoomsWithMaterials,
  };
}
