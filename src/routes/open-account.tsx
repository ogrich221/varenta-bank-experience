import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Phone, Lock, ShieldCheck, Camera, CheckCircle2,
  ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Building2, Key,
  Sparkles, Check, Globe, HelpCircle, Eye, EyeOff
} from "lucide-react";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import { PasswordField } from "@/components/site/PasswordField";
import { useBanking } from "@/lib/banking-context";

export const Route = createFileRoute("/open-account")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Open an Account — Varenta Bank" },
      { name: "description", content: "Apply for a premium Varenta Bank multi-currency account with institutional security and 5.15% APY." },
      { property: "og:title", content: "Open an Account — Varenta Bank" },
      { property: "og:description", content: "Multi-step secure biometric application for international banking." },
    ],
  }),
  component: OpenAccountPage,
});

export function OpenAccountPage() {
  const navigate = useNavigate();
  const { registerNewUser } = useBanking();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    nationality: "United States",
    country: "United States",
    address: "",
    occupation: "",

    // Step 2: Contact Details
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    city: "",
    postalCode: "",

    // Step 3: Account Preferences
    accountType: "Current Account" as "Current Account" | "Savings Account",
    preferredCurrency: "USD",
    password: "",
    confirmPassword: "",

    // Step 4: Security & OTP
    securityQuestion1: "What was the name of your first elementary school?",
    securityAnswer1: "",
    securityQuestion2: "What is your maternal grandmother's maiden name?",
    securityAnswer2: "",
    enteredOtp: "",

    // Step 5: KYC Selfie
    selfieImage: "" as string,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [mockGeneratedOtp, setMockGeneratedOtp] = useState("849201");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  // Camera state for Step 5
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = async () => {
    setCameraError("");
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError("Camera access not supported on this browser. You may use a sample selfie snapshot.");
      }
    } catch (err: any) {
      console.warn("Camera access failed", err);
      setCameraError("Unable to access camera. Please allow camera permissions, or proceed with identity verification upload.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setFormData((prev) => ({ ...prev, selfieImage: dataUrl }));
        stopCamera();
      }
    }
  };

  const sendMockOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockGeneratedOtp(code);
    setOtpSent(true);
    setFormData((prev) => ({ ...prev, enteredOtp: code })); // auto-fill for convenience
  };

  const verifyOtp = () => {
    if (formData.enteredOtp === mockGeneratedOtp) {
      setOtpVerified(true);
    }
  };

  // Stop camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `VRN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setApplicationId(generatedId);

    // Save into centralized context and register with Admin
    registerNewUser({
      firstName: formData.firstName || "Alexander",
      middleName: formData.middleName,
      lastName: formData.lastName || "Varenta",
      dob: formData.dob || "1988-06-14",
      gender: formData.gender,
      nationality: formData.nationality,
      country: formData.country,
      address: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      occupation: formData.occupation || "Executive",
      email: formData.email || "alexander.varenta@client.varentabank.com",
      phone: `${formData.phoneCountryCode} ${formData.phoneNumber}`,
      accountType: formData.accountType,
      preferredCurrency: formData.preferredCurrency,
      accountNumber: "",
      status: "Pending KYC",
      tier: "World Elite",
      profilePic: formData.selfieImage || "",
    }, formData.selfieImage);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <PageShell>
      <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Institutional Onboarding
            </span>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              Open Your <span className="text-gradient">Varenta Account</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Complete your encrypted multi-currency account application in 5 simple steps.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          {!isSubmitted && (
            <div className="mt-10 mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
                {[
                  { num: 1, label: "Personal" },
                  { num: 2, label: "Contact" },
                  { num: 3, label: "Account" },
                  { num: 4, label: "Security & OTP" },
                  { num: 5, label: "Biometric KYC" },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                        step === s.num
                          ? "border-2 border-primary bg-primary text-primary-foreground shadow-glow scale-110"
                          : step > s.num
                          ? "border border-green-500/50 bg-green-500/20 text-green-400"
                          : "border border-white/20 bg-background/60 text-muted-foreground"
                      }`}
                    >
                      {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="mt-1.5 hidden text-[11px] font-medium sm:block text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-3 h-1 w-full max-w-2xl mx-auto rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Glass Form Container */}
          <div className="glass rounded-[2.5rem] p-6 sm:p-10 shadow-glass border border-white/25">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ================= STEP 1: PERSONAL DETAILS ================= */}
                {step === 1 && (
                  <div className="animate-rise space-y-5">
                    <div className="border-b border-border/40 pb-3">
                      <h2 className="text-xl font-bold text-foreground">1. Personal Information</h2>
                      <p className="text-xs text-muted-foreground">
                        Required for legal identity and regulatory compliance across our 21 jurisdictions.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="e.g. Alexander"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Middle Name</label>
                        <input
                          type="text"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          placeholder="e.g. Vance"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="e.g. Varenta"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          name="dob"
                          required
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Gender *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer Not To Say">Prefer Not To Say</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Nationality *</label>
                        <input
                          type="text"
                          name="nationality"
                          required
                          value={formData.nationality}
                          onChange={handleChange}
                          placeholder="e.g. Swiss / American"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Country of Residence *</label>
                        <input
                          type="text"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="e.g. Switzerland"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Occupation / Profession *</label>
                        <input
                          type="text"
                          name="occupation"
                          required
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="e.g. Managing Director / Software Architect"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Residential Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. Bahnhofstrasse 45, Suite 800"
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.firstName || !formData.lastName || !formData.dob) {
                            alert("Please complete required personal details to continue.");
                            return;
                          }
                          setStep(2);
                        }}
                        className={btnPrimary}
                      >
                        Proceed to Contact Details <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: CONTACT DETAILS ================= */}
                {step === 2 && (
                  <div className="animate-rise space-y-5">
                    <div className="border-b border-border/40 pb-3">
                      <h2 className="text-xl font-bold text-foreground">2. Contact Information</h2>
                      <p className="text-xs text-muted-foreground">
                        Your direct channels for instant 2FA authentication, transaction alerts, and statement delivery.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@domain.com"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Country Code</label>
                        <select
                          name="phoneCountryCode"
                          value={formData.phoneCountryCode}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="+1">+1 (US / Canada)</option>
                          <option value="+44">+44 (United Kingdom)</option>
                          <option value="+41">+41 (Switzerland)</option>
                          <option value="+49">+49 (Germany)</option>
                          <option value="+33">+33 (France)</option>
                          <option value="+65">+65 (Singapore)</option>
                          <option value="+81">+81 (Japan)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+61">+61 (Australia)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-foreground mb-1">Mobile Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="555-0192"
                            className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Zurich or New York"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Postal / ZIP Code *</label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="e.g. 8001 or 10001"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(1)} className={btnGlass}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.email || !formData.phoneNumber) {
                            alert("Please provide valid contact information.");
                            return;
                          }
                          setStep(3);
                        }}
                        className={btnPrimary}
                      >
                        Account Preferences <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: ACCOUNT PREFERENCES ================= */}
                {step === 3 && (
                  <div className="animate-rise space-y-5">
                    <div className="border-b border-border/40 pb-3">
                      <h2 className="text-xl font-bold text-foreground">3. Account Preferences & Credentials</h2>
                      <p className="text-xs text-muted-foreground">
                        Select your initial account structure and establish your master digital banking password.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Account Type *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Current Account", "Savings Account"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, accountType: type as any }))}
                              className={`rounded-2xl border p-3 text-left transition-all ${
                                formData.accountType === type
                                  ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                                  : "border-border/60 bg-background/60 hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              <p className="text-xs font-bold">{type}</p>
                              <p className="text-[10px] mt-0.5">
                                {type === "Current Account" ? "Daily payments & debit card" : "5.15% APY high yield"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Primary Currency *</label>
                        <select
                          name="preferredCurrency"
                          value={formData.preferredCurrency}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="USD">USD ($) — United States Dollar</option>
                          <option value="EUR">EUR (€) — Euro</option>
                          <option value="GBP">GBP (£) — British Pound</option>
                          <option value="CHF">CHF (₣) — Swiss Franc</option>
                          <option value="SGD">SGD ($) — Singapore Dollar</option>
                          <option value="CAD">CAD ($) — Canadian Dollar</option>
                          <option value="AUD">AUD ($) — Australian Dollar</option>
                          <option value="JPY">JPY (¥) — Japanese Yen</option>
                          <option value="AED">AED (د.إ) — UAE Dirham</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Account Password *</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters with numbers"
                            className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-10 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Confirm Password *</label>
                        <PasswordField
                          icon={<Lock className="h-4 w-4" />}
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repeat password"
                          revealWord="confirm password"
                          className="rounded-2xl border border-border/60 bg-background/70 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(2)} className={btnGlass}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.password || formData.password.length < 6) {
                            alert("Please enter a secure password of at least 6 characters.");
                            return;
                          }
                          if (formData.password !== formData.confirmPassword) {
                            alert("Passwords do not match.");
                            return;
                          }
                          setStep(4);
                          sendMockOtp();
                        }}
                        className={btnPrimary}
                      >
                        Security & OTP Verification <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 4: SECURITY & OTP ================= */}
                {step === 4 && (
                  <div className="animate-rise space-y-5">
                    <div className="border-b border-border/40 pb-3">
                      <h2 className="text-xl font-bold text-foreground">4. Security Questions & Email OTP</h2>
                      <p className="text-xs text-muted-foreground">
                        Configure recovery challenges and confirm your email authorization code.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Security Question 1 *</label>
                      <select
                        name="securityQuestion1"
                        value={formData.securityQuestion1}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>What was the name of your first elementary school?</option>
                        <option>In what city or town was your first full-time job?</option>
                        <option>What is the model of your first car?</option>
                        <option>What was your childhood nickname?</option>
                      </select>
                      <input
                        type="text"
                        name="securityAnswer1"
                        required
                        value={formData.securityAnswer1}
                        onChange={handleChange}
                        placeholder="Your secret answer"
                        className="mt-2 w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Security Question 2 *</label>
                      <select
                        name="securityQuestion2"
                        value={formData.securityQuestion2}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>What is your maternal grandmother's maiden name?</option>
                        <option>What was the name of your first family pet?</option>
                        <option>What street did you grow up on as a teenager?</option>
                        <option>What is the title of your favorite book?</option>
                      </select>
                      <input
                        type="text"
                        name="securityAnswer2"
                        required
                        value={formData.securityAnswer2}
                        onChange={handleChange}
                        placeholder="Your secret answer"
                        className="mt-2 w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    {/* Email OTP Verification Box */}
                    <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <span className="text-xs font-bold text-foreground">Email OTP Verification</span>
                        </div>
                        <button
                          type="button"
                          onClick={sendMockOtp}
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <RefreshCw className="h-3 w-3" /> Resend Code
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        We sent a 6-digit confirmation code to <strong>{formData.email || "your email"}</strong>. (Demo Code: <span className="font-mono font-bold text-primary">{mockGeneratedOtp}</span>)
                      </p>

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          maxLength={6}
                          name="enteredOtp"
                          value={formData.enteredOtp}
                          onChange={handleChange}
                          placeholder="6-digit code"
                          className="rounded-2xl border border-primary/40 bg-background/90 px-4 py-2 font-mono text-center text-sm font-bold tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={verifyOtp}
                          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-105"
                        >
                          Verify OTP
                        </button>
                        {otpVerified && (
                          <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                            <CheckCircle2 className="h-4 w-4" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(3)} className={btnGlass}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.securityAnswer1 || !formData.securityAnswer2) {
                            alert("Please provide answers to both security questions.");
                            return;
                          }
                          setStep(5);
                        }}
                        className={btnPrimary}
                      >
                        Biometric KYC Verification <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 5: BIOMETRIC KYC CAMERA SELFIE ================= */}
                {step === 5 && (
                  <div className="animate-rise space-y-5">
                    <div className="border-b border-border/40 pb-3">
                      <h2 className="text-xl font-bold text-foreground">5. Biometric Facial KYC Verification</h2>
                      <p className="text-xs text-muted-foreground">
                        Use your device camera to capture a live facial selfie to comply with anti-money laundering (AML) and KYC regulations.
                      </p>
                    </div>

                    {/* Camera Viewfinder */}
                    <div className="relative mx-auto flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-slate-950 p-6 overflow-hidden max-w-md shadow-2xl">
                      {!formData.selfieImage ? (
                        <>
                          <div className="relative h-64 w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center">
                            {cameraActive ? (
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="h-full w-full object-cover scale-x-[-1]"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                                <Camera className="h-12 w-12 text-primary/60 mb-2 animate-bounce" />
                                <span className="text-xs">Camera preview inactive</span>
                              </div>
                            )}

                            {/* Biometric Oval Guide Overlay */}
                            <div className="pointer-events-none absolute inset-6 rounded-[50%] border-2 border-dashed border-primary/60 opacity-70 flex items-center justify-center">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-primary/80 bg-black/60 px-2 py-0.5 rounded">
                                Align Face Here
                              </span>
                            </div>
                          </div>

                          <canvas ref={canvasRef} className="hidden" />

                          <div className="mt-4 flex flex-wrap gap-3 justify-center">
                            {!cameraActive ? (
                              <button
                                type="button"
                                onClick={startCamera}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-105"
                              >
                                <Camera className="h-3.5 w-3.5" /> Start Camera
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={capturePhoto}
                                className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-green-600 animate-pulse"
                              >
                                <Camera className="h-3.5 w-3.5" /> Capture Selfie
                              </button>
                            )}

                            {/* Fallback Sample Capture */}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  selfieImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                                }));
                              }}
                              className="rounded-full border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              Use Certified Sample
                            </button>
                          </div>

                          {cameraError && (
                            <p className="mt-2 text-[11px] text-amber-400 text-center max-w-xs">{cameraError}</p>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="relative h-60 w-60 rounded-full overflow-hidden border-4 border-green-500 shadow-glow">
                            <img
                              src={formData.selfieImage}
                              alt="Captured KYC Selfie"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-[10px] text-green-400 font-mono">
                              BIOMETRICS VERIFIED
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, selfieImage: "" }));
                              startCamera();
                            }}
                            className="mt-4 text-xs text-muted-foreground hover:text-foreground underline"
                          >
                            Retake Photo
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-background/60 p-4 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2 text-foreground font-semibold mb-1">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Administrative Approval Notice
                      </p>
                      Your identity verification documents will be securely submitted to our compliance desk for administrative review. Upon submission, you will receive an immediate confirmation email, and upon administrative approval, your account credentials will activate.
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(4)} className={btnGlass}>
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`${btnPrimary} min-w-[200px]`}
                      >
                        {isSubmitting ? "Submitting Application..." : "Submit Application"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              /* ================= APPLICATION SUBMITTED MODAL ================= */
              <div className="animate-rise text-center py-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400 border border-green-500/40 shadow-glow">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  Application Reference: {applicationId}
                </span>

                <h2 className="mt-3 text-3xl font-bold text-foreground">
                  Registration Successfully Submitted
                </h2>
                <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
                  Thank you, <strong>{formData.firstName} {formData.lastName}</strong>. Your Varenta multi-currency {formData.accountType} application has been received and forwarded to our compliance officers for administrative verification.
                </p>

                {/* Email Confirmation Notice Box */}
                <div className="mt-8 max-w-md mx-auto rounded-3xl border border-white/20 bg-muted/30 p-5 text-left text-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>Automated Email Notifications Sent:</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                    <span><strong>Registration Confirmation Email:</strong> Dispatched to {formData.email || "your email address"}.</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                    <span><strong>Account Activation Notice:</strong> Will be delivered once administrative review is finalized.</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/dashboard" className={btnPrimary}>
                    Access Customer Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/login" className={btnGlass}>
                    Go to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
