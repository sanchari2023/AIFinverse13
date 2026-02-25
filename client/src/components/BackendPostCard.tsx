import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";

interface BackendPostCardProps {
  post: any;
  showShare: string | null;
  setShowShare: (id: string | null) => void;
}

export default function BackendPostCard({ post, showShare, setShowShare }: BackendPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm">
      {/* Header with date, read time, author AND SHARE BUTTON AT RIGHT */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 flex-wrap border-b border-slate-700/50 pb-4">
        <span className="flex items-center gap-1.5">
          <span className="text-lg">📅</span>
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-lg">⏱</span>
          <span>{post.read_time} min read</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-lg">✍️</span>
          <span className="text-cyan-300">{post.author?.name}</span>
        </span>
        
        {/* Share Button - in header with ml-auto */}
        <span className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(showShare === post.id ? null : post.id);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 text-xs transition-all duration-200"
            >
              <Share2 size={12} />
              Share
            </button>
            
            {showShare === post.id && (
              <div 
                className="absolute right-0 top-8 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl min-w-[140px]">
                  <h4 className="text-white font-semibold text-xs mb-2">Share Article</h4>
                  
                  <div className="space-y-1">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + window.location.origin + '/post/' + post.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1.5 bg-emerald-900/20 border border-emerald-800/30 rounded text-emerald-300 text-xs hover:bg-emerald-900/30 transition-colors"
                    >
                      <img src="/images/whatsapp.png" alt="WhatsApp" className="w-3 h-3" />
                      WhatsApp
                    </a>

                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/post/' + post.id)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1.5 bg-sky-900/20 border border-sky-800/30 rounded text-sky-300 text-xs hover:bg-sky-900/30 transition-colors"
                    >
                      <img src="/images/telegram.png" alt="Telegram" className="w-3 h-3" />
                      Telegram
                    </a>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + '/post/' + post.id);
                        setShowShare(null);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 bg-slate-700/30 border border-slate-600/30 rounded text-gray-300 text-xs hover:bg-slate-700/40 transition-colors"
                    >
                      <Copy size={12} />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </span>
      </div>

      {/* Featured Image */}
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">
        {post.title}
      </h3>

      {/* Subtitle */}
      {post.subtitle && (
        <p className="text-gray-300 mb-4">
          {post.subtitle}
        </p>
      )}

      {/* Excerpt or Full Content based on expanded state */}
      {isExpanded ? (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4 mb-6">
          <p>{post.content}</p>
        </div>
      ) : (
        <p className="text-gray-400 mb-6">
          {post.excerpt}
        </p>
      )}

      {/* Read More/Less Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-cyan-400 font-medium transition-all duration-200 flex items-center gap-2 group"
      >
        {isExpanded ? (
          <>
            <span>Read Less</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </>
        ) : (
          <>
            <span>Read Full Article</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </>
        )}
      </button>
    </div>
  );
}