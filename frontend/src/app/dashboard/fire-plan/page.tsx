'use client';

export default function FirePlanPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-error-lightest rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-fire-extinguisher text-error text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-font-heading">Fire Safety & Emergency Plan</h2>
            <p className="text-font-detail">Emergency procedures and evacuation plans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-bd rounded-lg p-6">
            <h3 className="text-lg font-bold text-font-heading mb-4">
              <i className="fa-solid fa-map-marked-alt text-primary mr-2"></i>
              Evacuation Routes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-subtle rounded-lg">
                <span className="text-font-base">Building A - Primary Route</span>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-eye"></i>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-subtle rounded-lg">
                <span className="text-font-base">Building A - Secondary Route</span>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-eye"></i>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-subtle rounded-lg">
                <span className="text-font-base">Building B - Primary Route</span>
                <button className="text-primary hover:text-primary-light">
                  <i className="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="border border-bd rounded-lg p-6">
            <h3 className="text-lg font-bold text-font-heading mb-4">
              <i className="fa-solid fa-users text-primary mr-2"></i>
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-bg-subtle rounded-lg">
                <p className="font-medium text-font-base">Fire Department</p>
                <p className="text-font-detail">911</p>
              </div>
              <div className="p-3 bg-bg-subtle rounded-lg">
                <p className="font-medium text-font-base">Facility Manager</p>
                <p className="text-font-detail">(617) 555-0100</p>
              </div>
              <div className="p-3 bg-bg-subtle rounded-lg">
                <p className="font-medium text-font-base">Safety Officer</p>
                <p className="text-font-detail">(617) 555-0101</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-error-lightest rounded-lg">
          <p className="text-sm text-error font-medium">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            Last Fire Drill: March 1, 2024 | Next Scheduled: June 1, 2024
          </p>
        </div>
      </div>
    </div>
  );
}
