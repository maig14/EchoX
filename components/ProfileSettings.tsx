import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft,
  Twitter,
  Globe,
  Newspaper,
  Hash,
  AtSign,
  Heart,
  Repeat2,
  Calendar,
  Languages,
  Image,
  BadgeCheck,
  MessageSquare,
  RotateCcw,
  Plus,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SearchFilters } from '../services/xaiService';
import { LANGUAGES, INTEREST_OPTIONS } from '../hooks/useUserFilters';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  interests: string[];
  updateFilters: (updates: Partial<SearchFilters>) => void;
  updateInterests: (interests: string[]) => void;
  resetFilters: () => void;
  addFromUser: (handle: string) => void;
  removeFromUser: (handle: string) => void;
  addHashtag: (tag: string) => void;
  removeHashtag: (tag: string) => void;
  toggleSource: (source: 'x' | 'web' | 'news') => void;
  onApplyAndRefresh: () => Promise<void>;
  isRefreshing?: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  filters,
  interests,
  updateFilters,
  updateInterests,
  resetFilters,
  addFromUser,
  removeFromUser,
  addHashtag,
  removeHashtag,
  toggleSource,
  onApplyAndRefresh,
  isRefreshing = false,
}) => {
  const [newUser, setNewUser] = useState('');
  const [newHashtag, setNewHashtag] = useState('');

  const handleApplyAndRefresh = async () => {
    await onApplyAndRefresh();
    onClose();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.trim()) {
      addFromUser(newUser);
      setNewUser('');
    }
  };

  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHashtag.trim()) {
      addHashtag(newHashtag);
      setNewHashtag('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      if (interests.length > 1) {
        updateInterests(interests.filter((i) => i !== interest));
      }
    } else {
      updateInterests([...interests, interest]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Search Filters</h1>
          <button 
            onClick={resetFilters}
            className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
            title="Reset to defaults"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto pb-20">
        <div className="px-4 py-4 space-y-6">
          
          {/* Interests Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <h2 className="font-semibold text-base">Your Interests</h2>
            </div>
            <p className="text-xs text-gray-500">Select topics for your personalized feed</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    interests.includes(interest)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </section>

          {/* Sources Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <h2 className="font-semibold text-base">Sources</h2>
            </div>
            <p className="text-xs text-gray-500">Where to search for content</p>
            <div className="flex gap-3">
              <button
                onClick={() => toggleSource('x')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  filters.sources.includes('x')
                    ? 'bg-white/10 border-white/30'
                    : 'bg-gray-900 border-gray-800 opacity-50'
                }`}
              >
                <Twitter size={24} className={filters.sources.includes('x') ? 'text-white' : 'text-gray-500'} />
                <span className="text-sm font-medium">X / Twitter</span>
              </button>
              <button
                onClick={() => toggleSource('web')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  filters.sources.includes('web')
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-gray-900 border-gray-800 opacity-50'
                }`}
              >
                <Globe size={24} className={filters.sources.includes('web') ? 'text-blue-400' : 'text-gray-500'} />
                <span className="text-sm font-medium">Web</span>
              </button>
              <button
                onClick={() => toggleSource('news')}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  filters.sources.includes('news')
                    ? 'bg-orange-500/20 border-orange-500/50'
                    : 'bg-gray-900 border-gray-800 opacity-50'
                }`}
              >
                <Newspaper size={24} className={filters.sources.includes('news') ? 'text-orange-400' : 'text-gray-500'} />
                <span className="text-sm font-medium">News</span>
              </button>
            </div>
          </section>

          {/* Language Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages size={18} className="text-purple-400" />
              <h2 className="font-semibold text-base">Language</h2>
            </div>
            <select
              value={filters.language}
              onChange={(e) => updateFilters({ language: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </section>

          {/* Follow Specific Users */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <AtSign size={18} className="text-cyan-400" />
              <h2 className="font-semibold text-base">From Users</h2>
            </div>
            <p className="text-xs text-gray-500">Only show posts from these accounts</p>
            <form onSubmit={handleAddUser} className="flex gap-2">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="@username"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-xl transition-colors"
              >
                <Plus size={20} />
              </button>
            </form>
            {filters.fromUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.fromUsers.map((user) => (
                  <span
                    key={user}
                    className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full text-sm"
                  >
                    @{user}
                    <button
                      onClick={() => removeFromUser(user)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Hashtags */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash size={18} className="text-pink-400" />
              <h2 className="font-semibold text-base">Hashtags</h2>
            </div>
            <p className="text-xs text-gray-500">Include posts with these hashtags</p>
            <form onSubmit={handleAddHashtag} className="flex gap-2">
              <input
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="#hashtag"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-xl transition-colors"
              >
                <Plus size={20} />
              </button>
            </form>
            {filters.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Engagement Filters */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-red-400" />
              <h2 className="font-semibold text-base">Engagement Filters</h2>
            </div>
            <p className="text-xs text-gray-500">Minimum engagement thresholds</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <Heart size={14} />
                  Min Likes
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.minLikes}
                  onChange={(e) => updateFilters({ minLikes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <Repeat2 size={14} />
                  Min Retweets
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.minRetweets}
                  onChange={(e) => updateFilters({ minRetweets: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Date Range */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-green-400" />
              <h2 className="font-semibold text-base">Date Range</h2>
            </div>
            <p className="text-xs text-gray-500">Filter posts by date (leave empty for all time)</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">From</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => updateFilters({ fromDate: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">To</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => updateFilters({ toDate: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
          </section>

          {/* Content Type Toggles */}
          <section className="space-y-3">
            <h2 className="font-semibold text-base">Content Options</h2>
            
            <div className="space-y-2">
              <ToggleRow
                icon={<MessageSquare size={18} className="text-gray-400" />}
                label="Include Replies"
                description="Show reply tweets in results"
                enabled={filters.includeReplies}
                onToggle={() => updateFilters({ includeReplies: !filters.includeReplies })}
              />
              
              <ToggleRow
                icon={<Repeat2 size={18} className="text-gray-400" />}
                label="Include Retweets"
                description="Show retweets in results"
                enabled={filters.includeRetweets}
                onToggle={() => updateFilters({ includeRetweets: !filters.includeRetweets })}
              />
              
              <ToggleRow
                icon={<Image size={18} className="text-gray-400" />}
                label="Media Only"
                description="Only show posts with images/videos"
                enabled={filters.mediaOnly}
                onToggle={() => updateFilters({ mediaOnly: !filters.mediaOnly })}
              />
              
              <ToggleRow
                icon={<BadgeCheck size={18} className="text-blue-400" />}
                label="Verified Only"
                description="Only show posts from verified accounts"
                enabled={filters.verified}
                onToggle={() => updateFilters({ verified: !filters.verified })}
              />
            </div>
          </section>

          {/* Spacer for fixed button */}
          <div className="h-20" />
        </div>
      </div>

      {/* Fixed Apply & Refresh Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={handleApplyAndRefresh}
          disabled={isRefreshing}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing Feed...' : 'Apply & Refresh Feed'}</span>
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Settings are auto-saved • Refresh to apply changes
        </p>
      </div>
    </div>
  );
};

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, description, enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center gap-3 p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
  >
    {icon}
    <div className="flex-1 text-left">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
    <div
      className={`w-12 h-7 rounded-full relative transition-colors ${
        enabled ? 'bg-emerald-500' : 'bg-gray-700'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  </button>
);

export default ProfileSettings;

