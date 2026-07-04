import PropTypes from "prop-types";
import { Body, Caption, Container, Title } from "../../routes/index";

const AuthShell = ({ eyebrow, title, accent, description, points, children }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 pt-24 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-white">
            <Caption className="text-green-400 uppercase tracking-[0.28em] mb-3">{eyebrow}</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight max-w-2xl">
              {title} <span className="text-yellow-300">{accent}</span>
            </Title>
            <Body className="text-slate-400 mt-5 leading-7 max-w-xl">
              {description}
            </Body>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-2xl">
              {points.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                  <p className="text-sm font-medium text-white">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-white/5 blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/20">
              <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                <p className="text-sm font-semibold text-white">CargoSetu Access</p>
                <p className="text-xs text-slate-400">Transparent freight bidding, in one place</p>
              </div>
              <div className="p-5 sm:p-8 bg-white text-slate-900">
                {children}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

AuthShell.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthShell;