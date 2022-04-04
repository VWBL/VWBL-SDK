import {
  FileType,
  ManageKeyType,
  UploadContentType,
  UploadMetadataType,
  VWBL,
  VWBLApi,
  VWBLNFT
} from "../../../src/vwbl";
import Web3 from "web3";
import sinon from "sinon"
import { expect } from "chai";

describe("VWBL",  () => {
  const web3 = new Web3();
  const vwblProtocolStub = {
    mintToken: sinon.stub(VWBLNFT.prototype, "mintToken"),
  };

  const vwblApiStub = {
    setKey: sinon.stub(VWBLApi.prototype, "setKey")
  };

  const vwbl = new VWBL({
    awsConfig: undefined,
    contractAddress: "0x2c7e967093d7fe0eeb5440bf49e5D148417B0412",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.CUSTOM,
    uploadMetadataType: UploadMetadataType.CUSTOM,
    vwblNetworkUrl: "http://example.com",
    web3
  });
  sinon.stub(web3.eth, "getAccounts").returns(Promise.resolve(["test address"]));
  sinon.stub(web3.eth.personal, "sign").returns(Promise.resolve("test sign"));
  before(async () => {
    await vwbl.sign();
  });
  it("mint token", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));
    const testFunctions = {uploadFile() {return Promise.resolve({encryptedDataUrl: "https://example.com", thumbnailImageUrl: "https://example.com"})}, async uploadMetadata (){}};
    const uploadFileStub = sinon.stub(testFunctions, "uploadFile").returns(Promise.resolve({encryptedDataUrl: "https://example.com", thumbnailImageUrl: "https://example.com"}));
    const uploadMetadataStub = sinon.stub(testFunctions, "uploadMetadata");
    const tokenId = await vwbl.createToken("test token", "test", {
        name: "plain data",
        content: "data:image/png;base64,xxx"
      },
      FileType.IMAGE, {
        name: "thumbnail image",
        content: "data:image/png;base64,yyy"
      },
      10,
       testFunctions.uploadFile, testFunctions.uploadMetadata);
    expect(vwblProtocolStub.mintToken.callCount).equal(1);
    expect(vwblApiStub.setKey.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  })
});
