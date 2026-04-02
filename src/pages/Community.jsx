import React, { useState, useEffect } from 'react';
import { LayoutGrid, List as ListIcon, PlusCircle } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import dummyEvents from '../data/events.json';

export default function Community() {
  const { subscribeToPosts } = useFirestore();
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const unsub = subscribeToPosts(setPosts);
    return () => unsub();
  }, [subscribeToPosts]);

  // Merge dummy events and posts for demonstration
  const records = [...dummyEvents, ...posts.map((p, i) => ({
    id: p.id || `post_${i}`,
    title: p.text.substring(0, 30) + '...',
    name: p.text,
    date: p.timestamp ? new Date(p.timestamp.toDate()).toLocaleDateString() : 'Today',
    location: 'Delhi',
    organizer: p.authorName,
    tag: 'Observation',
    img: `https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400&seed=${p.id}`
  }))];

  return (
    <div className="w-full bg-white min-h-screen py-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-divider pb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-header tracking-tight">Community Records</h2>
            <p className="text-gray-500 mt-1 text-sm font-medium">Browse public observations, events, and reports.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 text-sm font-semibold rounded-sm transition-colors cursor-pointer">
              <PlusCircle size={18} /> New Record
            </button>
            
            <div className="flex bg-gray-100 p-1 border border-divider rounded-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600 border border-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-all`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600 border border-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-all`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {records.map((rec) => (
              <div key={rec.id} className="ibis-card flex flex-col group cursor-pointer hover:border-primary-500 transition-colors">
                <div className="h-48 w-full bg-slate-100 overflow-hidden border-b border-divider">
                  <img src={rec.img || `https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400&seed=${rec.id}`} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider inline-block">{rec.tag}</span>
                  <h4 className="font-bold text-header text-sm line-clamp-1">{rec.title}</h4>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                    <span className="font-semibold">{rec.organizer}</span>
                    <span>{rec.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-divider rounded-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#1A1A1A] text-white">
                <tr>
                  <th className="p-3 font-semibold text-xs tracking-wider border-b border-gray-700">Type</th>
                  <th className="p-3 font-semibold text-xs tracking-wider border-b border-gray-700">Record Title</th>
                  <th className="p-3 font-semibold text-xs tracking-wider border-b border-gray-700">Contributor</th>
                  <th className="p-3 font-semibold text-xs tracking-wider border-b border-gray-700">Location</th>
                  <th className="p-3 font-semibold text-xs tracking-wider border-b border-gray-700 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => (
                  <tr key={rec.id} className={`border-b border-divider hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                    <td className="p-3">
                      <span className="text-[10px] bg-primary-50 text-primary-600 uppercase font-bold px-2 py-1 rounded-sm border border-primary-100">{rec.tag}</span>
                    </td>
                    <td className="p-3 font-semibold text-header">{rec.title}</td>
                    <td className="p-3 text-slate-600">{rec.organizer}</td>
                    <td className="p-3 text-slate-500">{rec.location}</td>
                    <td className="p-3 text-slate-500 text-right tabular-nums">{rec.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}


