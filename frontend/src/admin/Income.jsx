import {useUserProfile} from "../hooks/useUserProfile";
import {Title} from "../routes/index";
import {CgDollar} from "react-icons/cg";

const Income = ()=>{
    const {commission} = useUserProfile();

  return (
    <>
      <section>
        <div className="shadow-s1 p-8 rounded-lg  mb-12">
          <Title level={5} className=" font-normal">Commission Income</Title>

          <div className="shadow-s3 py-16 my-16 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <CgDollar size={80} className="text-green" />
            <div>
              <Title level={1}>₹{commission}</Title>
              <Title>Total Income</Title>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Income;