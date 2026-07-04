import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { register, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../routes/index";
import AuthShell from "./AuthShell";
import { getPasswordChecks, validatePassword } from "../../utils/passwordValidation";

const initialState = {name: "", email: "", password: "", confirmPassword: "", role: "Driver"};

export const Register = () =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) =>{
    e.preventDefault();
    const {name, email, password, confirmPassword, role} = formData;
    const emailTrimmed = email.trim();
    const passwordValidation = validatePassword(password);

    if(!name || !emailTrimmed || !password || !confirmPassword) return toast.error("All fields are required");
    if (!passwordValidation.valid) return toast.error(passwordValidation.errors[0]);
    if(password !== confirmPassword) return toast.error("Passwords do not match");
    dispatch(register({name: name.trim(), email: emailTrimmed, password, role}));
  };

  useEffect(() =>{
    if(isSuccess) { navigate("/login"); dispatch(RESET()); }
    if(isError) { toast.error(message || "Registration failed"); dispatch(RESET())}
  }, [isSuccess, isError, message, navigate, dispatch]);

  const passwordChecks = getPasswordChecks(formData.password);
  const unmetPasswordChecks = passwordChecks.filter((item) => !item.valid);
  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    passwordValidation.valid &&
    passwordsMatch
  );

  return (
    <>
      {isLoading && <Loader />}
      <AuthShell
        eyebrow="Get started"
        title="Join"
        accent="CargoSetu"
        description="Create your account to post loads as a Sender or place bids as a Driver."
        points={[
          "Post loads or place bids",
          "Verified access for safer operations",
          "Built for senders and drivers",
        ]}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={lbl}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ravi Sharma" className={inp} />
          </div>

          <div>
            <label className={lbl}>Email address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inp} />
          </div>

          <div>
            <label className={lbl}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 8 characters" className={inp} />
            {formData.password && unmetPasswordChecks.length > 0 && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Missing password requirements</p>
                <ul className="space-y-2">
                  {unmetPasswordChecks.map((item) => (
                    <li key={item.key} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs font-bold">•</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
                {passwordValidation.errors.length > 0 && (
                  <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {passwordValidation.errors[0]}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" className={inp} />
            {formData.confirmPassword && !passwordsMatch && (
              <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
            )}
          </div>

          <div>
            <label className={lbl}>Register as</label>
            <select name="role" value={formData.role} onChange={handleChange} className={inp}>
              <option value="Driver">Driver</option>
              <option value="Sender">Sender</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading || !isFormValid} className={btn}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <NavLink to="/login" className="text-green font-medium hover:underline">Log in</NavLink>
          </p>
        </form>
      </AuthShell>
    </>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-[#0F172A] hover:bg-[#111827] text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";
