import React from 'react';
import { X, Bell, CheckCircle2, Clock, FileText, CreditCard, Calendar, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';

interface NotificationsDrawerProps {
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, setActiveTab, setSelectedApplicationId } = useApp();
  const { currentUser, activeRole } = useAuth();

  const visibleNotifications =
    activeRole === 'super_admin'
      ? notifications
      : notifications.filter((n) => n.recipientId === currentUser?.uid || n.recipientId === 'all');

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'status_change':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'document_review':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.relatedId) {
      if (notif.type === 'status_change' || notif.type === 'document_review' || notif.type === 'payment') {
        setSelectedApplicationId(notif.relatedId);
        setActiveTab('tracking');
        onClose();
      } else if (notif.type === 'appointment') {
        setActiveTab('appointments');
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm h-full bg-[#0F1B3B] border-l border-white/10 p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-bold text-white text-base">Notifications Center</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {visibleNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No notifications yet.</p>
            ) : (
              visibleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-[#0A1128]/50 border-white/5 opacity-80'
                      : 'bg-[#16254F] border-[#D4AF37]/30 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-xl bg-white/5 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[9px] text-slate-500 mt-1.5 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Real-time push notifications via Firebase Cloud Messaging
          </p>
        </div>
      </div>
    </div>
  );
};
