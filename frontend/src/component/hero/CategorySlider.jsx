import { categorylists } from "../../utils/data";
import { CategoryCards, Container, Heading } from "../../routes/index";

const CategorySlider = () => {
  return (
    <>
      <section className="catgeory-slider pb-16">
        <Container>
          <Heading title="Browse Load Categories" subtitle="Find loads based on cargo and vehicle requirements" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5 my-8">
            {categorylists.map((item) => (
              <CategoryCards key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default CategorySlider;