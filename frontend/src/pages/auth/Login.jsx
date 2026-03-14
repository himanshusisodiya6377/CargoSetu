import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Title, Body, Caption } from "../../routes/index";

const initialState = {email: "", password: ""};

export const Login = ()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const {isLoading, isLoggedIn} = useSelector((state) => state.auth);

  const handleChange = (e) =>setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(!formData.email || !formData.password) return toast.error("All fields are required");
    dispatch(login(formData));
  };

  useEffect(()=>{
    if(isLoggedIn) navigate("/dashboard", { replace: true });
  }, [isLoggedIn, navigate]);

  return(
    <div>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container className="text-center text-white">
          <Caption className="text-green-400 uppercase tracking-widest mb-3">Welcome Back</Caption>
          <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
            Log in to <span className="text-yellow-300">CargoSetu</span>
          </Title>
          <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
            Access your dashboard, track loads and manage your freight — all in one place.
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
                {isLoading ? "Logging in..." : "Log In"}
              </button>

              <p className="text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <NavLink to="/register" className="text-green font-medium hover:underline">Sign up</NavLink>
              </p>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

const lbl = "block text-sm font-medium text-slate-600 mb-1.5";
const inp = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";
const btn = "w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60 mt-1";
