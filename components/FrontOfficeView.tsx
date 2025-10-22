import React, { useMemo } from 'react';
import { FRONT_OFFICE_STAFF } from '../src/core/data/FrontOfficeData';
import { Briefcase, Search } from 'lucide-react';

const FrontOfficeView: React.FC = () => {
    // Memoize the grouped staff to prevent recalculating on every render.
    const staffByDepartment = useMemo(() => {
        return FRONT_OFFICE_STAFF.reduce((acc, staffMember) => {
            if (!acc[staffMember.department]) {
                acc[staffMember.department] = [];
            }
            acc[staffMember.department].push(staffMember);
            return acc;
        }, {} as Record<string, typeof FRONT_OFFICE_STAFF>);
    }, []);

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Front Office Directory</h1>
            <p className="text-stone-400 mb-6">Meet the leadership and personnel shaping the future of your team.</p>

            <div className="space-y-8">
                {/* Front Office Department */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-amber-400" />
                        Front Office
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staffByDepartment['Front Office']?.map(staff => (
                            <div key={staff.role} className="bg-stone-800/50 p-4 rounded-lg ring-1 ring-stone-700">
                                <h3 className="font-bold text-lg text-stone-200">{staff.role}</h3>
                                <p className="text-sm text-stone-400 mt-1">{staff.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scouting Department */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Search className="w-6 h-6 text-amber-400" />
                        Scouting Department
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staffByDepartment['Scouting']?.map(staff => (
                            <div key={staff.role} className="bg-stone-800/50 p-4 rounded-lg ring-1 ring-stone-700">
                                <h3 className="font-bold text-lg text-stone-200">{staff.role}</h3>
                                <p className="text-sm text-stone-400 mt-1">{staff.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontOfficeView;