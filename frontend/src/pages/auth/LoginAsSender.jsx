import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserAsSeller, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Title, Body, Caption, Loader } from "../../routes/index";

const initialState = { email: "", password: "" };

export const LoginAsSender = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) return toast.error("All fields are required");
    // Use loginUserAsSeller which calls the /sender endpoint
    dispatch(loginUserAsSeller({ email, password }));
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
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Sender Portal</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              Login as <span className="text-yellow-300">Sender</span>
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              Access your sender dashboard to post loads, track shipments, and manage your freight with CargoSetu.
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
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className={inp} />
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
          </Container>
        </section>
      </div>
    </>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";
