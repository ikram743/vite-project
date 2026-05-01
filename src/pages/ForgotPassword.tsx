// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../lib/API";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-envelope text-2xl text-emerald-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email envoyé !
          </h2>
          <p className="text-gray-600 mb-4">
            Si un compte existe avec l'adresse <strong>{email}</strong>, vous
            recevrez un lien de réinitialisation.
          </p>
          <Link
            to="/auth?mode=signin"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Mot de passe oublié ?
          </h1>
          <p className="text-gray-500 mt-2">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          <Link
            to="/auth?mode=signin"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword; // import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './ForgotPassword.css';

// const ForgotPassword: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log('Reset password for:', email);
//     setSubmitted(true);
//   };

//   return (
//     <div className="forgot-password-page">
//       <div className="forgot-password-container">
//         <div className="forgot-password-header">
//           <Link to="/" className="logo">
//             <i className="fas fa-leaf"></i>
//             <span>FoodShare</span>
//           </Link>
//           <h1>Forgot password?</h1>
//           <p className="subtitle">Enter your email address and we'll send you a link to reset your password.</p>
//         </div>

//         {!submitted ? (
//           <form onSubmit={handleSubmit} className="forgot-password-form">
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 placeholder="your@email.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <button type="submit" className="btn-primary btn-block">
//               Send reset link
//             </button>

//             <p className="back-to-login">
//               <Link to="/login">← Back to sign in</Link>
//             </p>
//           </form>
//         ) : (
//           <div className="success-message">
//             <i className="fas fa-check-circle"></i>
//             <h2>Check your email</h2>
//             <p>We've sent a password reset link to <strong>{email}</strong></p>
//             <Link to="/login" className="btn-primary btn-block">Back to sign in</Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
