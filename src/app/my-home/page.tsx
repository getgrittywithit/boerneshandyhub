'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useHomes, useTasks } from '@/hooks/useHomeTracker';
import { getCurrentSeasonalReminders } from '@/data/boerneMaintenanceData';
import { systemInfo } from '@/types/homeTracker';

export default function MyHomeDashboard() {
  const { homes, isLoaded: homesLoaded } = useHomes();
  const { tasks, isLoaded: tasksLoaded, refreshTaskStatuses } = useTasks();

  // Refresh task statuses on load
  useEffect(() => {
    if (tasksLoaded) {
      refreshTaskStatuses();
    }
  }, [tasksLoaded, refreshTaskStatuses]);

  // Get focus tasks (top 3 most urgent across all homes)
  const { focusTasks, overdueCount } = useMemo(() => {
    const overdue = tasks.filter(t => t.status === 'overdue');
    const dueSoon = tasks
      .filter(t => t.status === 'due-soon' || t.status === 'due')
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime();
      })
      .slice(0, 3);

    return {
      focusTasks: dueSoon,
      overdueCount: overdue.length,
    };
  }, [tasks]);

  const seasonalReminders = getCurrentSeasonalReminders();

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-white">Home Maintenance</h1>
              <p className="mt-1 text-white/70">Keep your Hill Country home in top shape</p>
            </div>
            {homes.length > 0 && (
              <Link
                href="/my-home/add"
                className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                + Add Home
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {homes.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Track Your Home Maintenance
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get a personalized maintenance schedule with tips specific to Boerne and the Hill Country.
            </p>
            <Link
              href="/my-home/add"
              className="inline-flex items-center px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Add Your Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overdue Alert */}
            {overdueCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium">
                  You have {overdueCount} overdue task{overdueCount > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* My Homes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Homes</h2>
              <div className="space-y-3">
                {homes.map(home => {
                  const homeTasks = tasks.filter(t => t.homeId === home.id);
                  const homeOverdue = homeTasks.filter(t => t.status === 'overdue').length;

                  return (
                    <Link
                      key={home.id}
                      href={`/my-home/${home.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{home.name}</h3>
                        <p className="text-sm text-gray-500">{home.city}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {homeOverdue > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            {homeOverdue} overdue
                          </span>
                        )}
                        <span className="text-gray-400">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* This Month's Focus */}
            {focusTasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">This Month's Focus</h2>
                <p className="text-sm text-gray-500 mb-4">Top priorities across your homes</p>
                <div className="space-y-3">
                  {focusTasks.map(task => {
                    const home = homes.find(h => h.id === task.homeId);
                    const daysUntilDue = Math.ceil((new Date(task.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <Link
                        key={task.id}
                        href={`/my-home/${task.homeId}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{systemInfo[task.systemType]?.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-500">{home?.name}</p>
                          </div>
                        </div>
                        <span className={`text-sm ${
                          daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {daysUntilDue} days
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seasonal Tips */}
            {seasonalReminders.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-900 mb-2">Seasonal Tip</h3>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{seasonalReminders[0].icon}</span>
                  <div>
                    <p className="font-medium text-blue-800">{seasonalReminders[0].title}</p>
                    <p className="text-sm text-blue-600">{seasonalReminders[0].description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Find Pros CTA */}
            <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need help with maintenance?</h3>
              <p className="text-white/70 text-sm mb-4">Find trusted local pros in Boerne</p>
              <Link
                href="/services/home"
                className="inline-block px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
              >
                Browse Home Services →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
