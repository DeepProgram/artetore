import Head from 'next/head'
import HomeComponent from "../../components/Home/HomeComponent";
import Header from "../../components/Header/Header";


export default function Home() {
  return (
    <>
      <Head>
        <title>Artetore Web</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <Header></Header>
        <HomeComponent></HomeComponent>
      </main>
    </>
  )
}