import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import axios from "lib/axios";
import { InvitePrompt } from "components/InvitePrompt";
import cookie from "cookie";

interface Props {
  success: boolean;
  collectionName: string;
  token: string;
  setToken: (t: string) => void;
  path: string;
}

export default function Invite({
  success,
  collectionName,
  token,
  path,
}: Props) {
  if (!token) {
    const router = useRouter();
    router.replace(`/login?cb=${path}`);
  }

  if (!success) {
    // TODO: Needs design.
    return (
      <div className="flex justify-center px-8 pt-8">Invite not found.</div>
    );
  }

  return <InvitePrompt collectionName={collectionName} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { collectionId } = context.params;
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const token = parsedCookies[process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME];

  if (!token) {
    return {
      redirect: {
        destination: `/login?cb=${context.resolvedUrl}`,
      },
      props: {},
    };
  }

  // if token, get cookie from context.req.headers.cookie, and attach to Authorization Bearer.
  try {
    const { data } = await axios.get(`/collections/${collectionId}`);
    return {
      props: {
        token,
        success: true,
        collectionName: data.name,
        path: context.resolvedUrl,
      },
    };
  } catch (error) {
    return {
      props: {
        token,
        success: false,
        collectionName: "",
        path: context.resolvedUrl,
      },
    };
  }

  // get invite details from server.
};
