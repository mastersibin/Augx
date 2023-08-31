import { useState } from "react";
import "./Upload.css";
function Upload() {
  const [uploadFilename, setUploadFileName] = useState("");
  const [uploadFile, setUploadFile] = useState();

  const onFileChange = (event) => {
    setUploadFileName(event.target.files[0].name);
    setUploadFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("image", uploadFile);
    fetch("http://localhost:3333" + "/upload", {
      method: "POST",
      credentials: "include",

      body: formData,
    }).then((res) => console.log(res));
  };

  return (
    <div class="frame">
      <div class="center">
        <div class="bar"></div>
        <div class="title">Drop file to upload</div>
        <div class="dropzone">
          <div class="content">
            <img
              src="https://100dayscss.com/codepen/upload.svg"
              class="upload"
            />
            <span class="filename">{uploadFilename}</span>
            <input type="file" class="input" onChange={onFileChange} />
          </div>
        </div>
        <img src="https://100dayscss.com/codepen/syncing.svg" class="syncing" />
        <img src="https://100dayscss.com/codepen/checkmark.svg" class="done" />
        <button class="upload-btn" onClick={onFileUpload}>
          Upload file
        </button>
      </div>
    </div>
  );
}

export default Upload;
