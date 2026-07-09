import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, resetContact } from "../redux/features/contactSlice";
import { Container, Title, Body, Caption } from "../routes/index";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { contactInfo } from "../utils/data.jsx";

const INITIAL = {name: "",email: "",subject: "",message: ""};

const Contact = ()=>{
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.contact);
  const [form, setForm] = useState(INITIAL);

  useEffect(() =>{
    if(isSuccess) setForm(INITIAL);
    return () => { dispatch(resetContact())};
  },[isSuccess, dispatch]);

  const handleChange = (e)=>setForm((p) =>({ ...p,[e.target.name]: e.target.value}));

  const handleSubmit = (e)=>{
    e.preventDefault();
    dispatch(sendContactMessage(form));
  };

  return (
    <div>
      <section className="bg-slate-900 pt-24 pb-16">
        <Container className="text-center text-white">
          <Caption className="text-green-400 uppercase tracking-widest mb-3">Contact Us</Caption>
          <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight max-w-2xl mx-auto">
            We're Here to <span className="text-yellow-300">Help You</span>
          </Title>
          <Body className="text-slate-400 leading-7 mt-5 max-w-xl mx-auto">
            Have a question or need support? Send us a message and we'll reply within 24-48 hours.
          </Body>
        </Container>
      </section>
      <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

      <section className="bg-white pb-20">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-2/5 flex flex-col gap-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-yellow-300 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-3/5">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FiCheckCircle size={28} />
                    </div>
                    <Title level={5} className="text-slate-800">Message Sent!</Title>
                    <Body className="text-slate-500 max-w-sm">
                      We've received your message and will get back to you within 24-48 hours.
                    </Body>
                    <button onClick={() => dispatch(resetContact())} className="text-sm text-green hover:underline font-medium">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <Title level={5} className="text-slate-800 mb-1">Send a Message</Title>
                    <Caption className="text-slate-400 mb-6">Fill in the details below and we'll get back to you.</Caption>
                    {isError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Full Name *</label>
                          <input required name="name" value={form.name} onChange={handleChange} placeholder="Ravi Sharma" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Email *</label>
                          <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="ravi@example.com" className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Subject *</label>
                        <input required name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Load dispute / General inquiry" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Message *</label>
                        <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe your issue or question..." className={inputClass + " resize-none"} />
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60">
                        {isLoading ? (
                          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <><FiSend size={15} /> Send Message</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";
const inputClass = "w-full px-4 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-green focus:border-green transition";

export default Contact;
