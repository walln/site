import Head from "next/head";
import { useRouter } from "next/router";

interface MetaProps {
  title: string;
  description?: string;
  //   type: string;
  //   image: string;
  //   data;
}

export default function Meta(props: MetaProps) {
  const router = useRouter();

  return (
    <Head>
      <title>{props.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={props.description} name="description" />
      <meta property="og:url" content={`https://walln.dev${router.asPath}`} />
      {/* <meta property="og:type" content={props.type} /> */}
      <meta property="og:site_name" content="Nick Wall" />
      {props.description && (
        <meta property="og:description" content={props.description} />
      )}
      <meta property="og:title" content={props.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nickwal" />
      <meta name="twitter:title" content={props.title} />
      {props.description && (
        <meta name="twitter:description" content={props.description} />
      )}
      {/* <meta name="twitter:image" content={props.image} /> */}
      {/* {props.date && (
        <meta property="article:published_time" content={props.date} />
      )} */}
    </Head>
  );
}
