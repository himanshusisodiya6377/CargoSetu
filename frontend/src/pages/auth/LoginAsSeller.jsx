import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserAsSeller, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Container, Title, Body, Caption, Loader } from "../../routes/index";

const initialState = { email: "", password: "" };

export const LoginAsSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return toast.error("All fields are required");
    dispatch(loginUserAsSeller({ email: trimmedEmail, password }));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard", { replace: true });
      dispatch(RESET());
    }
    if (isError) {
      toast.error(message || "Login failed");
      dispatch(RESET());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <section className="bg-slate-900 pt-24 pb-16">
          <Container className="text-center text-white">
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Seller Portal</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              Login as <span className="text-yellow-300">Seller</span>
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              Access your seller dashboard to manage loads, track shipments, and grow your business with CargoSetu.
            </Body>
          </Container>
        </section>

        <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

        <section className="bg-white pb-24">
          <Container>
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
                  {isLoading ? "Logging in..." : "Login as Seller"}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Don&apos;t have a seller account?{" "}
                  <NavLink to="/register" className="text-green font-medium hover:underline">Sign up</NavLink>
                </p>
              </form>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";