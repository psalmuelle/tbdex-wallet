import { Web5 } from "@web5/api";

type initWebTypes = {
  password: string;
  sync?: string;
};

export default async function initWeb5({ password, sync }: initWebTypes) {
  const { web5, did: userDID } = await Web5.connect({
    password: password,
    sync: sync || undefined
  });
  return {
    web5,
    userDID,
  };
}
