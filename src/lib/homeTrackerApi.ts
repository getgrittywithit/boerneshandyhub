import { supabase } from './supabase';
import type {
  Home,
  HomeSystem,
  MaintenanceTask,
  ServiceRecord,
  Material,
  HomeSystemType,
  MaterialType,
} from '@/types/homeTracker';

// ============================================
// TYPE DEFINITIONS FOR DATABASE
// ============================================

interface DbHome {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  city: string;
  year_built: number | null;
  square_feet: number | null;
  lot_size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  created_at: string;
  updated_at: string;
}

interface DbHomeSystem {
  id: string;
  home_id: string;
  type: string;
  name: string;
  brand: string | null;
  model_number: string | null;
  install_date: string | null;
  warranty_expires: string | null;
  last_serviced: string | null;
  notes: string | null;
  created_at: string;
}

interface DbMaintenanceTask {
  id: string;
  home_id: string;
  system_type: string;
  title: string;
  description: string | null;
  frequency_months: number;
  last_completed: string | null;
  next_due: string;
  status: string;
  priority: string;
  linked_category: string | null;
  local_tip: string | null;
  created_at: string;
}

interface DbServiceRecord {
  id: string;
  home_id: string;
  task_id: string | null;
  system_type: string;
  service_date: string;
  title: string;
  description: string | null;
  provider_name: string | null;
  provider_id: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
}

interface DbMaterial {
  id: string;
  home_id: string;
  type: string;
  name: string;
  brand: string | null;
  color_code: string | null;
  finish: string | null;
  room: string;
  purchased_from: string | null;
  purchase_date: string | null;
  install_date: string | null;
  quantity: string | null;
  notes: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// CONVERTERS
// ============================================

function dbHomeToHome(dbHome: DbHome, systems: HomeSystem[]): Home {
  return {
    id: dbHome.id,
    name: dbHome.name,
    address: dbHome.address || '',
    city: dbHome.city,
    yearBuilt: dbHome.year_built,
    squareFeet: dbHome.square_feet,
    lotSize: dbHome.lot_size ? Number(dbHome.lot_size) : null,
    bedrooms: dbHome.bedrooms,
    bathrooms: dbHome.bathrooms ? Number(dbHome.bathrooms) : null,
    systems,
    createdAt: dbHome.created_at,
    updatedAt: dbHome.updated_at,
  };
}

function dbSystemToSystem(dbSystem: DbHomeSystem): HomeSystem {
  return {
    id: dbSystem.id,
    type: dbSystem.type as HomeSystemType,
    name: dbSystem.name,
    brand: dbSystem.brand || undefined,
    modelNumber: dbSystem.model_number || undefined,
    installDate: dbSystem.install_date || undefined,
    warrantyExpires: dbSystem.warranty_expires || undefined,
    lastServiced: dbSystem.last_serviced || undefined,
    notes: dbSystem.notes || undefined,
  };
}

function dbTaskToTask(dbTask: DbMaintenanceTask): MaintenanceTask {
  return {
    id: dbTask.id,
    homeId: dbTask.home_id,
    systemType: dbTask.system_type as HomeSystemType,
    title: dbTask.title,
    description: dbTask.description || '',
    frequencyMonths: dbTask.frequency_months,
    lastCompleted: dbTask.last_completed || undefined,
    nextDue: dbTask.next_due,
    status: dbTask.status as MaintenanceTask['status'],
    priority: dbTask.priority as MaintenanceTask['priority'],
    linkedCategory: dbTask.linked_category || undefined,
    localTip: dbTask.local_tip || undefined,
  };
}

function dbRecordToRecord(dbRecord: DbServiceRecord): ServiceRecord {
  return {
    id: dbRecord.id,
    homeId: dbRecord.home_id,
    taskId: dbRecord.task_id || undefined,
    systemType: dbRecord.system_type as HomeSystemType,
    date: dbRecord.service_date,
    title: dbRecord.title,
    description: dbRecord.description || '',
    provider: dbRecord.provider_name || undefined,
    providerId: dbRecord.provider_id || undefined,
    cost: dbRecord.cost ? Number(dbRecord.cost) : undefined,
    notes: dbRecord.notes || undefined,
  };
}

function dbMaterialToMaterial(dbMaterial: DbMaterial): Material {
  return {
    id: dbMaterial.id,
    homeId: dbMaterial.home_id,
    type: dbMaterial.type as MaterialType,
    name: dbMaterial.name,
    brand: dbMaterial.brand || undefined,
    colorCode: dbMaterial.color_code || undefined,
    finish: dbMaterial.finish || undefined,
    room: dbMaterial.room,
    purchasedFrom: dbMaterial.purchased_from || undefined,
    purchaseDate: dbMaterial.purchase_date || undefined,
    installDate: dbMaterial.install_date || undefined,
    quantity: dbMaterial.quantity || undefined,
    notes: dbMaterial.notes || undefined,
    photoUrl: dbMaterial.photo_path || undefined,
    createdAt: dbMaterial.created_at,
    updatedAt: dbMaterial.updated_at,
  };
}

// ============================================
// HOMES API
// ============================================

export const homesApi = {
  async list(userId: string): Promise<Home[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: homes, error } = await supabase
      .from('homes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!homes) return [];

    // Fetch systems for each home
    const homeIds = homes.map(h => h.id);
    const { data: systems } = await supabase
      .from('home_systems')
      .select('*')
      .in('home_id', homeIds);

    const systemsByHome: Record<string, HomeSystem[]> = {};
    (systems || []).forEach(s => {
      if (!systemsByHome[s.home_id]) systemsByHome[s.home_id] = [];
      systemsByHome[s.home_id].push(dbSystemToSystem(s));
    });

    return homes.map(h => dbHomeToHome(h, systemsByHome[h.id] || []));
  },

  async get(homeId: string): Promise<Home | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: home, error } = await supabase
      .from('homes')
      .select('*')
      .eq('id', homeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const { data: systems } = await supabase
      .from('home_systems')
      .select('*')
      .eq('home_id', homeId);

    return dbHomeToHome(home, (systems || []).map(dbSystemToSystem));
  },

  async create(
    userId: string,
    data: Omit<Home, 'id' | 'createdAt' | 'updatedAt' | 'systems'>
  ): Promise<Home> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: home, error } = await supabase
      .from('homes')
      .insert({
        user_id: userId,
        name: data.name,
        address: data.address || null,
        city: data.city,
        year_built: data.yearBuilt,
        square_feet: data.squareFeet,
        lot_size: data.lotSize,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
      })
      .select()
      .single();

    if (error) throw error;
    return dbHomeToHome(home, []);
  },

  async update(homeId: string, data: Partial<Home>): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: Partial<DbHome> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.address !== undefined) updates.address = data.address;
    if (data.city !== undefined) updates.city = data.city;
    if (data.yearBuilt !== undefined) updates.year_built = data.yearBuilt;
    if (data.squareFeet !== undefined) updates.square_feet = data.squareFeet;
    if (data.lotSize !== undefined) updates.lot_size = data.lotSize;
    if (data.bedrooms !== undefined) updates.bedrooms = data.bedrooms;
    if (data.bathrooms !== undefined) updates.bathrooms = data.bathrooms;

    const { error } = await supabase
      .from('homes')
      .update(updates)
      .eq('id', homeId);

    if (error) throw error;
  },

  async delete(homeId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('homes')
      .delete()
      .eq('id', homeId);

    if (error) throw error;
  },
};

// ============================================
// SYSTEMS API
// ============================================

export const systemsApi = {
  async create(homeId: string, data: Omit<HomeSystem, 'id'>): Promise<HomeSystem> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: system, error } = await supabase
      .from('home_systems')
      .insert({
        home_id: homeId,
        type: data.type,
        name: data.name,
        brand: data.brand || null,
        model_number: data.modelNumber || null,
        install_date: data.installDate || null,
        warranty_expires: data.warrantyExpires || null,
        last_serviced: data.lastServiced || null,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return dbSystemToSystem(system);
  },

  async update(systemId: string, data: Partial<HomeSystem>): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: Record<string, unknown> = {};
    if (data.type !== undefined) updates.type = data.type;
    if (data.name !== undefined) updates.name = data.name;
    if (data.brand !== undefined) updates.brand = data.brand;
    if (data.modelNumber !== undefined) updates.model_number = data.modelNumber;
    if (data.installDate !== undefined) updates.install_date = data.installDate;
    if (data.warrantyExpires !== undefined) updates.warranty_expires = data.warrantyExpires;
    if (data.lastServiced !== undefined) updates.last_serviced = data.lastServiced;
    if (data.notes !== undefined) updates.notes = data.notes;

    const { error } = await supabase
      .from('home_systems')
      .update(updates)
      .eq('id', systemId);

    if (error) throw error;
  },

  async delete(systemId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('home_systems')
      .delete()
      .eq('id', systemId);

    if (error) throw error;
  },
};

// ============================================
// TASKS API
// ============================================

export const tasksApi = {
  async listForHome(homeId: string): Promise<MaintenanceTask[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .select('*')
      .eq('home_id', homeId)
      .order('next_due', { ascending: true });

    if (error) throw error;
    return (data || []).map(dbTaskToTask);
  },

  async create(data: Omit<MaintenanceTask, 'id'>): Promise<MaintenanceTask> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: task, error } = await supabase
      .from('maintenance_tasks')
      .insert({
        home_id: data.homeId,
        system_type: data.systemType,
        title: data.title,
        description: data.description,
        frequency_months: data.frequencyMonths,
        last_completed: data.lastCompleted || null,
        next_due: data.nextDue,
        status: data.status,
        priority: data.priority,
        linked_category: data.linkedCategory || null,
        local_tip: data.localTip || null,
      })
      .select()
      .single();

    if (error) throw error;
    return dbTaskToTask(task);
  },

  async createMany(tasks: Omit<MaintenanceTask, 'id'>[]): Promise<MaintenanceTask[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert(
        tasks.map(t => ({
          home_id: t.homeId,
          system_type: t.systemType,
          title: t.title,
          description: t.description,
          frequency_months: t.frequencyMonths,
          last_completed: t.lastCompleted || null,
          next_due: t.nextDue,
          status: t.status,
          priority: t.priority,
          linked_category: t.linkedCategory || null,
          local_tip: t.localTip || null,
        }))
      )
      .select();

    if (error) throw error;
    return (data || []).map(dbTaskToTask);
  },

  async complete(taskId: string, completedDate?: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    // First get the task to calculate next due date
    const { data: task, error: fetchError } = await supabase
      .from('maintenance_tasks')
      .select('frequency_months')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;

    const date = completedDate || new Date().toISOString();
    const nextDue = new Date(date);
    nextDue.setMonth(nextDue.getMonth() + task.frequency_months);

    const { error } = await supabase
      .from('maintenance_tasks')
      .update({
        last_completed: date,
        next_due: nextDue.toISOString(),
        status: 'upcoming',
      })
      .eq('id', taskId);

    if (error) throw error;
  },

  async updateStatus(taskId: string, status: MaintenanceTask['status']): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('maintenance_tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) throw error;
  },

  async delete(taskId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('maintenance_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  },

  async deleteForHome(homeId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('maintenance_tasks')
      .delete()
      .eq('home_id', homeId);

    if (error) throw error;
  },
};

// ============================================
// SERVICE RECORDS API
// ============================================

export const recordsApi = {
  async listForHome(homeId: string): Promise<ServiceRecord[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_records')
      .select('*')
      .eq('home_id', homeId)
      .order('service_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(dbRecordToRecord);
  },

  async create(data: Omit<ServiceRecord, 'id'>): Promise<ServiceRecord> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: record, error } = await supabase
      .from('service_records')
      .insert({
        home_id: data.homeId,
        task_id: data.taskId || null,
        system_type: data.systemType,
        service_date: data.date,
        title: data.title,
        description: data.description,
        provider_name: data.provider || null,
        provider_id: data.providerId || null,
        cost: data.cost || null,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return dbRecordToRecord(record);
  },

  async update(recordId: string, data: Partial<ServiceRecord>): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: Record<string, unknown> = {};
    if (data.systemType !== undefined) updates.system_type = data.systemType;
    if (data.date !== undefined) updates.service_date = data.date;
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.provider !== undefined) updates.provider_name = data.provider;
    if (data.providerId !== undefined) updates.provider_id = data.providerId;
    if (data.cost !== undefined) updates.cost = data.cost;
    if (data.notes !== undefined) updates.notes = data.notes;

    const { error } = await supabase
      .from('service_records')
      .update(updates)
      .eq('id', recordId);

    if (error) throw error;
  },

  async delete(recordId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('service_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  },
};

// ============================================
// MATERIALS API
// ============================================

export const materialsApi = {
  async listForHome(homeId: string): Promise<Material[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('home_id', homeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(dbMaterialToMaterial);
  },

  async create(data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<Material> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: material, error } = await supabase
      .from('materials')
      .insert({
        home_id: data.homeId,
        type: data.type,
        name: data.name,
        brand: data.brand || null,
        color_code: data.colorCode || null,
        finish: data.finish || null,
        room: data.room,
        purchased_from: data.purchasedFrom || null,
        purchase_date: data.purchaseDate || null,
        install_date: data.installDate || null,
        quantity: data.quantity || null,
        notes: data.notes || null,
        photo_path: data.photoUrl || null,
      })
      .select()
      .single();

    if (error) throw error;
    return dbMaterialToMaterial(material);
  },

  async update(materialId: string, data: Partial<Material>): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: Record<string, unknown> = {};
    if (data.type !== undefined) updates.type = data.type;
    if (data.name !== undefined) updates.name = data.name;
    if (data.brand !== undefined) updates.brand = data.brand;
    if (data.colorCode !== undefined) updates.color_code = data.colorCode;
    if (data.finish !== undefined) updates.finish = data.finish;
    if (data.room !== undefined) updates.room = data.room;
    if (data.purchasedFrom !== undefined) updates.purchased_from = data.purchasedFrom;
    if (data.purchaseDate !== undefined) updates.purchase_date = data.purchaseDate;
    if (data.installDate !== undefined) updates.install_date = data.installDate;
    if (data.quantity !== undefined) updates.quantity = data.quantity;
    if (data.notes !== undefined) updates.notes = data.notes;
    if (data.photoUrl !== undefined) updates.photo_path = data.photoUrl;

    const { error } = await supabase
      .from('materials')
      .update(updates)
      .eq('id', materialId);

    if (error) throw error;
  },

  async delete(materialId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', materialId);

    if (error) throw error;
  },
};
