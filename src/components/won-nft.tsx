import { FC } from "react"

interface WonNftProps {
  src: string
}

export const WonNft: FC<WonNftProps> = ({ src }) => {
  return (
    <div className="won-nft">
      <img src={src} alt="won nft" />
      <div style={{ textAlign: "center" }}>Text for congratulations</div>
    </div>
  )
}