import React, { useState, useEffect } from 'react';
import { Search, Play, Clock, Loader2, Film, Sparkles } from 'lucide-react';

// API Configuration - Update this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8080/api';

// Starry background component
const StarryBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a1628] to-[#0f172a]" />
      
      {/* Stars layers */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(1px 1px at 20px 30px, white, transparent),
          radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 90px 40px, white, transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
          radial-gradient(1.5px 1.5px at 160px 120px, white, transparent),
          radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.9), transparent),
          radial-gradient(1px 1px at 220px 90px, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 250px 140px, white, transparent),
          radial-gradient(1.5px 1.5px at 280px 30px, rgba(255,255,255,0.8), transparent)
        `,
        backgroundSize: '300px 200px'
      }} />
      
      {/* Additional star layer for depth */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(1px 1px at 10px 10px, rgba(255,255,255,0.4), transparent),
          radial-gradient(1.5px 1.5px at 150px 150px, rgba(255,255,255,0.3), transparent),
          radial-gradient(1px 1px at 100px 50px, rgba(255,255,255,0.5), transparent),
          radial-gradient(2px 2px at 200px 100px, rgba(147,197,253,0.6), transparent),
          radial-gradient(1px 1px at 50px 200px, rgba(255,255,255,0.4), transparent),
          radial-gradient(1.5px 1.5px at 250px 180px, rgba(147,197,253,0.5), transparent)
        `,
        backgroundSize: '400px 300px'
      }} />
      
      {/* Subtle blue glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-900/15 rounded-full blur-3xl" />
    </div>
  );
};

export default function VideoVault() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch categories from backend on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      // Fallback categories if backend is not available
      setCategories([
        'Technology', 'Music', 'Gaming', 'Education',
        'Cooking', 'Fitness', 'Travel', 'Science'
      ]);
    }
  };

  const searchVideos = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/videos/search?query=${encodeURIComponent(query)}&maxResults=12`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos || []);
      setTotalResults(data.totalResults || data.videos?.length || 0);
    } catch (err) {
      setError('Unable to connect to server. Please ensure the backend is running.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos(searchQuery);
  };

  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    searchVideos(category);
  };

  const openVideo = (videoId) => {
    if (videoId.startsWith('demo-')) {
      // Demo video - show alert
      alert('This is a demo video. Connect your YouTube API key to see real videos!');
    } else {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur-sm bg-black/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Video Vault</h1>
          <span className="ml-auto text-xs text-blue-300/50">Powered by Spring Boot</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-4xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-medium">Discover Amazing Content</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Videos That
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> Inspire You</span>
        </h2>
        <p className="text-blue-200/60 text-lg mb-8">
          Enter a category and unlock a world of curated video content
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a category (e.g., Technology, Music, Cooking...)"
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
        </form>

        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.slice(0, 8).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-blue-200/80 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-all"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="relative max-w-7xl mx-auto px-4 pb-16">
        {error && (
          <div className="text-center py-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-blue-300/40 text-xs mt-1">
              Make sure the Spring Boot backend is running on port 8080
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <p className="text-blue-200/60">Searching the vault...</p>
          </div>
        )}

        {!loading && hasSearched && videos.length === 0 && !error && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-blue-900/50 mx-auto mb-4" />
            <p className="text-blue-200/60 text-lg">No videos found. Try a different category!</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Results for "<span className="text-cyan-400">{searchQuery}</span>"
              </h3>
              <span className="text-blue-300/50 text-sm">{totalResults} videos found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 transition-all hover:transform hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10"
                  onClick={() => openVideo(video.id)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${video.id}/480/270`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-cyan-500/20 rounded-full backdrop-blur-sm border border-cyan-400/30">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-blue-300/60 text-sm mb-2">{video.channel}</p>
                    <div className="flex items-center gap-3 text-blue-300/40 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.publishedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-white/5 rounded-full mb-4 border border-white/10">
              <Search className="w-8 h-8 text-blue-400/50" />
            </div>
            <p className="text-blue-200/50">Enter a category above to start exploring videos</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-blue-300/40 text-sm">
          <p>Video Vault • Java Spring Boot Backend + React Frontend</p>
        </div>
      </footer>
    </div>
  );
}
