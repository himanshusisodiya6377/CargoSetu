import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createLoad } from "../../redux/features/loadSlice";
import { Caption, Title } from "../../routes";
import { commonClassNameOfInput } from "../../component/common/Design";
import { BID_DURATIONS } from "../../utils/data";

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
bidDuration: "60",
};

const AddLoad = () =>{

const dispatch = useDispatch();
const navigate = useNavigate();

const [load,setLoad] = useState(initialState);
const [images, setImages] = useState([]);
const [previewImages,setPreviewImages] = useState([]);

const {isSuccess} = useSelector((state) => state.load);

const {title,maxBudget,description,pickupLocation,dropLocation,weight,length,width,height,vehicleType,cargoType,bidDuration} = load;

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
const formData = new FormData();

formData.append("title", title || "");
formData.append("description", description || "");
formData.append("pickupLocation", pickupLocation || "");
formData.append("dropLocation", dropLocation || "");
formData.append("maxBudget", maxBudget || "");
formData.append("weight", weight || "");
formData.append("dimensions[length]", length || "");
formData.append("dimensions[width]", width || "");
formData.append("dimensions[height]", height || "");
formData.append("vehicleType", vehicleType);
formData.append("cargoType", cargoType);
formData.append("bidDuration", bidDuration);

images.forEach((img) =>{
  formData.append("images", img)});

dispatch(createLoad(formData));
};

useEffect(()=>{
if(isSuccess){
navigate("/dashboard");
}},[isSuccess,navigate]);

const [startTime] = useState(() => new Date(Date.now() + 5 * 60 * 1000));
const endTime = new Date(startTime.getTime() + parseInt(bidDuration || 60) * 60 * 1000);

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

    <div>
      <Caption className="mb-2">Bidding Duration</Caption>
      <select
        name="bidDuration"
        value={bidDuration}
        onChange={handleInputChange}
        className={commonClassNameOfInput}
      >
        {BID_DURATIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <p className="text-xs text-gray_100 mt-1">
        Bidding starts ~5 min after posting and runs for {BID_DURATIONS.find(d => d.value === bidDuration)?.label || "1 hour"}.
        Est. start: {startTime.toLocaleString()} &middot; End: {endTime.toLocaleString()}
      </p>
    </div>

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

    <button type="submit" className="w-full bg-green text-white font-semibold rounded-lg px-16 py-3 hover:bg-primary transition shadow-md">
      POST LOAD
    </button>
  </form>
</section>
);
};

export default AddLoad;