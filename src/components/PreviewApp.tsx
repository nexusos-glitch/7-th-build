import React, { useState } from 'react';
import { Activity, Users, DollarSign, Bell } from 'lucide-react';

export default function PreviewApp() {
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <div className="flex-1 w-full h-full bg-[#0a0a0a] text-white flex flex-col font-sans">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <h2 className="font-bold text-orange-500 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Nexus Dashboard
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <button className="hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 text-orange-500 font-bold text-xs">
            JD
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-48 border-r border-white/10 flex flex-col py-4 gap-1">
          {['Overview', 'Analytics', 'Customers', 'Settings'].map(item => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`px-6 py-2 text-left text-sm transition-colors ${
                activeNav === item 
                  ? 'text-orange-500 border-r-2 border-orange-500 bg-orange-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">{activeNav}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Revenue', value: '$45,231', icon: DollarSign, color: 'text-green-400' },
              { label: 'Active Users', value: '2,405', icon: Users, color: 'text-blue-400' },
              { label: 'System Load', value: '24%', icon: Activity, color: 'text-orange-400' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-sm">{stat.label}</span>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="h-64 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 border-dashed">
            Interactive Chart Area
          </div>
        </main>
      </div>
    </div>
  );
}
