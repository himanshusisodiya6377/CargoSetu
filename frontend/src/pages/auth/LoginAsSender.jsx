import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserAsSeller, becomeSender, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Container, Title, Body, Caption, Loader } from "../../routes/index";

const initialState = { email: "", password: "" };

export const LoginAsSender = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, isSuccess, isError, message, user } = useSelector((state) => state.auth);
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);

  const isLoggedIn = !!user;
  const currentRole = user?.role;

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return toast.error("All fields are required");
    dispatch(loginUserAsSeller({ email: trimmedEmail, password }));
  };

  const handleBecomeSender = () => {
    dispatch(becomeSender());
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard", { replace: true });
      dispatch(RESET());
    }
    if (isError) {
      toast.error(message || "Something went wrong");
      dispatch(RESET());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  if (isLoggedIn && currentRole === "Sender") {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <section className="bg-slate-900 pt-24 pb-16">
          <Container className="text-center text-white">
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Sender Portal</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              {isLoggedIn ? "Become a" : "Login as"}{" "}
              <span className="text-yellow-300">Sender</span>
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              {isLoggedIn
                ? "Upgrade your account to start posting loads, track shipments, and manage your freight with CargoSetu."
                : "Access your sender dashboard to post loads, track shipments, and manage your freight with CargoSetu."}
            </Body>
          </Container>
        </section>

        <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

        <section className="bg-white pb-24">
          <Container>
            {isLoggedIn && currentRole === "Driver" ? (
              <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Upgrade to Sender</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You are currently registered as a <strong>Driver</strong>. Upgrade your account to also post and manage loads as a Sender.
                  </p>
                  {!confirmUpgrade ? (
                    <button
                      onClick={() => setConfirmUpgrade(true)}
                      className="w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition"
                    >
                      Continue as Sender
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        Your role will change to <strong>Sender</strong>. You can continue bidding on active loads you've already won.
                      </p>
                      <button
                        onClick={handleBecomeSender}
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60"
                      >
                        {isLoading ? "Upgrading..." : "Confirm Upgrade"}
                      </button>
                      <button
                        onClick={() => setConfirmUpgrade(false)}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8">
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
                    {isLoading ? "Logging in..." : "Login as Sender"}
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    Don&apos;t have a sender account?{" "}
                    <NavLink to="/register" className="text-green font-medium hover:underline">Sign up</NavLink>
                  </p>
                </form>
              </div>
            )}
          </Container>
        </section>
      </div>
    </>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";