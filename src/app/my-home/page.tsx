'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useHomes, useTasks } from '@/hooks/useHomeTracker';
import { getCurrentSeasonalReminders } from '@/data/boerneMaintenanceData';
import { systemInfo } from '@/types/homeTracker';

export default function MyHomeDashboard() {
  const { homes, isLoaded: homesLoaded } = useHomes();
  const { tasks, isLoaded: tasksLoaded, refreshTaskStatuses, getUpcomingTasks, getOverdueTasks } = useTasks();

  // Refresh task statuses on load
  useEffect(() => {
    if (tasksLoaded) {
      refreshTaskStatuses();
    }
  }, [tasksLoaded, refreshTaskStatuses]);

  const seasonalReminders = getCurrentSeasonalReminders();
  const upcomingTasks = getUpcomingTasks(30);
  const overdueTasks = getOverdueTasks();

  if (!homesLoaded || !tasksLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
              <li className="text-white font-medium">My Home Tracker</li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Home Maintenance Tracker</h1>
              <p className="mt-2 text-white/70">Keep your Hill Country home in top shape</p>
            </div>
            <Link
              href="/my-home/add"
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              + Add Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seasonal Reminders */}
        {seasonalReminders.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Seasonal Tips for Boerne</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {seasonalReminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-2xl">{reminder.icon}</span>
                    <div>
                      <p className="font-medium text-blue-800">{reminder.title}</p>
                      <p className="text-blue-600">{reminder.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {homes.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No homes added yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your home to get a personalized maintenance schedule with tips specific to the Boerne area.
            </p>
            <Link
              href="/my-home/add"
              className="inline-flex items-center px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Add Your First Home
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overdue Tasks Alert */}
              {overdueTasks.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-2">
                    {overdueTasks.slice(0, 3).map(task => {
                      const home = homes.find(h => h.id === task.homeId);
                      return (
                        <Link
                          key={task.id}
                          href={`/my-home/${task.homeId}`}
                          className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{systemInfo[task.systemType]?.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-500">{home?.name}</p>
                            </div>
                          </div>
                          <span className="text-red-600 text-sm font-medium">
                            {Math.abs(Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days overdue
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upcoming Maintenance
                </h2>
                {upcomingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No upcoming tasks in the next 30 days
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingTasks.slice(0, 10).map(task => {
                      const home = homes.find(h => h.id === task.homeId);
                      const daysUntilDue = Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <Link
                          key={task.id}
                          href={`/my-home/${task.homeId}`}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{systemInfo[task.systemType]?.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-500">{home?.name}</p>
                              {task.localTip && (
                                <p className="text-xs text-blue-600 mt-1">💡 {task.localTip}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium ${
                              task.status === 'overdue' ? 'text-red-600' :
                              task.status === 'due' ? 'text-orange-600' :
                              task.status === 'due-soon' ? 'text-yellow-600' :
                              'text-gray-500'
                            }`}>
                              {daysUntilDue <= 0 ? 'Due today' : `${daysUntilDue} days`}
                            </span>
                            <p className="text-xs text-gray-400">
                              {new Date(task.nextDue).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Homes List */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">My Homes</h2>
                  <Link
                    href="/my-home/add"
                    className="text-boerne-gold hover:text-boerne-gold-alt text-sm font-medium"
                  >
                    + Add
                  </Link>
                </div>
                <div className="space-y-3">
                  {homes.map(home => {
                    const homeTasks = tasks.filter(t => t.homeId === home.id);
                    const homeOverdue = homeTasks.filter(t => t.status === 'overdue').length;
                    const homeDueSoon = homeTasks.filter(t => t.status === 'due-soon' || t.status === 'due').length;

                    return (
                      <Link
                        key={home.id}
                        href={`/my-home/${home.id}`}
                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{home.name}</h3>
                            <p className="text-sm text-gray-500">{home.address}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {home.systems.length} system{home.systems.length !== 1 ? 's' : ''} tracked
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {homeOverdue > 0 && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                {homeOverdue}
                              </span>
                            )}
                            {homeDueSoon > 0 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                {homeDueSoon}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Find Local Pros</h3>
                <div className="space-y-2">
                  <Link
                    href="/services/home/hvac"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <span>❄️</span> HVAC Pros in Boerne
                  </Link>
                  <Link
                    href="/services/home/plumbing"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <span>🔧</span> Plumbers in Boerne
                  </Link>
                  <Link
                    href="/services/home/electrical"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <span>⚡</span> Electricians in Boerne
                  </Link>
                  <Link
                    href="/services/home/roofing"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    <span>🏠</span> Roofers in Boerne
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
