// pages/AuthPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "../lib/API";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useWilayas } from "../hooks/useWilaya";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [isFlipped, setIsFlipped] = useState(false);
  const [accountType, setAccountType] = useState<
    "donor" | "beneficiary" | null
  >(null);
  const [showAccountSelection, setShowAccountSelection] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sign In fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Contact fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [wilaya, setWilaya] = useState("");
  const { wilayas, loading: wilayasLoading } = useWilayas();

  // Donor fields
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Beneficiary fields
  const [associationName, setAssociationName] = useState("");
  const [associationType, setAssociationType] = useState("");

  // Geolocation states
  const [locationLoading, setLocationLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const type = params.get("type");

    if (mode === "signup") {
      setTimeout(() => setIsFlipped(true), 100);
      if (type === "donor" || type === "beneficiary") {
        setAccountType(type);
        setShowAccountSelection(false);
      } else {
        setShowAccountSelection(true);
        setAccountType(null);
      }
    } else {
      setIsFlipped(false);
      setShowAccountSelection(true);
      setAccountType(null);
    }
  }, [location.search]);

  const handleFlipToSignUp = (type?: "donor" | "beneficiary") => {
    setIsFlipped(true);
    if (type) {
      navigate(`/auth?mode=signup&type=${type}`, { replace: true });
    } else {
      navigate("/auth?mode=signup", { replace: true });
    }
  };

  const handleFlipToSignIn = () => {
    setIsFlipped(false);
    navigate("/auth?mode=signin", { replace: true });
  };

  const handleAccountTypeSelect = (type: "donor" | "beneficiary") => {
    navigate(`/auth?mode=signup&type=${type}`, { replace: true });
  };

  const handleBackToAccountType = () => {
    navigate("/auth?mode=signup", { replace: true });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        toast.success("Location detected");
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.display_name) setAddress(data.display_name);
            if (data.address?.city || data.address?.town)
              setCity(data.address?.city || data.address?.town || "");
          })
          .catch((err) => console.error(err));
        setLocationLoading(false);
      },
      (error) => {
        toast.error("Could not get location");
        setLocationLoading(false);
      },
    );
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      if (rememberMe) localStorage.setItem("rememberMe", "true");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the terms");
      return;
    }
    setLoading(true);
    try {
      const signupData: any = {
        email: signupEmail,
        password: signupPassword,
        name: accountType === "donor" ? contactName : associationName,
        role: accountType,
        address: address || "Temporary address",
        phone: phone || undefined,
        wilaya: wilaya || undefined,
      };
      if (accountType === "donor") {
        signupData.organizationName = businessName || "Temporary name";
        signupData.businessType = businessType || "other";
      }
      if (accountType === "beneficiary") {
        signupData.organizationType =
          associationType === "foodBank" || associationType === "charity"
            ? "association"
            : "individual";
      }
      if (coordinates) {
        signupData.location = {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        };
      }
      await register(signupData);
      toast.success("Account created successfully!");
      setTimeout(() => handleFlipToSignIn(), 2000);
    } catch (error: any) {
      if (error.data?.message) toast.error(error.data.message);
      else if (error.data?.errors)
        error.data.errors.forEach((err: any) => toast.error(err.message));
      else toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const getLeftPanelContent = () => {
    if (!isFlipped) {
      return {
        title: "Welcome Back!",
        subtitle: "Continue your journey to fight food waste.",
        features: [
          "Track your donations",
          "See your impact",
          "Connect with community",
          "Get notifications",
        ],
        quote: {
          text: "Together, we can ensure no good food goes to waste.",
          author: "FoodShare Initiative",
        },
      };
    }
    if (showAccountSelection) {
      return {
        title: "Join the Movement",
        subtitle: "Be part of the solution.",
        features: [
          "Save food from waste",
          "Help families in need",
          "Build a sustainable future",
          "Join our community",
        ],
        mission: "Every meal saved is a step toward a better Algeria.",
      };
    }
    if (accountType === "donor") {
      return {
        title: "Ready to Donate?",
        subtitle: "Turn your surplus into hope.",
        features: [
          "Reduce environmental impact",
          "Support local communities",
          "Inspire others to give",
          "Make every meal count",
        ],
      };
    }
    return {
      title: "Ready to Receive?",
      subtitle: "Get quality food for those in need.",
      features: [
        "Free food surplus",
        "Real-time notifications",
        "Find donations near you",
        "Focus on your mission",
      ],
    };
  };

  const content = getLeftPanelContent();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* LEFT PANEL - Compact */}
        <div className="flex-1 bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-6 md:p-8 flex flex-col justify-center">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-leaf text-lg text-emerald-300"></i>
              </div>
              <span className="text-lg font-bold">FoodShare</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {content.title}
            </h1>
            <p className="text-white/85 mb-5 text-sm">{content.subtitle}</p>

            <div className="space-y-2 mb-5">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <i className="fas fa-check text-emerald-300 text-[10px]"></i>
                  </div>
                  <span className="text-xs">{feature}</span>
                </div>
              ))}
            </div>

            {!isFlipped && content.quote && (
              <div className="bg-white/10 rounded-xl p-3">
                <i className="fas fa-quote-left text-emerald-300 mb-1 block text-xs"></i>
                <p className="italic text-xs">"{content.quote.text}"</p>
                <p className="text-white/60 text-[10px] mt-1">
                  — {content.quote.author}
                </p>
              </div>
            )}

            {isFlipped && showAccountSelection && content.mission && (
              <div className="bg-white/10 rounded-xl p-3 text-xs italic">
                {content.mission}
              </div>
            )}

            {isFlipped && !showAccountSelection && (
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 w-fit text-[10px]">
                <i className="fas fa-shield-alt text-xs"></i> Secure
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex-1 bg-white p-6 md:p-8 flex items-center justify-center"
          style={{ perspective: "2000px" }}
        >
          <div
            className="w-full max-w-md relative"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: isFlipped ? "500px" : "380px",
            }}
          >
            {/* SIGN IN FORM - FRONT */}
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                  Welcome back
                </h2>
                <p className="text-emerald-600 text-xs">Sign in to continue</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-1 text-xs cursor-pointer text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3 h-3 rounded"
                    />{" "}
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-emerald-600 text-xs"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-1.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition"
                >
                  {loading ? "Loading..." : "Sign in"}
                </button>
              </form>

              <div className="text-center mt-5 pt-3 border-t border-gray-100">
                <span className="text-gray-500 text-xs">New here? </span>
                <button
                  onClick={() => handleFlipToSignUp()}
                  className="text-emerald-600 font-semibold text-xs"
                >
                  Create an account
                </button>
              </div>
            </div>

            {/* SIGN UP FORM - BACK */}
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="max-h-[460px] overflow-y-auto pr-1">
                {showAccountSelection ? (
                  <>
                    <div className="mb-5">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        Join the movement
                      </h2>
                      <p className="text-emerald-600 text-xs">
                        Choose your account type
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleAccountTypeSelect("donor")}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/30 transition"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-store text-emerald-600 text-sm"></i>
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm">
                            I'm a Donor
                          </h3>
                        </div>
                        <p className="text-gray-500 text-xs mb-2">
                          Business with surplus food to donate
                        </p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span>✓ Reduce waste</span>
                          <span>✓ Tax benefits</span>
                          <span>✓ Social impact</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleAccountTypeSelect("beneficiary")}
                        className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/30 transition"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-hand-holding-heart text-emerald-600 text-sm"></i>
                          </div>
                          <h3 className="font-bold text-gray-800 text-sm">
                            I'm a Beneficiary
                          </h3>
                        </div>
                        <p className="text-gray-500 text-xs mb-2">
                          Association needing food surplus
                        </p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span>✓ Free food</span>
                          <span>✓ Real-time alerts</span>
                          <span>✓ Geolocation</span>
                        </div>
                      </button>
                    </div>

                    <div className="text-center mt-5 pt-3 border-t border-gray-100">
                      <span className="text-gray-500 text-xs">
                        Already have an account?{" "}
                      </span>
                      <button
                        onClick={handleFlipToSignIn}
                        className="text-emerald-600 font-semibold text-xs"
                      >
                        Sign in
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-0.5">
                        Create{" "}
                        {accountType === "donor" ? "donor" : "beneficiary"}{" "}
                        account
                      </h2>
                      <p className="text-emerald-600 text-xs">
                        Join the fight against food waste
                      </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-2.5">
                      {accountType === "donor" ? (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">
                              Business name *
                            </label>
                            <input
                              type="text"
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="e.g., Artisan Bakery"
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">
                              Contact person *
                            </label>
                            <input
                              type="text"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Full name"
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">
                              Business type *
                            </label>
                            <select
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                              required
                            >
                              <option value="">Select</option>
                              <option value="bakery">Bakery</option>
                              <option value="restaurant">Restaurant</option>
                              <option value="supermarket">Supermarket</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">
                              Association name *
                            </label>
                            <input
                              type="text"
                              value={associationName}
                              onChange={(e) =>
                                setAssociationName(e.target.value)
                              }
                              placeholder="e.g., Food Bank Algiers"
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">
                              Association type *
                            </label>
                            <select
                              value={associationType}
                              onChange={(e) =>
                                setAssociationType(e.target.value)
                              }
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                              required
                            >
                              <option value="">Select</option>
                              <option value="foodBank">Food Bank</option>
                              <option value="charity">Charity</option>
                              <option value="shelter">Shelter</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="hello@example.com"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+213 XXX XX XX XX"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                          Address
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street address"
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className="px-2.5 bg-emerald-100 text-emerald-600 rounded-lg text-xs"
                          >
                            {locationLoading ? "⏳" : "📍"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-0.5">
                            Wilaya
                          </label>
                          <select
                            value={wilaya}
                            onChange={(e) => setWilaya(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                            disabled={wilayasLoading}
                          >
                            <option value="">Select</option>
                            {wilayas.map((w) => (
                              <option key={w.code} value={w.code}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Create a strong password"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-0.5">
                          Confirm password *
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          required
                          className="w-3 h-3 rounded"
                        />
                        <span className="text-xs text-gray-600">
                          I agree to the{" "}
                          <a href="/terms" className="text-emerald-600">
                            Terms
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-emerald-600">
                            Privacy
                          </a>
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg font-semibold text-sm hover:bg-emerald-700"
                        >
                          {loading ? "Creating..." : "Create account"}
                        </button>
                        <button
                          type="button"
                          onClick={handleBackToAccountType}
                          className="flex-1 border border-emerald-600 text-emerald-600 py-1.5 rounded-lg font-semibold text-sm hover:bg-emerald-50"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
