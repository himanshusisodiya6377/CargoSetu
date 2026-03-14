import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createLoad } from "../../redux/features/loadSlice";
import { Caption, Title } from "../../routes";
import { commonClassNameOfInput, PrimaryButton } from "../../component/common/Design";
import { MdMyLocation } from "react-icons/md";

const initialState = {
title: "",
maxBudget: "",
description: "",
pickupLocation: "",
dropLocation: "",
weight: "",
length: "",
width: "",
height: "",
vehicleType: "",
cargoType: "",
bidStartTime: "",
bidEndTime: "",
};

const AddLoad = () =>{

const dispatch = useDispatch();
const navigate = useNavigate();

const [load,setLoad] = useState(initialState);
const [images, setImages] = useState([]);
const [previewImages,setPreviewImages] = useState([]);
const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
const [coordsStatus,setCoordsStatus] = useState(""); //"detecting" | "detected" | "failed"
 
const {isSuccess} = useSelector((state) => state.load);

const detectPickupLocation = ()=>{
  if(!navigator.geolocation){
    setCoordsStatus("failed");
    return;
  }
  setCoordsStatus("detecting");
  navigator.geolocation.getCurrentPosition(
    (pos) =>{
      setPickupCoords({lat: pos.coords.latitude, lng: pos.coords.longitude});
      setCoordsStatus("detected");
    },
    () =>setCoordsStatus("failed"),
    {timeout: 8000}
  );
};

const {title,maxBudget,description,pickupLocation,dropLocation,weight,length,width,height,vehicleType,cargoType,bidStartTime,bidEndTime} = load;

const handleInputChange = (e) =>{
const {name,value} = e.target;
setLoad({...load, [name]: value});
};

const handleImageChange = (e)=>{
const files = Array.from(e.target.files);
setImages(files);

const previews = files.map((file)=>URL.createObjectURL(file));
setPreviewImages(previews);
};

const handleSubmit = (e)=>{
e.preventDefault();
  console.log("Form data before send:", {title,length,width,height,weight});
const formData = new FormData();

formData.append("title", title || "");
formData.append("description", description || "");
formData.append("pickupLocation", pickupLocation || "");
formData.append("dropLocation", dropLocation || "");
if(pickupCoords.lat !==null && pickupCoords.lng !==null){
  formData.append("pickupLat", pickupCoords.lat);
  formData.append("pickupLng", pickupCoords.lng);
}
formData.append("maxBudget", maxBudget || "");
formData.append("weight", weight || "");
formData.append("dimensions[length]", length || "");
formData.append("dimensions[width]", width || "");
formData.append("dimensions[height]", height || "");
formData.append("vehicleType", vehicleType);
formData.append("cargoType", cargoType);
formData.append("bidStartTime", bidStartTime);
formData.append("bidEndTime", bidEndTime);

images.forEach((img) =>{
  formData.append("images", img)});

dispatch(createLoad(formData));
};

useEffect(()=>{
if(isSuccess){
navigate("/dashboard");
}},[isSuccess,navigate]);

return (
<section className="shadow-s1 p-4 sm:p-8 rounded-xl bg-white max-w-6xl mx-auto">
  <Title level={5} className="font-normal">Create Load</Title>
  <hr className="my-6" />
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <Caption className="mb-2">Load Title *</Caption>
      <input
        type="text"
        name="title"
        value={title}
        onChange={handleInputChange}
        className={commonClassNameOfInput}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <Caption className="mb-2">Pickup Location *</Caption>
        <input
          type="text"
          name="pickupLocation"
          value={pickupLocation}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
        <button
          type="button"
          onClick={detectPickupLocation}
          className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <MdMyLocation size={14} />
          {coordsStatus === "detecting" ? "Detecting…" : coordsStatus === "detected" ? `✓ Location captured (${pickupCoords.lat.toFixed(4)}, ${pickupCoords.lng.toFixed(4)})` : coordsStatus === "failed" ? "Could not get location — try again" : "Auto-detect pickup coordinates"}
        </button>
      </div>

      <div>
        <Caption className="mb-2">Drop Location *</Caption>
        <input
          type="text"
          name="dropLocation"
          value={dropLocation}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <Caption className="mb-2">Max Budget (₹)</Caption>
        <input
          type="number"
          name="maxBudget"
          value={maxBudget}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>

      <div>
        <Caption className="mb-2">Weight (kg)</Caption>
        <input
          type="number"
          name="weight"
          value={weight}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div>
        <Caption className="mb-2">Length</Caption>
        <input
          type="number"
          name="length"
          value={length}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>

      <div>
        <Caption className="mb-2">Width</Caption>
        <input
          type="number"
          name="width"
          value={width}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>

      <div>
        <Caption className="mb-2">Height</Caption>
        <input
          type="number"
          name="height"
          value={height}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <Caption className="mb-2">Vehicle Type *</Caption>
        <select
          name="vehicleType"
          value={vehicleType}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        >
          <option value="">Select vehicle</option>
          <option value="BIKE">Bike</option>
          <option value="AUTO">Auto</option>
          <option value="MINI_TRUCK">Mini Truck</option>
          <option value="TRUCK">Truck</option>
          <option value="CONTAINER">Container</option>
          <option value="TRAILER">Trailer</option>
        </select>
      </div>

      <div>
        <Caption className="mb-2">Cargo Type</Caption>
        <select
          name="cargoType"
          value={cargoType}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        >
          <option value="GENERAL">General</option>
          <option value="FRAGILE">Fragile</option>
          <option value="LIQUID">Liquid</option>
          <option value="PERISHABLE">Perishable</option>
          <option value="HEAVY">Heavy</option>
          <option value="HAZARDOUS">Hazardous</option>
        </select>
      </div>
    </div>

    {/*Bidding Time */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <Caption className="mb-2">Bid Start Time</Caption>
        <input
          type="datetime-local"
          name="bidStartTime"
          value={bidStartTime}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>

      <div>
        <Caption className="mb-2">Bid End Time</Caption>
        <input
          type="datetime-local"
          name="bidEndTime"
          value={bidEndTime}
          onChange={handleInputChange}
          className={commonClassNameOfInput}
        />
      </div>
    </div>

    {/* Description */}
    <div>
      <Caption className="mb-2">Description</Caption>
      <textarea
        name="description"
        rows="4"
        value={description}
        onChange={handleInputChange}
        className={commonClassNameOfInput}
      />
    </div>

    {/* Images */}
    <div>
      <Caption className="mb-2">Cargo Images</Caption>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className={commonClassNameOfInput}
      />

      <div className="flex flex-wrap gap-3 mt-3">
        {previewImages.map((img, index) =>(
          <img
            key={index}
            src={img}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md"
          />
        ))}
      </div>
    </div>

    <PrimaryButton type="submit" className="rounded-none mt-5">
      CREATE LOAD
    </PrimaryButton>
  </form>
</section>
);
};

export default AddLoad;
