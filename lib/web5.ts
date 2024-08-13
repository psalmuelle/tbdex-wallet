import { Web5 } from "@web5/api";

type initWebTypes = {
  password: string;
};

export default async function initWeb5({ password }: initWebTypes) {
  const { web5, did: userDID } = await Web5.connect({
    password: password,
  });

  return {
    web5,
    userDID,
  };
}
