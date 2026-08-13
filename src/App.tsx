import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  Users,
  FileText,
  Database,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut,
  MapPin,
  Phone,
  User,
  Lock,
  UserPlus,
  RefreshCw,
  FileSpreadsheet,
  Share2,
  Check,
  ChevronRight,
  X,
  Smartphone,
  Globe,
  Info,
  Calendar,
  Save,
  Map,
  UserCheck,
  Camera,
  Upload,
  ZoomIn,
  Copy,
  Code,
  ExternalLink,
  Send
} from 'lucide-react';

// --- TYPES ---
interface Student {
  id: string;
  name: string;
  classYear: string;
  status: 'visited' | 'pending' | 'postponed';
  studentPhone?: string;
  studentImage?: string;
  parentName: string;
  parentPhone: string;
  address: string;
  visitNotes: string;
  visitDate: string;
  visitorName: string;
  visitorPhone?: string;
  mapUrl?: string;
}

interface AppUser {
  username: string;
  name: string;
  role: 'teacher' | 'student';
  classYear?: string;
  password?: string;
  phone?: string;
}

// --- HELPER COMPONENTS ---
const StudentPhotoUpload = ({
  imageUrl,
  onImageChange,
  label = 'รูปถ่ายนักเรียน/นักศึกษา 📸'
}: {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  label?: string;
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ไฟล์รูปภาพมีขนาดใหญ่เกินไป (กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const img = new window.Image();
        img.src = result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            onImageChange(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            onImageChange(result);
          }
        };
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#7A7165]">{label}</label>
      <div className="flex items-center gap-3 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E5DFD3]">
        <div className="relative shrink-0 w-16 h-16 rounded-xl border border-[#E5DFD3] bg-[#F9F7F2] overflow-hidden flex items-center justify-center group shadow-xs">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Student Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onImageChange('')}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="ลบรูปภาพ"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Camera className="w-6 h-6 text-stone-400" />
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer px-3 py-1.5 bg-[#8A9A5B] hover:bg-[#7A8A4B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5" /> แนบไฟล์รูปภาพ
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-2.5 py-1.5 bg-white border border-[#E5DFD3] text-[#5A5A40] text-xs font-bold rounded-lg hover:bg-stone-50 transition-colors"
            >
              {showUrlInput ? 'ซ่อน URL' : 'หรือวาง URL รูปภาพ'}
            </button>
          </div>

          {showUrlInput && (
            <input
              type="text"
              value={imageUrl || ''}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="วางลิงก์รูปภาพ เช่น https://..."
              className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none font-mono"
            />
          )}
          <p className="text-[10px] text-stone-400">รองรับไฟล์ JPG, PNG, WEBP (แปลงและย่อขนาดภาพอัตโนมัติ)</p>
        </div>
      </div>
    </div>
  );
};

// --- INITIAL DEFAULTS ---
const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'STD-2569-001',
    name: 'นายสิทธิชัย สุขใจ',
    classYear: 'ปวช.1',
    status: 'visited',
    studentPhone: '082-111-2233',
    studentImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    parentName: 'นายสมคิด สุขใจ',
    parentPhone: '081-234-5678',
    address: '123/4 หมู่ 5 ต.สุเทพ อ.เมือง จ.เชียงใหม่',
    visitNotes: 'ครอบครัวมีความพร้อมและสนับสนุนการเรียนของนักเรียนดีมาก มีอินเทอร์เน็ตใช้งานเรียบร้อย แนะนำทุนความประพฤติดีเพิ่ม',
    visitDate: '2026-07-01',
    visitorName: 'ครูสมศักดิ์ รักชาติ',
    visitorPhone: '081-999-8888',
    mapUrl: 'https://maps.google.com/?q=18.796143,98.953765'
  },
  {
    id: 'STD-2569-042',
    name: 'นางสาวกมลวรรณ มาดี',
    classYear: 'ปวช.1',
    status: 'pending',
    studentPhone: '089-444-5566',
    studentImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    parentName: 'นางสมศรี มาดี',
    parentPhone: '089-876-5432',
    address: '55/2 ถ.ห้วยแก้ว ต.สุเทพ อ.เมือง จ.เชียงใหม่',
    visitNotes: 'ยังไม่ได้เข้าพบนัดหมาย เนื่องจากผู้ปกครองทำงานต่างจังหวัดนัดสัปดาห์หน้า',
    visitDate: '',
    visitorName: '',
    visitorPhone: '',
    mapUrl: ''
  },
  {
    id: 'STD-2569-055',
    name: 'นายธนาวุฒิ ใจธรรม',
    classYear: 'ปวช.3',
    status: 'postponed',
    studentPhone: '093-777-8899',
    studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    parentName: 'นายสุรพล ใจธรรม',
    parentPhone: '085-555-1234',
    address: '99 หมู่ 2 ต.ช้างคลาน อ.เมือง จ.เชียงใหม่',
    visitNotes: 'ผู้ปกครองติดธุระด่วน ขอเลื่อนเข้าเยี่ยมจากวันที่ 5 ก.ค. ไปเป็นสัปดาห์หน้าแทน',
    visitDate: '',
    visitorName: '',
    visitorPhone: '',
    mapUrl: ''
  },
  {
    id: 'STD-2569-012',
    name: 'นางสาวปิยนุช วงศ์สว่าง',
    classYear: 'ปวส.1',
    status: 'visited',
    studentPhone: '081-333-4455',
    studentImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    parentName: 'นางกัลยา วงศ์สว่าง',
    parentPhone: '084-333-8899',
    address: '12 หมู่ 7 ต.ฟ้าฮ่าม อ.เมือง จ.เชียงใหม่',
    visitNotes: 'อาศัยอยู่กับป้า ครอบครัวรายได้น้อย ขาดแคลนอุปกรณ์เรียนอิเล็กทรอนิกส์ ได้ส่งเรื่องขอทุนช่วยเหลือเร่งด่วน',
    visitDate: '2026-07-03',
    visitorName: 'ครูสมศักดิ์ รักชาติ',
    visitorPhone: '081-999-8888',
    mapUrl: 'https://maps.google.com/?q=18.812234,99.014523'
  },
  {
    id: 'STD-2569-088',
    name: 'นายกิตติศักดิ์ แก้วคง',
    classYear: 'ปวส.2',
    status: 'pending',
    studentPhone: '095-888-9900',
    studentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    parentName: 'นายสมชาย แก้วคง',
    parentPhone: '086-111-2222',
    address: '345 ต.ป่าแดด อ.เมือง จ.เชียงใหม่',
    visitNotes: '',
    visitDate: '',
    visitorName: '',
    visitorPhone: '',
    mapUrl: ''
  }
];

export default function App() {
  // --- STATES ---
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('visitsync_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear out old mock demo data so we always rely 100% on fresh Google Sheet database
        if (Array.isArray(parsed) && parsed.some(s => s.id === 'STD-2569-001' || s.name === 'นายสิทธิชัย สุขใจ')) {
          localStorage.removeItem('visitsync_students');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('visitsync_users');
    if (saved) return JSON.parse(saved);
    return [
      { username: 'admin', name: 'คุณครูฝ่ายปกครอง (Admin)', role: 'teacher', password: '44120', phone: '081-999-8888' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('visitsync_curr_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'reports' | 'sheets'>('dashboard');
  const [viewMode, setViewMode] = useState<'web' | 'mobile'>('web'); // Glide App simulator toggle!

  // Auth States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginRole, setLoginRole] = useState<'teacher' | 'student'>('teacher');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Register Form States
  const [regRole, setRegRole] = useState<'teacher' | 'student'>('student');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState('ปวช.1');
  const [regStudentPhone, setRegStudentPhone] = useState('');
  const [regStudentImage, setRegStudentImage] = useState('');
  const [regParent, setRegParent] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regMapUrl, setRegMapUrl] = useState(''); // Support mapUrl registration

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Detail Modal / Drawer & Image Zoom Modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // CRUD Forms
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<Omit<Student, 'id'>>({
    name: '',
    classYear: 'ปวช.1',
    status: 'pending',
    studentPhone: '',
    studentImage: '',
    parentName: '',
    parentPhone: '',
    address: '',
    visitNotes: '',
    visitDate: '',
    visitorName: '',
    visitorPhone: '',
    mapUrl: ''
  });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Student Dashboard Editing Form (For logged in Student)
  const [studentEditMode, setStudentEditMode] = useState(false);
  const [studentFormState, setStudentFormState] = useState({
    studentPhone: '',
    studentImage: '',
    parentName: '',
    parentPhone: '',
    address: '',
    mapUrl: ''
  });

  // Google Sheets state
  const TARGET_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ZWvV2QBmnNzzrIyzUK-x6FkU6TtXhfmtRLzelzuO_NA/edit?usp=sharing';

  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('visitsync_sheet_url') || TARGET_SHEET_URL;
  });
  const [appScriptUrl, setAppScriptUrl] = useState(() => {
    return localStorage.getItem('visitsync_appscript_url') || '';
  });
  const [isSavingToSheet, setIsSavingToSheet] = useState(false);
  const [copyScriptSuccess, setCopyScriptSuccess] = useState(false);
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('visitsync_last_sync_time') || '';
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  // --- LOGIC: SAVE TO GOOGLE SHEETS VIA APPS SCRIPT ---
  const handleSaveToAppScript = async (studentsData?: Student[]) => {
    const listToSave = studentsData || students;
    const targetScriptUrl = appScriptUrl.trim();
    if (!targetScriptUrl) {
      setSyncStatus('error');
      setSyncMessage('กรุณากรอก Web App URL ของ Google Apps Script ก่อนดำเนินการบันทึกข้อมูล');
      return false;
    }

    setIsSavingToSheet(true);
    setSyncStatus('syncing');
    setSyncMessage('กำลังส่งและบันทึกข้อมูลนักเรียนและครูผู้เยี่ยมบ้านลง Google Sheets ผ่าน Apps Script...');

    try {
      const response = await fetch('/api/appscript-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appScriptUrl: targetScriptUrl,
          students: listToSave,
          teachers: users.filter(u => u.role === 'teacher'),
          action: 'sync_all'
        })
      });

      const resData = await response.json();
      if (!response.ok || resData.error) {
        throw new Error(resData.error || 'เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Google Apps Script');
      }

      setSyncStatus('success');
      setSyncMessage(`บันทึกข้อมูลนักเรียนทั้งหมด ${listToSave.length} รายการลง Google Sheets สำเร็จเรียบร้อย!`);
      setSuccessToast('บันทึกลง Google Sheets ผ่าน Apps Script เรียบร้อย!');
      return true;
    } catch (err: any) {
      console.error('AppsScript save failed:', err);
      setSyncStatus('error');
      setSyncMessage(`ไม่สามารถบันทึกข้อมูลได้: ${err.message || 'โปรดตรวจสอบ Web App URL'}`);
      return false;
    } finally {
      setIsSavingToSheet(false);
    }
  };

  const handleRegisterTeacherToSheet = async (teacher: AppUser) => {
    const targetScriptUrl = appScriptUrl.trim();
    if (!targetScriptUrl) return;
    try {
      await fetch('/api/appscript-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appScriptUrl: targetScriptUrl,
          action: 'register_teacher',
          targetSheet: 'ครูผู้เยี่ยมบ้าน',
          teacher
        })
      });
      console.log('Saved teacher to Google Sheet "ครูผู้เยี่ยมบ้าน" successfully');
    } catch (err) {
      console.error('Failed to save teacher to Google Sheet:', err);
    }
  };

  const handleRegisterStudentToSheet = async (student: Student) => {
    const targetScriptUrl = appScriptUrl.trim();
    if (!targetScriptUrl) return;
    try {
      await fetch('/api/appscript-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appScriptUrl: targetScriptUrl,
          action: 'register_student',
          targetSheet: 'นักเรียน-นักศึกษา',
          student
        })
      });
      console.log('Saved student to Google Sheet "นักเรียน-นักศึกษา" successfully');
    } catch (err) {
      console.error('Failed to save student to Google Sheet:', err);
    }
  };

  // --- LOGIC: GOOGLE SHEET SYNC ---
  const handleSheetSync = async (e?: React.FormEvent, isBackground = false) => {
    if (e) e.preventDefault();
    const currentSheetUrl = sheetUrl.trim() || TARGET_SHEET_URL;

    if (!isBackground) {
      setSyncStatus('syncing');
      setSyncMessage('กำลังดึงข้อมูลและเชื่อมโยงกับ Google Sheets...');
    }

    try {
      // Call server-side proxy API
      const proxyUrl = `/api/sync-sheet?url=${encodeURIComponent(currentSheetUrl)}${appScriptUrl ? `&appscript=${encodeURIComponent(appScriptUrl)}` : ''}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('ไม่สามารถเชื่อมต่อระบบเซิร์ฟเวอร์ proxy ได้');
      }
      
      const data = await response.json();
      let csvText = data.csv;

      if (!csvText && data.data) {
        try {
          const parsed = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          
          // If Apps Script returned teachers array, parse teachers from 'ครูผู้เยี่ยมบ้าน' sheet
          if (parsed.teachers && Array.isArray(parsed.teachers) && parsed.teachers.length > 1) {
            const tRows = parsed.teachers;
            setUsers(prev => {
              const updated = [...prev];
              for (let r = 1; r < tRows.length; r++) {
                const trow = tRows[r];
                if (trow.length >= 3 && trow[0] && trow[2]) {
                  const uName = String(trow[0]).trim();
                  const name = String(trow[1] || uName).trim();
                  const pass = String(trow[2]).trim();
                  const phone = trow[3] ? String(trow[3]).trim() : undefined;
                  const role = trow[4] ? String(trow[4]).trim() : 'teacher';

                  if (uName && !updated.some(u => u.username === uName)) {
                    updated.push({
                      username: uName,
                      name: name,
                      password: pass,
                      role: role === 'student' ? 'student' : 'teacher',
                      phone
                    });
                  }
                }
              }
              return updated;
            });
          }

          if (parsed.students && Array.isArray(parsed.students)) {
            csvText = parsed.students.map((row: any[]) => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
          } else if (parsed.data && Array.isArray(parsed.data)) {
            csvText = parsed.data.map((row: any[]) => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
          }
        } catch {
          csvText = data.data;
        }
      }

      if (!csvText) {
        throw new Error('ไม่พบข้อมูลรูปแบบ CSV จากระบบเซิร์ฟเวอร์');
      }
      
      // Parse CSV
      const rows: string[][] = [];
      let currentRow: string[] = [];
      let inQuotes = false;
      let cell = '';
      
      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          currentRow.push(cell.trim());
          cell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\n' || (char === '\r' && csvText[i+1] === '\n')) {
            currentRow.push(cell.trim());
            if (currentRow.some(c => c !== '')) {
              rows.push(currentRow);
            }
            currentRow = [];
            cell = '';
            if (char === '\r') i++; // Skip next newline
          }
        } else {
          cell += char;
        }
      }
      if (cell || currentRow.length > 0) {
        currentRow.push(cell.trim());
        rows.push(currentRow);
      }

      if (rows.length < 2) {
        throw new Error('ข้อมูลใน Google Sheet ไม่ถูกต้องหรือไม่มีข้อมูลนักเรียน');
      }

      // Dynamic header mapping to support any column arrangement
      const headers = rows[0].map(h => h.toLowerCase().trim());
      
      const findIndex = (keywords: string[]) => {
        return headers.findIndex(h => keywords.some(k => h.includes(k)));
      };

      const idIdx = findIndex(['รหัส', 'id', 'เลขประจำตัว', 'code']);
      const nameIdx = findIndex(['ชื่อ-นามสกุล', 'ชื่อ นามสกุล', 'ชื่อจริง', 'ชื่อ', 'name', 'fullname', 'นักเรียน']);
      const classIdx = findIndex(['ชั้น', 'ห้อง', 'ระดับชั้น', 'class', 'grade', 'level']);
      const statusIdx = findIndex(['สถานะ', 'การเยี่ยม', 'status']);
      const studentPhoneIdx = findIndex(['เบอร์นักเรียน', 'เบอร์นักศึกษา', 'เบอร์โทรนักเรียน', 'เบอร์โทรนักศึกษา', 'เบอร์ส่วนตัว', 'student_phone', 'std_phone']);
      const imageIdx = findIndex(['รูป', 'รูปถ่าย', 'ภาพ', 'image', 'photo', 'avatar', 'pic', 'picture']);
      const parentIdx = findIndex(['ผู้ปกครอง', 'parent']);
      const phoneIdx = findIndex(['เบอร์ผู้ปกครอง', 'เบอร์โทรผู้ปกครอง', 'เบอร์', 'โทร', 'phone', 'mobile', 'tel']);
      const addressIdx = findIndex(['ที่อยู่', 'address']);
      const notesIdx = findIndex(['บันทึก', 'หมายเหตุ', 'รายละเอียด', 'notes', 'comment', 'remark', 'ความเห็น']);
      const dateIdx = findIndex(['วันที่', 'date', 'time', 'timestamp']);
      const visitorIdx = findIndex(['ผู้ตรวจ', 'ผู้เยี่ยม', 'ครู', 'visitor', 'teacher', 'ที่ปรึกษา']);
      const visitorPhoneIdx = findIndex(['เบอร์ครู', 'เบอร์ผู้ตรวจ', 'เบอร์ครูที่ปรึกษา', 'visitor_phone', 'advisor_phone', 'teacher_phone']);
      const mapIdx = findIndex(['แผนที่', 'พิกัด', 'map', 'gps', 'location', 'url']);

      const getValWithFallback = (row: string[], primaryIdx: number, positionalFallbackIdx: number, fallbackValue: string = '') => {
        if (primaryIdx !== -1 && primaryIdx < row.length && row[primaryIdx] !== undefined && row[primaryIdx] !== '') {
          return row[primaryIdx];
        }
        if (positionalFallbackIdx < row.length && row[positionalFallbackIdx] !== undefined && row[positionalFallbackIdx] !== '') {
          return row[positionalFallbackIdx];
        }
        return fallbackValue;
      };

      const parsedStudents: Student[] = [];

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (row.length < 1) continue;

        const id = getValWithFallback(row, idIdx, 0, `STD-GS-${1000 + r}`);
        const name = getValWithFallback(row, nameIdx, 1, '');
        
        // Ignore rows that don't have any name or valid data
        if (!name && !row.some(c => c.trim() !== '')) continue;

        const classYear = getValWithFallback(row, classIdx, 2, 'ปวช.1');
        const rawStatus = getValWithFallback(row, statusIdx, 3, '').toLowerCase();
        
        let status: 'visited' | 'pending' | 'postponed' = 'pending';
        if (rawStatus.includes('เสร็จ') || rawStatus.includes('visit') || rawStatus.includes('สำเร็จ') || rawStatus.includes('เรียบร้อย') || rawStatus.includes('เยี่ยมแล้ว')) {
          status = 'visited';
        } else if (rawStatus.includes('เลื่อน') || rawStatus.includes('postpone')) {
          status = 'postponed';
        }

        parsedStudents.push({
          id,
          name: name || `นักเรียนรายที่ ${r}`,
          classYear,
          status,
          studentPhone: getValWithFallback(row, studentPhoneIdx, 4, ''),
          studentImage: getValWithFallback(row, imageIdx, 5, ''),
          parentName: getValWithFallback(row, parentIdx, 6, ''),
          parentPhone: getValWithFallback(row, phoneIdx, 7, ''),
          address: getValWithFallback(row, addressIdx, 8, ''),
          visitNotes: getValWithFallback(row, notesIdx, 9, ''),
          visitDate: getValWithFallback(row, dateIdx, 10, ''),
          visitorName: getValWithFallback(row, visitorIdx, 11, ''),
          visitorPhone: getValWithFallback(row, visitorPhoneIdx, 12, ''),
          mapUrl: getValWithFallback(row, mapIdx, 13, '')
        });
      }

      setStudents(parsedStudents);
      localStorage.setItem('visitsync_sheet_url', currentSheetUrl);
      
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(timeStr);
      localStorage.setItem('visitsync_last_sync_time', timeStr);

      setSyncStatus('success');
      setSyncMessage(`ดึงข้อมูลและซิงค์สำเร็จ! โหลดข้อมูลนักเรียนทั้งหมด ${parsedStudents.length} รายการ จาก Google Sheets`);
      if (!isBackground) {
        setSuccessToast('ซิงค์ข้อมูล Google Sheets เรียบร้อยแล้ว!');
      }
    } catch (err: any) {
      console.warn('Google Sheets proxy fetch failed:', err);
      if (!isBackground) {
        setSyncStatus('error');
        setSyncMessage(`ไม่สามารถเชื่อมต่อได้: ${err.message || 'ข้อผิดพลาดเครือข่าย'}`);
      }
    }
  };

  // --- REAL-TIME BACKGROUND AUTO-SYNC EFFECT ---
  useEffect(() => {
    // Initial sync
    handleSheetSync(undefined, true);

    // Dynamic real-time sync every 15 seconds
    const interval = setInterval(() => {
      handleSheetSync(undefined, true);
    }, 15000);

    return () => clearInterval(interval);
  }, [sheetUrl]);

  // --- LOGIC: AUTH ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmedUser = loginUser.trim();
    const trimmedPass = loginPass.trim();

    if (!trimmedUser || !trimmedPass) {
      setAuthError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Role Specific Check
    if (loginRole === 'teacher') {
      // Find teacher
      const found = users.find(u => u.username === trimmedUser && u.role === 'teacher');
      if (found) {
        if (found.password === trimmedPass) {
          setCurrentUser(found);
          setSuccessToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณครู!');
          setLoginUser('');
          setLoginPass('');
        } else {
          setAuthError('รหัสผ่านไม่ถูกต้อง');
        }
      } else {
        setAuthError('ไม่พบชื่อผู้ใช้นี้ในระบบคุณครู');
      }
    } else {
      // Student login
      // Students can login using their Student ID as Username, and their registered password
      const foundUser = users.find(u => u.username === trimmedUser && u.role === 'student');
      if (foundUser && foundUser.password === trimmedPass) {
        setCurrentUser(foundUser);
        setSuccessToast(`ยินดีต้อนรับนักเรียน คุณ ${foundUser.name}`);
        setLoginUser('');
        setLoginPass('');
        
        // Populate edit student state
        const originalStudent = students.find(s => s.id === foundUser.username);
        if (originalStudent) {
          setStudentFormState({
            studentPhone: originalStudent.studentPhone || '',
            studentImage: originalStudent.studentImage || '',
            parentName: originalStudent.parentName,
            parentPhone: originalStudent.parentPhone,
            address: originalStudent.address,
            mapUrl: originalStudent.mapUrl || ''
          });
        }
      } else {
        // Let's also check if they are in the Student List, if they haven't set a password they can register first
        const inList = students.find(s => s.id === trimmedUser);
        if (inList) {
          setAuthError('รหัสประจำตัวนี้มีในระบบนักเรียน แต่ยังไม่ได้ลงทะเบียนตั้งรหัสผ่าน กรุณากดปุ่มลงทะเบียนก่อน');
        } else {
          setAuthError('ไม่พบรหัสประจำตัวหรือรหัสผ่านไม่ถูกต้อง');
        }
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const u = regUser.trim();
    const p = regPass.trim();
    const n = regName.trim();

    if (!u || !p || !n) {
      setAuthError('กรุณากรอกช่องข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // Check if user already exists
    if (users.some(usr => usr.username === u)) {
      setAuthError('ชื่อผู้ใช้หรือรหัสนักเรียนนี้ถูกใช้ในการลงทะเบียนแล้ว');
      return;
    }

    if (regRole === 'student') {
      // For student, ensure we create a student profile
      const newStudent: Student = {
        id: u, // Use student ID as user ID
        name: n,
        classYear: regClass,
        status: 'pending',
        studentPhone: regStudentPhone.trim() || 'ยังไม่ได้ระบุ',
        studentImage: regStudentImage.trim(),
        parentName: regParent.trim() || 'ยังไม่ได้ระบุ',
        parentPhone: regPhone.trim() || 'ยังไม่ได้ระบุ',
        address: regAddress.trim() || 'ยังไม่ได้ระบุ',
        visitNotes: '',
        visitDate: '',
        visitorName: '',
        mapUrl: regMapUrl.trim()
      };

      setStudents(prev => [newStudent, ...prev]);
      handleRegisterStudentToSheet(newStudent);
    }

    const newUser: AppUser = {
      username: u,
      name: n,
      role: regRole,
      classYear: regRole === 'student' ? regClass : undefined,
      password: p,
      phone: regRole === 'teacher' ? regPhone.trim() : regStudentPhone.trim() || undefined
    };

    setUsers(prev => [...prev, newUser]);
    if (regRole === 'teacher') {
      handleRegisterTeacherToSheet(newUser);
    }

    setCurrentUser(newUser);
    setSuccessToast('ลงทะเบียนและเข้าสู่ระบบสำเร็จ!');
    
    // Reset register states
    setRegUser('');
    setRegPass('');
    setRegName('');
    setRegStudentPhone('');
    setRegStudentImage('');
    setRegParent('');
    setRegPhone('');
    setRegAddress('');
    setRegMapUrl('');
    setAuthMode('login');

    if (regRole === 'student') {
      setStudentFormState({
        studentPhone: regStudentPhone.trim() || 'ยังไม่ได้ระบุ',
        studentImage: regStudentImage.trim(),
        parentName: regParent.trim() || 'ยังไม่ได้ระบุ',
        parentPhone: regPhone.trim() || 'ยังไม่ได้ระบุ',
        address: regAddress.trim() || 'ยังไม่ได้ระบุ',
        mapUrl: regMapUrl.trim()
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setStudentEditMode(false);
    setSuccessToast('ออกจากระบบเรียบร้อยแล้ว');
  };

  // --- LOGIC: CRUD FOR STUDENTS ---
  const openAddModal = () => {
    setStudentForm({
      name: '',
      classYear: 'ปวช.1',
      status: 'pending',
      studentPhone: '',
      studentImage: '',
      parentName: '',
      parentPhone: '',
      address: '',
      visitNotes: '',
      visitDate: '',
      visitorName: currentUser?.name || 'ครูสมศักดิ์ รักชาติ',
      visitorPhone: currentUser?.phone || '',
      mapUrl: ''
    });
    setIsAddOpen(true);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name) return;

    const newId = `STD-2569-${Math.floor(Math.random() * 900 + 100)}`;
    const newStudent: Student = {
      id: newId,
      ...studentForm
    };

    const updated = [newStudent, ...students];
    setStudents(updated);
    setIsAddOpen(false);
    setSuccessToast('เพิ่มข้อมูลนักเรียนใหม่เรียบร้อย!');

    if (appScriptUrl) {
      handleSaveToAppScript(updated);
    }
  };

  const openEditModal = (std: Student) => {
    setEditingStudentId(std.id);
    setStudentForm({
      name: std.name,
      classYear: std.classYear,
      status: std.status,
      studentPhone: std.studentPhone || '',
      studentImage: std.studentImage || '',
      parentName: std.parentName,
      parentPhone: std.parentPhone,
      address: std.address,
      visitNotes: std.visitNotes,
      visitDate: std.visitDate,
      visitorName: std.visitorName || currentUser?.name || 'ครูสมศักดิ์ รักชาติ',
      visitorPhone: std.visitorPhone || currentUser?.phone || '',
      mapUrl: std.mapUrl || ''
    });
    setIsEditOpen(true);
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;

    const updated = students.map(s => (s.id === editingStudentId ? { ...s, ...studentForm } : s));
    setStudents(updated);
    
    // Update selected student if open
    if (selectedStudent && selectedStudent.id === editingStudentId) {
      setSelectedStudent({ id: editingStudentId, ...studentForm } as Student);
    }

    setIsEditOpen(false);
    setEditingStudentId(null);
    setSuccessToast('อัปเดตข้อมูลการเยี่ยมบ้านเรียบร้อย!');

    if (appScriptUrl) {
      handleSaveToAppScript(updated);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนักเรียนรายนี้?')) {
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
      setSuccessToast('ลบข้อมูลนักเรียนเรียบร้อยแล้ว');

      if (appScriptUrl) {
        handleSaveToAppScript(updated);
      }
    }
  };

  // Student update their own info
  const handleStudentUpdateSelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = students.map(s =>
      s.id === currentUser.username
        ? {
            ...s,
            studentPhone: studentFormState.studentPhone,
            studentImage: studentFormState.studentImage,
            parentName: studentFormState.parentName,
            parentPhone: studentFormState.parentPhone,
            address: studentFormState.address,
            mapUrl: studentFormState.mapUrl
          }
        : s
    );
    setStudents(updated);
    setStudentEditMode(false);
    setSuccessToast('แก้ไขข้อมูลส่วนตัวและที่อยู่สำเร็จ!');

    if (appScriptUrl) {
      handleSaveToAppScript(updated);
    }
  };

  // --- FILTERED DATA ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = selectedClass === 'All' || s.classYear === selectedClass;
      const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;

      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, selectedClass, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const visited = students.filter(s => s.status === 'visited').length;
    const pending = students.filter(s => s.status === 'pending').length;
    const postponed = students.filter(s => s.status === 'postponed').length;
    const percent = total > 0 ? Math.round((visited / total) * 100) : 0;

    return { total, visited, pending, postponed, percent };
  }, [students]);

  // Unique Classes list for filter
  const classesList = useMemo(() => {
    const cls = students.map(s => s.classYear);
    return ['All', ...Array.from(new Set(cls))];
  }, [students]);

  // --- SUB-COMPONENTS & RENDERERS ---
  const renderStatusBadge = (status: 'visited' | 'pending' | 'postponed') => {
    switch (status) {
      case 'visited':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            เยี่ยมแล้ว
          </span>
        );
      case 'postponed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            เลื่อนการนัด
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
            รอดำเนินการ
          </span>
        );
    }
  };

  return (
    <div id="visitsync-app" className="min-h-screen bg-[#FDFBF7] text-[#433D35] flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#8A9A5B] text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-[#7A8A4B] animate-fade-in animate-bounce">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <div>
            <div className="text-sm font-bold">ดำเนินการสำเร็จ</div>
            <div className="text-xs text-stone-100">{successToast}</div>
          </div>
        </div>
      )}

      {/* --- NOT LOGGED IN VIEW --- */}
      {!currentUser ? (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-tr from-[#F2EDE4] via-[#FDFBF7] to-[#E5DFD3]">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-[#E5DFD3] shadow-xl p-8 md:p-10 relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A9A5B]/10 rounded-bl-[5rem]"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#8A9A5B] rounded-2xl flex items-center justify-center text-white shadow-md">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#5A5A40] tracking-tight">VisitSync</h1>
                <p className="text-xs text-[#7A7165]">ระบบติดตามและเยี่ยมบ้านนักเรียน</p>
              </div>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="font-medium">{authError}</span>
              </div>
            )}

            {/* TABS */}
            <div className="flex bg-[#F2EDE4] p-1 rounded-2xl mb-6">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  authMode === 'login' ? 'bg-[#8A9A5B] text-white shadow-sm' : 'text-[#7A7165] hover:text-[#5A5A40]'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  authMode === 'register' ? 'bg-[#8A9A5B] text-white shadow-sm' : 'text-[#7A7165] hover:text-[#5A5A40]'
                }`}
              >
                ลงทะเบียนใหม่
              </button>
            </div>

            {/* REGISTER FORM */}
            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#FDFBF7] border border-[#E5DFD3] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      regRole === 'student' ? 'bg-[#D4A373] text-white' : 'text-[#7A7165]'
                    }`}
                  >
                    นักเรียน/นักศึกษา
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('teacher')}
                    className={`py-1.5 text-xs font-bold rounded-lg ${
                      regRole === 'teacher' ? 'bg-[#5A5A40] text-white' : 'text-[#7A7165]'
                    }`}
                  >
                    ครูผู้เยี่ยมบ้าน
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">
                    {regRole === 'student' ? 'รหัสประจำตัวนักเรียน *' : 'ชื่อผู้ใช้งาน (Username) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={regRole === 'student' ? 'เช่น STD-2569-001' : 'เช่น somchai'}
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">รหัสผ่าน *</label>
                  <input
                    type="password"
                    required
                    placeholder="รหัสผ่านเข้าใช้งาน"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อ-นามสกุลจริง *</label>
                  <input
                    type="text"
                    required
                    placeholder="นาย/นางสาว สุขใจ ดียิ่ง"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                  />
                </div>

                {regRole === 'teacher' && (
                  <div>
                    <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรศัพท์ติดต่อครูที่ปรึกษา</label>
                    <input
                      type="text"
                      placeholder="เช่น 081-999-8888"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                    />
                  </div>
                )}

                {regRole === 'student' && (
                  <>
                    <StudentPhotoUpload
                      imageUrl={regStudentImage}
                      onImageChange={setRegStudentImage}
                      label="รูปถ่ายนักเรียน/นักศึกษา 📸"
                    />

                    <div>
                      <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรศัพท์นักเรียน/นักศึกษา 📱</label>
                      <input
                        type="text"
                        placeholder="เช่น 082-111-2233"
                        value={regStudentPhone}
                        onChange={(e) => setRegStudentPhone(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#7A7165] mb-1">ชั้นปี *</label>
                        <select
                          value={regClass}
                          onChange={(e) => setRegClass(e.target.value)}
                          className="w-full px-3 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                        >
                          <option value="ปวช.1">ปวช.1</option>
                          <option value="ปวช.2">ปวช.2</option>
                          <option value="ปวช.3">ปวช.3</option>
                          <option value="ปวส.1">ปวส.1</option>
                          <option value="ปวส.2">ปวส.2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรผู้ปกครอง</label>
                        <input
                          type="text"
                          placeholder="08X-XXX-XXXX"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อผู้ปกครอง</label>
                      <input
                        type="text"
                        placeholder="นายสมชาย มั่นคง"
                        value={regParent}
                        onChange={(e) => setRegParent(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A7165] mb-1">ที่อยู่อาศัยในปัจจุบัน</label>
                      <textarea
                        rows={2}
                        placeholder="เลขที่ หมู่ ตำบล อำเภอ จังหวัด"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-[#7A7165]">พิกัด/ลิงก์ Google Maps (ล่วงหน้า) 📍</label>
                        <span className="text-[10px] text-[#8A9A5B] font-bold">แนะนำ</span>
                      </div>
                      <input
                        type="text"
                        placeholder="เช่น https://maps.app.goo.gl/... หรือ ละติจูด,ลองจิจูด"
                        value={regMapUrl}
                        onChange={(e) => setRegMapUrl(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F7F2] border border-emerald-200/80 rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none placeholder-emerald-800/40"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8A9A5B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#7A8A4B] transition-colors mt-2"
                >
                  สมัครสมาชิกและเข้าใช้ระบบ
                </button>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#FDFBF7] border border-[#E5DFD3] rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setLoginRole('teacher'); setAuthError(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      loginRole === 'teacher' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-[#7A7165]'
                    }`}
                  >
                    คุณครู / แอดมิน
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginRole('student'); setAuthError(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      loginRole === 'student' ? 'bg-[#D4A373] text-white shadow-sm' : 'text-[#7A7165]'
                    }`}
                  >
                    นักเรียน / ผู้ปกครอง
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">
                    {loginRole === 'teacher' ? 'ชื่อผู้ใช้ (ID = admin)' : 'รหัสนักเรียน (Student ID)'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#7A7165]" />
                    <input
                      type="text"
                      required
                      placeholder={loginRole === 'teacher' ? 'เช่น admin' : 'เช่น STD-2569-001'}
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">
                    รหัสผ่าน {loginRole === 'teacher' ? '(Pass = 44120)' : ''}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#7A7165]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8A9A5B] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#7A8A4B] transition-colors mt-2"
                >
                  เข้าสู่ระบบรักษาความปลอดภัย
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[#E5DFD3] text-center">
              <span className="text-xs text-[#7A7165] block">บัญชีสำหรับผู้ทดสอบระบบ:</span>
              <div className="mt-2 inline-flex gap-2 items-center text-xs bg-[#F2EDE4] px-3.5 py-1.5 rounded-full font-mono font-semibold text-[#5A5A40]">
                <span>ID: admin</span>
                <span className="opacity-40">|</span>
                <span>Pass: 44120</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- LOGGED IN APP VIEW --- */
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* --- SIDEBAR PANEL (DESKTOP) --- */}
          <aside className="hidden md:flex w-72 bg-[#F2EDE4] border-r border-[#E5DFD3] flex-col shrink-0">
            {/* App Branding */}
            <div className="p-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8A9A5B] rounded-xl flex items-center justify-center text-white shadow-sm">
                <Home className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-[#5A5A40]">VisitSync</span>
                <span className="text-[10px] tracking-widest text-[#7A7165] font-semibold uppercase">Glide Edition</span>
              </div>
            </div>

            {/* View Mode Toggle: Interactive mockup utility */}
            <div className="mx-4 mb-6 p-2 bg-[#E5DFD3] rounded-2xl flex gap-1">
              <button
                onClick={() => setViewMode('web')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'web' ? 'bg-white text-[#433D35] shadow-sm' : 'text-[#7A7165] hover:text-[#5A5A40]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Web
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'mobile' ? 'bg-white text-[#433D35] shadow-sm' : 'text-[#7A7165] hover:text-[#5A5A40]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Glide App
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 px-4 space-y-1.5">
              {currentUser.role === 'teacher' ? (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-[#8A9A5B] text-white shadow-md'
                        : 'text-[#7A7165] hover:bg-[#E5DFD3] text-left'
                    }`}
                  >
                    <Home className="w-4.5 h-4.5" />
                    <span>แดชบอร์ดสรุป</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === 'students'
                        ? 'bg-[#8A9A5B] text-white shadow-md'
                        : 'text-[#7A7165] hover:bg-[#E5DFD3] text-left'
                    }`}
                  >
                    <Users className="w-4.5 h-4.5" />
                    <span>รายชื่อนักเรียน ({students.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === 'reports'
                        ? 'bg-[#8A9A5B] text-white shadow-md'
                        : 'text-[#7A7165] hover:bg-[#E5DFD3] text-left'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>รายงานเยี่ยมบ้าน</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('sheets')}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === 'sheets'
                        ? 'bg-[#8A9A5B] text-white shadow-md'
                        : 'text-[#7A7165] hover:bg-[#E5DFD3] text-left'
                    }`}
                  >
                    <FileSpreadsheet className="w-4.5 h-4.5" />
                    <span>ซิงค์ Google Sheets</span>
                  </button>
                </>
              ) : (
                <div className="p-3 bg-white/40 rounded-2xl border border-[#E5DFD3] text-xs space-y-2">
                  <div className="font-bold text-[#5A5A40] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    ยินดีต้อนรับนักเรียน
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    คุณล็อกอินเข้าสู่ระบบในฐานะนักเรียน สามารถอัปเดตข้อมูลที่อยู่แผนที่ และรายละเอียดผู้ปกครองของคุณเพื่อให้คณะครูวางแผนการเดินทางได้อย่างสะดวกสบาย
                  </p>
                </div>
              )}
            </nav>

            {/* Logged in profile area */}
            <div className="m-4 p-4 bg-[#E5DFD3] rounded-2xl border border-[#D8CEBC]">
              <div className="flex items-center gap-3 mb-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
                  {currentUser.name[0]}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-[#433D35] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-[#5A5A40] font-bold">
                    {currentUser.role === 'teacher' ? 'ครูผู้ดูแล / ADMIN' : `นักเรียนชั้น ${currentUser.classYear}`}
                  </span>
                  {currentUser.phone && (
                    <span className="text-[10px] text-stone-600 font-mono mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 shrink-0 text-stone-500" /> {currentUser.phone}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-white text-[#7A7165] hover:text-red-700 text-xs font-bold rounded-xl border border-[#D1C9BC] hover:bg-[#FDFBF7] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                ออกจากระบบ
              </button>
            </div>
          </aside>

          {/* --- MOBILE NAVIGATION --- */}
          <nav className="md:hidden bg-[#F2EDE4] border-b border-[#E5DFD3] px-4 py-3 flex items-center justify-between z-10 sticky top-0 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8A9A5B] rounded-lg flex items-center justify-center text-white font-bold">VS</div>
              <span className="font-bold text-base text-[#5A5A40]">VisitSync</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode(viewMode === 'web' ? 'mobile' : 'web')}
                className="p-2 bg-white/60 border border-[#E5DFD3] rounded-xl text-xs font-bold flex items-center gap-1 text-[#5A5A40]"
                title="สลับโหมด"
              >
                {viewMode === 'web' ? <Smartphone className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{viewMode === 'web' ? 'Glide' : 'Web'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-100"
                title="ออกระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>

          {/* Mobile Bottom Bar for Teacher */}
          {currentUser.role === 'teacher' && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5DFD3] grid grid-cols-4 py-2 px-1 z-30 shadow-lg">
              <button
                onClick={() => { setActiveTab('dashboard'); setViewMode('web'); }}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeTab === 'dashboard' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                }`}
              >
                <Home className="w-4 h-4" /> แดชบอร์ด
              </button>
              <button
                onClick={() => { setActiveTab('students'); setViewMode('web'); }}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeTab === 'students' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                }`}
              >
                <Users className="w-4 h-4" /> นักเรียน
              </button>
              <button
                onClick={() => { setActiveTab('reports'); setViewMode('web'); }}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeTab === 'reports' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                }`}
              >
                <FileText className="w-4 h-4" /> รายงาน
              </button>
              <button
                onClick={() => { setActiveTab('sheets'); setViewMode('web'); }}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeTab === 'sheets' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" /> ซิงค์ชีท
              </button>
            </div>
          )}


          {/* --- MAIN FRAMEWORK CONTAINER --- */}
          <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-y-auto">
            
            {/* --- GLIDE APP SMARTPHONE SIMULATOR WRAPPER --- */}
            {viewMode === 'mobile' ? (
              <div className="flex-1 bg-[#FDFBF7] flex justify-center items-center py-6 md:py-10 px-4">
                <div className="w-[375px] h-[780px] bg-stone-900 rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800 relative flex flex-col">
                  {/* Speaker and Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-2xl flex items-center justify-center z-40">
                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-1"></div>
                  </div>

                  {/* Simulated Mobile Screen */}
                  <div className="flex-1 bg-[#FDFBF7] rounded-[2.2rem] overflow-hidden flex flex-col text-[#433D35] relative">
                    {/* Header */}
                    <div className="bg-[#8A9A5B] text-white pt-8 pb-4 px-5 text-center relative shadow-sm shrink-0">
                      <span className="text-[10px] tracking-widest font-bold uppercase opacity-80 block mb-0.5">VisitSync App</span>
                      <h2 className="font-bold text-base">ระบบเยี่ยมบ้านและติดตาม</h2>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                      {currentUser.role === 'teacher' ? (
                        <>
                          {/* Glide Mobile Teacher View */}
                          <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD3] shadow-sm">
                            <div className="text-[11px] text-[#7A7165] mb-0.5">ภาพรวมการเยี่ยมบ้าน</div>
                            <div className="text-2xl font-bold text-[#5A5A40] flex items-baseline gap-1">
                              {stats.visited} / {stats.total} ราย
                              <span className="text-xs text-[#8A9A5B] font-bold">({stats.percent}%)</span>
                            </div>
                            <div className="w-full bg-[#F2EDE4] h-2 rounded-full mt-2.5 overflow-hidden">
                              <div className="bg-[#8A9A5B] h-full" style={{ width: `${stats.percent}%` }}></div>
                            </div>
                          </div>

                          {/* Quick Student list for Glide App */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                              <h3 className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">รายชื่อนักเรียน</h3>
                              <button
                                onClick={openAddModal}
                                className="text-xs font-bold text-[#8A9A5B] flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> เพิ่ม
                              </button>
                            </div>
                            
                            {/* Simple Mobile search */}
                            <input
                              type="text"
                              placeholder="ค้นหาชื่อ หรือรหัสนักเรียน..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5DFD3] rounded-xl focus:outline-none"
                            />

                            <div className="space-y-2">
                              {filteredStudents.length > 0 ? (
                                filteredStudents.map((std) => (
                                  <div
                                    key={std.id}
                                    onClick={() => setSelectedStudent(std)}
                                    className="bg-white p-3.5 rounded-xl border border-[#E5DFD3] hover:border-[#8A9A5B] cursor-pointer flex items-center justify-between gap-3 shadow-sm transition-all active:scale-[0.98]"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {std.studentImage ? (
                                        <img
                                          src={std.studentImage}
                                          alt={std.name}
                                          className="w-9 h-9 rounded-full object-cover border border-[#E5DFD3] shrink-0"
                                        />
                                      ) : (
                                        <div className="w-9 h-9 rounded-full bg-[#8A9A5B]/15 text-[#8A9A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E5DFD3]">
                                          {std.name[0]}
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <div className="font-bold text-xs text-[#433D35] truncate">{std.name}</div>
                                        <div className="text-[10px] text-[#7A7165] flex items-center gap-1.5 mt-0.5">
                                          <span className="font-mono bg-[#F2EDE4] px-1 rounded text-stone-600">{std.id}</span>
                                          <span>ชั้น {std.classYear}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="shrink-0">
                                      {renderStatusBadge(std.status)}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6 text-xs text-stone-400">ไม่พบข้อมูลนักเรียน</div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {/* Glide Mobile Student View Profile Card */}
                          <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD3] shadow-sm space-y-3">
                            <div className="flex items-center gap-3 border-b border-[#F2EDE4] pb-3">
                              {students.find(s => s.id === currentUser.username)?.studentImage ? (
                                <img
                                  src={students.find(s => s.id === currentUser.username)?.studentImage}
                                  alt={currentUser.name}
                                  onClick={() => setPreviewImageModal(students.find(s => s.id === currentUser.username)?.studentImage || null)}
                                  className="w-11 h-11 rounded-full object-cover border-2 border-[#8A9A5B] shadow-xs cursor-pointer shrink-0 hover:scale-105 transition-transform"
                                  title="คลิกขยายรูป"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                                  {currentUser.name?.[0] || 'S'}
                                </div>
                              )}
                              <div>
                                <h3 className="font-extrabold text-[#433D35] text-sm">{currentUser.name}</h3>
                                <div className="text-[10px] text-[#7A7165] flex items-center gap-1 mt-0.5">
                                  <span className="font-mono bg-[#E5DFD3] px-1 rounded font-bold text-[#5A5A40]">{currentUser.username}</span>
                                  <span>•</span>
                                  <span className="font-bold">นักเรียน/นักศึกษา</span>
                                </div>
                              </div>
                            </div>

                            {/* Advisor Info */}
                            {students.find(s => s.id === currentUser.username)?.visitorName && (
                              <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-[#E5DFD3] flex items-center justify-between text-xs">
                                <div>
                                  <span className="text-[10px] text-[#7A7165] block font-semibold">ครูที่ปรึกษา:</span>
                                  <span className="font-bold text-[#433D35]">
                                    {students.find(s => s.id === currentUser.username)?.visitorName}
                                  </span>
                                </div>
                                {students.find(s => s.id === currentUser.username)?.visitorPhone && (
                                  <a
                                    href={`tel:${students.find(s => s.id === currentUser.username)?.visitorPhone}`}
                                    className="px-2.5 py-1 bg-[#8A9A5B] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#7A8A4B]"
                                  >
                                    📞 {students.find(s => s.id === currentUser.username)?.visitorPhone}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Editable Details Area */}
                          <div className="bg-white p-4 rounded-2xl border border-[#E5DFD3] shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-xs font-bold text-[#5A5A40]">ข้อมูลติดต่อ & ที่อยู่ที่ต้องการให้ครูไปเยี่ยม</h4>
                              <button
                                onClick={() => setStudentEditMode(!studentEditMode)}
                                className="text-xs font-bold text-[#8A9A5B] flex items-center gap-0.5"
                              >
                                <Edit className="w-3.5 h-3.5" /> {studentEditMode ? 'ยกเลิก' : 'แก้ไข'}
                              </button>
                            </div>

                            {studentEditMode ? (
                              <form onSubmit={handleStudentUpdateSelf} className="space-y-3">
                                <StudentPhotoUpload
                                  imageUrl={studentFormState.studentImage}
                                  onImageChange={(url) => setStudentFormState({ ...studentFormState, studentImage: url })}
                                  label="รูปถ่ายส่วนตัวนักเรียน/นักศึกษา 📸"
                                />

                                <div>
                                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">เบอร์โทรศัพท์ส่วนตัวนักเรียน/นักศึกษา 📱</label>
                                  <input
                                    type="text"
                                    value={studentFormState.studentPhone}
                                    onChange={(e) => setStudentFormState({ ...studentFormState, studentPhone: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-lg focus:outline-none"
                                    placeholder="เช่น 082-111-2233"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">ชื่อผู้ปกครอง</label>
                                  <input
                                    type="text"
                                    value={studentFormState.parentName}
                                    onChange={(e) => setStudentFormState({ ...studentFormState, parentName: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-lg focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">เบอร์โทรติดต่อผู้ปกครอง</label>
                                  <input
                                    type="text"
                                    value={studentFormState.parentPhone}
                                    onChange={(e) => setStudentFormState({ ...studentFormState, parentPhone: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-lg focus:outline-none"
                                  />
                                </div>
                                 <div>
                                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">ที่อยู่อาศัย</label>
                                  <textarea
                                    value={studentFormState.address}
                                    onChange={(e) => setStudentFormState({ ...studentFormState, address: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-lg focus:outline-none resize-none"
                                    rows={2}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">พิกัด/ลิงก์ Google Maps ล่วงหน้า 📍</label>
                                  <input
                                    type="text"
                                    value={studentFormState.mapUrl}
                                    onChange={(e) => setStudentFormState({ ...studentFormState, mapUrl: e.target.value })}
                                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-lg focus:outline-none"
                                    placeholder="เช่น ละติจูด,ลองจิจูด หรือลิงก์แผนที่"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="w-full py-2 bg-[#8A9A5B] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#7A8A4B]"
                                >
                                  <Save className="w-3.5 h-3.5" /> บันทึกการแก้ไข
                                </button>
                              </form>
                            ) : (
                              <div className="space-y-2.5 text-xs">
                                <div>
                                  <span className="text-[#7A7165] block text-[10px]">เบอร์โทรศัพท์นักเรียน:</span>
                                  {students.find(s => s.id === currentUser.username)?.studentPhone ? (
                                    <a
                                      href={`tel:${students.find(s => s.id === currentUser.username)?.studentPhone}`}
                                      className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                      📱 {students.find(s => s.id === currentUser.username)?.studentPhone}
                                    </a>
                                  ) : (
                                    <span className="font-bold text-stone-400">ยังไม่ได้ระบุ</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-[#7A7165] block text-[10px]">ชื่อผู้ปกครอง:</span>
                                  <span className="font-bold">
                                    {students.find(s => s.id === currentUser.username)?.parentName || 'ยังไม่ได้ระบุ'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#7A7165] block text-[10px]">เบอร์ติดต่อผู้ปกครอง:</span>
                                  <span className="font-mono font-bold">
                                    {students.find(s => s.id === currentUser.username)?.parentPhone || 'ยังไม่ได้ระบุ'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#7A7165] block text-[10px]">ที่อยู่อาศัยหลัก:</span>
                                  <span className="font-medium leading-relaxed block text-[#433D35] bg-[#F9F7F2] p-2 rounded-lg border border-[#E5DFD3] mt-1">
                                    {students.find(s => s.id === currentUser.username)?.address || 'ยังไม่ได้ระบุ'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[#7A7165] block text-[10px]">พิกัดนำทางล่วงหน้า:</span>
                                  {students.find(s => s.id === currentUser.username)?.mapUrl ? (
                                    <a
                                      href={students.find(s => s.id === currentUser.username)?.mapUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 inline-flex items-center gap-1 mt-1 font-bold"
                                    >
                                      <Map className="w-3 h-3" /> เปิดดูพิกัดแผนที่ 📍
                                    </a>
                                  ) : (
                                    <span className="text-stone-400 text-[11px] italic mt-0.5 block">ไม่ได้กำหนดพิกัด</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom simulated navigation inside Glide simulator */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#F2EDE4] border-t border-[#E5DFD3] grid grid-cols-2 pt-2 pb-5 z-20">
                      <button
                        onClick={() => {
                          if (currentUser.role === 'teacher') setActiveTab('dashboard');
                        }}
                        className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                          activeTab === 'dashboard' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                        }`}
                      >
                        <Home className="w-4 h-4" /> แดชบอร์ด
                      </button>
                      <button
                        onClick={() => {
                          if (currentUser.role === 'teacher') setActiveTab('students');
                        }}
                        className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                          activeTab === 'students' ? 'text-[#8A9A5B]' : 'text-[#7A7165]'
                        }`}
                      >
                        <Users className="w-4 h-4" /> แฟ้มประวัติ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* --- WEB BROWSER/TABLET DESKTOP DASHBOARD --- */
              <div className="flex-1 flex flex-col min-h-0 bg-[#FDFBF7]">
                
                {/* Header Title Bar */}
                <header className="h-20 px-6 md:px-10 border-b border-[#E5DFD3] flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                  <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-[#5A5A40] tracking-tight">
                      {currentUser.role === 'teacher' ? 'ระบบบันทึกการเยี่ยมบ้านนักเรียน' : 'หน้าจัดการและประวัตินักเรียน'}
                    </h1>
                    <p className="text-xs text-[#7A7165] hidden md:block">
                      {currentUser.role === 'teacher' ? 'ข้อมูลสรุป สถิติ และการจัดการบัญชีโรงเรียนเรียลไทม์' : 'ข้อมูลที่อยู่ติดต่อ และประวัติสถานะการเยี่ยมบ้านของท่าน'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {currentUser.role === 'teacher' && (
                      <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 bg-[#8A9A5B] text-white rounded-xl text-xs font-bold hover:bg-[#7A8A4B] transition-shadow shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> เพิ่มข้อมูลนักเรียน
                      </button>
                    )}
                  </div>
                </header>

                {/* Main page router inside WEB VIEW */}
                {currentUser.role === 'student' ? (
                  /* Student View on Web */
                  <div className="p-6 md:p-10 space-y-6 max-w-3xl">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4A373]/5 rounded-bl-[10rem]"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#8A9A5B]/10 flex items-center justify-center text-[#8A9A5B] font-extrabold text-xl shadow-inner">
                            {currentUser.name[0]}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-[#433D35]">{currentUser.name}</h2>
                            <p className="text-xs text-[#7A7165] font-mono mt-0.5">รหัสนักเรียน: {currentUser.username} | ชั้นเรียน: {currentUser.classYear}</p>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] text-[#7A7165] uppercase font-bold tracking-wider mb-1">สถานะปัจจุบัน</div>
                          {renderStatusBadge(
                            students.find(s => s.id === currentUser.username)?.status || 'pending'
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#F2EDE4] pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-[#5A5A40] flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#8A9A5B]" />
                            รายละเอียดที่อยู่และข้อมูลติดต่อ
                          </h3>
                          <button
                            onClick={() => setStudentEditMode(!studentEditMode)}
                            className="px-4 py-1.5 bg-[#F2EDE4] hover:bg-[#E5DFD3] text-[#5A5A40] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            {studentEditMode ? 'ยกเลิก' : 'แก้ไขข้อมูลที่อยู่'}
                          </button>
                        </div>

                        {studentEditMode ? (
                          <form onSubmit={handleStudentUpdateSelf} className="space-y-4 max-w-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อผู้ปกครอง</label>
                                <input
                                  type="text"
                                  value={studentFormState.parentName}
                                  onChange={(e) => setStudentFormState({ ...studentFormState, parentName: e.target.value })}
                                  className="w-full px-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none focus:ring-2 ring-[#8A9A5B]"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรผู้ปกครอง</label>
                                <input
                                  type="text"
                                  value={studentFormState.parentPhone}
                                  onChange={(e) => setStudentFormState({ ...studentFormState, parentPhone: e.target.value })}
                                  className="w-full px-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none focus:ring-2 ring-[#8A9A5B]"
                                  required
                                />
                              </div>
                            </div>
                             <div>
                              <label className="block text-xs font-bold text-[#7A7165] mb-1">ที่อยู่อาศัยปัจจุบัน</label>
                              <textarea
                                value={studentFormState.address}
                                onChange={(e) => setStudentFormState({ ...studentFormState, address: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none focus:ring-2 ring-[#8A9A5B] resize-none"
                                rows={2}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#7A7165] mb-1">พิกัด/ลิงก์ Google Maps (ล่วงหน้า) 📍</label>
                              <input
                                type="text"
                                value={studentFormState.mapUrl}
                                onChange={(e) => setStudentFormState({ ...studentFormState, mapUrl: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none focus:ring-2 ring-[#8A9A5B]"
                                placeholder="เช่น https://maps.app.goo.gl/... หรือ ละติจูด,ลองจิจูด"
                              />
                            </div>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#8A9A5B] hover:bg-[#7A8A4B] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                              <Save className="w-4 h-4" />
                              บันทึกการเปลี่ยนแปลง
                            </button>
                          </form>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#FDFBF7] p-5 rounded-2xl border border-[#E5DFD3]">
                            <div>
                              <span className="text-xs text-[#7A7165] block mb-0.5">ผู้ปกครองหลัก</span>
                              <span className="font-bold text-sm text-[#433D35]">
                                {students.find(s => s.id === currentUser.username)?.parentName || 'ยังไม่ได้ระบุ'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-[#7A7165] block mb-0.5">เบอร์ติดต่อ</span>
                              <span className="font-mono font-bold text-sm text-[#433D35]">
                                {students.find(s => s.id === currentUser.username)?.parentPhone || 'ยังไม่ได้ระบุ'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-[#7A7165] block mb-0.5">ที่อยู่ที่ใช้บันทึกการนำทาง</span>
                              <span className="font-bold text-xs block text-[#433D35] mt-0.5">
                                {students.find(s => s.id === currentUser.username)?.address || 'ยังไม่ได้ระบุ'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-[#7A7165] block mb-0.5">พิกัดแผนที่ล่วงหน้า 📍</span>
                              {students.find(s => s.id === currentUser.username)?.mapUrl ? (
                                <a
                                  href={students.find(s => s.id === currentUser.username)?.mapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 inline-flex items-center gap-1 mt-1 transition-colors"
                                >
                                  <Map className="w-3 h-3" /> เปิดแผนที่
                                </a>
                              ) : (
                                <span className="text-stone-400 text-xs mt-1 block">ยังไม่ได้ใส่ข้อมูล</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Advisor Contact Card */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-md space-y-4">
                      <h3 className="font-bold text-[#5A5A40] flex items-center gap-2 border-b border-[#F2EDE4] pb-3">
                        <UserCheck className="w-5 h-5 text-[#8A9A5B]" />
                        ข้อมูลครูที่ปรึกษา / ครูผู้รับผิดชอบการเยี่ยมบ้าน
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-4 rounded-xl border border-[#E5DFD3]">
                          <div className="w-10 h-10 rounded-full bg-[#D4A373] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {(students.find(s => s.id === currentUser.username)?.visitorName || 'ค')[0]}
                          </div>
                          <div>
                            <span className="text-[#7A7165] block text-[10px]">ชื่อครูที่ปรึกษา</span>
                            <span className="font-bold text-stone-800">
                              {students.find(s => s.id === currentUser.username)?.visitorName || 'ครูสมศักดิ์ รักชาติ'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-4 rounded-xl border border-[#E5DFD3]">
                          <div className="w-10 h-10 rounded-full bg-[#8A9A5B]/10 text-[#8A9A5B] flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[#7A7165] block text-[10px]">เบอร์โทรศัพท์ติดต่อคุณครู</span>
                            {students.find(s => s.id === currentUser.username)?.visitorPhone ? (
                              <a
                                href={`tel:${students.find(s => s.id === currentUser.username)?.visitorPhone}`}
                                className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
                              >
                                {students.find(s => s.id === currentUser.username)?.visitorPhone} 📞
                              </a>
                            ) : (
                              <span className="font-bold text-stone-400">ยังไม่ได้ระบุข้อมูลเบอร์โทร</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Visit Notes for Student */}
                    {students.find(s => s.id === currentUser.username)?.status === 'visited' && (
                      <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 shadow-sm space-y-3">
                        <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> บันทึกความคิดเห็นจากการเยี่ยมบ้านของคุณครู
                        </h4>
                        <p className="text-stone-700 text-xs leading-relaxed italic">
                          "{students.find(s => s.id === currentUser.username)?.visitNotes || 'เรียบร้อย'}"
                        </p>
                        <div className="text-[11px] text-stone-500 text-right font-medium">
                          — บันทึกโดยคุณครู {students.find(s => s.id === currentUser.username)?.visitorName || 'สมศักดิ์ รักชาติ'} เมื่อวันที่ {students.find(s => s.id === currentUser.username)?.visitDate}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Teacher Views on Web Router */
                  <>
                    {/* --- TAB 1: DASHBOARD VIEW --- */}
                    {activeTab === 'dashboard' && (
                      <div className="p-6 md:p-10 space-y-8">
                        {/* Real-time sync alert for Admin Dashboard */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4.5 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
                          <div className="flex items-center gap-2.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <div className="text-xs text-[#5A5A40]">
                              <span className="font-bold text-[#8A9A5B]">ระบบเชื่อมโยงข้อมูลกับ Google Sheets เรียลไทม์ 100%</span> (ดึงข้อมูลอัตโนมัติในเบื้องหลังทุกๆ 15 วินาที)
                            </div>
                          </div>
                          {lastSyncTime && (
                            <div className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                              ดึงข้อมูลล่าสุดเมื่อ: {lastSyncTime} น.
                            </div>
                          )}
                        </div>

                        {/* Stats Rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-white p-6 rounded-[2rem] border border-[#E5DFD3] shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[#7A7165] text-xs font-bold uppercase tracking-wider mb-0.5">จำนวนนักเรียนทั้งหมด</div>
                              <div className="text-4xl font-extrabold text-[#5A5A40]">{stats.total} <span className="text-sm font-normal text-stone-500">ราย</span></div>
                              <div className="mt-1 text-[11px] text-[#8A9A5B] font-bold">ฐานข้อมูลอัปเดตปัจจุบัน</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-[#8A9A5B]/10 flex items-center justify-center text-[#8A9A5B]">
                              <Users className="w-6 h-6" />
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-[2rem] border border-[#E5DFD3] shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <div className="text-[#7A7165] text-xs font-bold uppercase tracking-wider mb-0.5">เยี่ยมบ้านเสร็จสิ้น</div>
                                <div className="text-4xl font-extrabold text-[#5A5A40]">{stats.visited} <span className="text-sm font-normal text-[#7A7165]">ราย</span></div>
                              </div>
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
                                <CheckCircle className="w-6 h-6" />
                              </div>
                            </div>
                            <div className="w-full bg-[#F2EDE4] h-2 rounded-full overflow-hidden mt-3">
                              <div className="bg-[#8A9A5B] h-full transition-all duration-500" style={{ width: `${stats.percent}%` }}></div>
                            </div>
                            <div className="text-[10px] text-[#7A7165] mt-1.5 text-right font-bold">ความคืบหน้า {stats.percent}%</div>
                          </div>

                          <div className="bg-[#D4A373]/5 p-6 rounded-[2rem] border border-[#D4A373]/30 shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[#7A7165] text-xs font-bold uppercase tracking-wider mb-0.5">คงค้างรอดำเนินการ</div>
                              <div className="text-4xl font-extrabold text-[#D4A373]">{stats.pending} <span className="text-sm font-normal text-[#D4A373]">ราย</span></div>
                              <div className="mt-1 text-[11px] text-[#D4A373] font-bold">เร่งประเมินตามปฏิทินการเยี่ยมบ้าน</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/10 flex items-center justify-center text-[#D4A373]">
                              <Clock className="w-6 h-6" />
                            </div>
                          </div>

                          <div className="bg-[#5A5A40]/5 p-6 rounded-[2rem] border border-[#E5DFD3] shadow-sm flex items-center justify-between">
                            <div>
                              <div className="text-[#7A7165] text-xs font-bold uppercase tracking-wider mb-0.5">นัดเลื่อนการเดินทาง</div>
                              <div className="text-4xl font-extrabold text-[#5A5A40]">{stats.postponed} <span className="text-sm font-normal text-stone-500">ราย</span></div>
                              <div className="mt-1 text-[11px] text-[#7A7165] font-bold">กรุณาติดต่อผู้ปกครองใหม่</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-[#7A7165]">
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                          </div>
                        </div>

                        {/* Recent Visit Activity List */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          
                          {/* Left: Quick Charts / Visualization using pure beautiful CSS/HTML */}
                          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-sm space-y-4">
                            <h3 className="font-bold text-[#5A5A40] text-base">สัดส่วนตามชั้นปี (จำแนกรายชั้น)</h3>
                            <div className="space-y-4 pt-2">
                              {['ปวช.1', 'ปวช.2', 'ปวช.3', 'ปวส.1', 'ปวส.2'].map(cls => {
                                const totalInClass = students.filter(s => s.classYear === cls).length;
                                const visitedInClass = students.filter(s => s.classYear === cls && s.status === 'visited').length;
                                const pct = totalInClass > 0 ? Math.round((visitedInClass / totalInClass) * 100) : 0;
                                return (
                                  <div key={cls} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-[#433D35]">
                                      <span>ชั้น {cls}</span>
                                      <span className="text-[#8A9A5B]">{visitedInClass} / {totalInClass} ราย ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-[#F2EDE4] h-2.5 rounded-full overflow-hidden">
                                      <div className="bg-[#8A9A5B] h-full" style={{ width: `${pct}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="pt-4 border-t border-[#F2EDE4] flex items-center gap-2 text-[10px] text-[#7A7165]">
                              <Info className="w-3.5 h-3.5" />
                              <span>เกณฑ์วัดประสิทธิภาพขั้นต่ำของโรงเรียนคือ 100% ภายในภาคเรียนที่ 1</span>
                            </div>
                          </div>

                          {/* Right: recent items */}
                          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-sm space-y-4">
                            <h3 className="font-bold text-[#5A5A40] text-base">บันทึกความคืบหน้าการเยี่ยมบ้านล่าสุด</h3>
                            <div className="divide-y divide-[#F2EDE4] max-h-64 overflow-y-auto">
                              {students.filter(s => s.status === 'visited').map(std => (
                                <div key={std.id} className="py-3.5 flex items-start gap-3 text-xs">
                                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                                    ✓
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-baseline">
                                      <span className="font-bold text-[#433D35]">{std.name} ({std.classYear})</span>
                                      <span className="text-[10px] text-stone-400 font-mono">{std.visitDate}</span>
                                    </div>
                                    <p className="text-[#7A7165] mt-1 truncate">{std.visitNotes || 'เรียบร้อยดี มีความพร้อม'}</p>
                                  </div>
                                </div>
                              ))}
                              {students.filter(s => s.status === 'visited').length === 0 && (
                                <div className="text-center py-10 text-[#7A7165]">ยังไม่มีนักเรียนรายใดที่เยี่ยมบ้านเสร็จสิ้น</div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* --- TAB 2: STUDENT MANAGEMENT DIRECTORY (CRUD) --- */}
                    {activeTab === 'students' && (
                      <div className="p-6 md:p-10 flex-1 flex flex-col min-h-0">
                        <div className="bg-white rounded-[2.5rem] border border-[#E5DFD3] shadow-lg flex flex-col flex-1 min-h-[400px]">
                          {/* Search and Filter Panel */}
                          <div className="p-6 border-b border-[#E5DFD3] bg-[#FDFBF7]/50 rounded-t-[2.5rem] flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <h2 className="font-extrabold text-[#5A5A40] text-lg shrink-0">ทำเนียบรายชื่อนักเรียนนักศึกษา</h2>
                            
                            <div className="w-full lg:w-auto flex flex-wrap gap-2 items-center justify-end">
                              {/* Search text input */}
                              <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#7A7165]" />
                                <input
                                  type="text"
                                  placeholder="ค้นชื่อ รหัส หรือ ผู้ปกครอง..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 bg-[#F2EDE4]/70 border-none rounded-xl text-xs focus:ring-2 ring-[#8A9A5B] focus:outline-none placeholder-stone-500 text-[#433D35]"
                                />
                              </div>

                              {/* Class Filter select */}
                              <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="px-3 py-2 bg-[#F2EDE4]/70 border-none rounded-xl text-xs focus:outline-none text-[#433D35] font-semibold"
                              >
                                <option value="All">ทุกระดับชั้น</option>
                                {classesList.filter(c => c !== 'All').map(c => (
                                  <option key={c} value={c}>ชั้น {c}</option>
                                ))}
                              </select>

                              {/* Status Filter select */}
                              <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 bg-[#F2EDE4]/70 border-none rounded-xl text-xs focus:outline-none text-[#433D35] font-semibold"
                              >
                                <option value="All">ทุกสถานะการเยี่ยม</option>
                                <option value="visited">เยี่ยมบ้านเสร็จสิ้น</option>
                                <option value="pending">รอดำเนินการ</option>
                                <option value="postponed">เลื่อนการนัด</option>
                              </select>
                            </div>
                          </div>

                          {/* Student Table Area */}
                          <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="text-[#7A7165] text-[11px] font-bold uppercase tracking-wider border-b border-[#E5DFD3] bg-stone-50">
                                  <th className="px-6 md:px-8 py-3.5">รหัสประจำตัว</th>
                                  <th className="px-4 py-3.5">ชื่อ-นามสกุล</th>
                                  <th className="px-4 py-3.5">เบอร์โทรนักเรียน</th>
                                  <th className="px-4 py-3.5">ผู้ปกครองหลัก</th>
                                  <th className="px-4 py-3.5">สถานะการเยี่ยม</th>
                                  <th className="px-6 py-3.5 text-right">ดำเนินการ</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs divide-y divide-[#F2EDE4]">
                                {filteredStudents.map((std) => (
                                  <tr key={std.id} className="hover:bg-[#FDFBF7] transition-all group">
                                    <td className="px-6 md:px-8 py-4 font-mono text-[11px] text-stone-500 font-bold">
                                      {std.id}
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center gap-3">
                                        {std.studentImage ? (
                                          <img
                                            src={std.studentImage}
                                            alt={std.name}
                                            onClick={(e) => { e.stopPropagation(); setPreviewImageModal(std.studentImage || null); }}
                                            className="w-10 h-10 rounded-full object-cover border border-[#E5DFD3] shadow-xs cursor-pointer hover:scale-110 transition-transform shrink-0"
                                            title="คลิกขยายรูป"
                                          />
                                        ) : (
                                          <div className="w-10 h-10 rounded-full bg-[#8A9A5B]/15 text-[#8A9A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E5DFD3]">
                                            {std.name[0]}
                                          </div>
                                        )}
                                        <div>
                                          <div
                                            onClick={() => setSelectedStudent(std)}
                                            className="font-bold text-[#433D35] hover:text-[#8A9A5B] cursor-pointer"
                                          >
                                            {std.name}
                                          </div>
                                          <div className="text-[10px] text-stone-500">ชั้น {std.classYear}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4">
                                      {std.studentPhone ? (
                                        <a
                                          href={`tel:${std.studentPhone}`}
                                          className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                                        >
                                          📱 {std.studentPhone}
                                        </a>
                                      ) : (
                                        <span className="text-stone-400 italic text-[11px]">ไม่ได้ระบุ</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="font-semibold text-stone-700">{std.parentName}</div>
                                      <div className="text-[10px] text-stone-500 font-mono">{std.parentPhone}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                      {renderStatusBadge(std.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => setSelectedStudent(std)}
                                          className="p-1.5 hover:bg-[#F2EDE4] rounded-lg text-[#8A9A5B]"
                                          title="ดูบันทึกทั้งหมด"
                                        >
                                          <Info className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => openEditModal(std)}
                                          className="p-1.5 hover:bg-[#F2EDE4] rounded-lg text-amber-600"
                                          title="แก้ไขประวัติ"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteStudent(std.id)}
                                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500"
                                          title="ลบข้อมูลนักเรียน"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#7A7165]">
                                      ไม่พบข้อมูลสอดคล้องกับตัวกรองที่เลือก
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="p-4 border-t border-[#E5DFD3] text-center text-[11px] text-[#7A7165] bg-stone-50/50 rounded-b-[2.5rem]">
                            อ้างอิงข้อมูลสำนักงานทะเบียนนักเรียน ร่วมกับ Google Sheets
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- TAB 3: VISITED REPORTS VIEW --- */}
                    {activeTab === 'reports' && (
                      <div className="p-6 md:p-10 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="font-extrabold text-[#5A5A40] text-lg">รายงานประมวลผลสรุปการเยี่ยมบ้านนักเรียน</h3>
                              <p className="text-xs text-[#7A7165]">เฉพาะรายชื่อนักเรียนที่มีสถานะ "เยี่ยมบ้านเสร็จสิ้น" ในระบบเรียลไทม์</p>
                            </div>
                            <button
                              onClick={() => {
                                const headers = 'ID,Name,Class,StudentPhone,Parent,ParentPhone,Notes,Date,Visitor,VisitorPhone\n';
                                const rows = students
                                  .filter(s => s.status === 'visited')
                                  .map(s => `"${s.id}","${s.name}","${s.classYear}","${s.studentPhone || ''}","${s.parentName}","${s.parentPhone}","${(s.visitNotes || '').replace(/"/g, '""')}","${s.visitDate || ''}","${s.visitorName || ''}","${s.visitorPhone || ''}"`)
                                  .join('\n');
                                const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'VisitSync_Report_Completed.csv';
                                a.click();
                                setSuccessToast('ดาวน์โหลดรายงาน CSV สำเร็จ!');
                              }}
                              className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#7A8A4B] text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                            >
                              <FileSpreadsheet className="w-4 h-4" /> ส่งออกรายงาน CSV
                            </button>
                          </div>

                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {students.filter(s => s.status === 'visited').map(std => (
                              <div key={std.id} className="p-5 bg-[#FDFBF7] border border-[#E5DFD3] rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#433D35]">{std.name}</span>
                                    <span className="font-mono text-[10px] bg-[#E5DFD3] px-2 py-0.5 rounded text-[#5A5A40] font-bold">{std.id}</span>
                                    <span className="text-xs font-bold text-[#8A9A5B]">({std.classYear})</span>
                                  </div>
                                  <div className="text-xs text-stone-600 leading-relaxed">
                                    <span className="font-bold text-[#7A7165]">ที่อยู่พักอาศัย:</span> {std.address || 'ไม่ระบุที่อยู่'}
                                  </div>
                                  <div className="p-3 bg-white rounded-xl border border-[#E5DFD3] text-xs italic text-[#433D35]">
                                    "{std.visitNotes || 'ไม่มีบันทึกพิเศษ'}"
                                  </div>
                                </div>
                                <div className="md:text-right shrink-0 flex flex-col justify-between text-xs text-stone-500">
                                  <div>
                                    <div className="font-bold text-[#5A5A40] text-[11px]">ผู้ตรวจบันทึก</div>
                                    <div className="font-semibold text-stone-700">{std.visitorName || 'สมศักดิ์ รักชาติ'}</div>
                                  </div>
                                  <div className="mt-2 md:mt-0 text-[10px] text-stone-400 font-mono">
                                    วันที่เยี่ยม: {std.visitDate || 'ไม่มีข้อมูล'}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {students.filter(s => s.status === 'visited').length === 0 && (
                              <div className="text-center py-16 text-stone-400 text-xs">
                                ยังไม่มีการรายงานผลตรวจเยี่ยมบ้านที่สมบูรณ์ในระบบปัจจุบัน
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- TAB 4: GOOGLE SHEETS SETUP SCREEN --- */}
                    {activeTab === 'sheets' && (
                      <div className="p-6 md:p-10 space-y-6 max-w-4xl">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#E5DFD3] shadow-md space-y-6">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                                <FileSpreadsheet className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-extrabold text-[#5A5A40] text-lg">เชื่อมโยงคลังข้อมูลกับ Google Sheets & Apps Script</h3>
                                <p className="text-xs text-[#7A7165]">บันทึกและซิงค์ประวัตินักเรียนพร้อมรูปภาพลงใน Google Sheet ของคุณโดยตรง</p>
                              </div>
                            </div>
                            <a
                              href={sheetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-[#F9F7F2] hover:bg-[#E5DFD3] text-[#5A5A40] border border-[#E5DFD3] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              เปิด Google Sheet
                            </a>
                          </div>

                          {/* Sync status alert */}
                          {syncStatus === 'success' && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div className="font-semibold">{syncMessage}</div>
                            </div>
                          )}
                          {syncStatus === 'error' && (
                            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-3">
                              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                              <div className="font-semibold">{syncMessage}</div>
                            </div>
                          )}

                          {/* PART 1: READ FROM GOOGLE SHEETS */}
                          <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#E5DFD3] space-y-3">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-[#8A9A5B]" />
                              <h4 className="font-bold text-xs text-[#5A5A40]">1. ลิงก์ Google Sheets สำหรับดึงข้อมูล (Read)</h4>
                            </div>
                            <form onSubmit={handleSheetSync} className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="url"
                                placeholder="https://docs.google.com/spreadsheets/d/1ZWvV2QBmnNzzrIyzUK-x6FkU6TtXhfmtRLzelzuO_NA/edit"
                                value={sheetUrl}
                                onChange={(e) => {
                                  setSheetUrl(e.target.value);
                                  localStorage.setItem('visitsync_sheet_url', e.target.value);
                                }}
                                className="flex-1 px-4 py-3 text-xs bg-white border border-[#E5DFD3] rounded-xl focus:ring-2 ring-[#8A9A5B] focus:outline-none"
                              />
                              <button
                                type="submit"
                                disabled={syncStatus === 'syncing'}
                                className="px-5 py-3 bg-[#8A9A5B] hover:bg-[#7A8A4B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow shrink-0 cursor-pointer disabled:opacity-50"
                              >
                                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                                {syncStatus === 'syncing' ? 'กำลังซิงค์...' : 'ดึงข้อมูลทันที'}
                              </button>
                            </form>
                          </div>

                          {/* PART 2: WRITE TO GOOGLE SHEETS VIA APPS SCRIPT */}
                          <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Send className="w-4 h-4 text-emerald-700" />
                                <h4 className="font-bold text-xs text-emerald-900">2. URL ของ Google Apps Script Web App สำหรับบันทึกข้อมูล (Write) *</h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowCodeGuide(!showCodeGuide)}
                                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline cursor-pointer"
                              >
                                <Code className="w-3.5 h-3.5" />
                                {showCodeGuide ? 'ซ่อนคู่มือโค้ด Apps Script' : 'ดูคู่มือ & โค้ด Apps Script'}
                              </button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="url"
                                placeholder="https://script.google.com/macros/s/your-deployment-id/exec"
                                value={appScriptUrl}
                                onChange={(e) => {
                                  setAppScriptUrl(e.target.value);
                                  localStorage.setItem('visitsync_appscript_url', e.target.value);
                                }}
                                className="flex-1 px-4 py-3 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 ring-emerald-500 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveToAppScript()}
                                disabled={isSavingToSheet || !appScriptUrl.trim()}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow shrink-0 cursor-pointer disabled:opacity-50"
                              >
                                {isSavingToSheet ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    กำลังบันทึก...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4" />
                                    บันทึกลง Google Sheets ทันที
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-[11px] text-stone-500 leading-relaxed">
                              * เมื่อกรอก Apps Script URL เรียบร้อยแล้ว ทุกครั้งที่คุณ <strong className="text-stone-700">เพิ่ม/แก้ไข/ลบ</strong> ข้อมูลนักเรียนหรือรูปถ่ายในเว็บ ระบบจะส่งและบันทึกลง Google Sheets ของคุณโดยอัตโนมัติ!
                            </p>
                          </div>

                          {/* APPS SCRIPT CODE & GUIDE MODAL / PANEL */}
                          {showCodeGuide && (
                            <div className="p-5 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 space-y-4 animate-fade-in">
                              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-emerald-400" />
                                  <span className="font-bold text-xs text-white">โค้ด Google Apps Script (พร้อมใช้งาน)</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const codeText = `function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var studentSheet = ss.getSheetByName('นักเรียน-นักศึกษา') || ss.getSheets()[0];
    var studentData = studentSheet ? studentSheet.getDataRange().getValues() : [];
    var teacherSheet = ss.getSheetByName('ครูผู้เยี่ยมบ้าน');
    var teacherData = teacherSheet ? teacherSheet.getDataRange().getValues() : [];
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', students: studentData, teachers: teacherData, data: studentData }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. บันทึกครูผู้เยี่ยมบ้าน -> หน้า 'ครูผู้เยี่ยมบ้าน'
    if (contents.action === 'register_teacher' || contents.targetSheet === 'ครูผู้เยี่ยมบ้าน') {
      var tSheet = ss.getSheetByName('ครูผู้เยี่ยมบ้าน');
      if (!tSheet) {
        tSheet = ss.insertSheet('ครูผู้เยี่ยมบ้าน');
        tSheet.appendRow(['ชื่อผู้ใช้งาน/ไอดี', 'ชื่อ-นามสกุล', 'รหัสผ่าน', 'เบอร์โทรศัพท์', 'บทบาท', 'วันที่ลงทะเบียน']);
      }
      var t = contents.teacher || {};
      tSheet.appendRow([t.username || '', t.name || '', t.password || '', t.phone || '', 'teacher', new Date().toLocaleString('th-TH')]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'บันทึกครูผู้เยี่ยมบ้านเรียบร้อย' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. บันทึกนักเรียน -> หน้า 'นักเรียน-นักศึกษา'
    if (contents.action === 'register_student' || contents.targetSheet === 'นักเรียน-นักศึกษา') {
      var sSheet = ss.getSheetByName('นักเรียน-นักศึกษา');
      if (!sSheet) {
        sSheet = ss.insertSheet('นักเรียน-นักศึกษา');
        sSheet.appendRow(['รหัสประจำตัว', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'สถานะการเยี่ยม', 'เบอร์โทรนักเรียน', 'รูปถ่ายนักเรียน', 'ชื่อผู้ปกครอง', 'เบอร์โทรผู้ปกครอง', 'ที่อยู่', 'บันทึกการเยี่ยมบ้าน', 'วันที่เข้าเยี่ยม', 'ครูที่ปรึกษา', 'เบอร์โทรครู', 'พิกัดแผนที่']);
      }
      var s = contents.student || {};
      var statusText = 'รอดำเนินการ';
      if (s.status === 'visited') statusText = 'เยี่ยมแล้ว';
      else if (s.status === 'postponed') statusText = 'เลื่อนเยี่ยม';
      sSheet.appendRow([s.id || '', s.name || '', s.classYear || '', statusText, s.studentPhone || '', s.studentImage || '', s.parentName || '', s.parentPhone || '', s.address || '', s.visitNotes || '', s.visitDate || '', s.visitorName || '', s.visitorPhone || '', s.mapUrl || '']);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'บันทึกนักเรียนเรียบร้อย' })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. ซิงค์ทั้งหมด (Sync All)
    if (contents.action === 'sync_all' && Array.isArray(contents.students)) {
      var sSheet = ss.getSheetByName('นักเรียน-นักศึกษา');
      if (!sSheet) sSheet = ss.insertSheet('นักเรียน-นักศึกษา');
      sSheet.clearContents();
      sSheet.appendRow(['รหัสประจำตัว', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'สถานะการเยี่ยม', 'เบอร์โทรนักเรียน', 'รูปถ่ายนักเรียน', 'ชื่อผู้ปกครอง', 'เบอร์โทรผู้ปกครอง', 'ที่อยู่', 'บันทึกการเยี่ยมบ้าน', 'วันที่เข้าเยี่ยม', 'ครูที่ปรึกษา', 'เบอร์โทรครู', 'พิกัดแผนที่']);
      contents.students.forEach(function(s) {
        var statusText = 'รอดำเนินการ';
        if (s.status === 'visited') statusText = 'เยี่ยมแล้ว';
        else if (s.status === 'postponed') statusText = 'เลื่อนเยี่ยม';
        sSheet.appendRow([s.id || '', s.name || '', s.classYear || '', statusText, s.studentPhone || '', s.studentImage || '', s.parentName || '', s.parentPhone || '', s.address || '', s.visitNotes || '', s.visitDate || '', s.visitorName || '', s.visitorPhone || '', s.mapUrl || '']);
      });
      if (Array.isArray(contents.teachers)) {
        var tSheet = ss.getSheetByName('ครูผู้เยี่ยมบ้าน');
        if (!tSheet) tSheet = ss.insertSheet('ครูผู้เยี่ยมบ้าน');
        tSheet.clearContents();
        tSheet.appendRow(['ชื่อผู้ใช้งาน/ไอดี', 'ชื่อ-นามสกุล', 'รหัสผ่าน', 'เบอร์โทรศัพท์', 'บทบาท', 'วันที่ลงทะเบียน']);
        contents.teachers.forEach(function(t) {
          tSheet.appendRow([t.username || '', t.name || '', t.password || '', t.phone || '', t.role || 'teacher', new Date().toLocaleString('th-TH')]);
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', count: contents.students.length })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Action ไม่ถูกต้อง' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
                                    navigator.clipboard.writeText(codeText);
                                    setCopyScriptSuccess(true);
                                    setTimeout(() => setCopyScriptSuccess(false), 3000);
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  {copyScriptSuccess ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                                      คัดลอกสำเร็จแล้ว!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      คัดลอกโค้ด Apps Script
                                    </>
                                  )}
                                </button>
                              </div>

                              <ol className="text-xs text-stone-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                                <li>เปิด Google Sheet ของคุณ (<a href={sheetUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{sheetUrl.slice(0, 45)}...</a>)</li>
                                <li>คลิกเมนู <strong className="text-white">ส่วนขยาย (Extensions) &gt; Apps Script</strong></li>
                                <li>ลบโค้ดเดิมทั้งหมด วางโค้ดด้านล่างนี้ลงไป แล้วกด <strong className="text-white">บันทึก (Ctrl+S)</strong></li>
                                <li>คลิกปุ่มปะรำด้านขวาบน <strong className="text-white">ทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้รายการใหม่ (New deployment)</strong></li>
                                <li>เลือกประเภทเฟือง ⚙️ เป็น <strong className="text-white">เว็บแอป (Web app)</strong></li>
                                <li>ตั้งค่า ผู้มีสิทธิ์เข้าถึง (Who has access): เลือก <strong className="text-emerald-400 font-bold">"ทุกคน" (Anyone)</strong></li>
                                <li>กด <strong className="text-white">ทำให้ใช้งานได้ (Deploy)</strong> แล้วคัดลอก <strong className="text-white">URL ของเว็บแอป (Web App URL)</strong> มาวางในช่องด้านบน</li>
                              </ol>

                              <pre className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">
{`function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (contents.action === 'sync_all' && Array.isArray(contents.students)) {
      sheet.clearContents();
      var headers = [
        'รหัสประจำตัว', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'สถานะการเยี่ยม',
        'เบอร์โทรนักเรียน', 'รูปถ่ายนักเรียน', 'ชื่อผู้ปกครอง', 'เบอร์โทรผู้ปกครอง',
        'ที่อยู่', 'บันทึกการเยี่ยมบ้าน', 'วันที่เข้าเยี่ยม', 'ครูที่ปรึกษา',
        'เบอร์โทรครู', 'พิกัดแผนที่'
      ];
      sheet.appendRow(headers);
      
      contents.students.forEach(function(s) {
        var statusText = 'รอดำเนินการ';
        if (s.status === 'visited') statusText = 'เยี่ยมแล้ว';
        else if (s.status === 'postponed') statusText = 'เลื่อนเยี่ยม';

        sheet.appendRow([
          s.id || '',
          s.name || '',
          s.classYear || '',
          statusText,
          s.studentPhone || '',
          s.studentImage || '',
          s.parentName || '',
          s.parentPhone || '',
          s.address || '',
          s.visitNotes || '',
          s.visitDate || '',
          s.visitorName || '',
          s.visitorPhone || '',
          s.mapUrl || ''
        ]);
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', count: contents.students.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Action ไม่ถูกต้อง' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                              </pre>
                            </div>
                          )}

                          {/* Real-time status indicator */}
                          <div className="flex items-center gap-2.5 p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-[#5A5A40]">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <div className="leading-relaxed">
                              <span className="font-bold text-[#8A9A5B]">โหมดติดตามเรียลไทม์ (100% Real-time Sync) กำลังทำงาน:</span> ระบบจะตรวจสอบและซิงค์ข้อมูลใหม่จากแผ่นงานชีทของคุณโดยอัตโนมัติในเบื้องหลังทุกๆ 15 วินาที
                              {lastSyncTime && (
                                <span className="block mt-1 text-[11px] text-emerald-800 font-semibold bg-white/60 border border-emerald-200 px-2.5 py-0.5 rounded-lg w-fit">
                                  เวลาซิงค์ล่าสุด: {lastSyncTime} น.
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      )}


      {/* --- ADD STUDENT DIALOG / MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E5DFD3] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="bg-[#8A9A5B] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <UserPlus className="w-5 h-5" /> เพิ่มนักเรียนเข้ากลุ่มเยี่ยมบ้าน
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <StudentPhotoUpload
                imageUrl={studentForm.studentImage}
                onImageChange={(url) => setStudentForm({ ...studentForm, studentImage: url })}
                label="รูปถ่ายนักเรียน/นักศึกษา 📸"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อ-นามสกุลนักเรียน *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                    placeholder="นายสุขใจ จริงจัง"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชั้นปี/ห้องเรียน *</label>
                  <select
                    value={studentForm.classYear}
                    onChange={(e) => setStudentForm({ ...studentForm, classYear: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  >
                    <option value="ปวช.1">ปวช.1</option>
                    <option value="ปวช.2">ปวช.2</option>
                    <option value="ปวช.3">ปวช.3</option>
                    <option value="ปวส.1">ปวส.1</option>
                    <option value="ปวส.2">ปวส.2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรศัพท์นักเรียน/นักศึกษา 📱</label>
                <input
                  type="text"
                  value={studentForm.studentPhone || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, studentPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  placeholder="เช่น 082-111-2233"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อผู้ปกครอง</label>
                  <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                    placeholder="เช่น นายสนิท จริงจัง"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์ติดต่อผู้ปกครอง</label>
                  <input
                    type="text"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">ที่อยู่นักเรียนโดยสังเขป</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none resize-none"
                  rows={2}
                  placeholder="รายละเอียดตำแหน่งที่อยู่อาศัยเพื่อใช้นำทาง"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">พิกัด/ลิงก์ Google Maps (ล่วงหน้า) 📍</label>
                <input
                  type="text"
                  value={studentForm.mapUrl || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, mapUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-emerald-200 rounded-xl focus:outline-none placeholder-stone-400"
                  placeholder="เช่น https://maps.app.goo.gl/... หรือ ละติจูด,ลองจิจูด"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-[#E5DFD3]">
                <div>
                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">สถานะเยือน</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                  >
                    <option value="pending">รอดำเนินการ</option>
                    <option value="visited">เสร็จสิ้นการเยี่ยม</option>
                    <option value="postponed">เลื่อนการนัด</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">วันที่เข้าเยี่ยม</label>
                  <input
                    type="date"
                    value={studentForm.visitDate}
                    onChange={(e) => setStudentForm({ ...studentForm, visitDate: e.target.value })}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#E5DFD3]">
                <div>
                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">ชื่อครูที่ปรึกษา</label>
                  <input
                    type="text"
                    value={studentForm.visitorName}
                    onChange={(e) => setStudentForm({ ...studentForm, visitorName: e.target.value })}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                    placeholder="เช่น ครูสมศักดิ์"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">เบอร์โทรครูที่ปรึกษา</label>
                  <input
                    type="text"
                    value={studentForm.visitorPhone || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, visitorPhone: e.target.value })}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                    placeholder="เช่น 081-999-8888"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8A9A5B] hover:bg-[#7A8A4B] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                ยืนยันการเพิ่มข้อมูลนักเรียน
              </button>
            </form>
          </div>
        </div>
      )}


      {/* --- EDIT STUDENT DIALOG / MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E5DFD3] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <Edit className="w-5 h-5" /> แก้ไข/บันทึกผลการเยี่ยมบ้านนักเรียน
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStudent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <StudentPhotoUpload
                imageUrl={studentForm.studentImage}
                onImageChange={(url) => setStudentForm({ ...studentForm, studentImage: url })}
                label="รูปถ่ายนักเรียน/นักศึกษา 📸"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อ-นามสกุลนักเรียน *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชั้นปี/ห้องเรียน *</label>
                  <select
                    value={studentForm.classYear}
                    onChange={(e) => setStudentForm({ ...studentForm, classYear: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  >
                    <option value="ปวช.1">ปวช.1</option>
                    <option value="ปวช.2">ปวช.2</option>
                    <option value="ปวช.3">ปวช.3</option>
                    <option value="ปวส.1">ปวส.1</option>
                    <option value="ปวส.2">ปวส.2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์โทรศัพท์นักเรียน/นักศึกษา 📱</label>
                <input
                  type="text"
                  value={studentForm.studentPhone || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, studentPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  placeholder="เช่น 082-111-2233"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">ชื่อผู้ปกครอง</label>
                  <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7A7165] mb-1">เบอร์ติดต่อผู้ปกครอง</label>
                  <input
                    type="text"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">ที่อยู่นักเรียนโดยละเอียด</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-[#E5DFD3] rounded-xl focus:outline-none resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A7165] mb-1">พิกัด/ลิงก์ Google Maps (ล่วงหน้า) 📍</label>
                <input
                  type="text"
                  value={studentForm.mapUrl || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, mapUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[#F9F7F2] border border-emerald-200 rounded-xl focus:outline-none placeholder-stone-400"
                  placeholder="เช่น https://maps.app.goo.gl/... หรือ ละติจูด,ลองจิจูด"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-[#E5DFD3] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">สถานะการเยี่ยม</label>
                    <select
                      value={studentForm.status}
                      onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="visited">เสร็จสิ้นการเยี่ยม</option>
                      <option value="postponed">เลื่อนการนัด</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">วันที่ลงพื้นที่ตรวจ</label>
                    <input
                      type="date"
                      value={studentForm.visitDate}
                      onChange={(e) => setStudentForm({ ...studentForm, visitDate: e.target.value })}
                      className="w-full px-2 py-1 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">บันทึกความคิดเห็นจากการเยี่ยมบ้าน</label>
                  <textarea
                    value={studentForm.visitNotes}
                    onChange={(e) => setStudentForm({ ...studentForm, visitNotes: e.target.value })}
                    className="w-full p-2 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none resize-none"
                    rows={3}
                    placeholder="เช่น สภาพที่อยู่ดีเยี่ยม อาศัยร่วมกับคุณตา ปัญหาค่าพาหนะเดินทางมาเรียน..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">ชื่อครูผู้เยี่ยมบ้าน / ครูที่ปรึกษา</label>
                    <input
                      type="text"
                      value={studentForm.visitorName}
                      onChange={(e) => setStudentForm({ ...studentForm, visitorName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7A7165] mb-0.5">เบอร์โทรครูที่ปรึกษา</label>
                    <input
                      type="text"
                      value={studentForm.visitorPhone || ''}
                      onChange={(e) => setStudentForm({ ...studentForm, visitorPhone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5DFD3] rounded-lg focus:outline-none"
                      placeholder="เช่น 081-999-8888"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4A373] hover:bg-[#c39262] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                บันทึกการแก้ไขข้อมูลนักเรียน
              </button>
            </form>
          </div>
        </div>
      )}


      {/* --- STUDENT DETAIL OVERLAY DRAWER (WEB & SIMULATOR ACCESSED) --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-end z-[90] animate-fade-in">
          <div className="bg-white h-full w-full max-w-md border-l border-[#E5DFD3] shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            <div className="p-6 bg-[#F2EDE4] border-b border-[#E5DFD3] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7A7165] font-mono tracking-wider block font-bold">STUDENT PROFILE</span>
                <h3 className="font-extrabold text-lg text-[#5A5A40] mt-0.5">แฟ้มประวัติเยี่ยมบ้านรายบุคคล</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#7A7165] hover:text-[#433D35] border border-[#E5DFD3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Main Badge Block */}
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#E5DFD3] flex items-center gap-4 relative overflow-hidden">
                {selectedStudent.studentImage ? (
                  <div className="relative group shrink-0">
                    <img
                      src={selectedStudent.studentImage}
                      alt={selectedStudent.name}
                      onClick={() => setPreviewImageModal(selectedStudent.studentImage || null)}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8A9A5B] shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => setPreviewImageModal(selectedStudent.studentImage || null)}
                      className="absolute inset-0 bg-black/40 rounded-2xl text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="ขยายรูป"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#8A9A5B] text-white flex items-center justify-center font-extrabold text-xl shadow shrink-0">
                    {selectedStudent.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-[#433D35] text-base">{selectedStudent.name}</h4>
                  <div className="text-[11px] text-[#7A7165] flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="font-mono bg-[#E5DFD3] px-1.5 py-0.5 rounded text-xs font-bold text-[#5A5A40]">{selectedStudent.id}</span>
                    <span>•</span>
                    <span className="font-bold">ชั้น {selectedStudent.classYear}</span>
                  </div>
                  {selectedStudent.studentImage && (
                    <button
                      onClick={() => setPreviewImageModal(selectedStudent.studentImage || null)}
                      className="mt-1.5 text-[10px] text-[#8A9A5B] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <ZoomIn className="w-3 h-3" /> คลิกขยายรูปถ่ายนักเรียน
                    </button>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#7A7165] block uppercase tracking-wider">สถานะดำเนินงาน</span>
                <div className="inline-block">{renderStatusBadge(selectedStudent.status)}</div>
              </div>

              {/* Family & Student Contacts */}
              <div className="bg-white p-4.5 rounded-2xl border border-[#E5DFD3] space-y-3.5">
                <h5 className="font-bold text-xs text-[#5A5A40] border-b border-[#F2EDE4] pb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#8A9A5B]" /> ข้อมูลติดต่อและครอบครัว
                </h5>
                
                {/* Student Phone Badge & Quick Call */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block">เบอร์โทรศัพท์นักเรียน/นักศึกษา</span>
                    <span className="font-mono font-extrabold text-sm text-emerald-950">
                      {selectedStudent.studentPhone || 'ยังไม่ได้ระบุ'}
                    </span>
                  </div>
                  {selectedStudent.studentPhone && (
                    <a
                      href={`tel:${selectedStudent.studentPhone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> โทรหานักเรียน
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-stone-400 text-[10px] block">ชื่อผู้ปกครองหลัก</span>
                    <span className="font-bold text-[#433D35]">{selectedStudent.parentName || 'ไม่ได้ระบุ'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">เบอร์โทรผู้ปกครอง</span>
                    {selectedStudent.parentPhone ? (
                      <a href={`tel:${selectedStudent.parentPhone}`} className="font-mono font-bold text-[#8A9A5B] hover:underline block">
                        📞 {selectedStudent.parentPhone}
                      </a>
                    ) : (
                      <span className="font-mono font-bold text-stone-400">ไม่ได้ระบุ</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-stone-400 text-xs block mb-1">ที่อยู่อาศัย / แผนที่นำทาง</span>
                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E5DFD3] text-xs leading-relaxed text-[#433D35] font-medium">
                    {selectedStudent.address || 'ไม่มีระบุที่อยู่'}
                  </div>
                </div>
              </div>

              {/* Teacher Notes Block */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-[#E5DFD3] space-y-3.5">
                <h5 className="font-bold text-xs text-[#5A5A40] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#8A9A5B]" /> ผลการตรวจเยี่ยมและบันทึกเพิ่มเติม
                </h5>
                {selectedStudent.status === 'visited' ? (
                  <div className="bg-white p-4 rounded-xl border border-[#E5DFD3] text-xs italic text-[#433D35] leading-relaxed">
                    "{selectedStudent.visitNotes || 'เยี่ยมบ้านสำเร็จเรียบร้อย มีสภาพความพร้อมดี'}"
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-400 text-xs bg-white rounded-xl border border-dashed border-[#E5DFD3]">
                    ยังไม่มีความคืบหน้าการลงพื้นที่ตรวจเยี่ยมบ้าน
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#7A7165] pt-3 border-t border-dashed border-[#E5DFD3]">
                  <div>
                    <strong>ครูที่ปรึกษา:</strong> {selectedStudent.visitorName || 'ไม่ระบุ'}
                  </div>
                  <div className="text-right">
                    <strong>เบอร์โทรครู:</strong> {selectedStudent.visitorPhone || 'ไม่ระบุ'}
                  </div>
                  {selectedStudent.status === 'visited' && (
                    <div className="col-span-2 mt-1 text-right text-stone-400">
                      <strong>วันที่เยี่ยม:</strong> {selectedStudent.visitDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Google Maps Shortcuts */}
              <div className="space-y-2">
                {selectedStudent.mapUrl ? (
                  <a
                    href={selectedStudent.mapUrl.startsWith('http') ? selectedStudent.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStudent.mapUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md animate-pulse-subtle"
                  >
                    <Map className="w-4 h-4" /> 📍 เปิดพิกัดนำทางล่วงหน้าที่ระบุไว้
                  </a>
                ) : (
                  <div className="text-center py-2.5 px-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-center gap-1">
                    <span>⚠️ ยังไม่ได้ระบุพิกัดล่วงหน้า ครูสามารถกด "แก้ไข" เพื่อระบุพิกัดได้</span>
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStudent.address || selectedStudent.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#E5DFD3] hover:bg-[#D8CEBC] text-[#5A5A40] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm border border-[#CFC5B4]"
                >
                  <Map className="w-4 h-4" /> ค้นหาตำแหน่งและเส้นทางด้วยที่อยู่นักเรียน
                </a>
              </div>
            </div>

            {/* Actions for teacher */}
            {currentUser.role === 'teacher' && (
              <div className="p-4 bg-stone-100 border-t border-[#E5DFD3] grid grid-cols-2 gap-3 shrink-0">
                <button
                  onClick={() => {
                    openEditModal(selectedStudent);
                  }}
                  className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Edit className="w-3.5 h-3.5" /> บันทึกการเยี่ยม
                </button>
                <button
                  onClick={() => {
                    handleDeleteStudent(selectedStudent.id);
                  }}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> ลบนักเรียน
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- STUDENT IMAGE FULLSCREEN PREVIEW MODAL --- */}
      {previewImageModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in cursor-pointer"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-3 animate-scale-up cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#8A9A5B]" /> รูปถ่ายนักเรียน/นักศึกษา
              </span>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-stone-900/5 rounded-xl mt-3 min-h-[250px]">
              <img
                src={previewImageModal}
                alt="Student Full Preview"
                className="w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
