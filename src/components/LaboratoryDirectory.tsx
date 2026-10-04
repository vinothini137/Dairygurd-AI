import React, { useState } from 'react';
import {
  FlaskConical,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { TestingLab } from '../types';

interface LaboratoryDirectoryProps {
  labs: TestingLab[];
  onAddLab: (lab: TestingLab) => void;
}

export const LaboratoryDirectory: React.FC<LaboratoryDirectoryProps> = ({
  labs,
  onAddLab,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [accreditedBy, setAccreditedBy] = useState('NABL / FSSAI Certified');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [turnaroundDays, setTurnaroundDays] = useState('2 to 3 Business Days');
  const [testsOffered, setTestsOffered] = useState('Aflatoxin Mycotoxin, Silage pH, Crude Protein');
  const [sampleInstructions, setSampleInstructions] = useState('Send 500g in airtight Ziploc bag chilled.');

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.name.toLowerCase().includes(search.toLowerCase()) ||
      lab.city.toLowerCase().includes(search.toLowerCase()) ||
      lab.address.toLowerCase().includes(search.toLowerCase()) ||
      lab.testsOffered.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newLab: TestingLab = {
      id: `lab-custom-${Date.now()}`,
      name: name.trim(),
      accreditedBy: accreditedBy.trim() || 'Accredited Analytical Lab',
      address: address.trim() || city,
      city: city.trim() || 'Local District',
      phone: phone.trim(),
      email: email.trim() || undefined,
      turnaroundDays,
      testsOffered: testsOffered
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      sampleInstructions,
      isCustom: true,
    };

    onAddLab(newLab);
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
            <span className="text-2xl">🧪</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Nearby Testing Laboratories
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send feed, silage, and raw milk samples for certified mycotoxin, chemical, and nutritional assays.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Lab</span>
        </button>
      </div>

      {/* Guide Banner: How to Prepare & Dispatch Samples */}
      <div className="bg-gradient-to-br from-cyan-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-extrabold text-cyan-200 text-sm flex items-center gap-2">
          <span>📦</span>
          <span>Sample Collection & Dispatch Guidelines for Farmers</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-cyan-100/90 leading-relaxed">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">1. Representative Sampling:</strong>
            Take 5-6 handfuls from different points of the silage pit face or feed bags and mix thoroughly.
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">2. Moisture Airtight Seal:</strong>
            Double-bag 500g in ziploc bags, expelling all air before sealing so fermentation stops.
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <strong className="text-white block mb-0.5">3. Cold Transit:</strong>
            Ship silage with a frozen gel pack to prevent mold from blooming in transit.
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lab name, city, or test type (e.g. Aflatoxin, Silage Fermentation, Somatic Cell Count)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 transition-all font-medium"
        />
      </div>

      {/* Labs List */}
      <div className="space-y-4">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white border border-slate-200 hover:border-cyan-300 rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {lab.name}
                  </h3>
                  {lab.isCustom && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Local
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-cyan-700 mt-0.5">
                  {lab.accreditedBy}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{lab.address}, {lab.city}</span>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Turnaround: {lab.turnaroundDays}
                </span>
                {lab.pricingEstimate && (
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Estimated Cost: <strong className="text-slate-800">{lab.pricingEstimate}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Tests Offered Chips */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Tests & Diagnostic Panels:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lab.testsOffered.map((test, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-cyan-50 text-cyan-900 border border-cyan-200 px-2.5 py-1 rounded-lg"
                  >
                    {test}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample instructions */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
              <FileText className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <span>
                <strong>Sample Submission:</strong> {lab.sampleInstructions}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${lab.phone}`}
                className="bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {lab.phone}</span>
              </a>

              {lab.email && (
                <a
                  href={`mailto:${lab.email}?subject=Feed%20Testing%20Inquiry%20from%20DairyGuard`}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Lab</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Lab Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Save Local Testing Laboratory
                </h3>
                <p className="text-xs text-slate-500">
                  Save nearby dairy or feed testing centers for offline access.
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
                  Laboratory Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. District Dairy Union Quality Lab"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Accreditation / Affiliation
                  </label>
                  <input
                    type="text"
                    value={accreditedBy}
                    onChange={(e) => setAccreditedBy(e.target.value)}
                    placeholder="e.g. FSSAI / NDDB Approved"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 184 2259000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karnal / Anand"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={turnaroundDays}
                    onChange={(e) => setTurnaroundDays(e.target.value)}
                    placeholder="e.g. 2 Days"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tests Offered (comma separated)
                </label>
                <input
                  type="text"
                  value={testsOffered}
                  onChange={(e) => setTestsOffered(e.target.value)}
                  placeholder="e.g. Aflatoxin HPLC, Silage pH, Urea Adulteration"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Dairy Science Campus, Main Road"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
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
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Save Lab Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
