import PropTypes from "prop-types";
import { Title } from "../common/Design";

const CategoryCard = ({ item }) => {
  return (
    <>
      <div className="flex items-center flex-col gap-2 py-8 rounded-lg bg-slate-200 shadow-s1">
        <div className="h-24">
          <img src={item.image} alt="" className="w-full h-full object-contain" />
        </div>
        <Title className="uppercase text-center">{item.title}</Title>
      </div>
    </>
  );
};

CategoryCard.propTypes = {
  item: PropTypes.any,
};

export default CategoryCard;