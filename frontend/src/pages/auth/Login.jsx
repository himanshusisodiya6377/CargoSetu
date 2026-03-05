import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../redux/features/authSlice";
import { commonClassNameOfInput } from "../../component/common/Design";
import { Caption,Container,CustomNavLink,PrimaryButton,Title} from "../../routes/index";
import { useDispatch,useSelector } from "react-redux";

const initialState ={
  email: "",
  password: "",
};

export const Login = () =>{

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  
  const {isLoading, isLoggedIn, isError} = useSelector((state) => state.auth);
  
  const handleInputChange = (e) =>{
    const {name, value} = e.target;
    setFormData({...formData,[name]: value});
  };
  
  const {email,password}=formData; 
  
  const handleLogin = (e) =>{
    e.preventDefault();
    if(isLoading) return;

    if(!email || !password){
    return toast.error("All fields are required");
    }

    dispatch(login({email,password}));
  };

  useEffect(() =>{
  if (isLoggedIn){
    navigate("/");
  }
  }, [isLoggedIn, isError, navigate]);

  return (
    <section className="register pt-10 sm:pt-16 relative overflow-hidden">
      <div className="hidden sm:block bg-green w-72 h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl absolute top-1/2 -translate-y-1/2"></div>
      <div className="bg-[#241C37] py-6 sm:py-8 relative content">
        <Container>
          <Title level={3} className="text-white"> LogIn </Title>
        </Container>
      </div>

      <div className="px-4">
        <form onSubmit={handleLogin} className="bg-white shadow-s3 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-10 sm:my-16 p-5 sm:p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Welcome Back</Title>
            <p className="mt-2 text-sm sm:text-lg">
              Don't have an account?{" "}
              <CustomNavLink href="/register">Signup Here</CustomNavLink>
            </p>
          </div>

          <div className="py-4 sm:py-5 mt-6 sm:mt-8">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div>
            <Caption className="mb-2">Password *</Caption>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
              placeholder="Enter Your Password"
              required
            />
          </div>

          <PrimaryButton className="w-full rounded-none my-5">
            LOGIN
          </PrimaryButton>
        </form>
      </div>

      <div className="hidden sm:block bg-green w-72 h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl absolute bottom-40 right-0"></div>
    </section>
  );
};