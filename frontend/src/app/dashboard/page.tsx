'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // redirect to login if no user data found
        router.push('/');
      }
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const Highcharts = (window as any).Highcharts;
      const repairsContainer = document.getElementById('repairs-trend-chart');
      const watchContainer = document.getElementById('watch-chart');

      // wait until both elements exist before rendering
      if (Highcharts && repairsContainer && watchContainer) {
        clearInterval(interval);

        // ---- Repair & Behavior Changes Chart ----
        Highcharts.chart('repairs-trend-chart', {
          chart: { type: 'line', backgroundColor: 'transparent' },
          title: { text: null },
          credits: { enabled: false },
          xAxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            title: { text: 'Time Period' },
          },
          yAxis: {
            title: { text: 'Number of Incidents' },
            min: 0,
          },
          colors: ['#CD0D0D', '#f6c51b', '#388557', '#14558f'],
          series: [
            { name: 'New Repairs', data: [12, 8, 6, 4], color: '#CD0D0D' },
            { name: 'Repairs Resolved', data: [5, 7, 9, 8], color: '#388557' },
            { name: 'Behavioral Incidents', data: [15, 11, 8, 7], color: '#f6c51b' },
            { name: 'Positive Behaviors', data: [8, 12, 15, 18], color: '#14558f' },
          ],
          legend: { enabled: true },
        });

        // ---- Watch Status Chart ----
        Highcharts.chart('watch-chart', {
          chart: { type: 'pie', backgroundColor: 'transparent' },
          title: { text: null },
          credits: { enabled: false },
          colors: ['#388557', '#f6c51b', '#CD0D0D', '#14558f'],
          series: [
            {
              name: 'Residents',
              data: [
                { name: 'Normal', y: 11, color: '#388557' },
                { name: 'Sleep Log', y: 2, color: '#f6c51b' },
                { name: 'Alert', y: 1, color: '#f6c51b' },
                { name: 'Elevated', y: 1, color: '#CD0D0D' },
              ],
              showInLegend: true,
            },
          ],
        });
      }
    }, 300); // check every 300ms until elements are ready

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-mf-font-detail">
        Loading...
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Residents',
      value: '156',
      icon: 'fa-users',
      color: 'bg-blue-100 text-blue-600',
      change: '+12',
    },
    {
      label: 'Active Staff',
      value: '48',
      icon: 'fa-user-tie',
      color: 'bg-green-100 text-green-600',
      change: '+3',
    },
    {
      label: 'Open Incidents',
      value: '7',
      icon: 'fa-triangle-exclamation',
      color: 'bg-red-100 text-red-600',
      change: '-2',
    },
    {
      label: 'Pending Tasks',
      value: '23',
      icon: 'fa-clipboard-check',
      color: 'bg-yellow-100 text-yellow-600',
      change: '+5',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'incident',
      title: 'New incident reported',
      time: '10 minutes ago',
      icon: 'fa-triangle-exclamation',
      color: 'text-red-600',
    },
    {
      id: 2,
      type: 'medication',
      title: 'Medication count completed',
      time: '1 hour ago',
      icon: 'fa-pills',
      color: 'text-green-600',
    },
    {
      id: 3,
      type: 'staff',
      title: 'New staff member onboarded',
      time: '2 hours ago',
      icon: 'fa-user-plus',
      color: 'text-blue-600',
    },
    {
      id: 4,
      type: 'repair',
      title: 'Repair request submitted',
      time: '3 hours ago',
      icon: 'fa-wrench',
      color: 'text-yellow-600',
    },
  ];

  const handleAddResident = () => {
    setIsLoading(true);
    router.push('/dashboard/add-resident');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading && <Loading />}
      <div id="analytics-main" className="flex-1 p-6 overflow-auto">
        <div id="overview-cards" className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center">
              <i className="fa-solid fa-users text-primary text-2xl mr-4"></i>
              <div>
                <p className="text-2xl font-bold text-primary">15</p>
                <p className="text-sm text-font-detail">Total Residents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center">
              <i className="fa-solid fa-eye text-warning text-2xl mr-4"></i>
              <div>
                <p className="text-2xl font-bold text-warning">4</p>
                <p className="text-sm text-font-detail">On Watch</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center">
              <i className="fa-solid fa-ban text-error text-2xl mr-4"></i>
              <div>
                <p className="text-2xl font-bold text-error">8</p>
                <p className="text-sm text-font-detail">On Repairs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center">
              <i className="fa-solid fa-gavel text-highlight text-2xl mr-4"></i>
              <div>
                <p className="text-2xl font-bold text-highlight">2</p>
                <p className="text-sm text-font-detail">Court Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-bd p-6">
            <div className="flex items-center">
              <i className="fa-solid fa-star text-success text-2xl mr-4"></i>
              <div>
                <p className="text-2xl font-bold text-success">850</p>
                <p className="text-sm text-font-detail">Avg Credits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base">
                Repair & Behavior Changes - Last Month
              </h3>
              <p className="text-sm text-font-detail mt-1">
                Tracking incidents and repair progression over 30 days
              </p>
            </div>
            <div className="p-6">
              <div id="repairs-trend-chart" className="h-64"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-bd">
            <div className="p-6 border-b border-bd">
              <h3 className="text-lg font-semibold text-font-base">Watch Status Overview</h3>
            </div>
            <div className="p-6">
              <div id="watch-chart" className="h-64"></div>
            </div>
          </div>
        </div>

        <div id="residents-table" className="bg-white rounded-lg border border-bd mb-8">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-table text-primary mr-3"></i>
                  Resident Management Overview
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Complete resident information with room assignments and status tracking
                </div>
              </div>
              <button
                onClick={handleAddResident}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add New Resident
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-bd">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Resident Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Credits</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Room #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Pencils</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Advocate Staff</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Repairs</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Watch</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bd">
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">
                      Johnson, Marcus
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">950</span>
                    </td>
                    <td className="px-4 py-3 text-sm">101</td>
                    <td className="px-4 py-3 text-sm">P-1, P-3</td>
                    <td className="px-4 py-3 text-sm">Davis, L.</td>
                    <td className="px-4 py-3 text-sm">None</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                        Team Leader
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">
                        Normal
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-light text-sm">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">
                      Rodriguez, Alex
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">650</span>
                    </td>
                    <td className="px-4 py-3 text-sm">102</td>
                    <td className="px-4 py-3 text-sm">P-2</td>
                    <td className="px-4 py-3 text-sm">Wilson, M.</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">R1</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">ALOYO</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">Alert</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-light text-sm">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">
                      Thompson, Kevin
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">450</span>
                    </td>
                    <td className="px-4 py-3 text-sm">103</td>
                    <td className="px-4 py-3 text-sm">None</td>
                    <td className="px-4 py-3 text-sm">Brown, P.</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">R2, R3</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">
                        Restricted
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-error text-white px-2 py-1 rounded text-xs">
                        Elevated
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-light text-sm">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">Garcia, Luis</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">890</span>
                    </td>
                    <td className="px-4 py-3 text-sm">104</td>
                    <td className="px-4 py-3 text-sm">P-4</td>
                    <td className="px-4 py-3 text-sm">Martinez, R.</td>
                    <td className="px-4 py-3 text-sm">None</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">
                        General Pop
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-success text-white px-2 py-1 rounded text-xs">
                        Normal
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-light text-sm">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-font-base">
                      Williams, Chris
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">720</span>
                    </td>
                    <td className="px-4 py-3 text-sm">105</td>
                    <td className="px-4 py-3 text-sm">P-5, P-6</td>
                    <td className="px-4 py-3 text-sm">Johnson, D.</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">R1</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-highlight text-white px-2 py-1 rounded text-xs">
                        Court
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-warning text-white px-2 py-1 rounded text-xs">
                        Sleep Log
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary hover:text-primary-light text-sm">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <button className="text-primary hover:text-primary-light text-sm font-medium">
                <i className="fa-solid fa-chevron-down mr-2"></i>
                Load More Residents
              </button>
            </div>
          </div>
        </div>

        <div id="separations-section" className="bg-white rounded-lg border border-bd mb-8">
          <div className="p-6 border-b border-bd">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-font-base flex items-center">
                  <i className="fa-solid fa-users-slash text-primary mr-3"></i>
                  Active Separations & Court Schedule
                </h3>
                <div className="mt-2 text-sm text-font-detail">
                  Current separation assignments and court appearances for today
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-highlight text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-sm">
                  <i className="fa-solid fa-gavel mr-2"></i>
                  Add Court Date
                </button>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                  <i className="fa-solid fa-edit mr-2"></i>
                  Edit Separations
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-error-lightest border border-error rounded-lg p-4">
                <h4 className="font-semibold text-error mb-3 flex items-center">
                  <i className="fa-solid fa-chalkboard text-error mr-2"></i>
                  Class room 1
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Rodriguez, Alex</div>
                    <div className="text-xs text-font-detail">Room 102 - R1 Repair</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Thompson, Kevin</div>
                    <div className="text-xs text-font-detail">Room 103 - R2, R3 Repairs</div>
                  </div>
                </div>
              </div>

              <div className="bg-warning-lightest border border-warning rounded-lg p-4">
                <h4 className="font-semibold text-warning mb-3 flex items-center">
                  <i className="fa-solid fa-chalkboard text-warning mr-2"></i>
                  Class room 2
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Davis, Michael</div>
                    <div className="text-xs text-font-detail">Room 108 - R1 Repair</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Wilson, Tyler</div>
                    <div className="text-xs text-font-detail">Room 111 - R2 Repair</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-lightest border border-primary rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-3 flex items-center">
                  <i className="fa-solid fa-users text-primary mr-2"></i>
                  Conference Room
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Brown, Jason</div>
                    <div className="text-xs text-font-detail">Room 107 - R3 Repair</div>
                  </div>
                </div>
              </div>

              <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
                <h4 className="font-semibold text-highlight mb-3 flex items-center">
                  <i className="fa-solid fa-gavel text-highlight mr-2"></i>
                  Court Today
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Williams, Chris</div>
                    <div className="text-xs text-font-detail">10:00 AM - Family Court</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-sm font-medium">Anderson, Jake</div>
                    <div className="text-xs text-font-detail">2:30 PM - Juvenile Court</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="repairs-section" className="bg-white rounded-lg border border-bd mb-8">
          <div className="p-6 border-b border-bd">
            <h3 className="text-lg font-semibold text-font-base flex items-center">
              <i className="fa-solid fa-tools text-error mr-3"></i>
              Residents on Repair Status
            </h3>
            <div className="mt-2 text-sm text-font-detail">
              Current behavioral repairs and restrictions
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-error-lightest border border-error rounded-lg p-4">
                <h4 className="font-semibold text-error mb-3">R1 Repairs</h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-sm">Rodriguez, Alex - Room 102</div>
                  <div className="bg-white p-2 rounded text-sm">Davis, Michael - Room 108</div>
                  <div className="bg-white p-2 rounded text-sm">Williams, Chris - Room 105</div>
                </div>
              </div>
              <div className="bg-warning-lightest border border-warning rounded-lg p-4">
                <h4 className="font-semibold text-warning mb-3">R2 Repairs</h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-sm">Thompson, Kevin - Room 103</div>
                  <div className="bg-white p-2 rounded text-sm">Wilson, Tyler - Room 111</div>
                </div>
              </div>
              <div className="bg-highlight-lightest border border-highlight rounded-lg p-4">
                <h4 className="font-semibold text-highlight mb-3">R3 Repairs</h4>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded text-sm">Thompson, Kevin - Room 103</div>
                  <div className="bg-white p-2 rounded text-sm">Brown, Jason - Room 107</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
