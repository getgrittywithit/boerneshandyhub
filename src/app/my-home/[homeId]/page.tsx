'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHomes, useTasks, useServiceRecords } from '@/hooks/useHomeTracker';
import { systemInfo, type HomeSystemType, type MaintenanceTask } from '@/types/homeTracker';

export default function HomeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeId = params.homeId as string;

  const { homes, isLoaded: homesLoaded, getHome, deleteHome } = useHomes();
  const { tasks, isLoaded: tasksLoaded, getTasksForHome, completeTask, refreshTaskStatuses } = useTasks();
  const { getRecordsForHome, addRecord } = useServiceRecords();

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState<MaintenanceTask | null>(null);
  const [completeNotes, setCompleteNotes] = useState('');

  const home = getHome(homeId);
  const homeTasks = getTasksForHome(homeId);
  const homeRecords = getRecordsForHome(homeId);

  // Refresh task statuses
  useEffect(() => {
    if (tasksLoaded) {
      refreshTaskStatuses();
    }
  }, [tasksLoaded, refreshTaskStatuses]);

  // Organize tasks
  const { focusTasks, overdueTasks, laterTasks, totalCount } = useMemo(() => {
    const now = new Date();
    const thirtyDaysOut = new Date();
    thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);

    const overdue = homeTasks.filter(t => t.status === 'overdue');
    const dueSoon = homeTasks
      .filter(t => t.status === 'due-soon' || t.status === 'due')
      .sort((a, b) => {
        // Sort by priority first, then by due date
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime();
      });

    // Focus = top 3 due-soon tasks (skip overdue, those show separately)
    const focus = dueSoon.slice(0, 3);
    const later = homeTasks
      .filter(t => !overdue.includes(t) && !focus.includes(t))
      .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());

    return {
      focusTasks: focus,
      overdueTasks: overdue,
      laterTasks: later,
      totalCount: homeTasks.length,
    };
  }, [homeTasks]);

  const handleCompleteTask = () => {
    if (!showCompleteModal) return;

    completeTask(showCompleteModal.id);

    addRecord({
      homeId,
      taskId: showCompleteModal.id,
      systemType: showCompleteModal.systemType,
      date: new Date().toISOString(),
      title: showCompleteModal.title,
      description: completeNotes || `Completed: ${showCompleteModal.title}`,
    });

    setShowCompleteModal(null);
    setCompleteNotes('');
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <p className="mt-1 text-white/70">{home.city}</p>
            </div>
            <button
              onClick={handleDeleteHome}
              className="text-white/40 hover:text-red-400 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Overdue Alert */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-3">
              {overdueTasks.length} Overdue
            </h3>
            <div className="space-y-2">
              {overdueTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{systemInfo[task.systemType]?.icon}</span>
                    <span className="font-medium text-gray-900">{task.title}</span>
                  </div>
                  <button
                    onClick={() => setShowCompleteModal(task)}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* This Month's Focus */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">This Month's Focus</h2>
          <p className="text-sm text-gray-500 mb-4">Your top priorities for the next 30 days</p>

          {focusTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✓</div>
              <p className="text-gray-600">You're all caught up! No urgent tasks this month.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {focusTasks.map(task => (
                <FocusTaskCard
                  key={task.id}
                  task={task}
                  onComplete={() => setShowCompleteModal(task)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Service History Summary */}
        {homeRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Service History</h3>
            <div className="space-y-2">
              {homeRecords.slice(0, 3).map(record => (
                <div key={record.id} className="flex items-center gap-3 text-sm">
                  <span>{systemInfo[record.systemType]?.icon}</span>
                  <span className="text-gray-700">{record.title}</span>
                  <span className="text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Tasks */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-700">
              View Full Schedule ({totalCount} total tasks)
            </span>
            <span className="text-gray-400">
              {showAllTasks ? '▲' : '▼'}
            </span>
          </button>

          {showAllTasks && (
            <div className="border-t divide-y">
              {[...overdueTasks, ...focusTasks, ...laterTasks].map(task => (
                <SimpleTaskRow
                  key={task.id}
                  task={task}
                  onComplete={() => setShowCompleteModal(task)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Find Pros */}
        <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Need help with a task?</h3>
          <p className="text-white/70 text-sm mb-4">Find trusted local pros in Boerne</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/services/home/hvac"
              className="px-3 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              HVAC
            </Link>
            <Link
              href="/services/home/plumbing"
              className="px-3 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Plumbing
            </Link>
            <Link
              href="/services/home/electrical"
              className="px-3 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Electrical
            </Link>
            <Link
              href="/services/home/roofing"
              className="px-3 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Roofing
            </Link>
            <Link
              href="/services/home"
              className="px-3 py-2 bg-boerne-gold text-boerne-navy rounded-lg text-sm font-medium hover:bg-boerne-gold-alt transition-colors"
            >
              All Services →
            </Link>
          </div>
        </div>
      </div>

      {/* Complete Task Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{systemInfo[showCompleteModal.systemType]?.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{showCompleteModal.title}</h3>
                  <p className="text-sm text-gray-500">Mark as complete?</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={completeNotes}
                  onChange={(e) => setCompleteNotes(e.target.value)}
                  placeholder="Any notes about the work done..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTask}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                >
                  Mark Complete
                </button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Link
                  href={`/services/home/${systemInfo[showCompleteModal.systemType]?.category || 'handyman'}`}
                  className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                >
                  Need a pro? Find {systemInfo[showCompleteModal.systemType]?.name} services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Focus Task Card - More prominent display
function FocusTaskCard({ task, onComplete }: { task: MaintenanceTask; onComplete: () => void }) {
  const daysUntilDue = Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{systemInfo[task.systemType]?.icon}</span>
          <div>
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
            {task.localTip && (
              <p className="text-sm text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded inline-block">
                💡 {task.localTip}
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <span className={`text-sm font-medium ${
            daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-500'
          }`}>
            {daysUntilDue <= 0 ? 'Due now' : `${daysUntilDue} days`}
          </span>
          <button
            onClick={onComplete}
            className="mt-2 block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Task Row - Compact for the full list
function SimpleTaskRow({ task, onComplete }: { task: MaintenanceTask; onComplete: () => void }) {
  const daysUntilDue = Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-3 flex items-center justify-between hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="text-lg">{systemInfo[task.systemType]?.icon}</span>
        <span className="text-gray-700">{task.title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs ${
          task.status === 'overdue' ? 'text-red-600' :
          task.status === 'due-soon' ? 'text-orange-500' :
          'text-gray-400'
        }`}>
          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` :
           daysUntilDue === 0 ? 'Today' :
           `${daysUntilDue}d`}
        </span>
        <button
          onClick={onComplete}
          className="px-2 py-1 text-green-600 text-xs hover:bg-green-50 rounded"
        >
          Done
        </button>
      </div>
    </div>
  );
}
