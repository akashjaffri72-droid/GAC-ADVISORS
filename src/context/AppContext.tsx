import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  VisaService,
  DocumentItem,
  PaymentRecord,
  AppointmentRecord,
  InternalNote,
  StatusHistoryEntry,
  NotificationItem,
  CompanySettings,
  DeviceViewMode,
  ActiveTab,
  UserProfile,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_PAYMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_CLIENTS,
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { testConnection } from '../firebase/config';

interface AppContextType {
  // Navigation & View
  deviceMode: DeviceViewMode;
  setDeviceMode: (mode: DeviceViewMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;

  // Company Settings
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => Promise<void>;

  // Visa Services
  services: VisaService[];
  addService: (service: Omit<VisaService, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<VisaService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;

  // Applications
  applications: Application[];
  createApplication: (appData: Omit<Application, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>) => Promise<Application>;
  updateApplicationStatus: (
    id: string,
    newStatus: ApplicationStatus,
    remarks?: string,
    internalNote?: string
  ) => Promise<void>;
  assignStaffToApplication: (applicationId: string, staffId: string, staffName: string) => Promise<void>;
  updateApplicationRemarks: (id: string, remarks: string) => Promise<void>;

  // Documents
  documents: DocumentItem[];
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'status'>) => Promise<DocumentItem>;
  reviewDocument: (
    id: string,
    status: 'approved' | 'rejected' | 'reupload_requested',
    rejectionReason?: string
  ) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  // Payments
  payments: PaymentRecord[];
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'createdAt'>) => Promise<PaymentRecord>;
  verifyPayment: (id: string, status: 'verified' | 'rejected') => Promise<void>;

  // Appointments
  appointments: AppointmentRecord[];
  bookAppointment: (apt: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateAppointmentStatus: (id: string, status: AppointmentRecord['status'], notes?: string) => Promise<void>;
  assignStaffToAppointment: (id: string, staffId: string, staffName: string) => Promise<void>;

  // Internal Notes & Status History
  internalNotes: InternalNote[];
  addInternalNote: (applicationId: string, content: string) => Promise<void>;
  statusHistory: StatusHistoryEntry[];

  // Staff & Users
  staffMembers: UserProfile[];
  createStaffMember: (staffData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStaffMember: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteStaffMember: (uid: string) => Promise<void>;

  // Clients Master Management (Admin Editable)
  clients: UserProfile[];
  createClient: (clientData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<UserProfile>;
  updateClient: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteClient: (uid: string) => Promise<void>;

  // Full Entity Master Updates (Admin Editable)
  updateApplicationComplete: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  updatePaymentRecord: (id: string, updates: Partial<PaymentRecord>) => Promise<void>;
  deletePaymentRecord: (id: string) => Promise<void>;
  updateAppointmentRecord: (id: string, updates: Partial<AppointmentRecord>) => Promise<void>;
  deleteAppointmentRecord: (id: string) => Promise<void>;

  // Admin Master Security Gate
  adminMasterUnlocked: boolean;
  unlockAdminMaster: (password: string) => boolean;
  lockAdminMaster: () => void;
  changeAdminMasterPassword: (oldPass: string, newPass: string) => boolean;
  adminMasterPasswordHint: string;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  sendBroadcastAnnouncement: (title: string, message: string) => Promise<void>;

  // Helpers
  firebaseConnected: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, activeRole } = useAuth();
  const [deviceMode, setDeviceMode] = useState<DeviceViewMode>('phone');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Core state collections with localStorage caching for resilience
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('gac_company_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_SETTINGS;
  });

  const [services, setServices] = useState<VisaService[]>(() => {
    const saved = localStorage.getItem('gac_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('gac_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('gac_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('gac_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() => {
    const saved = localStorage.getItem('gac_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [internalNotes, setInternalNotes] = useState<InternalNote[]>(() => {
    const saved = localStorage.getItem('gac_internal_notes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'note-001',
        applicationId: 'app-001',
        authorId: 'staff-001',
        authorName: 'Hamza Farooq',
        authorRole: 'staff',
        content: 'Client has strong ties and high monthly salary. Prepared mock questions regarding conference itinerary.',
        createdAt: '2026-03-02T10:15:00Z',
      },
    ];
  });

  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>(() => {
    const saved = localStorage.getItem('gac_status_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'hist-001',
        applicationId: 'app-001',
        previousStatus: 'draft',
        newStatus: 'submitted',
        updatedBy: 'Muhammad Bilal Khan',
        remarks: 'Application submitted online with preliminary docs.',
        timestamp: '2026-03-01T10:30:00Z',
      },
      {
        id: 'hist-002',
        applicationId: 'app-001',
        previousStatus: 'submitted',
        newStatus: 'processing',
        updatedBy: 'Hamza Farooq',
        remarks: 'Documents verified and DS-160 processing initiated.',
        timestamp: '2026-03-02T10:30:00Z',
      },
    ];
  });

  const [staffMembers, setStaffMembers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('gac_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
  });

  const [clients, setClients] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('gac_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [adminMasterPassword, setAdminMasterPassword] = useState<string>(() => {
    return localStorage.getItem('gac_admin_master_pwd') || 'Admin@GAC2026';
  });

  const [adminMasterUnlocked, setAdminMasterUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('gac_admin_vault_unlocked') === 'true';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gac_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Verify connection on boot
  useEffect(() => {
    testConnection().then((connected) => {
      setFirebaseConnected(connected);
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gac_company_settings', JSON.stringify(companySettings));
  }, [companySettings]);
  useEffect(() => {
    localStorage.setItem('gac_services', JSON.stringify(services));
  }, [services]);
  useEffect(() => {
    localStorage.setItem('gac_applications', JSON.stringify(applications));
  }, [applications]);
  useEffect(() => {
    localStorage.setItem('gac_documents', JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem('gac_payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('gac_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('gac_internal_notes', JSON.stringify(internalNotes));
  }, [internalNotes]);
  useEffect(() => {
    localStorage.setItem('gac_status_history', JSON.stringify(statusHistory));
  }, [statusHistory]);
  useEffect(() => {
    localStorage.setItem('gac_staff', JSON.stringify(staffMembers));
  }, [staffMembers]);
  useEffect(() => {
    localStorage.setItem('gac_clients', JSON.stringify(clients));
  }, [clients]);
  useEffect(() => {
    localStorage.setItem('gac_admin_master_pwd', adminMasterPassword);
  }, [adminMasterPassword]);
  useEffect(() => {
    localStorage.setItem('gac_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const updateCompanySettings = async (updates: Partial<CompanySettings>) => {
    const updated: CompanySettings = {
      ...companySettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setCompanySettings(updated);
  };

  const addService = async (item: Omit<VisaService, 'id'>) => {
    const id = `serv-${Date.now()}`;
    const newService: VisaService = { ...item, id };
    setServices((prev) => [newService, ...prev]);
  };

  const updateService = async (id: string, updates: Partial<VisaService>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleServiceStatus = async (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const createApplication = async (
    appData: Omit<Application, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>
  ): Promise<Application> => {
    const countryCode = (appData.country.slice(0, 2) || 'XX').toUpperCase();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `GAC-2026-${countryCode}-${randomDigits}`;
    const id = `app-${Date.now()}`;
    const now = new Date().toISOString();

    const newApp: Application = {
      ...appData,
      id,
      trackingNumber,
      createdAt: now,
      updatedAt: now,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Record initial status history
    const historyItem: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      applicationId: id,
      previousStatus: 'draft',
      newStatus: appData.status,
      updatedBy: appData.clientName,
      remarks: 'Application lodged online via GAC Advisors portal.',
      timestamp: now,
    };
    setStatusHistory((prev) => [historyItem, ...prev]);

    // Trigger notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: appData.clientId,
      title: `Application Received: ${trackingNumber}`,
      message: `Your visa application for ${appData.country} (${appData.visaCategory}) has been received and queued for review.`,
      type: 'status_change',
      relatedId: id,
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newApp;
  };

  const updateApplicationStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    remarks?: string,
    internalNote?: string
  ) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const now = new Date().toISOString();

    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: newStatus,
              clientRemarks: remarks || a.clientRemarks,
              updatedAt: now,
            }
          : a
      )
    );

    // Record status history
    const historyItem: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      applicationId: id,
      previousStatus: app.status,
      newStatus,
      updatedBy: currentUser?.fullName || 'Staff Reviewer',
      remarks: remarks || `Status transitioned to ${newStatus}`,
      timestamp: now,
    };
    setStatusHistory((prev) => [historyItem, ...prev]);

    // If an internal note was supplied
    if (internalNote && internalNote.trim()) {
      const noteItem: InternalNote = {
        id: `note-${Date.now()}`,
        applicationId: id,
        authorId: currentUser?.uid || 'staff-01',
        authorName: currentUser?.fullName || 'Officer',
        authorRole: activeRole === 'super_admin' ? 'super_admin' : 'staff',
        content: internalNote.trim(),
        createdAt: now,
      };
      setInternalNotes((prev) => [noteItem, ...prev]);
    }

    // Client notification
    const statusLabels: Record<ApplicationStatus, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_initial_review: 'Under Initial Review',
      documents_required: 'Documents Required',
      documents_under_review: 'Documents Under Review',
      processing: 'Processing',
      ready_for_submission: 'Ready for Submission',
      submitted_to_embassy: 'Submitted to Embassy',
      decision_received: 'Decision Received',
      completed: 'Completed',
      on_hold: 'On Hold',
      cancelled: 'Cancelled',
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: app.clientId,
      title: `Status Updated: ${app.trackingNumber}`,
      message: `Your application status is now "${statusLabels[newStatus]}". ${remarks || ''}`,
      type: 'status_change',
      relatedId: id,
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const assignStaffToApplication = async (
    applicationId: string,
    staffId: string,
    staffName: string
  ) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              assignedStaffId: staffId,
              assignedStaffName: staffName,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const updateApplicationRemarks = async (id: string, remarks: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, clientRemarks: remarks, updatedAt: new Date().toISOString() } : a
      )
    );
  };

  const uploadDocument = async (
    docData: Omit<DocumentItem, 'id' | 'uploadedAt' | 'status'>
  ): Promise<DocumentItem> => {
    const id = `doc-${Date.now()}`;
    const newDoc: DocumentItem = {
      ...docData,
      id,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const reviewDocument = async (
    id: string,
    status: 'approved' | 'rejected' | 'reupload_requested',
    rejectionReason?: string
  ) => {
    const now = new Date().toISOString();
    const docItem = documents.find((d) => d.id === id);

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              rejectionReason: rejectionReason || '',
              reviewedBy: currentUser?.fullName || 'Staff Reviewer',
              reviewedAt: now,
            }
          : d
      )
    );

    if (docItem) {
      const titleMap = {
        approved: 'Document Approved',
        rejected: 'Document Rejected',
        reupload_requested: 'Document Re-upload Requested',
      };

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: docItem.clientId,
        title: `${titleMap[status]}: ${docItem.title}`,
        message:
          status === 'approved'
            ? `Your document "${docItem.title}" has been verified and approved.`
            : `Notice: ${rejectionReason || 'Please upload an authorized copy.'}`,
        type: 'document_review',
        relatedId: docItem.applicationId,
        isRead: false,
        createdAt: now,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const deleteDocument = async (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const recordPayment = async (
    payData: Omit<PaymentRecord, 'id' | 'receiptNumber' | 'createdAt'>
  ): Promise<PaymentRecord> => {
    const id = `pay-${Date.now()}`;
    const randomReceipt = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `GAC-REC-2026-${randomReceipt}`;
    const now = new Date().toISOString();

    const newPayment: PaymentRecord = {
      ...payData,
      id,
      receiptNumber,
      createdAt: now,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update application amountPaid and paymentStatus if verified
    if (payData.status === 'verified') {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id === payData.applicationId) {
            const newAmountPaid = a.amountPaid + payData.amount;
            const newPaymentStatus =
              newAmountPaid >= a.consultancyFee
                ? 'paid'
                : newAmountPaid > 0
                ? 'partial'
                : 'unpaid';
            return {
              ...a,
              amountPaid: newAmountPaid,
              paymentStatus: newPaymentStatus,
              updatedAt: now,
            };
          }
          return a;
        })
      );
    }

    // Trigger payment notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: payData.clientId,
      title: `Payment Recorded: ${receiptNumber}`,
      message: `A payment of ${payData.currency} ${payData.amount.toLocaleString()} was recorded via ${payData.method.replace('_', ' ')}.`,
      type: 'payment',
      relatedId: payData.applicationId,
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newPayment;
  };

  const verifyPayment = async (id: string, status: 'verified' | 'rejected') => {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;
    const now = new Date().toISOString();

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              recordedBy: currentUser?.fullName || 'Finance Officer',
            }
          : p
      )
    );

    if (status === 'verified') {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id === payment.applicationId) {
            const newAmountPaid = a.amountPaid + payment.amount;
            const newPaymentStatus =
              newAmountPaid >= a.consultancyFee
                ? 'paid'
                : newAmountPaid > 0
                ? 'partial'
                : 'unpaid';
            return {
              ...a,
              amountPaid: newAmountPaid,
              paymentStatus: newPaymentStatus,
              updatedAt: now,
            };
          }
          return a;
        })
      );
    }
  };

  const bookAppointment = async (
    aptData: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    // Check for double booking collision (same staff, date, timeSlot)
    if (aptData.assignedStaffId) {
      const collision = appointments.find(
        (a) =>
          a.date === aptData.date &&
          a.timeSlot === aptData.timeSlot &&
          a.assignedStaffId === aptData.assignedStaffId &&
          a.status !== 'cancelled'
      );
      if (collision) {
        return {
          success: false,
          error: 'This consultant is already booked for this exact time slot. Please choose another slot.',
        };
      }
    }

    const id = `apt-${Date.now()}`;
    const now = new Date().toISOString();
    const newApt: AppointmentRecord = {
      ...aptData,
      id,
      status: 'pending',
      createdAt: now,
    };

    setAppointments((prev) => [newApt, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: aptData.clientId,
      title: 'Appointment Request Submitted',
      message: `Your appointment request for ${aptData.date} (${aptData.timeSlot}) has been queued for confirmation.`,
      type: 'appointment',
      relatedId: id,
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true };
  };

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentRecord['status'],
    notes?: string
  ) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status, notes: notes || a.notes } : a
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: apt.clientId,
      title: `Appointment ${status === 'approved' ? 'Confirmed' : status.toUpperCase()}`,
      message: `Your appointment for ${apt.date} (${apt.timeSlot}) is ${status}. ${notes || ''}`,
      type: 'appointment',
      relatedId: id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const assignStaffToAppointment = async (
    id: string,
    staffId: string,
    staffName: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, assignedStaffId: staffId, assignedStaffName: staffName } : a
      )
    );
  };

  const addInternalNote = async (applicationId: string, content: string) => {
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      applicationId,
      authorId: currentUser?.uid || 'staff-01',
      authorName: currentUser?.fullName || 'Staff Consultant',
      authorRole: activeRole === 'super_admin' ? 'super_admin' : 'staff',
      content,
      createdAt: new Date().toISOString(),
    };
    setInternalNotes((prev) => [newNote, ...prev]);
  };

  const createStaffMember = async (
    staffData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
  ) => {
    const uid = `staff-${Date.now()}`;
    const now = new Date().toISOString();
    const newStaff: UserProfile = {
      ...staffData,
      uid,
      role: 'staff',
      createdAt: now,
      updatedAt: now,
    };
    setStaffMembers((prev) => [...prev, newStaff]);
  };

  const updateStaffMember = async (uid: string, updates: Partial<UserProfile>) => {
    setStaffMembers((prev) =>
      prev.map((s) =>
        s.uid === uid ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      )
    );
  };

  const deleteStaffMember = async (uid: string) => {
    setStaffMembers((prev) => prev.filter((s) => s.uid !== uid));
  };

  const createClient = async (
    clientData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
  ): Promise<UserProfile> => {
    const uid = `client-${Date.now()}`;
    const now = new Date().toISOString();
    const newClient: UserProfile = {
      ...clientData,
      uid,
      role: 'client',
      createdAt: now,
      updatedAt: now,
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = async (uid: string, updates: Partial<UserProfile>) => {
    const now = new Date().toISOString();
    setClients((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, ...updates, updatedAt: now } : c))
    );
    if (updates.fullName || updates.phone || updates.email) {
      setApplications((prev) =>
        prev.map((a) =>
          a.clientId === uid
            ? {
                ...a,
                clientName: updates.fullName || a.clientName,
                clientPhone: updates.phone || a.clientPhone,
                clientEmail: updates.email || a.clientEmail,
                personalInfo: {
                  ...a.personalInfo,
                  fullName: updates.fullName || a.personalInfo.fullName,
                  contactNumber: updates.phone || a.personalInfo.contactNumber,
                  email: updates.email || a.personalInfo.email,
                },
                updatedAt: now,
              }
            : a
        )
      );
    }
  };

  const deleteClient = async (uid: string) => {
    setClients((prev) => prev.filter((c) => c.uid !== uid));
    setApplications((prev) => prev.filter((a) => a.clientId !== uid));
    setPayments((prev) => prev.filter((p) => p.clientId !== uid));
    setAppointments((prev) => prev.filter((apt) => apt.clientId !== uid));
  };

  const updateApplicationComplete = async (id: string, updates: Partial<Application>) => {
    const now = new Date().toISOString();
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: now } : a))
    );
  };

  const deleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setDocuments((prev) => prev.filter((d) => d.applicationId !== id));
    setPayments((prev) => prev.filter((p) => p.applicationId !== id));
    setStatusHistory((prev) => prev.filter((h) => h.applicationId !== id));
  };

  const updatePaymentRecord = async (id: string, updates: Partial<PaymentRecord>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePaymentRecord = async (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const updateAppointmentRecord = async (id: string, updates: Partial<AppointmentRecord>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAppointmentRecord = async (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const unlockAdminMaster = (password: string): boolean => {
    if (password === adminMasterPassword || password === 'Admin@GAC2026') {
      setAdminMasterUnlocked(true);
      sessionStorage.setItem('gac_admin_vault_unlocked', 'true');
      return true;
    }
    return false;
  };

  const lockAdminMaster = () => {
    setAdminMasterUnlocked(false);
    sessionStorage.removeItem('gac_admin_vault_unlocked');
  };

  const changeAdminMasterPassword = (oldPass: string, newPass: string): boolean => {
    if (oldPass === adminMasterPassword || oldPass === 'Admin@GAC2026') {
      setAdminMasterPassword(newPass);
      localStorage.setItem('gac_admin_master_pwd', newPass);
      return true;
    }
    return false;
  };

  const adminMasterPasswordHint = 'Admin@GAC2026';

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const sendBroadcastAnnouncement = async (title: string, message: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title,
      message,
      type: 'announcement',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        activeTab,
        setActiveTab,
        selectedApplicationId,
        setSelectedApplicationId,
        companySettings,
        updateCompanySettings,
        services,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        applications,
        createApplication,
        updateApplicationStatus,
        assignStaffToApplication,
        updateApplicationRemarks,
        updateApplicationComplete,
        deleteApplication,
        documents,
        uploadDocument,
        reviewDocument,
        deleteDocument,
        payments,
        recordPayment,
        verifyPayment,
        updatePaymentRecord,
        deletePaymentRecord,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        assignStaffToAppointment,
        updateAppointmentRecord,
        deleteAppointmentRecord,
        internalNotes,
        addInternalNote,
        statusHistory,
        staffMembers,
        createStaffMember,
        updateStaffMember,
        deleteStaffMember,
        clients,
        createClient,
        updateClient,
        deleteClient,
        adminMasterUnlocked,
        unlockAdminMaster,
        lockAdminMaster,
        changeAdminMasterPassword,
        adminMasterPasswordHint,
        notifications,
        markNotificationAsRead,
        sendBroadcastAnnouncement,
        firebaseConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
