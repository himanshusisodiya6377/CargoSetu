import { processList } from "../../utils/data.jsx";
import { Container, Heading, Title } from "../../routes/index";

const Process = () =>{
  return (
    <section className="relative bg-slate-900 pb-32">
      <div className="absolute top-0 w-full h-20 bg-white rounded-b-[40px]" />
      <Container className="relative z-10 pt-24 text-white">
        <Heading title="How It Works" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {processList.map((item) =>(
            <div key={item.id} className="h-full bg-slate-700 rounded-xl p-8 flex flex-col items-center text-center transition hover:-translate-y-1">
              
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <img src={item.cover} alt={item.title} className="w-12 h-12 object-contain"/>
              </div>

              <Title level={5} className="text-white font-medium mb-3"> {item.title} </Title>

              <p className="text-sm text-gray-300 leading-relaxed flex-grow">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
      <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-[40px]" />
    </section>
  );
};

export default Process;
