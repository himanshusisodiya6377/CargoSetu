import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { PrimaryButton, Caption, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { updateLoad, getLoad } from "../../redux/features/loadSlice";

export const LoadEdit = ()=>{

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const [images,setImages] = useState([]);

  const [formData,setFormData] = useState({
    title: "",
    pickupLocation: "",
    dropLocation: "",
    weight: "",
    maxBudget: "",
    vehicleType: "TRUCK",
    cargoType: "GENERAL",
    bidStartTime: "",
    bidEndTime: "",
    description: "",
  });

  const {title,pickupLocation,dropLocation,weight,maxBudget,vehicleType,cargoType,bidStartTime,bidEndTime,description} = formData;

  useEffect(()=>{
    dispatch(getLoad(id)).then((res)=>{
      if(res.payload?.data){
        const load = res.payload.data;

        setFormData({
          title: load.title || "",
          pickupLocation: load.pickupLocation || "",
          dropLocation: load.dropLocation || "",
          weight: load.weight || "",
          maxBudget: load.maxBudget || "",
          vehicleType: load.vehicleType || "TRUCK",
          cargoType: load.cargoType || "GENERAL",
          bidStartTime: load.bidStartTime ? new Date(load.bidStartTime).toISOString().slice(0, 16) : "",
          bidEndTime: load.bidEndTime ? new Date(load.bidEndTime).toISOString().slice(0, 16) : "",
          description: load.description || "",
        });
      }
    });
  },[dispatch,id]);

  const handleInputChange =(e)=>{
    const {name,value} = e.target;

    setFormData((prev) =>({
      ...prev,
      [name]:value,
    }));
  };

  const handleImageChange =(e)=>{
    setImages(e.target.files);
  };

  const submitForm = (e)=>{
    e.preventDefault();

    const data = new FormData();

    if(title !== "") data.append("title", title);
    if(pickupLocation !== "") data.append("pickupLocation", pickupLocation);
    if(dropLocation !== "") data.append("dropLocation", dropLocation);
    if(weight !== "") data.append("weight", weight);
    if(maxBudget !== "") data.append("maxBudget", maxBudget);
    if(vehicleType !== "") data.append("vehicleType", vehicleType);
    if(cargoType !== "") data.append("cargoType", cargoType);
    if(bidStartTime !== "") data.append("bidStartTime", bidStartTime);
    if(bidEndTime !== "") data.append("bidEndTime", bidEndTime);
    if(description !== "") data.append("description", description);

    if(images.length > 0){
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }}

    // console.log(formData);
    dispatch(updateLoad({id, formData: data}))
      .unwrap()
      .then(()=>{
        navigate("/load");
      })};

  return (
    <section className="bg-white shadow-s1 p-4 sm:p-8 rounded-xl">
      <Title level={5} className="font-normal mb-5">Update Load</Title>
      <hr className="my-5" />
      <form className="space-y-4" onSubmit={submitForm}>
        <div>
          <Caption className="mb-2">Load Title</Caption>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            className={commonClassNameOfInput}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-1/2">
            <Caption className="mb-2">Pickup Location</Caption>
            <input
              type="text"
              name="pickupLocation"
              value={pickupLocation}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <Caption className="mb-2">Drop Location</Caption>
            <input
              type="text"
              name="dropLocation"
              value={dropLocation}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-1/2">
            <Caption className="mb-2">Weight</Caption>
            <input
              type="number"
              name="weight"
              value={weight}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <Caption className="mb-2">Max Budget</Caption>
            <input
              type="number"
              name="maxBudget"
              value={maxBudget}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
            />
          </div>

        </div>

        <div>
          <Caption className="mb-2">Vehicle Type</Caption>
          <select
            name="vehicleType"
            value={vehicleType}
            onChange={handleInputChange}
            className={commonClassNameOfInput}
          >
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

        <div className="flex gap-5">

          <div className="w-1/2">
            <Caption className="mb-2">Bid Start Time</Caption>
            <input
              type="datetime-local"
              name="bidStartTime"
              value={bidStartTime}
              onChange={handleInputChange}
              className={commonClassNameOfInput}
            />
          </div>

          <div className="w-1/2">
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
        </div>

        <PrimaryButton type="submit" className="rounded-none mt-5">
          Update Load
        </PrimaryButton>
      </form>
    </section>
  );
};