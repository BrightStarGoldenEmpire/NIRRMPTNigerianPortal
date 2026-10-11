"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2, Sparkles, Phone, Mail, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  isWhatsappRedirect?: boolean;
  isEmailRedirect?: boolean;
}

// Enterprise Knowledge Base - 100 Comprehensive System FAQs across 10 Operational Categories
const NIRRMPT_KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  // 1-10: General & Mandate
  { keywords: ["what is nirrmpt", "about nirrmpt", "meaning of nirrmpt", "full name"], answer: "NIRRMPT stands for the Nigerian Institute of Regenerative Resource Management & Protection Technologies. It is the federal body responsible for ecological technology, environmental tracking, and sustainable resource protection." },
  { keywords: ["mandate", "objective", "purpose", "mission"], answer: "Our mandate is to deploy advanced technology, satellite telemetry, IoT sensor networks, and data analytics to protect Nigeria's natural resources and regenerate degraded ecosystems." },
  { keywords: ["location", "headquarters", "address", "where is"], answer: "NIRRMPT operates nationwide with key directorate hubs in Port Harcourt, Rivers State, and administrative synchronization with the Federal Capital Territory." },
  { keywords: ["contact", "phone", "email", "support line"], answer: "You can reach NIRRMPT via official channels, email us at support@nirrmpt.org, or directly message our direct line on WhatsApp at +234 802 5252 362." },
  { keywords: ["governing council", "board", "leadership", "dg", "director general"], answer: "NIRRMPT is led by the Governing Council and Executive Directorate, chaired by Prof. Adeleke O. Danjuma." },
  { keywords: ["federal", "government", "ministry", "mda"], answer: "NIRRMPT operates as a specialized technology institute synchronized across 142 R&D projects with federal and state environmental ministries." },
  { keywords: ["hours", "working hours", "opening"], answer: "Portal services and API telemetry operate 24/7. Physical administrative desks operate Monday through Friday, 8:00 AM to 4:00 PM WAT." },
  { keywords: ["charter", "policy charter", "framework"], answer: "Our policy charters set statutory environmental compliance, remote sensing protocols, and land regeneration guidelines across Nigeria." },
  { keywords: ["ndpr", "data protection", "privacy"], answer: "All NIRRMPT data collection and citizen submissions strictly comply with the Nigeria Data Protection Regulation (NDPR)." },
  { keywords: ["annual report", "publications", "bulletin"], answer: "Public bulletins, annual ecological audits, and statutory reports are accessible on our News page at /news." },

  // 11-20: Navigation & Pages
  { keywords: ["home", "homepage", "landing page"], answer: "The Home page gives a complete overview of active ecological projects, public metrics, and institute updates." },
  { keywords: ["news", "press", "announcement", "bulletins"], answer: "Visit the Newsroom at /news for official releases, research charters, and federal announcements." },
  { keywords: ["events", "upcoming events", "symposium"], answer: "Upcoming environmental summits, technical workshops, and townhalls are listed on the Events page at /events." },
  { keywords: ["gallery", "photos", "field photos"], answer: "The Gallery page at /gallery showcases field operations, drone surveys, and institute milestone events." },
  { keywords: ["departments", "directorates", "divisions"], answer: "Explore our specialized divisions on the Directorates page at /departments." },
  { keywords: ["about us", "about page"], answer: "Learn about our history, organizational structure, and statutory backing at /about." },
  { keywords: ["leadership page", "board page"], answer: "Profiles of the Executive Council and Directorate heads are available at /leadership." },
  { keywords: ["contact page", "reach us"], answer: "Visit /contact to send structured inquiries, report field anomalies, or locate branch offices." },
  { keywords: ["login page", "portal login"], answer: "Access restricted roles (Citizen, Field Desk, Directorate Operations, Super Admin) at /login." },
  { keywords: ["search", "find information"], answer: "Use the global search bar in the top navigation bar or filter options on specific section pages." },

  // 21-30: Directorates & Operating Divisions
  { keywords: ["regenerative resource", "dept 01", "dept-01"], answer: "Directorate 01 oversees pilot projects for soil remediation, afforestation, and watershed protection." },
  { keywords: ["geospatial", "ecological monitoring", "dept 02", "dept-02"], answer: "Directorate 02 manages satellite remote sensing networks, drone cartography, and IoT environmental tracking sensors." },
  { keywords: ["field operations", "inspectors", "field desk"], answer: "Field Operations manages ground teams conducting environmental audits, site sampling, and verification." },
  { keywords: ["digital governance", "api network", "mda integration"], answer: "The Digital Governance division maintains the Inter-MDA RESTful API network for seamless real-time data sharing." },
  { keywords: ["research and development", "r&d"], answer: "Our R&D department focuses on bio-remediation chemistry, automated ecological risk modeling, and sensor hardware." },
  { keywords: ["compliance", "enforcement"], answer: "The Compliance Directorate evaluates real estate, industrial, and agricultural compliance against ecological standards." },
  { keywords: ["coastal", "mangrove", "rivers state"], answer: "Specialized coastal regeneration desks oversee mangrove restoration and marine ecosystem protection in the Niger Delta." },
  { keywords: ["arid", "northern belt", "desertification"], answer: "Arid zone operations focus on Great Green Wall support, soil stabilization, and drone seed deployment." },
  { keywords: ["laboratory", "testing", "soil analysis"], answer: "NIRRMPT operates regional biochemistry labs for heavy metal analysis, water purity testing, and soil health indexing." },
  { keywords: ["training", "academy", "capacity building"], answer: "We offer technical certification modules for field inspectors, regional officers, and environmental scientists." },

  // 31-40: Portal Roles & Authentication
  { keywords: ["role", "user roles", "access level"], answer: "The portal supports 4 primary role tiers: Citizen, Staff Field Desk, Directorate Operations, and Super Admin Core." },
  { keywords: ["citizen", "public user", "citizen role"], answer: "Citizens can submit public environmental reports, view open bulletins, track public audits, and access the newsroom." },
  { keywords: ["field desk", "staff field", "inspector role"], answer: "Staff Field Desk officers upload geospatial field logs, audit cards, soil test samples, and inspection status updates." },
  { keywords: ["directorate operations", "director role"], answer: "Directorate Operations reviews regional field reports, approves compliance filings, and monitors real-time telemetry." },
  { keywords: ["super admin", "admin core"], answer: "Super Admin Core manages user access roles, system configurations, API keys, and institute-wide system logs." },
  { keywords: ["forgot password", "reset password", "login issue"], answer: "Use the 'Forgot Password' link on the login screen or contact your Directorate IT Administrator." },
  { keywords: ["profile picture", "avatar", "update profile"], answer: "Authenticated users can update their profile avatar, designation, and contact details in Dashboard Profile Settings." },
  { keywords: ["registration", "create account", "sign up"], answer: "Public citizen accounts can be registered online. Staff and official accounts require administrative authorization." },
  { keywords: ["permission denied", "unauthorized", "access restricted"], answer: "If you see a permission restriction, verify that your account role has clearance for that specific dashboard module." },
  { keywords: ["session", "logout", "sign out"], answer: "For security, sessions automatically expire after periods of inactivity. Log out using the user menu on your dashboard." },

  // 41-50: Ecological Technologies & Systems
  { keywords: ["satellite", "remote sensing", "telemetry"], answer: "Phase 2 Satellite tracking uses automated remote sensing to monitor vegetation index, land movement, and deforestation." },
  { keywords: ["drone", "cartography", "aerial"], answer: "Autonomous drone fleets are used for high-resolution topographical mapping and aerial seed distribution in hard-to-reach zones." },
  { keywords: ["iot", "sensors", "sensor network"], answer: "Ground-level IoT sensor clusters monitor air quality, water pH, soil moisture, and hydrocarbon levels in real time." },
  { keywords: ["soil remediation", "bioremediation"], answer: "Remediation technology utilizes specialized micro-organisms and organic bio-char to restore oil-impacted soils." },
  { keywords: ["mangrove restoration", "tidal flora"], answer: "Coastal teams map and protect restored tidal flora, stabilizing shorelines against erosion and storm surges." },
  { keywords: ["ai", "machine learning", "risk model"], answer: "AI models analyze historical telemetry to predict environmental degradation risks and pipeline encroachments." },
  { keywords: ["pipeline", "spill", "hydrocarbon"], answer: "Telemetry systems automatically trigger alert cards when abnormal soil conductivity or gas emissions are detected." },
  { keywords: ["audit card", "real estate audit"], answer: "Real estate and land audit cards rate locations based on environmental safety, soil health, and flood risk." },
  { keywords: ["gis", "mapping", "geospatial tagging"], answer: "All field inspection data is geospatial-tagged with GPS coordinates for spatial validation in the central database." },
  { keywords: ["water quality", "watershed"], answer: "Watershed monitoring systems track river basin health, industrial effluent runoff, and aquatic biodiversity status." },

  // 51-60: Reporting & Submissions
  { keywords: ["report anomaly", "submit report", "illegal dumping"], answer: "Citizens can report illegal logging, chemical spills, or dumping via the Citizen Portal submission form." },
  { keywords: ["status", "track report", "report status"], answer: "Track your submitted report using the unique tracking ID generated upon portal submission." },
  { keywords: ["file approval", "pipeline approval", "document submission"], answer: "Field desk document submissions undergo a multi-tier review process by Directorate Operations officers." },
  { keywords: ["evidence", "upload photo", "attach file"], answer: "Inspection forms support uploading geo-tagged photographs, PDF lab results, and spatial coordinates." },
  { keywords: ["anonymous", "whistleblower", "confidential"], answer: "Public anomaly reports can be submitted anonymously to protect citizens reporting environmental violations." },
  { keywords: ["turnaround", "processing time", "how long"], answer: "Urgent environmental hazard reports are triaged within 24 hours; standard compliance filings take 3 to 5 business days." },
  { keywords: ["feedback", "comments"], answer: "Feedback on public reports is sent directly to your portal notification feed or registered email." },
  { keywords: ["rejection", "file returned"], answer: "If a submission is returned, check the inspector notes in your dashboard and resubmit with missing requirements." },
  { keywords: ["audit log", "history"], answer: "All document movements and status changes are permanently recorded in the system audit trail." },
  { keywords: ["certificate", "clearance certificate"], answer: "Environmental clearance certificates are issued digitally with verifiable QR codes upon final approval." },

  // 61-70: Enterprise Architecture & Platform Tech
  { keywords: ["nextjs", "react", "framework"], answer: "The NIRRMPT platform is built with Next.js App Router, React, and TypeScript for high performance and reliability." },
  { keywords: ["tailwind", "css", "styling"], answer: "The portal frontend utilizes Tailwind CSS for responsive desktop, tablet, and mobile interface design." },
  { keywords: ["api", "rest", "endpoints"], answer: "Inter-agency data synchronization uses secure RESTful API endpoints encrypted over HTTPS." },
  { keywords: ["database", "storage"], answer: "Data is stored across distributed enterprise databases featuring automated daily backups and disaster recovery." },
  { keywords: ["responsive", "mobile app", "phone view"], answer: "The NIRRMPT portal is fully responsive and optimized for seamless access on smartphones, tablets, and desktops." },
  { keywords: ["security", "encryption", "ssl"], answer: "The platform uses end-to-end TLS encryption, strict CORS policies, and enterprise role-based access control." },
  { keywords: ["performance", "speed", "loading"], answer: "Page rendering uses Next.js server components and asset optimization for fast access even in low-bandwidth regions." },
  { keywords: ["offline", "field mode"], answer: "Field inspectors can capture audit data offline; logs automatically synchronize once a network connection is re-established." },
  { keywords: ["version", "updates", "system version"], answer: "The current system release runs on platform build 2026.3 with enhanced real-time telemetry pipelines." },
  { keywords: ["uptime", "server status"], answer: "System status is monitored 24/7 with a target operational uptime of 99.9%." },

  // 71-80: Inter-Agency & Federal Mandate
  { keywords: ["mda", "inter mda", "other ministries"], answer: "The Inter-MDA network connects NIRRMPT with national planning, environment, and petroleum regulatory agencies." },
  { keywords: ["state government", "rivers state desk", "local desk"], answer: "Regional state desks facilitate local field inspections, ecological sampling, and municipal compliance reviews." },
  { keywords: ["laws", "act", "statutory power"], answer: "NIRRMPT operates under federal statutory backing to enforce ecological technology guidelines and data standards." },
  { keywords: ["emergency", "disaster", "flood"], answer: "During ecological emergencies, telemetry feeds are linked directly to national emergency response teams." },
  { keywords: ["partners", "universities", "research institutes"], answer: "NIRRMPT collaborates with federal universities and international research labs on soil biochemistry R&D." },
  { keywords: ["grants", "funding", "projects"], answer: "Regenerative project grants are managed under strict Directorate oversight with published transparency metrics." },
  { keywords: ["international", "cop", "climate policy"], answer: "Our technologies support Nigeria's international climate commitments and carbon sequestration reporting." },
  { keywords: ["carbon credit", "sequestration"], answer: "Geospatial mapping measures forest density to generate accurate, verifiable blue carbon metrics." },
  { keywords: ["standards", "iso", "compliance rating"], answer: "Environmental sampling protocols follow ISO 14001 guidelines and national federal environmental benchmarks." },
  { keywords: ["public portal", "open data"], answer: "Selected non-sensitive telemetry streams are published to the public portal to encourage transparent research." },

  // 81-90: Training & Field Desks
  { keywords: ["training module", "courses", "staff training"], answer: "Interactive training modules for staff cover geospatial tagging, safety protocols, and audit card grading." },
  { keywords: ["field desk app", "inspector tools"], answer: "Field desk tools include digital checklists, GPS land verifiers, and real-time sample logging interfaces." },
  { keywords: ["equipment", "sensors", "hardware"], answer: "Sensors are calibrated quarterly by regional technical teams to maintain precise measurement accuracy." },
  { keywords: ["safety", "protocol", "field safety"], answer: "Inspectors must follow statutory field safety protocols when conducting coastal and industrial site audits." },
  { keywords: ["gps", "coordinates", "mapping tool"], answer: "Geospatial tagging requires accurate GPS satellite lock before an audit card can be finalized." },
  { keywords: ["photos", "image upload", "site evidence"], answer: "Photos uploaded in field reports must include timestamp and coordinate metadata for audit validation." },
  { keywords: ["badge", "id card", "inspector id"], answer: "All active field inspectors carry official NIRRMPT digital credentials with scannable verification codes." },
  { keywords: ["schedule", "inspection date"], answer: "Inspection schedules are dispatched to field desk officers via their personalized portal dashboard." },
  { keywords: ["verification", "validate audit"], answer: "Directorate Operations verifies all submitted audit cards before releasing official public ratings." },
  { keywords: ["regional office", "branch"], answer: "Regional operational hubs assist field desks across geopolitical zones for rapid incident deployment." },

  // 91-100: Troubleshooting & Platform Features
  { keywords: ["back button", "navigation error"], answer: "Use the built-in portal navigation controls or back buttons to navigate cleanly between dashboard modules." },
  { keywords: ["card size", "card display", "ui glitch"], answer: "Interface cards auto-scale for optimal reading. If you experience visual layout issues, refresh your browser." },
  { keywords: ["browser", "chrome", "edge"], answer: "The portal is fully optimized for modern browsers including Google Chrome, Microsoft Edge, Firefox, and Safari." },
  { keywords: ["dark mode", "theme"], answer: "The interface features standard executive high-contrast styling designed for daytime and nighttime field use." },
  { keywords: ["notifications", "alerts"], answer: "System alerts appear in the header notification center and inform you of file approvals or status changes." },
  { keywords: ["export", "pdf", "csv", "download"], answer: "Audit reports and news publications can be exported or printed directly from their respective viewing panels." },
  { keywords: ["slow internet", "bandwidth"], answer: "For slow network connections, lightweight text mode and compressed data views activate automatically." },
  { keywords: ["cache", "refresh"], answer: "If updated dashboard data does not appear immediately, clear your browser cache or perform a hard refresh (Ctrl+F5)." },
  { keywords: ["developer", "tech stack"], answer: "The platform is engineered using modern React ecosystem standards, TypeScript, and server-side Next.js architectures." },
  { keywords: ["whatsapp", "direct agent", "human agent"], answer: "If you require direct assistance from a live NIRRMPT representative, click the WhatsApp link below or message +234 802 5252 362." }
];

// Expanded FAQ Menu Options covering all 8 major FAQ sections + Direct Agent Channels
const FAQ_MENU_OPTIONS = [
  { id: 1, label: "General & Mandate", key: "about nirrmpt" },
  { id: 2, label: "Directorates & Operating Divisions", key: "directorates" },
  { id: 3, label: "Portal Roles & Authentication", key: "user roles" },
  { id: 4, label: "Ecological Technologies & Systems", key: "satellite" },
  { id: 5, label: "Reporting & Submissions", key: "report anomaly" },
  { id: 6, label: "Inter-Agency & Federal Mandate", key: "mda" },
  { id: 7, label: "Training & Field Desks", key: "training module" },
  { id: 8, label: "Troubleshooting & Platform Features", key: "browser" },
  { id: 9, label: "Chat with a Human Agent (WhatsApp)", isHumanAgent: true },
  { id: 10, label: "Send an Email to Official Support Team", isEmailOption: true },
];

const WHATSAPP_NUMBER = "+2348025252362";
const WHATSAPP_DISPLAY = "+234 802 5252 362";
const SUPPORT_EMAIL = "support@nirrmpt.org";

export default function GlobalChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const welcomeMenuText = `Hello! Welcome to NIRRMPT Assistance Center.\n\nPlease select an option by typing the corresponding number (1-10):\n\n1. General & Mandate\n2. Directorates & Operating Divisions\n3. Portal Roles & Authentication\n4. Ecological Technologies & Systems\n5. Reporting & Submissions\n6. Inter-Agency & Federal Mandate\n7. Training & Field Desks\n8. Troubleshooting & Platform Features\n9. Chat with a Human Support Agent (WhatsApp)\n10. Email Support Team (${SUPPORT_EMAIL})`;

  const [messages, setMessages] = useState<Message[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: welcomeMenuText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!mounted) return null;

  const findAnswerInKnowledgeBase = (query: string): { answer: string; matched: boolean; isHuman?: boolean; isEmail?: boolean } => {
    const cleanQuery = query.toLowerCase().trim();

    // Direct numerical options matching 1-10
    if (cleanQuery === "1" || cleanQuery.includes("option 1") || cleanQuery.includes("click 1")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("about nirrmpt"));
      return { answer: match ? match.answer : "NIRRMPT is the federal body responsible for ecological technology, environmental tracking, and sustainable resource protection.", matched: true };
    }
    if (cleanQuery === "2" || cleanQuery.includes("option 2") || cleanQuery.includes("click 2")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("directorates"));
      return { answer: match ? match.answer : "Explore our specialized divisions and directorates on the official Directorates page at /departments.", matched: true };
    }
    if (cleanQuery === "3" || cleanQuery.includes("option 3") || cleanQuery.includes("click 3")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("user roles"));
      return { answer: match ? match.answer : "The portal supports 4 primary role tiers: Citizen, Staff Field Desk, Directorate Operations, and Super Admin Core.", matched: true };
    }
    if (cleanQuery === "4" || cleanQuery.includes("option 4") || cleanQuery.includes("click 4")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("satellite"));
      return { answer: match ? match.answer : "Phase 2 Satellite tracking uses automated remote sensing to monitor vegetation index, land movement, and deforestation.", matched: true };
    }
    if (cleanQuery === "5" || cleanQuery.includes("option 5") || cleanQuery.includes("click 5")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("report anomaly"));
      return { answer: match ? match.answer : "Citizens can report illegal logging, chemical spills, or dumping via the Citizen Portal submission form.", matched: true };
    }
    if (cleanQuery === "6" || cleanQuery.includes("option 6") || cleanQuery.includes("click 6")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("mda"));
      return { answer: match ? match.answer : "The Inter-MDA network connects NIRRMPT with national planning, environment, and petroleum regulatory agencies.", matched: true };
    }
    if (cleanQuery === "7" || cleanQuery.includes("option 7") || cleanQuery.includes("click 7")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("training module"));
      return { answer: match ? match.answer : "Interactive training modules for staff cover geospatial tagging, safety protocols, and audit card grading.", matched: true };
    }
    if (cleanQuery === "8" || cleanQuery.includes("option 8") || cleanQuery.includes("click 8")) {
      const match = NIRRMPT_KNOWLEDGE_BASE.find(item => item.keywords.includes("browser"));
      return { answer: match ? match.answer : "The portal is fully optimized for modern browsers including Google Chrome, Microsoft Edge, Firefox, and Safari.", matched: true };
    }
    if (cleanQuery === "9" || cleanQuery.includes("option 9") || cleanQuery.includes("human agent") || cleanQuery.includes("click 9")) {
      return {
        answer: `You are being connected to an official NIRRMPT Support Agent. Click the button below to start your direct WhatsApp conversation with our helpdesk at ${WHATSAPP_DISPLAY}.`,
        matched: true,
        isHuman: true,
      };
    }
    if (cleanQuery === "10" || cleanQuery.includes("option 10") || cleanQuery.includes("email support") || cleanQuery.includes("click 10")) {
      return {
        answer: `You can send an official email query or report directly to the NIRRMPT Support Desk at ${SUPPORT_EMAIL}. Click the button below to open your email client.`,
        matched: true,
        isEmail: true,
      };
    }

    // Keyword lookup across 100 FAQs
    for (const item of NIRRMPT_KNOWLEDGE_BASE) {
      for (const keyword of item.keywords) {
        if (cleanQuery.includes(keyword)) {
          return { answer: item.answer, matched: true };
        }
      }
    }

    return {
      answer: `I couldn't find a direct match for your request. You can select an option from 1 to 8 to view category FAQs, type 9 for WhatsApp support, or type 10 to send an email to ${SUPPORT_EMAIL}.`,
      matched: false,
    };
  };

  const processResponse = (userInputText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const result = findAnswerInKnowledgeBase(userInputText);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isWhatsappRedirect: result.isHuman,
        isEmailRedirect: result.isEmail || (!result.matched && !result.isHuman),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const text = inputMessage;
    setInputMessage("");
    processResponse(text);
  };

  const handleOptionClick = (optionId: number) => {
    processResponse(optionId.toString());
  };

  const getWhatsappUrl = (customText?: string) => {
    const text = encodeURIComponent(
      customText 
        ? `Hello NIRRMPT Support, I have an inquiry: ${customText}`
        : "Hello NIRRMPT Support, I would like to make an inquiry."
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const getEmailUrl = () => {
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("NIRRMPT Portal Support Inquiry")}&body=${encodeURIComponent("Hello NIRRMPT Support Team,\n\nI would like to make an inquiry regarding:\n\n")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-500/30"
          aria-label="Chat with NIRRMPT"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">
            Chat with NIRRMPT
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[430px] h-[580px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-800/90 border-b border-slate-700/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Chat with NIRRMPT
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Official Intelligent Assistant
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-slate-700/50 transition-colors"
                title="Connect via WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={getEmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-slate-700/50 transition-colors"
                title={`Send Email to ${SUPPORT_EMAIL}`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 scrollbar-thin scrollbar-thumb-slate-700"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-emerald-700/40 text-emerald-300 border border-emerald-600/30"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none"
                    }`}
                  >
                    {msg.text}

                    {/* Menu Options Render */}
                    {msg.id === "welcome-1" && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-col gap-1.5">
                        {FAQ_MENU_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionClick(opt.id)}
                            className={`text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                              opt.isHumanAgent
                                ? "bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/40"
                                : opt.isEmailOption
                                ? "bg-cyan-700/80 hover:bg-cyan-600 text-white border border-cyan-400/40"
                                : "bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 border border-slate-600/40"
                            }`}
                          >
                            {opt.id}. {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* WhatsApp Action Button */}
                    {msg.isWhatsappRedirect && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-col gap-2">
                        <a
                          href={getWhatsappUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Chat on WhatsApp ({WHATSAPP_DISPLAY})
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Email Action Button */}
                    {msg.isEmailRedirect && (
                      <div className="mt-3 pt-2 border-t border-slate-700/80 flex flex-col gap-2">
                        <a
                          href={getEmailUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Send Email to {SUPPORT_EMAIL}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-700/40 border border-emerald-600/30 flex items-center justify-center text-emerald-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800 border border-slate-700/60 px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Official Contact Info Callout Banner */}
          <div className="bg-slate-800/80 px-3.5 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-cyan-400" /> Support Email:
            </span>
            <a
              href={getEmailUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-medium flex items-center gap-1"
            >
              {SUPPORT_EMAIL}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type 1-10 or ask a question..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}