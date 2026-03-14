import { Caption, Container, CustomNavLink, Loader, PrimaryButton, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUserAsSeller } from "../../redux/features/authSlice";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialState ={
  email: "",
  password: "",
};

export const LoginAsSeller = () =>{

      const dispatch = useDispatch();
    
      const [formData, setFormData] = useState(initialState);
      
      const {isLoading} = useSelector((state) => state.auth);
      
      const handleInputChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prev)=>({...prev,[name]: value}));
      };
      
      const {email,password}=formData; 
      
      const handleLogin = (e) =>{
        e.preventDefault();
        if(isLoading) return;
    
        if(!email || !password){
        return toast.error("All fields are required");
        }

        const userData={email,password};
    
        dispatch(loginUserAsSeller(userData));
      };

    //   useEffect(() => {
    //     if (isLoggedIn) {
    //     navigate("/dashboard");
    //    }
    //   }, [isLoggedIn, navigate]);

  return (
    <>
     {isLoading && <Loader/>}
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[20vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Login Seller
              </Title>
            </div>
          </Container>
        </div>
        <form onSubmit={handleLogin} className="bg-white shadow-s3 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 m-auto my-16 p-4 sm:p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>New Seller Member</Title>
            <p className="mt-2 text-lg">
              Don't you have an account? <CustomNavLink href="/create-account">Signup Here</CustomNavLink>
            </p>
          </div>

          <div className="py-5 mt-8">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input value={email} type="email" onChange={handleInputChange} name="email" className={commonClassNameOfInput} placeholder="Enter Your Email" />
          </div>
          <div>
            <Caption className="mb-2">Password *</Caption>
            <input value={password} type="password" onChange={handleInputChange} name="password" className={commonClassNameOfInput} placeholder="Enter Your Password" />
          </div>
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" />
            <Caption>I agree to the Terms & Policy</Caption>
          </div>
          <PrimaryButton className="w-full rounded-none my-5 uppercase">Become Seller</PrimaryButton>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};