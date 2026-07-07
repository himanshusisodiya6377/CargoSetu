import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthShell from "./AuthShell";

const initialState = {email: "", password: ""};

export const Login = ()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const {isLoading, isLoggedIn} = useSelector((state) => state.auth);

  const handleChange = (e) =>setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) =>{
    e.preventDefault();
    const email = formData.email.trim();
    if(!email || !formData.password) return toast.error("All fields are required");
    dispatch(login({ ...formData, email }));
  };

  useEffect(()=>{
    if(isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  return(
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to"
      accent="CargoSetu"
      description="Sign in to access your dashboard, track bids, and manage your loads from one place."
      points={[
        "Quick access to active loads",
        "Track bids and delivery status",
        "Secure, verified account access",
      ]}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={lbl}>Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inp} />
        </div>

        <div>
          <label className={lbl}>Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className={`${inp} pr-10`} />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className={btn}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <NavLink to="/register" className="text-green font-medium hover:underline">Sign up</NavLink>
        </p>
      </form>
    </AuthShell>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-[#0F172A] hover:bg-[#111827] text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";
