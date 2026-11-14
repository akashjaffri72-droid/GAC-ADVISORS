export type UserRole = 'client' | 'staff' | 'super_admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  role: UserRole;
  language: 'en' | 'ur';
  assignedSpecialty?: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_initial_review'
  | 'documents_required'
  | 'documents_under_review'
  | 'processing'
  | 'ready_for_submission'
  | 'submitted_to_embassy'
  | 'decision_received'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
  contactNumber: string;
  email: string;
  residentialAddress: string;
  city: string;
  country: string;
}

export interface TravelInfo {
  purposeOfVisit: string;
  intendedTravelDate: string;
  durationOfStay: string;
  previousTravelHistory: string;
  previousVisaRefusals: string;
  destinationCity?: string;
}

export interface FinancialInfo {
  employmentStatus: 'employed' | 'self_employed' | 'business_owner' | 'student' | 'retired' | 'unemployed';
  employerOrBusinessName: string;
  jobTitleOrProfession: string;
  monthlyIncome: string;
  estimatedBankBalance: string;
  fundingSource: 'self' | 'sponsor' | 'company' | 'other';
  sponsorDetails?: string;
}

export interface VisaService {
  id: string;
  country: string;
  category: string;
  title: string;
  description: string;
  consultancyFee: number;
  currency: string;
  estimatedProcessing: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  importantInstructions: string;
  isActive: boolean;
  flagEmoji?: string;
  popular?: boolean;
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  clientId: string;
  category:
    | 'passport'
    | 'photograph'
    | 'bank_statement'
    | 'employment_letter'
    | 'invitation_letter'
    | 'travel_history'
    | 'accommodation_evidence'
    | 'other';
  title: string;
  fileName: string;
  fileUrl?: string;
  fileData?: string; // Base64 data for client preview & local offline storage
  fileSize: string;
  fileType: string;
  status: 'pending' | 'approved' | 'rejected' | 'reupload_requested';
  rejectionReason?: string;
  reviewedBy?: string;
  uploadedAt: string;
  reviewedAt?: string;
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  trackingNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'cash' | 'online';
  transactionReference: string;
  status: 'pending' | 'verified' | 'rejected';
  receiptNumber: string;
  recordedBy?: string;
  notes?: string;
  paymentProofUrl?: string;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  appointmentType: 'in_person' | 'virtual_video' | 'phone';
  visaCategory: string;
  date: string;
  timeSlot: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
}

export interface InternalNote {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  authorRole: 'staff' | 'super_admin';
  content: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  updatedBy: string;
  remarks: string;
  timestamp: string;
}

export interface Application {
  id: string;
  trackingNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  country: string;
  visaCategory: string;
  serviceId: string;
  status: ApplicationStatus;
  currentStep: number;
  personalInfo: PersonalInfo;
  travelInfo: TravelInfo;
  financialInfo: FinancialInfo;
  clientRemarks?: string;
  consultancyFee: number;
  amountPaid: number;
  currency: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'status_change' | 'document_review' | 'payment' | 'appointment' | 'announcement';
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CompanySettings {
  officeAddress: string;
  pakistanWhatsApp: string;
  uaeWhatsApp: string;
  supportEmail: string;
  workingDays: string;
  workingHours: string;
  consultationDisclaimers: string;
  updatedAt: string;
}

export type DeviceViewMode = 'phone' | 'tablet' | 'desktop';
export type ActiveTab =
  | 'dashboard'
  | 'catalog'
  | 'services'
  | 'apply'
  | 'tracking'
  | 'documents'
  | 'appointments'
  | 'payments'
  | 'staff'
  | 'settings'
  | 'android_code'
  | 'admin_master';
