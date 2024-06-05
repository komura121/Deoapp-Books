import Navbar from "../LAYOUTS/Navbar";
import "../App.css";
import ChapListComponent from "../components/ChapListComponent";
import Footer from "../LAYOUTS/Footer";
import Background from "../LAYOUTS/Background";

function ChaptersPages() {
  return (
    <>
      <Navbar />
      <ChapListComponent />
      <Footer />
      <Background />
    </>
  );
}

export default ChaptersPages;
