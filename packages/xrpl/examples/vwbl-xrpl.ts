import * as fs from "fs";
import { Wallet } from "xrpl";

import { VWBLXRPL } from "vwbl-sdk-xrpl";
import { UploadContentType, UploadMetadataType } from "vwbl-core";
import { XummSdk } from "xumm-sdk";
import {
  XummJsonTransaction,
  XummPostPayloadBodyJson,
} from "xumm-sdk/dist/src/types";

const USER_ADDRESS = "...";
const wallet = Wallet.fromSecret("...");
const xumm = new XummSdk("{XUMM_API_KEY}", "{XUMM_API_SECRET}");

async function main() {
  const vwblXrpl = new VWBLXRPL({
    xrplChainId: 0, // Mainnet:0 / Testnet:1 / Devnet:2
    vwblNetworkUrl: "https://vwbl.network",
    uploadContentType: UploadContentType.IPFS,
    uploadMetadataType: UploadMetadataType.IPFS,
    ipfsConfig: {
      apiKey: "{PINATA_APIKEY",
      apiSecret: "{PINATA_APISECRET}",
    },
  });

  const fileBuffer = fs.readFileSync("{FILE_PATH}");
  const file = new File([fileBuffer], "sample.png", { type: "image/png" });

  /*
  Mint & Set key
 */

  const { mintTxJson, metadataUrl } = await vwblXrpl.generateMintTokenTxForIPFS(
    USER_ADDRESS,
    0,
    true,
    false,
    "test",
    "vwbl test",
    file,
    "{FILE_PATH}"
  );
  // *make sure you don't submit tx
  const mintTxPayload: XummPostPayloadBodyJson = {
    txjson: mintTxJson as unknown as XummJsonTransaction,
    options: {
      submit: false,
    },
  };

  let signedMintTxHex = "";
  try {
    const response = await xumm.payload.create(mintTxPayload, true);

    if (response) {
      console.log(response.next.always);
      const startTime = Date.now();

      let completed = false;
      while (!completed) {
        try {
          const status = await xumm.payload.get(response.uuid);
          if (status?.meta?.resolved) {
            completed = true;
            if (status.meta.signed && status.response.hex) {
              console.log("Transaction signed by user:");
              signedMintTxHex = status.response.hex;
              break;
            } else {
              console.log("Transaction not signed by user:", status);
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            if (Date.now() - startTime > 180000) {
              console.log("Time our reached");
              completed = true;
            }
          }
        } catch (error) {
          console.error("Error checking payload status:", error);
          break;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  const { tokenId, emptyTxObject } = await vwblXrpl.mintAndGenerateTxForIPFS(
    signedMintTxHex,
    metadataUrl,
    USER_ADDRESS
  );

  const txObj: XummPostPayloadBodyJson = {
    txjson: emptyTxObject as unknown as XummJsonTransaction,
    // * make sure you don't submit tx on client side
    options: {
      submit: false,
    },
  };

  const resp = await xumm.payload.create(txObj, true);
  let signedEmptyTxHex = "";
  if (resp) {
    console.log(resp.next.always);
    const startTime = Date.now();

    let completed = false;
    while (!completed) {
      try {
        const status = await xumm.payload.get(resp.uuid);
        if (status?.meta?.resolved) {
          completed = true;
          if (status.meta.signed && status.response.hex) {
            console.log("Transaction signed by user:");
            signedEmptyTxHex = status.response.hex;
            break;
          } else {
            console.log("Transaction not signed by user:", status);
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));

          if (Date.now() - startTime > 180000) {
            console.log("Time our reached");
            completed = true;
          }
        }
      } catch (error) {
        console.error("Error checking payload status:", error);
        break;
      }
    }
  }

  const tId = await vwblXrpl.createManagedTokenForIPFS(
    tokenId,
    signedEmptyTxHex,
    wallet.publicKey
  );
  console.log(tId);

  /*
  Get key & Extract Metadata
 */

  const txForSigning = await vwblXrpl.generateTxForSigning(USER_ADDRESS);
  // *make sure you don't submit tx
  const signingTxPayload: XummPostPayloadBodyJson = {
    txjson: txForSigning as unknown as XummJsonTransaction,
    options: {
      submit: false,
    },
  };

  let signedTx = "";
  try {
    const response = await xumm.payload.create(signingTxPayload, true);

    if (response) {
      console.log(response.next.always);
      const startTime = Date.now();
      let completed = false;
      while (!completed) {
        try {
          const status = await xumm.payload.get(response.uuid);
          if (status?.meta?.resolved) {
            completed = true;
            if (status.meta.signed && status.response.hex) {
              console.log("Transaction signed by user:");
              signedTx = status.response.hex;
              break;
            } else {
              console.log("Transaction not signed by user:", status);
            }
          } else {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            if (Date.now() - startTime > 180000) {
              console.log("Time our reached");
              completed = true;
            }
          }
        } catch (error) {
          console.error("Error checking payload status:", error);
          break;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  const metadata = await vwblXrpl.extractMetadata(
    tId,
    signedTx,
    wallet.publicKey
  );
  if (metadata) {
    console.log(metadata.id);
    console.log(metadata.fileName);
    console.log(metadata.image);
  }
}

main();
