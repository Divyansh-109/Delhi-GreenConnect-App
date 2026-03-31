import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CalendarPlus, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import OrganizeEventForm from '../components/forms/OrganizeEventForm';
import ReportDiscoveryForm from '../components/forms/ReportDiscoveryForm';
import dummyEvents from '../data/events.json';

export default function Community() {
  const { currentUser } = useAuth();
  const { subscribeToPosts, addPost } = useFirestore();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const unsub = subscribeToPosts(setPosts);
    return () => unsub();
  }, [subscribeToPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await addPost(newPost);
      setNewPost('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="p-4 sm:p-6 pb-24"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Community Feed</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => setActiveModal('event')}
          className="bg-primary-50 border border-primary-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-primary-700 shadow-sm active:scale-95 transition-transform"
        >
          <CalendarPlus size={24} />
          <span className="text-xs font-bold text-center">Organize<br/>Event</span>
        </button>
        <button 
          onClick={() => setActiveModal('report')}
          className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-amber-700 shadow-sm active:scale-95 transition-transform"
        >
          <MapPin size={24} />
          <span className="text-xs font-bold text-center">Report /<br/>Discover</span>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Upcoming Events</h3>
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          {dummyEvents.map(event => (
            <div key={event.id} className="min-w-[240px] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex-shrink-0">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-1 rounded-md">{event.tag}</span>
                <span className="text-xs font-bold text-slate-400">{event.date}</span>
              </div>
              <h4 className="font-black text-slate-800 leading-tight mb-1">{event.title}</h4>
              <p className="text-xs text-slate-500 mb-2 truncate">{event.location}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CalendarPlus size={12} /> Organized by {event.organizer}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handlePost} className="mb-6 relative flex shadow-sm rounded-full overflow-hidden border border-slate-200">
        <input 
          type="text" 
          placeholder="Share an update with the park..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full pl-5 pr-14 py-3.5 outline-none text-sm text-slate-700 bg-white"
        />
        <button 
          type="submit" 
          disabled={!newPost.trim()}
          className="absolute right-0 top-0 bottom-0 px-5 bg-primary-600 text-white disabled:bg-slate-300 flex items-center justify-center transition-colors"
        >
          <Send size={18} />
        </button>
      </form>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}&bg=22c55e&color=fff`} alt="" className="w-8 h-8 rounded-full shadow-sm" />
              <div>
                <h4 className="font-bold text-sm text-slate-800 leading-tight">{post.authorName}</h4>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  {post.timestamp ? new Date(post.timestamp.toDate()).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{post.text}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center p-8 text-slate-400 flex flex-col items-center">
            <MessageSquare size={32} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">No posts yet. Be the first!</p>
          </div>
        )}
      </div>

      {activeModal === 'event' && <OrganizeEventForm onClose={() => setActiveModal(null)} />}
      {activeModal === 'report' && <ReportDiscoveryForm onClose={() => setActiveModal(null)} />}
    </motion.div>
  );
}
