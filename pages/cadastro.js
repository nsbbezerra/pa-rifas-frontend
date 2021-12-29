import Header from "../components/header";
import Footer from "../components/footer";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Register from "../components/register";

export default function Cadastro() {
  const { query, push } = useRouter();
  const { rifa } = query;

  return (
    <>
      <Header />

      <Container maxW={"3xl"} mt={10}>
        <Register raffle={rifa} />
      </Container>
      <Footer />
    </>
  );
}
