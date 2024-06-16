import "./create-token.scss";

import { ClipLoader } from "react-spinners";
import useAppObjMenu from "hooks/useAppObjMenu";
import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { CameraPlus, CaretDoubleRight, CaretUp } from "@phosphor-icons/react";

const CreateToken = () => {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");

  const [TokenMenu, selectedToken] = useAppObjMenu({
    uppercase: true,
    objecKey: "symbol",
    toggleCallback: (val) => {},
    items: [],
  });

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
    <div className="createToken">
      <div className="createToken__image-display">
        <img src={`/assets/images/5.jpg`} alt="random images display" />
      </div>

      <div className="createToken__form">
        <div className="createToken__form--inner">
          {/* IMAGE SELECTION */}
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
                name="ramp-fun-[image]"
                onChange={onSelectFile}
                className="image-file-input"
              />

              <button className="add-image-btn">
                <CameraPlus size={18} weight="regular" />
              </button>
            </div>
          </div>

          {/* HEADER TEXT */}
          <div className="createToken__form--header">
            <div className="createToken__form--header-block">
              <h2>Create new Token</h2>
              <p>
                Launch a new token by supplying the details below <br /> You can
                add add your social media links and website
                <br />
              </p>
            </div>
          </div>

          {/* INPUTS */}
          <div className="createToken__form--body">
            <div className="c-input">
              <div className="c-input__block">
                <input
                  value={name}
                  maxLength={32}
                  placeholder="Token name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="c-input">
              <div className="c-input__block">
                <input
                  value={ticker}
                  maxLength={32}
                  placeholder="Token ticker"
                  onChange={(e) => setTicker(e.target.value)}
                />
              </div>
            </div>

            <div className="c-textarea">
              <textarea
                maxLength={200}
                value={description}
                placeholder="Token description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Accordion>
              <AccordionItem
                header={({ state }) => (
                  <div className="optional-accordion">
                    <p>More options</p>

                    <div className="bttn chevron" data-closed={!state.isEnter}>
                      <CaretUp size={15} weight="bold" />
                    </div>
                  </div>
                )}
              >
                <>
                  <div className="c-input">
                    <div className="c-input__block">
                      <input
                        maxLength={32}
                        value={twitter}
                        placeholder="Twitter link (optional)"
                        onChange={(e) => setTwitter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="c-input">
                    <div className="c-input__block">
                      <input
                        maxLength={32}
                        value={telegram}
                        placeholder="Telegram link (optional)"
                        onChange={(e) => setTelegram(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="c-input">
                    <div className="c-input__block">
                      <input
                        maxLength={32}
                        value={website}
                        placeholder="Website (optional)"
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              </AccordionItem>
            </Accordion>

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
        </div>
      </div>
    </div>
  );
};

export default CreateToken;
