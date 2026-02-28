import { trustList } from "../../utils/data";
import { Container, Heading } from "../../routes/index";

const Trust = () => {
  return (
    <section className=" bg-white">
      <Container>
        <Heading title="Trusted by Logistics Partners" subtitle="Leading transport and logistics companies rely on CargoSetu for transparent and cost-effective freight bidding."/>

        <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {trustList.map((item) => (
            <div key={item.id} className="flex items-center justify-center p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition">
              <img src={item.logo} alt={item.name} className="h-10 max-w-[140px] object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Trust;
