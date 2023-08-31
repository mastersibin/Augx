import { useEffect, useState } from "react";
import ImageMin from "./ImageMin";
import "./Library.css";
function Library(props) {
  const [images, setImages] = useState([]);
  // const [intervalId, setIntervalId] = useState();

  const fetchMethod = () => {
    fetch("http://localhost:3333" + "/library", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setImages(res.images));
  };

  useEffect(() => {
    fetchMethod();
    let x = setInterval(fetchMethod, 5000);
    // setIntervalId(x)
    // return () => {
    //     clearInterval(intervalId)
    // }
  }, []);

  return (
    <div className="post-list">
      {images.map((image) => (
        <ImageMin
          key={
            image.url +
            image.liked +
            image.title +
            image.source +
            image.location +
            image.likes
          }
          image={image}
        />
      ))}
    </div>
  );
}
export default Library;
