import type { Web5 } from "@web5/api";

interface DeleteKccProps {
  web5: Web5;
  recordId: string;
}

export default async function deleteKcc({ web5, recordId }: DeleteKccProps) {
  if (!web5) return;

  const { status } = await web5.dwn.records.delete({
    message: {
      recordId: recordId,
    },
  });

  return status;
}
