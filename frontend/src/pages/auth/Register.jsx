import { commonClassNameOfInput } from "../../component/common/Design";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Caption,Container,CustomNavLink,Loader,PrimaryButton,Title } from "../../routes/index";
import { register,RESET } from "../../redux/features/authSlice";
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";

const initialState ={
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Register = () =>{

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData,setFormData] = useState(initialState);
  
  const {isLoading,isSuccess,isLoggedIn,message,isError} = useSelector((state) => state.auth);
  
  const handleInputChange = (e) =>{
    const {name, value} = e.target;
    setFormData({...formData,[name]: value});
  };
  
  const {name,email,password,confirmPassword}=formData; 
  
  const handleRegister = (e) =>{
    e.preventDefault();
    if(isLoading) return;

    if(!name || !email || !password || !confirmPassword){
    return toast.error("All fields are required");
    }

    if(password.length < 8){
    return toast.error("Password must be at least 8 characters");
    }

    if(password !== confirmPassword) {
    return toast.error("Password does not match");
  }

  const userData = {name,email,password};

  dispatch(register(userData));
  };

  useEffect(() => {
  if(isSuccess && isLoggedIn) {
    navigate("/login");
  }

  if(isError){
    toast.error(message || "Registration failed");
  }

  return () => {
    dispatch(RESET());
  };
}, [dispatch, isLoggedIn, isSuccess, isError, message, navigate]);

  return (
    <>
    {isLoading && <Loader/>}
    <section className="register pt-10 sm:pt-16 relative overflow-hidden">
      <div className="hidden sm:block bg-green w-72 h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl absolute top-1/2 -translate-y-1/2"></div>

      <div className="bg-[#241C37] py-6 sm:py-8 relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">Sign Up</Title>
          </div>
        </Container>
      </div>

      <div className="px-4">
        <form
          onSubmit={handleRegister}
          className="bg-white shadow-s3 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-10 sm:my-16 p-5 sm:p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Sign Up</Title>
            <p className="mt-2 text-sm sm:text-lg">
              Do you already have an account?{" "}
              <CustomNavLink href="/login">Log In Here</CustomNavLink>
            </p>
          </div>

          <div className="py-4 sm:py-5">
            <Caption className="mb-2">Username *</Caption>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
              placeholder="First Name"
              required
            />
          </div>

          <div className="py-4 sm:py-5">
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

          <div className="py-4 sm:py-5">
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

          <div>
            <Caption className="mb-2">Confirm Password *</Caption>
            <input
              type="password"
              name="confirmPassword"
               value={confirmPassword}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="flex items-start gap-2 py-4 text-sm sm:text-base">
            <input type="checkbox" className="mt-1" />
            <Caption>I agree to the Terms & Policy</Caption>
          </div>

          <PrimaryButton className="w-full rounded-none my-5">
            {isLoading ? "Creating..." : "CREATE ACCOUNT"}
          </PrimaryButton>

          <p className="text-center mt-5 text-sm sm:text-base">
            By clicking the signup button, you create a Cobiro account, and you agree to Cobiros{" "}
            <span className="text-green underline">
              Terms & Conditions
            </span>{" "}
            &{" "}
            <span className="text-green underline">Privacy Policy</span>.
          </p>
        </form>
      </div>

      <div className="hidden sm:block bg-green w-72 h-72 md:w-96 md:h-96 rounded-full opacity-20 blur-3xl absolute bottom-40 right-0"></div>
    </section>
    </>
  );
};