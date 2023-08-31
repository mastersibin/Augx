import { useEffect, useState } from "react";
import "./ImageMin.css";
function ImageMin(props) {
  const [liked, setLiked] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    setLiked(props.image.liked);
  }, []);

  const onLike = () => {
    // setLiked(!liked)
    if (liked === false)
      fetch("http://localhost:3333" + "/like", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: props.image.url,
        }),
      });
    else
      fetch("http://localhost:3333" + "/unlike", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: props.image.url,
        }),
      });
  };

  const onDlt = () => {
    fetch("http://localhost:3333" + "/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: props.image.url,
      }),
    }).then((res) => setDeleted(true));
  };

  const onTitleClick = () => {
    let newTitle = prompt("Enter new title");
    fetch("http://localhost:3333" + "/changeTitle", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: props.image.url,
        title: newTitle,
      }),
    });
  };

  const onSourceClick = () => {
    let newSource = prompt("Enter source");
    fetch("http://localhost:3333" + "/changeSource", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: props.image.url,
        source: newSource,
      }),
    });
  };

  const onLocationClick = () => {
    let newLocation = prompt("Enter location");
    fetch("http://localhost:3333" + "/changeLocation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: props.image.url,
        location: newLocation,
      }),
    });
  };

  return (
    <div className="post-card">
      <div>
        <h3 onClick={() => onTitleClick()}>{props.image.title}</h3>
        <img
          className="post-card-img"
          src={"http://localhost:3333/image/" + props.image.url}
        />
        {liked ? (
          <button className="btn btn-success m-3" onClick={() => onLike()}>
            Liked <span class="badge badge-light">{props.image.likes}</span>
          </button>
        ) : (
          <button className="btn btn-primary m-3" onClick={() => onLike()}>
            Like <span class="badge badge-light">{props.image.likes}</span>
          </button>
        )}
        {deleted ? (
          <button className="btn btn-danger m-3">Deleted</button>
        ) : (
          <button className="btn btn-danger m-3" onClick={() => onDlt()}>
            Delete
          </button>
        )}

        <h6 className="m-3" onClick={() => onSourceClick()}>
          Source: {props.image.source}
        </h6>
        <h6 className="m-3" onClick={() => onLocationClick()}>
          Location: {props.image.location}
        </h6>
      </div>
    </div>
  );
}
export default ImageMin;
