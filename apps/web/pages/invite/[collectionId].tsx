import { GetServerSideProps } from "next";
import axios from "lib/axios";
import { useEffect } from "react";
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

  // if !success, hit them with "invite not found."

  return (
    <div className="flex justify-center px-8 pt-8">
      <div className="w-full max-w-s">
        Youve been invited to xxx. Click here to accept the invite.
      </div>
    </div>
  );
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