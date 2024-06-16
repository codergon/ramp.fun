import "./create-token.scss";
import { ClipLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { CameraPlus, CaretDoubleRight } from "@phosphor-icons/react";
import TokenForm from "./tokenForm";

const CreateTokenModal = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");

  // HANDLE IMAGE UPLOAD
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    // create the preview
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile as Blob);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <div className="base-modal create-token">
      <div className="c-img-input">
        <div
          className="c-img-input__preview"
          onClick={() => {
            if (imageRef.current) {
              imageRef.current.click();
            }
          }}
        >
          <img alt="preview" src={preview || "./assets/images/1.webp"} />
          <input
            type="file"
            ref={imageRef}
            accept="image/*"
            multiple={false}
            name="supersub-[image]"
            onChange={onSelectFile}
            className="image-file-input"
          />

          <button className="add-image-btn">
            <CameraPlus size={18} weight="regular" />
          </button>
        </div>
      </div>

      <TokenForm
        name={name}
        setName={setName}
        recipient={recipient}
        description={description}
        setRecipient={setRecipient}
        setDescription={setDescription}
      />

      <div
        className={`base-btn ${loading ? "disabled" : ""}`}
        onClick={() => {}}
      >
        <p>Create token</p>

        {!loading && (
          <div className="base-btn__icon">
            <CaretDoubleRight size={15} weight="bold" />
          </div>
        )}

        {loading && (
          <div className="c-spinner">
            <ClipLoader
              size={16}
              color={"#fff"}
              loading={loading}
              aria-label="Loading Spinner"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTokenModal;
