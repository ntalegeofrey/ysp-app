"use client";
import Head from "next/head";

const AddNewResident = () => {
  return (
    <div id="analytics-main" className="flex-1 p-6 overflow-auto">
                {/* <!-- Add New Resident Form --> */}
                <div id="add-resident-form" className="bg-white rounded-lg border border-bd mb-8">
                    <div className="p-6 border-b border-bd">
                        <h3 className="text-xl font-semibold text-font-base flex items-center">
                            <i className="fa-solid fa-user-plus text-primary mr-3"></i>
                            Add New Resident
                        </h3>
                        <p className="text-sm text-font-detail mt-2">Enter resident information and initial assignments</p>
                    </div>
                    
                    <form className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">First Name *</label>
                                <input type="text" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter first name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Last Name *</label>
                                <input type="text" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter last name" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Date of Birth *</label>
                                <input type="date" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Room Assignment *</label>
                                <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option value="">Select Room</option>
                                    <option value="101">Room 101</option>
                                    <option value="102">Room 102</option>
                                    <option value="103">Room 103</option>
                                    <option value="104">Room 104</option>
                                    <option value="105">Room 105</option>
                                    <option value="106">Room 106</option>
                                    <option value="107">Room 107</option>
                                    <option value="108">Room 108</option>
                                    <option value="109">Room 109</option>
                                    <option value="110">Room 110</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Initial Credits</label>
                                <input type="number" className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="1000" value="1000" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Advocate Staff *</label>
                                <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option value="">Select Staff</option>
                                    <option value="davis">Davis, L.</option>
                                    <option value="wilson">Wilson, M.</option>
                                    <option value="brown">Brown, P.</option>
                                    <option value="martinez">Martinez, R.</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-font-base mb-2">Initial Status</label>
                                <select className="w-full px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option value="general">General Population</option>
                                    <option value="aloyo">ALOYO</option>
                                    <option value="team-leader">Team Leader</option>
                                    <option value="restricted">Restricted</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => {console.log('Cancel button clicked');}}className="px-6 py-2 border border-bd text-font-base rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                                <i className="fa-solid fa-plus mr-2"></i>
                                Add Resident
                            </button>
                        </div>
                    </form>
                </div>

                {/* <!-- Edit Separations & Court Schedule Form --> */}
                <div id="edit-separations-form" className="bg-white rounded-lg border border-bd">
                    <div className="p-6 border-b border-bd">
                        <h3 className="text-xl font-semibold text-font-base flex items-center">
                            <i className="fa-solid fa-users-slash text-primary mr-3"></i>
                            Edit Separations & Court Schedule
                        </h3>
                        <p className="text-sm text-font-detail mt-2">Manage separation zones and court appearances</p>
                    </div>
                    
                    <div className="p-6">
                        {/* <!-- Separation Zones Management --> */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-font-base flex items-center">
                                    <i className="fa-solid fa-layer-group text-primary mr-2"></i>
                                    Separation Zones
                                </h4>
                                <button onClick={() => print()} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm">
                                    <i className="fa-solid fa-plus mr-2"></i>
                                    Add Zone
                                </button>
                            </div>
                            
                            <div id="separation-zones-container" className="space-y-4">
                                {/* <!-- Zone 1 --> */}
                                <div className="border border-bd rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <input type="text" value="Classroom 1" className="text-base font-medium text-font-base bg-white border border-bd-input rounded px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-primary" />
                                        <button className="text-error hover:text-red-700">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-font-base mb-2">Residents in this Area</label>
                                        <div className="border border-primary rounded-lg p-3 bg-primary-lightest min-h-[150px] mb-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                    <span className="text-sm">Rodriguez, Alex - Room 102</span>
                                                    <button onClick={() => {console.log("remove from zone")}} className="text-error hover:text-red-700">
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                    <span className="text-sm">Thompson, Kevin - Room 103</span>
                                                    <button onClick={() => {console.log("remove from zone")}} className="text-error hover:text-red-700">
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select className="flex-1 px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white">
                                                <option value="">Select a resident to add</option>
                                                <option value="johnson">Johnson, Marcus - Room 101</option>
                                                <option value="williams">Williams, Chris - Room 109</option>
                                                <option value="martinez">Martinez, Luis - Room 110</option>
                                                <option value="davis">Davis, Michael - Room 108</option>
                                            </select>
                                            <button onClick={() => {console.log("add to zone")}} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm whitespace-nowrap">
                                                <i className="fa-solid fa-plus mr-2"></i>
                                                Add Resident
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* <!-- Zone 2 --> */}
                                <div className="border border-bd rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <input type="text" value="Classroom 2" className="text-base font-medium text-font-base bg-white border border-bd-input rounded px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-primary" />
                                        <button className="text-error hover:text-red-700">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-font-base mb-2">Residents in this Area</label>
                                        <div className="border border-primary rounded-lg p-3 bg-primary-lightest min-h-[150px] mb-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                    <span className="text-sm">Davis, Michael - Room 108</span>
                                                    <button onClick={() => {console.log("remove from zone")}} className="text-error hover:text-red-700">
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select className="flex-1 px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white">
                                                <option value="">Select a resident to add</option>
                                                <option value="johnson">Johnson, Marcus - Room 101</option>
                                                <option value="rodriguez">Rodriguez, Alex - Room 102</option>
                                                <option value="thompson">Thompson, Kevin - Room 103</option>
                                                <option value="martinez">Martinez, Luis - Room 110</option>
                                            </select>
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm whitespace-nowrap">
                                                <i className="fa-solid fa-plus mr-2"></i>
                                                Add Resident
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* <!-- Zone 3 --> */}
                                <div className="border border-bd rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <input type="text" value="Conference Room" className="text-base font-medium text-font-base bg-white border border-bd-input rounded px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-primary" />
                                        <button className="text-error hover:text-red-700">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-font-base mb-2">Residents in this Area</label>
                                        <div className="border border-primary rounded-lg p-3 bg-primary-lightest min-h-[150px] mb-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                    <span className="text-sm">Brown, Jason - Room 107</span>
                                                    <button onClick={() => {console.log("remove from zone")}} className="text-error hover:text-red-700">
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select className="flex-1 px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white">
                                                <option value="">Select a resident to add</option>
                                                <option value="davis">Davis, Michael - Room 108</option>
                                                <option value="martinez">Martinez, Luis - Room 110</option>
                                                <option value="johnson">Johnson, Marcus - Room 101</option>
                                            </select>
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light text-sm whitespace-nowrap">
                                                <i className="fa-solid fa-plus mr-2"></i>
                                                Add Resident
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* <!-- Court Schedule Section --> */}
                        <div className="border-t border-bd pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-font-base flex items-center">
                                    <i className="fa-solid fa-gavel text-highlight mr-2"></i>
                                    Court Schedule
                                </h4>
                            </div>
                            
                            <div className="border border-bd rounded-lg p-4 bg-gray-50">
                                <div>
                                    <label className="block text-sm font-medium text-font-base mb-2">Residents with Court Today</label>
                                    <div className="border border-highlight rounded-lg p-3 bg-highlight-lightest min-h-[150px] mb-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                <div>
                                                    <span className="text-sm font-medium">Wilson, Derek - Room 105</span>
                                                    <span className="text-xs text-font-detail ml-2">10:00 AM - District Court</span>
                                                </div>
                                                <button onClick={() => {console.log("remove from court")}} className="text-error hover:text-red-700">
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between bg-white p-2 rounded border border-bd">
                                                <div>
                                                    <span className="text-sm font-medium">Garcia, Antonio - Room 106</span>
                                                    <span className="text-xs text-font-detail ml-2">2:30 PM - Superior Court</span>
                                                </div>
                                                <button onClick={() => {console.log("remove from court")}} className="text-error hover:text-red-700">
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <select className="flex-1 px-3 py-2 border border-bd-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white">
                                            <option value="">Select a resident to add</option>
                                            <option value="johnson">Johnson, Marcus - Room 101</option>
                                            <option value="rodriguez">Rodriguez, Alex - Room 102</option>
                                            <option value="thompson">Thompson, Kevin - Room 103</option>
                                            <option value="martinez">Martinez, Luis - Room 110</option>
                                        </select>
                                        <button onClick={() => {console.log("add to court")}} className="bg-highlight text-font-dark px-4 py-2 rounded-lg hover:bg-highlight-lighter text-sm whitespace-nowrap">
                                            <i className="fa-solid fa-plus mr-2"></i>
                                            Add Resident
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-8">
                            <button type="button" onClick={() => {console.log("cancel")}} className="px-6 py-2 border border-bd text-font-base rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light">
                                <i className="fa-solid fa-save mr-2"></i>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default AddNewResident;
