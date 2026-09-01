import React, { useState } from 'react';
import { User, MapPin, Phone, Globe, Layers, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { SupportedLanguage, LANGUAGE_OPTIONS } from '../utils/translations';

interface UserProfileModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(userProfile.fullName);
  const [village, setVillage] = useState(userProfile.villageLocation);
  const [stateRegion, setStateRegion] = useState(userProfile.stateRegion);
  const [phone, setPhone] = useState(userProfile.phoneNumber);
  const [lang, setLang] = useState<SupportedLanguage>(userProfile.primaryLanguage);
  const [landAcres, setLandAcres] = useState(userProfile.landSizeAcres.toString());
  const [soil, setSoil] = useState(userProfile.soilType);
  const [cropsText, setCropsText] = useState(
    Array.isArray(userProfile?.mainCrops) ? userProfile.mainCrops.join(', ') : 'Wheat, Rice, Tomato'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCrops = cropsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...userProfile,
      fullName: name,
      villageLocation: village,
      stateRegion: stateRegion,
      phoneNumber: phone,
      primaryLanguage: lang,
      landSizeAcres: parseFloat(landAcres) || 4.5,
      soilType: soil as any,
      mainCrops: parsedCrops.length ? parsedCrops : userProfile.mainCrops,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
                Farmer Profile & Land Settings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Used to personalize disease diagnostics & expert advisory
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
              Farmer's Full Name (किसान का नाम):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Village & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                Village / District:
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                State / Region:
              </label>
              <input
                type="text"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Phone & Land Acres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number (for Helpline):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                Total Land Size (Acres):
              </label>
              <input
                type="number"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Main Crops */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
              Primary Farm Crops (comma separated):
            </label>
            <input
              type="text"
              value={cropsText}
              onChange={(e) => setCropsText(e.target.value)}
              placeholder="e.g., Tomato, Wheat, Rice (Paddy), Cotton"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
              Soil Type:
            </label>
            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
              <option value="black_cotton">Black Cotton Soil (काली मिट्टी)</option>
              <option value="red_loamy">Red Loamy Soil (लाल मिट्टी)</option>
              <option value="clay">Clayey Soil (चिकनी मिट्टी)</option>
              <option value="sandy">Sandy Loam (बलुई दोमट)</option>
            </select>
          </div>

          {/* Language preference */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
              Primary Language:
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md transition"
            >
              Save Profile (सेव करें)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
