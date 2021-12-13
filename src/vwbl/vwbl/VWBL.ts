import Web3 from "web3";
import { VWBLNFT } from "../blockchain/VWBLProtocol";
import ManageKeyType from "../types/ManageKeyType";
import UploadImageType from "../types/UploadImageType";
import UploadMetadataType from "../types/UploadMetadataType";

type ConstructorProps = {
  web3: Web3;
  address: string;
  manageKeyType: ManageKeyType;
  uploadImageType: UploadImageType;
  uploadMetadataType: UploadMetadataType;
  manageKeyURL: string;
}

type CreateTokenProps = {
  plainData: string;
  
}

type VWBLOption = Omit<ConstructorProps, "web3">;

class VWBL {
  private nft: VWBLNFT;
  private opts: VWBLOption;

  constructor(props: ConstructorProps) {
    const {web3, address} = props;
    this.nft = new VWBLNFT(web3, address);
    this.opts = props;
  }
  createToken = ()
}
