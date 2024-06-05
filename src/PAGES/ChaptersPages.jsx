import Navbar from "../LAYOUT/Navbar";
import "../App.css";
import ChapListComponent from "../components/ChapListComponent";
import Footer from "../LAYOUT/Footer";
import Background from "../LAYOUT/Background";

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
