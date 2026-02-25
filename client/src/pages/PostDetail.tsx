// pages/PostDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import { postService } from "@/services/postService";
import { Share2, Copy } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log("📌 Fetching post with ID:", id);
        const data = await postService.getPostById(id);
        console.log("📌 Post data received:", data);
        setPost(data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const getShareLinks = () => {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://aifinverse.com';
    
    const shareUrl = `${baseUrl}/post/${post.id}`;
    const message = `Check out this article: ${post.title}\n\n${shareUrl}`;
    const encodedMessage = encodeURIComponent(message);

    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      copy: shareUrl,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-slate-950/95 bg-[url('/images/login.png')] bg-cover bg-center bg-fixed bg-blend-darken">
          <Navbar />
          <div className="pt-20 px-4 text-center">
            <p className="text-white">Loading article...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !post) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-slate-950/95 bg-[url('/images/login.png')] bg-cover bg-center bg-fixed bg-blend-darken">
          <Navbar />
          <div className="pt-20 px-4 text-center">
            <h1 className="text-2xl text-white mb-4">Error</h1>
            <p className="text-gray-400 mb-6">{error || "Post not found"}</p>
            <Link href="/newsletter">
              <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg">
                ← Back to Newsletter
              </button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-slate-950/95 bg-[url('/images/login.png')] bg-cover bg-center bg-fixed bg-blend-darken">
        <Navbar />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/newsletter">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-cyan-400 font-medium transition-all duration-200">
                ← Back to Newsletter
              </button>
            </Link>
          </div>

          {/* Article Card */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6 md:p-8">
            
            {/* Header with metadata and share button */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 flex-wrap border-b border-slate-700/50 pb-4">
              <span className="flex items-center gap-1.5">
                <span className="text-lg">📅</span>
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">⏱</span>
                <span>{post.read_time} min read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-lg">✍️</span>
                <span className="text-cyan-300">{post.author?.name || post.author_name}</span>
              </span>
              
              {/* Share Button */}
              <span className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 text-xs transition-all duration-200"
                  >
                    <Share2 size={12} />
                    Share
                  </button>
                  
                  {showShare && (
                    <div 
                      className="absolute right-0 top-8 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl min-w-[140px]">
                        <h4 className="text-white font-semibold text-xs mb-2">Share Article</h4>
                        
                        <div className="space-y-1">
                          <a
                            href={getShareLinks().whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1.5 bg-emerald-900/20 border border-emerald-800/30 rounded text-emerald-300 text-xs hover:bg-emerald-900/30 transition-colors"
                          >
                            <img src="/images/whatsapp.png" alt="WhatsApp" className="w-3 h-3" />
                            WhatsApp
                          </a>

                          <a
                            href={getShareLinks().telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1.5 bg-sky-900/20 border border-sky-800/30 rounded text-sky-300 text-xs hover:bg-sky-900/30 transition-colors"
                          >
                            <img src="/images/telegram.png" alt="Telegram" className="w-3 h-3" />
                            Telegram
                          </a>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getShareLinks().copy);
                              setShowShare(false);
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

            {/* Category */}
            {post.category && (
              <div className="inline-block px-3 py-1 bg-violet-900/30 text-violet-300 rounded-full text-xs font-medium mb-3 border border-violet-800/50">
                {post.category}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <h2 className="text-xl text-gray-300 mb-6">
                {post.subtitle}
              </h2>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content - using ReactMarkdown to render markdown */}
            <div className="prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex gap-6 text-sm text-gray-400">
              <span>👁️ {post.views} views</span>
              <span>❤️ {post.likes} likes</span>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}