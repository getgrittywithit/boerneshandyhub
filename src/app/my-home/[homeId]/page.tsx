'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHomes, useTasks, useServiceRecords } from '@/hooks/useHomeTracker';
import { systemInfo, type HomeSystemType, type MaintenanceTask } from '@/types/homeTracker';

export default function HomeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeId = params.homeId as string;

  const { homes, isLoaded: homesLoaded, getHome, deleteHome, addSystem, deleteSystem } = useHomes();
  const { tasks, isLoaded: tasksLoaded, getTasksForHome, completeTask, refreshTaskStatuses, generateTasksForHome } = useTasks();
  const { records, getRecordsForHome, addRecord } = useServiceRecords();

  const [activeTab, setActiveTab] = useState<'tasks' | 'systems' | 'history'>('tasks');
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState<MaintenanceTask | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');
  const [completeCost, setCompleteCost] = useState('');
  const [completeProvider, setCompleteProvider] = useState('');

  const home = getHome(homeId);
  const homeTasks = getTasksForHome(homeId);
  const homeRecords = getRecordsForHome(homeId);

  // Refresh task statuses
  useEffect(() => {
    if (tasksLoaded) {
      refreshTaskStatuses();
    }
  }, [tasksLoaded, refreshTaskStatuses]);

  // Group tasks by status
  const overdueTasks = homeTasks.filter(t => t.status === 'overdue');
  const dueSoonTasks = homeTasks.filter(t => t.status === 'due-soon' || t.status === 'due');
  const upcomingTasks = homeTasks.filter(t => t.status === 'upcoming');

  // Get available systems to add
  const existingSystemTypes = home?.systems.map(s => s.type) || [];
  const availableSystems = (Object.keys(systemInfo) as HomeSystemType[])
    .filter(type => !existingSystemTypes.includes(type));

  const handleAddSystem = (systemType: HomeSystemType) => {
    if (!home) return;
    addSystem(homeId, {
      type: systemType,
      name: systemInfo[systemType].name,
    });
    // Regenerate tasks
    const updatedHome = {
      ...home,
      systems: [...home.systems, { id: 'new', type: systemType, name: systemInfo[systemType].name }],
    };
    generateTasksForHome(updatedHome);
    setShowAddSystem(false);
  };

  const handleRemoveSystem = (systemId: string) => {
    if (!home) return;
    if (confirm('Remove this system? Associated maintenance tasks will also be removed.')) {
      deleteSystem(homeId, systemId);
      // Regenerate tasks
      const updatedHome = {
        ...home,
        systems: home.systems.filter(s => s.id !== systemId),
      };
      generateTasksForHome(updatedHome);
    }
  };

  const handleCompleteTask = () => {
    if (!showCompleteModal) return;

    // Complete the task
    completeTask(showCompleteModal.id);

    // Add service record
    addRecord({
      homeId,
      taskId: showCompleteModal.id,
      systemType: showCompleteModal.systemType,
      date: new Date().toISOString(),
      title: showCompleteModal.title,
      description: completeNotes || `Completed: ${showCompleteModal.title}`,
      provider: completeProvider || undefined,
      cost: completeCost ? parseFloat(completeCost) : undefined,
    });

    // Reset form
    setShowCompleteModal(null);
    setCompleteNotes('');
    setCompleteCost('');
    setCompleteProvider('');
  };

  const handleDeleteHome = () => {
    if (confirm('Delete this home? This cannot be undone.')) {
      deleteHome(homeId);
      router.push('/my-home');
    }
  };

  if (!homesLoaded || !tasksLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Home not found</h2>
          <Link href="/my-home" className="text-boerne-gold hover:text-boerne-gold-alt">
            Back to My Homes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/my-home" className="hover:text-white transition-colors">My Home Tracker</Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{home.name}</li>
            </ol>
          </nav>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{home.name}</h1>
              <p className="mt-1 text-white/70">{home.address}, {home.city}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                {home.yearBuilt && <span>Built {home.yearBuilt}</span>}
                {home.squareFeet && <span>{home.squareFeet.toLocaleString()} sq ft</span>}
                {home.bedrooms && <span>{home.bedrooms} bed</span>}
                {home.bathrooms && <span>{home.bathrooms} bath</span>}
              </div>
            </div>
            <button
              onClick={handleDeleteHome}
              className="px-4 py-2 text-white/60 hover:text-red-400 transition-colors text-sm"
            >
              Delete Home
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            {overdueTasks.length > 0 && (
              <div className="px-4 py-2 bg-red-500/20 rounded-lg">
                <span className="text-red-300 font-semibold">{overdueTasks.length}</span>
                <span className="text-red-300/70 text-sm ml-1">overdue</span>
              </div>
            )}
            {dueSoonTasks.length > 0 && (
              <div className="px-4 py-2 bg-yellow-500/20 rounded-lg">
                <span className="text-yellow-300 font-semibold">{dueSoonTasks.length}</span>
                <span className="text-yellow-300/70 text-sm ml-1">due soon</span>
              </div>
            )}
            <div className="px-4 py-2 bg-white/10 rounded-lg">
              <span className="text-white font-semibold">{home.systems.length}</span>
              <span className="text-white/70 text-sm ml-1">systems</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Maintenance Tasks
          </button>
          <button
            onClick={() => setActiveTab('systems')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'systems' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Systems
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Service History
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Overdue */}
            {overdueTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-50 px-6 py-3 border-b border-red-100">
                  <h3 className="font-semibold text-red-800">Overdue ({overdueTasks.length})</h3>
                </div>
                <div className="divide-y">
                  {overdueTasks.map(task => (
                    <TaskRow key={task.id} task={task} onComplete={() => setShowCompleteModal(task)} />
                  ))}
                </div>
              </div>
            )}

            {/* Due Soon */}
            {dueSoonTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-yellow-50 px-6 py-3 border-b border-yellow-100">
                  <h3 className="font-semibold text-yellow-800">Due Soon ({dueSoonTasks.length})</h3>
                </div>
                <div className="divide-y">
                  {dueSoonTasks.map(task => (
                    <TaskRow key={task.id} task={task} onComplete={() => setShowCompleteModal(task)} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <h3 className="font-semibold text-gray-800">Upcoming ({upcomingTasks.length})</h3>
              </div>
              {upcomingTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No upcoming tasks. Add more systems to generate maintenance schedules.
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingTasks.map(task => (
                    <TaskRow key={task.id} task={task} onComplete={() => setShowCompleteModal(task)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Systems Tab */}
        {activeTab === 'systems' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Systems in Your Home</h3>
                <button
                  onClick={() => setShowAddSystem(true)}
                  className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                >
                  + Add System
                </button>
              </div>

              {home.systems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No systems added yet. Add systems to generate maintenance tasks.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {home.systems.map(system => (
                    <div key={system.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{systemInfo[system.type]?.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{system.name}</h4>
                            {system.brand && (
                              <p className="text-sm text-gray-500">{system.brand}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSystem(system.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-3">
                        <Link
                          href={`/services/home/${systemInfo[system.type]?.category || 'handyman'}`}
                          className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                        >
                          Find {systemInfo[system.type]?.name} pros →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900">Service History</h3>
            </div>
            {homeRecords.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No service records yet. Complete tasks to build your history.
              </div>
            ) : (
              <div className="divide-y">
                {homeRecords.map(record => (
                  <div key={record.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{systemInfo[record.systemType]?.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{record.title}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          {record.description && (
                            <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                          )}
                          {record.provider && (
                            <p className="text-sm text-gray-500 mt-1">Provider: {record.provider}</p>
                          )}
                        </div>
                      </div>
                      {record.cost && (
                        <span className="text-gray-900 font-medium">
                          ${record.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add System Modal */}
      {showAddSystem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add System</h3>
                <button
                  onClick={() => setShowAddSystem(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              {availableSystems.map(type => (
                <button
                  key={type}
                  onClick={() => handleAddSystem(type)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-boerne-gold hover:bg-boerne-gold/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{systemInfo[type].icon}</span>
                    <span className="text-sm font-medium text-gray-900">{systemInfo[type].name}</span>
                  </div>
                </button>
              ))}
              {availableSystems.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-4">
                  All available systems have been added.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complete Task Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Complete Task</h3>
                <button
                  onClick={() => setShowCompleteModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{systemInfo[showCompleteModal.systemType]?.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{showCompleteModal.title}</p>
                  <p className="text-sm text-gray-500">{showCompleteModal.description}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider / Who did the work? (optional)
                </label>
                <input
                  type="text"
                  value={completeProvider}
                  onChange={(e) => setCompleteProvider(e.target.value)}
                  placeholder="e.g., ABC Plumbing, Self"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (optional)
                </label>
                <input
                  type="number"
                  value={completeCost}
                  onChange={(e) => setCompleteCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  placeholder="Any notes about the work done..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Link
                  href={`/services/home/${systemInfo[showCompleteModal.systemType]?.category || 'handyman'}`}
                  className="px-4 py-2 text-boerne-gold hover:text-boerne-gold-alt font-medium"
                >
                  Find a pro instead →
                </Link>
                <button
                  onClick={handleCompleteTask}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Task Row Component
function TaskRow({ task, onComplete }: { task: MaintenanceTask; onComplete: () => void }) {
  const daysUntilDue = Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{systemInfo[task.systemType]?.icon}</span>
          <div>
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
            {task.localTip && (
              <p className="text-sm text-blue-600 mt-1 flex items-start gap-1">
                <span>💡</span> {task.localTip}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {task.priority}
              </span>
              <span className="text-xs text-gray-500">
                Every {task.frequencyMonths} month{task.frequencyMonths > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${
            task.status === 'overdue' ? 'text-red-600' :
            task.status === 'due' || task.status === 'due-soon' ? 'text-yellow-600' :
            'text-gray-500'
          }`}>
            {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
             daysUntilDue === 0 ? 'Due today' :
             `${daysUntilDue} days`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(task.nextDue).toLocaleDateString()}
          </p>
          <button
            onClick={onComplete}
            className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200 transition-colors"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
