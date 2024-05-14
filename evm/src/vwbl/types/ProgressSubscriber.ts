export enum StepStatus {
  MINT_TOKEN = "MINT_TOKEN",
  CREATE_KEY = "CREATE_KEY",
  ENCRYPT_DATA = "ENCRYPT_DATA",
  UPLOAD_CONTENT = "UPLOAD_CONTENT",
  UPLOAD_METADATA = "UPLOAD_METADATA",
  SET_KEY = "SET_KEY",
}

export type ProgressSubscriber = {
  kickStep: (status: StepStatus) => void;
  kickProgress?: () => void;
};
