'use client';

export default function AIInsightsPage() {
  const insights = [
    {
      id: 1,
      title: 'Incident Pattern Detected',
      description: 'AI has detected an increase in incidents during evening shifts in Building A.',
      severity: 'high',
      recommendation: 'Consider increasing staff presence during evening hours.',
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Medication Compliance Trend',
      description: 'Medication compliance has improved by 15% over the past month.',
      severity: 'low',
      recommendation: 'Continue current medication management protocols.',
      date: '2024-03-14'
    },
    {
      id: 3,
      title: 'Staff Scheduling Optimization',
      description: 'AI suggests adjusting shift schedules to reduce overtime costs by 12%.',
      severity: 'medium',
      recommendation: 'Review proposed schedule changes in the system admin panel.',
      date: '2024-03-13'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary-lightest rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-brain text-primary text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-font-heading">AI-Powered Insights</h2>
            <p className="text-font-detail">Intelligent analysis and recommendations for your facility</p>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-6">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  insight.severity === 'high' ? 'bg-error-lightest text-error' :
                  insight.severity === 'medium' ? 'bg-warning-lightest text-warning' :
                  'bg-success-lightest text-success'
                }`}>
                  <i className="fa-solid fa-lightbulb text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-font-heading mb-2">{insight.title}</h3>
                  <p className="text-font-detail mb-3">{insight.description}</p>
                  <div className="bg-primary-lightest p-4 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">
                      <i className="fa-solid fa-star mr-2"></i>
                      Recommendation
                    </p>
                    <p className="text-sm text-font-base">{insight.recommendation}</p>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                insight.severity === 'high' ? 'bg-error-lightest text-error' :
                insight.severity === 'medium' ? 'bg-warning-lightest text-warning' :
                'bg-success-lightest text-success'
              }`}>
                {insight.severity} priority
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-bd">
              <span className="text-sm text-font-detail">
                <i className="fa-solid fa-calendar mr-2"></i>
                {insight.date}
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition text-sm">
                  View Details
                </button>
                <button className="px-4 py-2 bg-bg-subtle text-font-base rounded-lg hover:bg-bd transition text-sm">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
