import { truncate } from "utils/HelperUtils";
import useAppObjMenu from "hooks/useAppObjMenu";
import { CaretDown } from "@phosphor-icons/react";

interface TokenFormArgs {
  name: string;
  recipient: string;
  description: string;
  setName: (name: string) => void;
  setRecipient: (recipient: string) => void;
  setDescription: (description: string) => void;
}

const TokenForm = ({
  name,
  setName,
  recipient,
  description,
  setRecipient,
  setDescription,
}: TokenFormArgs) => {
  const [TokenMenu, selectedToken] = useAppObjMenu({
    uppercase: true,
    objecKey: "symbol",
    toggleCallback: (val) => {},
    items: [],
  });

  const [ChainMenu, selectedChain] = useAppObjMenu({
    uppercase: false,
    objecKey: "chain_name",
    menuClass: "chain-menu",
    toggleCallback: (val) => {},
    items: [],
  });

  return (
    <>
      <div className="base-modal__header">
        <div className="base-modal__header-block">
          <h2>Create new Token</h2>
          <p>
            Create subscription plans for your customers to subscribe
            <br /> You can create multiple plans with different features.
          </p>
        </div>
      </div>

      <div className="base-modal__body">
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

        <div className="c-textarea">
          <textarea
            maxLength={200}
            value={description}
            placeholder="Token description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="row-block">
          <div className="row-block__inner">
            <TokenMenu>
              <div className="menu-trigger">
                <div className="r-block">
                  <div className="menu-trigger__icon">
                    <img src={selectedToken?.image_url} alt="" />
                  </div>

                  <p>
                    {selectedToken?.["symbol"]}{" "}
                    <span>({truncate(selectedToken?.["address"], 16)})</span>
                  </p>
                </div>

                <CaretDown size={16} weight="bold" />
              </div>
            </TokenMenu>
          </div>
        </div>

        <div className="base-input">
          <ChainMenu>
            <div
              className="r-block"
              style={{
                cursor: "pointer",
              }}
            >
              <div className="base-input--icon">
                <img alt="" src={selectedChain?.image_url} />
              </div>

              <p
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                }}
              >
                {selectedChain.short_name}
              </p>

              <CaretDown
                size={16}
                weight="bold"
                style={{
                  marginTop: "-2px",
                }}
              />
            </div>
          </ChainMenu>

          <div className="base-input__block">
            <input
              value={recipient}
              placeholder="Destination address"
              onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenForm;
