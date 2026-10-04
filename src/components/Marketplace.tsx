import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  PhoneCall,
  MessageCircle,
  MapPin,
  Tag,
  Calendar,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';
import { MarketCategory, MarketListing, MarketListingType } from '../types';

interface MarketplaceProps {
  listings: MarketListing[];
  onAddListing: (listing: MarketListing) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  onAddListing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'sell' | 'buy'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<MarketCategory>('milk');
  const [type, setType] = useState<MarketListingType>('sell');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(60);
  const [priceUnit, setPriceUnit] = useState('per Liter');
  const [quantity, setQuantity] = useState('50 Liters Daily');
  const [location, setLocation] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    { id: 'all', label: 'All Items', icon: '🏪' },
    { id: 'milk', label: 'Milk (दूध)', icon: '🥛' },
    { id: 'cattle', label: 'Cattle (पशु)', icon: '🐄' },
    { id: 'feed', label: 'Feed & Fodder (चारा)', icon: '🌾' },
    { id: 'dairy_products', label: 'Dairy Products (घी/पनीर)', icon: '🧺' },
  ];

  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = listingTypeFilter === 'all' || item.type === listingTypeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const handlePostListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sellerPhone.trim()) return;

    const newListing: MarketListing = {
      id: `market-${Date.now()}`,
      title: title.trim(),
      category,
      type,
      price: Number(price) || 0,
      priceUnit,
      quantity: quantity.trim() || '1 Unit',
      location: location.trim() || 'Local Farm',
      sellerName: sellerName.trim() || 'Dairy Farmer',
      sellerPhone: sellerPhone.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      datePosted: 'Just now',
      badge: type === 'sell' ? 'Available Now' : 'Wanted to Buy',
    };

    onAddListing(newListing);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dairy Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct farmer-to-farmer platform to buy and sell milk, cattle, silage bales, fodder, and dairy products.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Listing</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search and Buy/Sell Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search milk, Murrah buffaloes, silage bales, wheat straw, ghee, location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-stretch">
          <button
            onClick={() => setListingTypeFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              listingTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setListingTypeFilter('sell')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              listingTypeFilter === 'sell' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            For Sale (Buy)
          </button>
          <button
            onClick={() => setListingTypeFilter('buy')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              listingTypeFilter === 'buy' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
            }`}
          >
            Wanted (Sell)
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-2xl p-8">
          <span className="text-4xl">🛒</span>
          <h3 className="font-bold text-slate-800 text-base mt-2">No listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Be the first to list fresh milk, cattle, fodder, or homemade ghee for nearby dairy farmers.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a Listing</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition-all space-y-3 flex flex-col justify-between group"
            >
              <div>
                {/* Photo if present */}
                {item.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs text-white ${
                        item.type === 'sell' ? 'bg-emerald-700/90' : 'bg-blue-700/90'
                      }`}
                    >
                      {item.type === 'sell' ? 'FOR SALE' : 'WANTED TO BUY'}
                    </span>
                  </div>
                )}

                {!item.imageUrl && (
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.type === 'sell'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.type === 'sell' ? 'FOR SALE' : 'WANTED TO BUY'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.datePosted}</span>
                  </div>
                )}

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Price & Quantity */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.priceUnit}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-600">{item.quantity}</span>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Seller & Location */}
                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <span>👤 {item.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${item.sellerPhone}`}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Seller</span>
                </a>

                <a
                  href={`https://wa.me/${item.sellerPhone.replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(item.title)}%20on%20DairyGuard`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post New Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Post to Dairy Marketplace
                </h3>
                <p className="text-xs text-slate-500">
                  List your milk, animals, silage, or dairy products for other farmers.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostListing} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MarketCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="milk">🥛 Milk (दूध)</option>
                    <option value="cattle">🐄 Cattle (पशु)</option>
                    <option value="feed">🌾 Feed & Silage (चारा)</option>
                    <option value="dairy_products">🧺 Dairy Products (घी/पनीर)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MarketListingType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="sell">I am Selling (For Sale)</option>
                    <option value="buy">I Want to Buy (Buyer Request)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100L Fresh Cow Milk Daily / 2nd Calver Murrah Buffalo"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Unit</label>
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="e.g. per Liter / per Head / per kg"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 Liters / 1 Animal / 10 Tons"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location (Town / District) *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Karnal, Haryana"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Chaudhary Ram Singh"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Details</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide fat percentage, vaccination status, delivery details, etc..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
