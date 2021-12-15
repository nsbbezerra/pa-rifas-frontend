import Header from "../../components/header";
import Footer from "../../components/footer";
import { useRouter } from "next/router";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import ckeckAnimation from "../../assets/check.json";
import errorAnimation from "../../assets/error.json";
import waitingAnimation from "../../assets/waiting.json";
import Lottie from "../../components/lottie";
import api from "../../configs/axios";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@chakra-ui/react";

export default function Finalize() {
  const { query, push } = useRouter();

  const { payment_id, status, external_reference } = query;

  const [loading, setLoading] = useState(false);

  async function payOrder() {
    setLoading(true);

    try {
      await api.post(`/payOrder/${external_reference}`, {
        payment_id,
        status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "approved") {
      payOrder();
    }
  }, [payment_id]);

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
        {status === "approved" && "PAGAMENTO APROVADO"}
        {status === "pending" && "PAGAMENTO PENDENTE"}
        {status === "rejected" && "PAGAMENTO REJEITADO"}
      </Heading>
      {loading && (
        <Flex justify="center" align="center" mt={3}>
          <Spinner size="xl" colorScheme="green" />
        </Flex>
      )}
      <Flex justify="center" align="center" mt={5} direction={"column"}>
        <Text textAlign={"center"}>Boleto: Aprovação em até 3 dias</Text>
        <Text textAlign={"center"}>
          Pix, Cartão de Crédito e Débito: Aprovação imediata
        </Text>
        <Button onClick={() => push("/")} mt={5}>
          Ir ao Início
        </Button>
      </Flex>
      <Footer />
    </>
  );
}
