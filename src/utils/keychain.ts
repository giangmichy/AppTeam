import * as Keychain from "react-native-keychain";

export const saveToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword("user", token);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save token: ${error.message}`);
    } else {
      throw new Error("Failed to save token: Unknown error");
    }
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

export const clearToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to clear token: ${error.message}`);
    } else {
      throw new Error("Failed to clear token: Unknown error");
    }
  }
};
