import "./wallet-icon.scss";
import makeBlockie from "ethereum-blockies-base64";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

interface WalletIconProps {
  size?: number;
  address: string;
  jazzicon?: boolean | null;
}

const WalletIcon = ({
  size = 20,
  address = "",
  jazzicon = null,
}: WalletIconProps) => {
  const { useJazzicons } = { useJazzicons: true };

  return (
    <div
      className="c-wallet-icon"
      style={{
        width: size,
        height: size,
        borderRadius: size,
      }}
    >
      {jazzicon === true || (jazzicon === null && !!useJazzicons) ? (
        <Jazzicon diameter={size} seed={jsNumberForAddress(address!)} />
      ) : (
        <img src={makeBlockie(address!)} />
      )}
    </div>
  );
};

export default WalletIcon;
