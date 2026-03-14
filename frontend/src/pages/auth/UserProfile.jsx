import { useEffect, useState, useRef } from "react";
import { Caption } from "../../routes/index";
import { User2 } from "../../component/hero/Hero";
import { commonClassNameOfInput, PrimaryButton } from "../../component/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "../../redux/features/authSlice";
import { toast } from "react-toastify";

const UserProfile = () =>{
  useRedirectLoggedOutUser("/login");

  const {user, isLoading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({name: "", phone: ""});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() =>{
    if (!user) dispatch(getUserProfile());
  }, [dispatch, user]);

  useEffect(() =>{
    if (user) {
      setFormData({ name: user.name || "", phone: user.phone || "" });
      setPhotoPreview(user.photo || "");
    }
  }, [user]);

  const handleChange = (e) =>{
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handlePhotoChange = (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file)); // show local preview instantly
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.name.trim()){
      toast.error("Name cannot be empty");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    if(photoFile) data.append("photo",photoFile);

    const result = await dispatch(updateUserProfile(data));
    if(updateUserProfile.fulfilled.match(result)){
      toast.success("Profile updated successfully");
      setPhotoFile(null);
    }else{
      toast.error(result.payload || "Failed to update profile");
    }
  };

  return(
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        <p className="text-gray_100 text-sm mt-1">View and manage your personal information.</p>
      </div>
    
      <div className="shadow-s1 p-6 rounded-lg">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
            <img src={photoPreview || User2} alt="Profile" className="w-20 h-20 rounded-full object-cover cursor-pointer" onClick={() => fileInputRef.current.click()}/>
            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-gray-600 hover:bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded-full transition">
              Edit
            </button>
            <input ref={fileInputRef} type="file" accept="image/png, image/jpg, image/jpeg" className="hidden" onChange={handlePhotoChange}/>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">{user?.name || "—"}</h3>
            <p className="text-sm text-gray_100">{user?.email}</p>
            <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green_100 text-green">
              {user?.role}
            </span>
          </div>
        </div>

        <hr className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Caption className="mb-2">Full Name</Caption>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`capitalize ${commonClassNameOfInput}`}
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Caption className="mb-2">Contact Number</Caption>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={commonClassNameOfInput}
                placeholder="Contact number"
              />
            </div>
            <div>
              <Caption className="mb-2">Email</Caption>
              <input
                type="email"
                value={user?.email || ""}
                className={`${commonClassNameOfInput} bg-gray-50 cursor-not-allowed`}
                disabled
              />
            </div>
          </div>

          <div>
            <Caption className="mb-2">Role</Caption>
            <input
              type="text"
              value={user?.role || ""}
              className={`${commonClassNameOfInput} bg-gray-50 cursor-not-allowed`}
              disabled
            />
          </div>

          <div>
            <Caption className="mb-2">Profile Photo</Caption>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Choose Image
              </button>
              <span className="text-sm text-gray_100">
                {photoFile ? photoFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </PrimaryButton>

        </form>
      </div>

    </section>
  );
};

export default UserProfile;