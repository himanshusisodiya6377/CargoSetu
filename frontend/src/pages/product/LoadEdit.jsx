import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Caption, Title } from "../../routes/index";
import { commonClassNameOfInput } from "../../component/common/Design";
import { updateLoad, getLoad } from "../../redux/features/loadSlice";
import { toast } from "react-toastify";

const BID_DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "360", label: "6 hours" },
  { value: "1440", label: "24 hours" },
];

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
    bidDuration: "60",
    description: "",
  });

  const [existingBidTimes, setExistingBidTimes] = useState(null);

  const {title,pickupLocation,dropLocation,weight,maxBudget,vehicleType,cargoType,bidDuration,description} = formData;

  useEffect(()=>{
    dispatch(getLoad(id)).then((res)=>{
      const loadData = res.payload?.data || res.payload;
      if(loadData?._id || loadData?.title){
        const load = loadData;
        const duration = load.bidDuration || 60;

        setFormData({
          title: load.title || "",
          pickupLocation: load.pickupLocation || "",
          dropLocation: load.dropLocation || "",
          weight: load.weight || "",
          maxBudget: load.maxBudget || "",
          vehicleType: load.vehicleType || "TRUCK",
          cargoType: load.cargoType || "GENERAL",
          bidDuration: String(duration),
          description: load.description || "",
        });

        setExistingBidTimes({
          start: load.bidStartTime,
          end: load.bidEndTime,
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
    if(description !== "") data.append("description", description);
    data.append("bidDuration", bidDuration);

    if(images.length > 0){
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }}

    dispatch(updateLoad({id, formData: data}))
      .unwrap()
      .then(()=>{
        toast.success("Load updated successfully");
        navigate("/load");
      })
      .catch((err)=>{
        toast.error(err || "Failed to update load");
      });
  };

  const now = new Date();
  const newStart = new Date(now.getTime() + 5 * 60 * 1000);
  const newEnd = new Date(newStart.getTime() + parseInt(bidDuration || 60) * 60 * 1000);

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
          {existingBidTimes && (
            <p className="text-xs text-gray_100 mt-1">
              Originally scheduled: {new Date(existingBidTimes.start).toLocaleString()} &ndash; {new Date(existingBidTimes.end).toLocaleString()}.
              Changing the duration will recalculate times from now.
              Est. new start: {newStart.toLocaleString()} &middot; End: {newEnd.toLocaleString()}
            </p>
          )}
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

        <button type="submit" className="w-full bg-green text-white font-semibold rounded-lg px-16 py-3 hover:bg-primary transition shadow-md">
          UPDATE LOAD
        </button>
      </form>
    </section>
  );
};