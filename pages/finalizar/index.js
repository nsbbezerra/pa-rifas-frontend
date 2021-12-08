import Header from "../../components/header";
import Footer from "../../components/footer";
import { useRouter } from "next/router";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { AiOutlineHome } from "react-icons/ai";
import ckeckAnimation from "../../assets/check.json";
import errorAnimation from "../../assets/error.json";
import Lottie from "../../components/lottie";
import api from "../../configs/axios";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";

export default function Finalize() {
  const { query, push } = useRouter();

  const { payment_id, status, external_reference } = query;

  const [loading, setLoading] = useState(false);

  async function payOrder() {
    setLoading(true);

    try {
      const response = await api.post(`/payOrder/${external_reference}`, {
        payment_id,
        status,
      });
      setLoading(false);
      push("/");
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    payOrder();
  }, [payment_id]);

  return (
    <>
      <Header />
      <Flex justify="center" align="center">
        <Lottie
          animation={status === "approved" ? ckeckAnimation : errorAnimation}
          width="20%"
        />
      </Flex>
      <Heading textAlign="center">
        PAGAMENTO {status === "approved" ? "APROVADO" : "REJEITADO"}
      </Heading>
      <Flex justify="center" align="center" mt={3}>
        <Spinner size="xl" colorScheme="green" />
      </Flex>
      <Footer />
    </>
  );
}
