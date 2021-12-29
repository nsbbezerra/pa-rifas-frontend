import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  Box,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Link as ChakraLink,
  Input,
  Text,
  useColorModeValue,
  Button,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  Skeleton,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiOutlineDollar } from "react-icons/ai";
import api from "../../configs/axios";
import { useRouter } from "next/router";
import { useClient } from "../../context/Clients";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";

export default function Checkout() {
  const { query, push } = useRouter();
  const { order, identify } = query;
  const { client } = useClient();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [accept, setAccept] = useState(false);
  const [finding, setFinding] = useState(true);

  const [numbers, setNumbers] = useState([]);
  const [receipt, setReceipt] = useState({});

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function findNumbers() {
    setFinding(true);

    try {
      const response = await api.get(`/findInformation/${order}`);
      setNumbers(response.data.numbers);
      setReceipt(response.data.order);
      setFinding(false);
    } catch (error) {
      setFinding(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      let mess = !error.response.data
        ? "Erro no pagamento"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  useEffect(() => {
    findNumbers();
  }, [identify]);

  async function payById() {
    setLoading(true);

    try {
      const response = await api.post(`/rafflePaymentById/${order}`);
      push(response.data.url);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      let mess = !error.response.data
        ? "Erro no pagamento"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  return (
    <>
      <Header />
      <Container maxW={"5xl"} mt={20}>
        <Grid
          templateColumns={[
            "1fr",
            "1fr",
            "1fr 300px",
            "1fr 300px",
            "1fr 300px",
          ]}
          gap={10}
        >
          <Box>
            <Box
              rounded={"lg"}
              shadow={"lg"}
              borderWidth={"1px"}
              overflow={"hidden"}
            >
              <Box
                p={3}
                fontWeight={"bold"}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              >
                MEUS DADOS
              </Box>
              <Box p={5}>
                <FormControl>
                  <FormLabel mb={0}>Nome</FormLabel>
                  <Input
                    focusBorderColor="green.500"
                    isReadOnly
                    value={client.name}
                  />
                </FormControl>

                <Grid
                  templateColumns={[
                    "1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                  ]}
                  gap={5}
                  mt={5}
                >
                  <FormControl>
                    <FormLabel mb={0}>Email</FormLabel>
                    <Input
                      focusBorderColor="green.500"
                      isReadOnly
                      value={client.email}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel mb={0}>Telefone</FormLabel>
                    <Input
                      focusBorderColor="green.500"
                      isReadOnly
                      value={client.phone}
                    />
                  </FormControl>
                </Grid>
              </Box>
            </Box>

            {finding ? (
              <Box mt={5}>
                <Skeleton h="60px" mb={3} />
                <Skeleton h="200px" />
              </Box>
            ) : (
              <Box
                rounded={"lg"}
                shadow={"lg"}
                borderWidth={"1px"}
                overflow={"hidden"}
                mt={5}
              >
                <Box
                  p={3}
                  bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
                >
                  <Text fontWeight={"bold"}>RESERVA NÚMERO: {order}</Text>
                  <Text fontSize={"xs"}>IDENTIFICAÇÃO: {identify}</Text>
                </Box>
                <Box p={5}>
                  <Text fontSize={"sm"}>NÚMEROS RESERVADOS:</Text>
                  <Grid
                    templateColumns={[
                      "repeat(4, 1fr)",
                      "repeat(7, 1fr)",
                      "repeat(5, 1fr)",
                      "repeat(7, 1fr)",
                      "repeat(7, 1fr)",
                    ]}
                    gap={5}
                    mt={5}
                    justifyContent={"center"}
                  >
                    {numbers.map((num) => (
                      <Flex
                        key={num.id}
                        h="40px"
                        justify={"center"}
                        align={"center"}
                        rounded={"lg"}
                        bg={useColorModeValue("orange.500", "orange.200")}
                        fontWeight={"semibold"}
                        color={useColorModeValue("gray.100", "gray.800")}
                      >
                        {num.number}
                      </Flex>
                    ))}
                  </Grid>
                </Box>
                <Divider />
                <Box p={3}>
                  <Text fontSize={"sm"}>
                    DATA DA EXPIRAÇÃO:{" "}
                    <strong>
                      {format(
                        new Date(receipt.expiration_date),
                        "dd 'de' MMMM', às ' HH:mm'h'",
                        { locale: pt_br }
                      )}
                    </strong>
                  </Text>
                </Box>
              </Box>
            )}
          </Box>

          <Box rounded="lg" shadow={"lg"} h="min-content" borderWidth={"1px"}>
            <Box p={3}>
              {finding ? (
                <>
                  <Skeleton w="100px" h="20px" mb={2} />
                  <Skeleton w="180px" h="30px" />
                </>
              ) : (
                <Stat>
                  <StatLabel>Total a Pagar</StatLabel>
                  <StatNumber>
                    R${" "}
                    {parseFloat(receipt.value).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                    })}
                  </StatNumber>
                </Stat>
              )}
            </Box>
            <Divider />
            <Box p={3}>
              <Checkbox
                colorScheme={"green"}
                onChange={(e) => setAccept(e.target.checked)}
                defaultChecked={accept}
              >
                Reservando os números você concorda com nossos{" "}
                <Link href={"/condicoesdeuso"} passHref>
                  <ChakraLink target={"_blank"} textDecor={"underline"}>
                    Termos de Uso
                  </ChakraLink>
                </Link>
              </Checkbox>

              <Button
                colorScheme={"green"}
                leftIcon={<AiOutlineDollar />}
                size={"lg"}
                isFullWidth
                mt={5}
                isDisabled={!accept}
                isLoading={loading}
                onClick={() => payById()}
              >
                Pagar Agora
              </Button>
            </Box>
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
