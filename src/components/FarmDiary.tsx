import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  Droplets,
  Sprout,
  FlaskConical,
  ShieldCheck,
  Wheat,
  FileText,
  Trash2,
  Filter,
  CheckCircle,
  Volume2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ActivityType, FarmDiaryEntry, UserProfile } from '../types';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';
import { speakText } from '../utils/audioSpeech';

interface FarmDiaryProps {
  diaryEntries: FarmDiaryEntry[];
  userProfile: UserProfile;
  currentLang: SupportedLanguage;
  onAddEntry: (entry: Omit<FarmDiaryEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
}

export const FarmDiary: React.FC<FarmDiaryProps> = ({
  diaryEntries,
  userProfile,
  currentLang,
  onAddEntry,
  onDeleteEntry,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [filterCrop, setFilterCrop] = useState<string>('all');

  // Form state for new activity entry
  const [formCrop, setFormCrop] = useState<string>(userProfile.mainCrops[0] || 'Tomato');
  const [formFieldSection, setFormFieldSection] = useState<string>('Main Plot (2 Acres)');
  const [formActivityType, setFormActivityType] = useState<ActivityType>('irrigation');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formProductName, setFormProductName] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formWaterHours, setFormWaterHours] = useState<string>('3');
  const [formCost, setFormCost] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formStage, setFormStage] = useState<'sowing' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity' | 'harvest'>('vegetative');

  const activityTypesConfig: Array<{ type: ActivityType; label: string; icon: string; color: string }> = [
    { type: 'sowing', label: 'Sowing / Planting', icon: '🌱', color: 'bg-emerald-500 text-white' },
    { type: 'irrigation', label: 'Watering / Irrigation', icon: '💧', color: 'bg-blue-500 text-white' },
    { type: 'fertilizer', label: 'Fertilizer Application', icon: '🧪', color: 'bg-amber-500 text-white' },
    { type: 'pesticide', label: 'Pesticide / Spray', icon: '🛡️', color: 'bg-purple-500 text-white' },
    { type: 'weeding', label: 'Weeding / Hoeing', icon: '🌿', color: 'bg-teal-500 text-white' },
    { type: 'harvest', label: 'Crop Harvest', icon: '🌾', color: 'bg-orange-500 text-white' },
    { type: 'note', label: 'General Field Note', icon: '📝', color: 'bg-slate-600 text-white' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleGenerated =
      formTitle.trim() ||
      `${activityTypesConfig.find((a) => a.type === formActivityType)?.label} for ${formCrop}`;

    onAddEntry({
      cropName: formCrop,
      fieldSection: formFieldSection,
      activityType: formActivityType,
      date: formDate,
      title: titleGenerated,
      details: {
        productName: formProductName || undefined,
        quantity: formQuantity || undefined,
        waterHours: formWaterHours ? parseFloat(formWaterHours) : undefined,
        costInRupees: formCost ? parseFloat(formCost) : undefined,
      },
      cropStage: formStage,
      notes: formNotes,
    });

    // Reset and close
    setFormTitle('');
    setFormProductName('');
    setFormQuantity('');
    setFormNotes('');
    setShowAddModal(false);
  };

  const filteredEntries = (diaryEntries || []).filter((entry) => {
    const matchAct = filterActivity === 'all' || entry.activityType === filterActivity;
    const matchCrop = filterCrop === 'all' || entry.cropName.toLowerCase().includes(filterCrop.toLowerCase());
    return matchAct && matchCrop;
  });

  const handleReadTimeline = () => {
    const summary = (diaryEntries || []).slice(0, 3).map((e) => `On ${e.date}: ${e.title} on ${e.cropName}`).join('. ');
    speakText(`Farm Diary timeline for ${userProfile?.fullName || 'Farmer'}. Recent logs: ${summary}`, currentLang);
  };

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Diary Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/50 text-emerald-100 text-xs font-bold border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Digital Kisan Notebook</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 font-['Outfit']">
              {texts.diaryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              Logging planting dates, watering schedules, fertilizers, and sprays for expert context
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReadTimeline}
              className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl flex items-center gap-1 text-xs font-bold transition border border-white/20"
              title="Listen to timeline"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>{texts.addDiaryEntry}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Visual Icon Action Buttons (1-Tap to Log) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          1-Tap Quick Action Logging:
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {activityTypesConfig.slice(0, 6).map((item) => (
            <button
              key={item.type}
              onClick={() => {
                setFormActivityType(item.type);
                setShowAddModal(true);
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-400 flex flex-col items-center justify-center gap-1.5 transition transform active:scale-95 text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition">{item.icon}</span>
              <span className="text-[11px] font-bold text-slate-800 leading-tight">
                {item.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['all', 'irrigation', 'fertilizer', 'pesticide', 'sowing', 'harvest'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterActivity(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
                filterActivity === act
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {act === 'all' ? 'All Activities' : act}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500">
          {filteredEntries.length} Recorded Entries
        </span>
      </div>

      {/* TIMELINE VIEW (Visual chronology of farming actions) */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No diary entries found for this filter.</p>
            <p className="text-xs">Tap "+ New Activity Entry" to log planting, fertilizer, or watering.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const config = activityTypesConfig.find((a) => a.type === entry.activityType) || activityTypesConfig[0];
            return (
              <div
                key={entry.id}
                className="relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm transition hover:shadow-md"
              >
                {/* Timeline node icon */}
                <div className="absolute -left-[31px] top-4 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm ring-4 ring-slate-50">
                  {config.icon}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {entry.cropName}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Stage: {entry.cropStage}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 font-['Outfit']">
                      {entry.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Breakdown Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  {entry.details.productName && (
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Product</span>
                      <strong className="text-slate-900 truncate block">{entry.details.productName}</strong>
                    </div>
                  )}

                  {entry.details.quantity && (
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Dose / Quantity</span>
                      <strong className="text-slate-900 truncate block">{entry.details.quantity}</strong>
                    </div>
                  )}

                  {entry.details.waterHours && (
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Watering Time</span>
                      <strong className="text-blue-900 block">{entry.details.waterHours} Hours Drip</strong>
                    </div>
                  )}

                  {entry.details.costInRupees && (
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Cost</span>
                      <strong className="text-emerald-900 block">₹{entry.details.costInRupees}</strong>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {entry.notes && (
                  <p className="text-xs text-slate-600 mt-2 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    📝 <strong>Field Observations:</strong> {entry.notes}
                  </p>
                )}

                {/* Attached photos if any */}
                {entry.photos && entry.photos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {entry.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Crop snapshot"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Log Farm Activity (खेत का काम दर्ज करें)
                </h2>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {/* Activity Type Picker */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Activity Type:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
                  {activityTypesConfig.map((item) => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setFormActivityType(item.type)}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        formActivityType === item.type
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                    Crop Name:
                  </label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    {(userProfile?.mainCrops || ['Wheat', 'Rice (Paddy)', 'Cotton', 'Tomato']).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Vegetables">Vegetables</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Activity Title:
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Sowed 50kg seeds, or Sprayed Mancozeb M-45"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Product name & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                    Product / Fertilizer / Chemical:
                  </label>
                  <input
                    type="text"
                    value={formProductName}
                    onChange={(e) => setFormProductName(e.target.value)}
                    placeholder="e.g., Urea / Neem Oil / Saaf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                    Quantity / Dose:
                  </label>
                  <input
                    type="text"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    placeholder="e.g., 2 bags (90kg) or 500ml"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Field Notes / Observations:
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g., Soil moisture was adequate, healthy germination seen..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md transition"
                >
                  Save Entry (डायरी में लिखें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
