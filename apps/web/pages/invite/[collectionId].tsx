import { GetServerSideProps } from "next";
import axios from "lib/axios";
import { useEffect } from "react";
import { InvitePrompt } from "components/InvitePrompt";
import { getAuthTokenFromCookie } from "utils/helpers";
import { useState } from "react";

interface Props {
  success: boolean;
  collectionName: string;
}

export default function Invite({ success, collectionName }: Props) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = getAuthTokenFromCookie();
    if (t) setToken(t);
  }, []);

  if (!success) {
    // TODO: Needs design.
    return (
      <div className="flex justify-center px-8 pt-8">Invite not found.</div>
    );
  }

  // TODO: Needs design.
  return <InvitePrompt collectionName={collectionName} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { collectionId } = context.params;
  try {
    const { data } = await axios.get(`/collections/${collectionId}`);
    return {
      props: {
        success: true,
        collectionName: data.name,
      },
    };
  } catch (error) {
    return {
      props: {
        success: false,
        collectionName: "",
      },
    };
  }

  // get invite details from server.
};
