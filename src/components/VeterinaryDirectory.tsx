import React, { useState } from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
  Search,
  Plus,
  ShieldCheck,
  Star,
  MessageCircle,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { VetDoctor } from '../types';

interface VeterinaryDirectoryProps {
  vets: VetDoctor[];
  onAddVet: (vet: VetDoctor) => void;
}

export const VeterinaryDirectory: React.FC<VeterinaryDirectoryProps> = ({
  vets,
  onAddVet,
}) => {
  const [search, setSearch] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new custom local vet
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('B.V.Sc & A.H.');
  const [specialty, setSpecialty] = useState('General Livestock & Emergency');
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [experienceYears, setExperienceYears] = useState(8);

  const filteredVets = vets.filter((vet) => {
    const matchesSearch =
      vet.name.toLowerCase().includes(search.toLowerCase()) ||
      vet.city.toLowerCase().includes(search.toLowerCase()) ||
      vet.specialty.toLowerCase().includes(search.toLowerCase()) ||
      vet.address.toLowerCase().includes(search.toLowerCase());
    const matchesEmergency = !emergencyOnly || vet.emergencyAvailable;
    return matchesSearch && matchesEmergency;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newVet: VetDoctor = {
      id: `vet-custom-${Date.now()}`,
      name: name.trim(),
      degree: degree.trim() || 'B.V.Sc',
      specialty: specialty.trim() || 'Livestock Care',
      clinicName: clinicName.trim() || 'Village Veterinary Clinic',
      address: address.trim() || city,
      city: city.trim() || 'Local District',
      phone: phone.trim(),
      emergencyAvailable,
      experienceYears: Number(experienceYears) || 5,
      rating: 5.0,
      isCustom: true,
    };

    onAddVet(newVet);
    setIsModalOpen(false);
    setName('');
    setPhone('');
    setAddress('');
    setCity('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Veterinary Doctor Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find certified livestock doctors, emergency mobile ambulances, and cattle obstetricians.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Save Your Local Doctor</span>
        </button>
      </div>

      {/* 24/7 Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              National Emergency Livestock Toll-Free Helpline: 1962
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              Government 24/7 Mobile Veterinary Unit (MVU) emergency service for cattle.
            </p>
          </div>
        </div>

        <a
          href="tel:1962"
          className="bg-white hover:bg-rose-50 text-rose-800 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 1962 Now</span>
        </a>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name, city, clinic, or specialty (e.g. Mastitis, Calving)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
          />
        </div>

        <button
          onClick={() => setEmergencyOnly(!emergencyOnly)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto shrink-0 ${
            emergencyOnly
              ? 'bg-rose-100 text-rose-900 border-rose-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-rose-600" />
          <span>24/7 Emergency Available Only</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVets.map((vet) => (
          <div
            key={vet.id}
            className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Top row: Name & Emergency badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {vet.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {vet.degree} • {vet.experienceYears} yrs experience
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {vet.emergencyAvailable && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                      24/7 Emergency
                    </span>
                  )}
                  {vet.isCustom && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Saved by You
                    </span>
                  )}
                </div>
              </div>

              {/* Specialty & Clinic */}
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{vet.specialty}</span>
                </div>
                <p className="font-medium text-slate-500 pl-5">{vet.clinicName}</p>
              </div>

              {/* Address */}
              <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{vet.address}, {vet.city}</span>
              </div>

              {/* Fee or note if available */}
              {vet.consultationFee && (
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 inline-block font-medium">
                  Fee: <strong className="text-slate-700">{vet.consultationFee}</strong>
                </div>
              )}
            </div>

            {/* Contact Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${vet.phone}`}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {vet.phone}</span>
              </a>

              <a
                href={`https://wa.me/${vet.phone.replace(/[^0-9]/g, '')}?text=Hello%20Doctor,%20I%20need%20veterinary%20assistance%20for%20my%20cow`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Local Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Save Your Local Veterinary Doctor
                </h3>
                <p className="text-xs text-slate-500">
                  Store your trusted village vet or compounder contact for quick 1-tap offline calls.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.V.Sc / Diploma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinic / Dispensary Name
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="e.g. Taluka Veterinary Dispensary"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City / Town / Tehsil *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karnal / Anand"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Gynaecology / Surgery"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Address / Landmark
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Main Highway, opposite Milk Chilling Plant"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={emergencyAvailable}
                  onChange={(e) => setEmergencyAvailable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="emergency" className="font-bold text-slate-700 cursor-pointer">
                  Available for 24/7 Night / Emergency Calls
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Save to My Contacts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
