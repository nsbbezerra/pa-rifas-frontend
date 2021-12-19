import Header from "../../components/header";
import Footer from "../../components/footer";
import { useRouter } from "next/router";
import { Flex, Heading } from "@chakra-ui/layout";
import ckeckAnimation from "../../assets/check.json";
import errorAnimation from "../../assets/error.json";
import waitingAnimation from "../../assets/waiting.json";
import Lottie from "../../components/lottie";
import { Button, Grid } from "@chakra-ui/react";
import { FaHome, FaReceipt } from "react-icons/fa";

export default function Finalize() {
  const { query, push } = useRouter();

  const { status } = query;

  return (
    <>
      <Header />
      <Flex justify="center" align="center">
        {status === "approved" && (
          <Lottie animation={ckeckAnimation} width="20%" />
        )}
        {status === "pending" && (
          <Lottie animation={waitingAnimation} width="20%" />
        )}
        {status === "rejected" && (
          <Lottie animation={errorAnimation} width="20%" />
        )}
      </Flex>
      <Heading textAlign="center">
        {status === "approved" && "Parabens! Seu pagamento foi aprovado."}
        {status === "pending" && "Aguarde! Seu pagamento está em análise."}
        {status === "rejected" && "Ops! Seu pagamento foi negado."}
      </Heading>

      <Grid
        mt={7}
        templateColumns={[
          "200px",
          "200px 200px",
          "200px 200px",
          "200px 200px",
          "200px 200px",
        ]}
        gap={5}
        justifyContent={"center"}
        justifyItems={"center"}
      >
        <Button leftIcon={<FaReceipt />} isFullWidth>
          Ver Comprovante
        </Button>
        <Button
          leftIcon={<FaHome />}
          colorScheme={"green"}
          isFullWidth
          onClick={() => push("/")}
        >
          Ir ao Início
        </Button>
      </Grid>

      <Footer />
    </>
  );
}
