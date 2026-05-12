import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { register, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Title, Body, Caption, Loader } from "../../routes/index";

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
    if(!name || !email || !password || !confirmPassword) return toast.error("All fields are required");
    if(password.length < 8) return toast.error("Password must be at least 8 characters");
    if(password !== confirmPassword) return toast.error("Passwords do not match");
    dispatch(register({name, email, password, role}));
  };

  useEffect(() =>{
    if(isSuccess) { navigate("/login"); dispatch(RESET()); }
    if(isError) { toast.error(message || "Registration failed"); dispatch(RESET())}
  }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <section className="bg-slate-900 pt-24 pb-16">
          <Container className="text-center text-white">
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Get Started</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              Join <span className="text-yellow-300">CargoSetu</span> Today
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              Register as a Sender to post loads, or as a Driver to bid and win freight contracts.
            </Body>
          </Container>
        </section>

        <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

        <section className="bg-white pb-24">
          <Container>
            <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8">
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
                </div>

                <div>
                  <label className={lbl}>Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" className={inp} />
                </div>

                <div>
                  <label className={lbl}>Register as</label>
                  <select name="role" value={formData.role} onChange={handleChange} className={inp}>
                    <option value="Driver">Driver</option>
                    <option value="Sender">Sender</option>
                  </select>
                </div>

                <button type="submit" disabled={isLoading} className={btn}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <NavLink to="/login" className="text-green font-medium hover:underline">Log in</NavLink>
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
