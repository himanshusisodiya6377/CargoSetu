import ReactDOM from "react-dom";

const Loader = () => {
  const loaderRoot = document.getElementById("loader");
  if (!loaderRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] bg-gray-950/80 flex items-center justify-center">
      <div className="custom-loader"></div>
    </div>,
    loaderRoot
  );
};

export default Loader;