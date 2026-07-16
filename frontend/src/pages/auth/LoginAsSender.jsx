import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { becomeSender, RESET } from "../../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Container, Title, Body, Caption, Loader } from "../../routes/index";

export const LoginAsSender = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message, user } = useSelector((state) => state.auth);
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);

  const isLoggedIn = !!user;
  const currentRole = user?.role;

  const handleBecomeSender = () => {
    dispatch(becomeSender());
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard", { replace: true });
      dispatch(RESET());
    }
    if (isError) {
      toast.error(message || "Something went wrong");
      dispatch(RESET());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  if (isLoggedIn && currentRole === "Sender") {
    navigate("/dashboard", { replace: true });
    return null;
  }

  if (!isLoggedIn) {
    return (
      <>
        <section className="bg-slate-900 pt-24 pb-16">
          <Container className="text-center text-white">
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Sender Portal</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              Become a <span className="text-yellow-300">Sender</span>
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              Please log in first to upgrade your account.
            </Body>
          </Container>
        </section>
        <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />
        <section className="bg-white pb-24">
          <Container>
            <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8 text-center">
              <p className="text-gray-600 mb-6">You need to be logged in to become a sender.</p>
              <NavLink
                to="/login"
                className="inline-block w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition text-center"
              >
                Go to Login
              </NavLink>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <section className="bg-slate-900 pt-24 pb-16">
          <Container className="text-center text-white">
            <Caption className="text-green-400 uppercase tracking-widest mb-3">Sender Portal</Caption>
            <Title level={3} className="text-white text-3xl sm:text-4xl leading-tight">
              Become a <span className="text-yellow-300">Sender</span>
            </Title>
            <Body className="text-slate-400 mt-4 max-w-sm mx-auto">
              Upgrade your account to start posting loads, track shipments, and manage your freight with CargoSetu.
            </Body>
          </Container>
        </section>

        <div className="bg-white w-full h-20 rounded-t-[40px] -mt-5" />

        <section className="bg-white pb-24">
          <Container>
            <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-s1 p-4 sm:p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Upgrade to Sender</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You are currently registered as a <strong>Driver</strong>. Upgrade your account to also post and manage loads as a Sender.
                </p>
                {!confirmUpgrade ? (
                  <button
                    onClick={() => setConfirmUpgrade(true)}
                    className="w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition"
                  >
                    Continue as Sender
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      Your role will change to <strong>Sender</strong>. You can continue bidding on active loads you've already won.
                    </p>
                    <button
                      onClick={handleBecomeSender}
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-green text-white font-semibold py-3 rounded-full transition disabled:opacity-60"
                    >
                      {isLoading ? "Upgrading..." : "Confirm Upgrade"}
                    </button>
                    <button
                      onClick={() => setConfirmUpgrade(false)}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default LoginAsSender;
