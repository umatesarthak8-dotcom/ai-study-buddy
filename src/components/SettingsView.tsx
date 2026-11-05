import React, { useState } from 'react';
import {
  Settings,
  User,
  GraduationCap,
  Sparkles,
  Save,
  Check,
  Cpu,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { UserProfile, UserStats } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  userStats: UserStats;
  onResetStats: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onUpdateProfile,
  userStats,
  onResetStats,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saved, setSaved] = useState(false);

  const disciplines = [
    'Computer Science & Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical & Aerospace Engineering',
    'Civil & Structural Engineering',
    'Biomedical & Bioengineering',
    'Chemical & Materials Engineering',
    'Robotics & Autonomous Systems',
  ];

  const academicYears = [
    '1st Year Undergraduate',
    '2nd Year Undergraduate',
    '3rd Year Undergraduate',
    'Final Year Undergraduate',
    'Master of Science / M.Tech',
    'Ph.D. Researcher',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 font-mono">
              Configuration
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Settings & Student Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalize your engineering study discipline, scholar identity, and learning environment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scholar Identity Section */}
        <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-md space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            Scholar Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="e.g. Sarthak Umate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Personal Tagline / Goal
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="e.g. Preparing for Final Exams & Gate"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Primary Engineering Discipline
              </label>
              <select
                value={formData.discipline}
                onChange={(e) => setFormData((p) => ({ ...p, discipline: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Academic Standing
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData((p) => ({ ...p, academicYear: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                {academicYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Engine & System Status */}
        <div className="bg-[#121A2D] rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            AI Engine Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[11px] block">Active Primary Model</span>
              <span className="font-bold text-white font-mono">gemini-3.8-flash</span>
              <p className="text-[10px] text-slate-500 mt-1">High-speed reasoning, structured schemas</p>
            </div>

            <div className="p-3.5 bg-[#0B1020] rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[11px] block">Resilient Auto-Fallback</span>
              <span className="font-bold text-emerald-400 font-mono">gemini-3.1-flash-lite Enabled</span>
              <p className="text-[10px] text-slate-500 mt-1">Guarantees zero downtime during demand spikes</p>
            </div>
          </div>

          <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-300 font-semibold">
                API Key securely managed via Server-Side Environment (Zero Browser Leakage)
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
