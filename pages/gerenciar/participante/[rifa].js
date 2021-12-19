import Header from "../../../components/header";
import Footer from "../../../components/footer";
import {
  Container,
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  useColorMode,
  Tag,
  useColorModeValue,
  Icon,
  Center,
  LinkBox,
  Stack,
  Skeleton,
  Button,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import Image from "next/image";
import { AiOutlineTrophy, AiOutlineDollar } from "react-icons/ai";
import configs from "../../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useClient } from "../../../context/Clients";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../../configs/axios";

export default function GerenciarPartitipante({
  raffle,
  trophys,
  orders,
  numbers,
}) {
  const { colorMode } = useColorMode();
  const { client } = useClient();
  const toast = useToast();

  const { isFallback, push } = useRouter();

  if (isFallback) {
    return (
      <>
        <Header />
        <Container maxW={"5xl"} mt={10}>
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "300px 1fr",
              "300px 1fr",
              "300px 1fr",
            ]}
            gap={10}
          >
            <Skeleton h={"300px"} />
            <Box>
              <Grid templateColumns={"1fr 1fr"} gap={5}>
                <Skeleton h={"100px"} />
                <Skeleton h={"100px"} />
                <Skeleton h={"100px"} />
                <Skeleton h={"100px"} />
              </Grid>
              <Stack mt={5}>
                <Skeleton h={"50px"} />
                <Skeleton h={"50px"} />
                <Skeleton h={"50px"} />
              </Stack>
            </Box>
          </Grid>
        </Container>
        <Footer />
      </>
    );
  }

  const [loading, setLoading] = useState(false);

  function handleColor(color) {
    if (color === "green") {
      if (colorMode === "light") {
        return "green.500";
      } else {
        return "green.200";
      }
    }
    if (color === "orange") {
      if (colorMode === "light") {
        return "orange.500";
      } else {
        return "orange.200";
      }
    }
    if (color === "red") {
      if (colorMode === "light") {
        return "red.500";
      } else {
        return "red.200";
      }
    }
    if (color === "blue") {
      if (colorMode === "light") {
        return "blue.500";
      } else {
        return "blue.200";
      }
    }
    if (color === "gray") {
      if (colorMode === "light") {
        return "gray.900";
      } else {
        return "gray.900";
      }
    }
    if (color === "yellow") {
      if (colorMode === "light") {
        return "yellow.500";
      } else {
        return "yellow.200";
      }
    }
  }

  function handleStatus(status) {
    switch (status) {
      case "open":
        return { title: "RIFA LIBERADA", bg: handleColor("green") };
      case "cancel":
        return { title: "RIFA CANCELADA", bg: handleColor("red") };
      case "drawn":
        return { title: "RIFA FINALIZADA", bg: handleColor("blue") };
      case "waiting":
        return { title: "RIFA EM ESPERA", bg: handleColor("yellow") };
      case "refused":
        return { title: "RIFA BLOQUEADA", bg: handleColor("gray") };
      default:
        return { title: "RIFA EM ESPERA", bg: handleColor("yellow") };
    }
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function payById(id) {
    setLoading(true);

    try {
      const response = await api.post(`/rafflePaymentById/${id}`);
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

      <Container maxW="6xl" mt={10}>
        <Tag colorScheme="green" size="lg" fontWeight="bold" mb={10}>
          RIFA Nº {raffle.id}
        </Tag>

        <Grid
          templateColumns={[
            "1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
          ]}
          gap={"10"}
          justifyContent={"center"}
          justifyItems={"center"}
        >
          <LinkBox
            rounded="xl"
            overflow="hidden"
            borderWidth="1px"
            shadow="lg"
            h="min-content"
            w="300px"
          >
            <Box>
              <Image
                width={300}
                height={300}
                src={`${configs.url}/img/${raffle.thumbnail}`}
                layout="responsive"
                alt="PA Rifas, rifas online"
              />
            </Box>
            <Flex
              bg={handleStatus(raffle.status).bg}
              p={2}
              justify="center"
              align="center"
              color={useColorModeValue("white", "gray.700")}
              pos="absolute"
              zIndex={800}
              transform="rotate(-40deg)"
              w="250px"
              left="-50px"
              top="40px"
              shadow="lg"
              fontWeight="bold"
              fontSize="lg"
            >
              {handleStatus(raffle.status).title}
            </Flex>
            <Box p={4}>
              <Heading
                fontSize="2xl"
                color={colorMode === "light" ? "green.500" : "green.200"}
              >
                {raffle.name}
              </Heading>
              <Text fontSize="md" mt={3}>
                {raffle.description}
              </Text>

              <HStack mt={3}>
                <Stat>
                  <StatLabel>Valor</StatLabel>
                  <StatNumber>
                    R${" "}
                    {parseFloat(raffle.raffle_value).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                    })}
                  </StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Sorteio</StatLabel>
                  <StatNumber>
                    {format(new Date(raffle.draw_date), "dd/MM/yyyy", {
                      locale: pt_br,
                    })}
                  </StatNumber>
                </Stat>
              </HStack>
            </Box>
          </LinkBox>

          <Box w="100%">
            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
            >
              PREMIAÇÃO
            </Heading>
            <Box
              bgGradient={
                colorMode === "light"
                  ? "linear(to-r, green.500, orange.500)"
                  : "linear(to-r, green.200, orange.200)"
              }
              w="135px"
              h="3px"
              mt={1}
            />

            <Stack mt={5}>
              {trophys.map((tro) => (
                <Grid
                  templateColumns={"60px 1fr 130px"}
                  gap={5}
                  rounded={"xl"}
                  overflow={"hidden"}
                  borderWidth={"1px"}
                  justifyItems={"center"}
                  alignItems={"center"}
                  key={tro.id}
                >
                  <Flex
                    justify={"center"}
                    align={"center"}
                    p={5}
                    bg={useColorModeValue("green.500", "green.200")}
                    color={useColorModeValue("gray.100", "gray.800")}
                    h="60px"
                    w="60px"
                  >
                    <Icon as={AiOutlineTrophy} fontSize={"3xl"} />
                  </Flex>
                  <Text p={2}>{tro.description}</Text>
                  {tro.status === "waiting" ? (
                    <Tag colorScheme={"orange"}>AGUARDANDO</Tag>
                  ) : (
                    ""
                  )}
                  {tro.client_identify === client.identify &&
                  tro.status === "drawn" ? (
                    <Tag colorScheme={"green"}>VOCÊ GANHOU</Tag>
                  ) : (
                    ""
                  )}
                  {tro.client_identify !== client.identify &&
                  tro.status === "drawn" ? (
                    <Tag colorScheme={"blue"}>SORTEADO</Tag>
                  ) : (
                    ""
                  )}
                </Grid>
              ))}
            </Stack>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mt={10}
            >
              MEUS NÚMEROS
            </Heading>

            <Box
              bgGradient={
                colorMode === "light"
                  ? "linear(to-r, green.500, orange.500)"
                  : "linear(to-r, green.200, orange.200)"
              }
              w="185px"
              h="3px"
              mt={1}
            />

            <HStack mt={5} spacing={7}>
              <Flex align="center">
                <Box
                  w="30px"
                  h="25px"
                  rounded="xl"
                  bg={useColorModeValue("green.500", "green.200")}
                />
                <Text fontSize="sm" ml={3}>
                  Pagamento Aprovado
                </Text>
              </Flex>
              <Flex align="center">
                <Box
                  w="30px"
                  h="25px"
                  rounded="xl"
                  bg={useColorModeValue("orange.500", "orange.200")}
                />
                <Text fontSize="sm" ml={3}>
                  Aguardando Pagamento
                </Text>
              </Flex>
            </HStack>

            <Grid
              templateColumns={[
                "repeat(1, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={5}
              mt={5}
              justifyContent="center"
            >
              {orders
                .filter((obj) => obj.client_id === client.id)
                .map((ord) => {
                  return (
                    <Box
                      rounded="xl"
                      shadow="lg"
                      borderWidth="1px"
                      bg={
                        ord.status === "paid_out"
                          ? handleColor("green")
                          : handleColor("orange")
                      }
                      key={ord.id}
                      h="min-content"
                    >
                      <Center p={2}>
                        <Text color={useColorModeValue("gray.100", "gray.800")}>
                          COMPRA NÚMERO: <strong>{ord.id}</strong>
                        </Text>
                      </Center>
                      <Box pr={2} pl={2} pb={2}>
                        <Grid
                          bg={useColorModeValue("white", "gray.800")}
                          rounded="xl"
                          p={3}
                          templateColumns="repeat(3, 1fr)"
                          gap={2}
                        >
                          {numbers
                            .filter((obj) => obj.order_id === ord.id)
                            .map((ord) => (
                              <Flex
                                w="100%"
                                h="40px"
                                rounded="xl"
                                justify="center"
                                align="center"
                                bg={useColorModeValue(
                                  "blackAlpha.100",
                                  "whiteAlpha.300"
                                )}
                                color={useColorModeValue(
                                  "gray.800",
                                  "gray.100"
                                )}
                                fontWeight="700"
                                key={ord.id}
                              >
                                {ord.number}
                              </Flex>
                            ))}
                        </Grid>
                      </Box>
                      <Flex
                        justify="space-between"
                        align="center"
                        pr={3}
                        pl={3}
                        pb={2}
                        color={useColorModeValue("gray.100", "gray.800")}
                      >
                        <Text>Valor da Compra</Text>
                        <Text fontWeight="bold">
                          R${" "}
                          {parseFloat(ord.value).toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </Flex>
                      {ord.transaction_id === "" ||
                      ord.transaction_id === null ||
                      !ord.transaction_id ? (
                        ""
                      ) : (
                        <Flex
                          justify="space-between"
                          align="center"
                          pr={3}
                          pl={3}
                          pb={2}
                          color={useColorModeValue("gray.100", "gray.800")}
                        >
                          <Text>ID Pagamento:</Text>
                          <Button
                            variant={"link"}
                            colorScheme={"whiteAlpha"}
                            color={useColorModeValue("gray.100", "gray.800")}
                          >
                            {ord.transaction_id}
                          </Button>
                        </Flex>
                      )}

                      {ord.status === "paid_out" && ord.pay_mode === "pix" ? (
                        <Flex
                          justify="space-between"
                          align="center"
                          pr={3}
                          pl={3}
                          pb={2}
                          color={useColorModeValue("gray.100", "gray.800")}
                        >
                          <Text>Forma:</Text>
                          <Button
                            variant={"link"}
                            colorScheme={"whiteAlpha"}
                            color={useColorModeValue("gray.100", "gray.800")}
                          >
                            PIX
                          </Button>
                        </Flex>
                      ) : (
                        ""
                      )}

                      {ord.status === "paid_out" && ord.pay_mode === "card" ? (
                        <Flex
                          justify="space-between"
                          align="center"
                          pr={3}
                          pl={3}
                          pb={2}
                          color={useColorModeValue("gray.100", "gray.800")}
                        >
                          <Text>Forma:</Text>
                          <Button
                            variant={"link"}
                            colorScheme={"whiteAlpha"}
                            color={useColorModeValue("gray.100", "gray.800")}
                          >
                            Cartão de Crédito
                          </Button>
                        </Flex>
                      ) : (
                        ""
                      )}

                      {ord.status === "paid_out" && ord.pay_mode === "debit" ? (
                        <Flex
                          justify="space-between"
                          align="center"
                          pr={3}
                          pl={3}
                          pb={2}
                          color={useColorModeValue("gray.100", "gray.800")}
                        >
                          <Text>Forma:</Text>
                          <Button
                            variant={"link"}
                            colorScheme={"whiteAlpha"}
                            color={useColorModeValue("gray.100", "gray.800")}
                          >
                            Cartão de Débito
                          </Button>
                        </Flex>
                      ) : (
                        ""
                      )}

                      {ord.status !== "paid_out" && (
                        <Box pl={2} pr={2} pb={2}>
                          <Popover placement="top">
                            <PopoverTrigger>
                              <Button
                                size="sm"
                                colorScheme={"green"}
                                leftIcon={<AiOutlineDollar />}
                              >
                                Pagar Agora
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent _focus={{ outline: "none" }}>
                              <PopoverHeader fontWeight="semibold">
                                Confirmação
                              </PopoverHeader>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverBody>
                                Se você fez o pagamento utilizando boleto
                                aguarde até 3 dias para a confirmação do
                                pagamento, caso houve um erro no pagamento
                                clique no botão abaixo para fazer o pagamento.
                              </PopoverBody>
                              <PopoverFooter d="flex" justifyContent="flex-end">
                                <ButtonGroup size="sm">
                                  <Button
                                    colorScheme="green"
                                    isLoading={loading}
                                    onClick={() => payById(ord.id)}
                                  >
                                    Confirmar
                                  </Button>
                                </ButtonGroup>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      )}
                    </Box>
                  );
                })}
            </Grid>
          </Box>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

export const getStaticPaths = async () => {
  const response = await fetch(`${configs.url}/findRaffle`);
  const data = await response.json();
  const paths = await data.map((raf) => {
    return { params: { rifa: raf.identify } };
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const raff = params.rifa;
  const response = await fetch(`${configs.url}/raffleParticipant/${raff}`);
  const data = await response.json();
  const raffle = !data.raffle ? null : data.raffle;
  const trophys = !data.trophys ? null : data.trophys;
  const orders = !data.orders ? null : data.orders;
  const numbers = !data.numbers ? null : data.numbers;

  return {
    props: {
      raffle,
      trophys,
      orders,
      numbers,
    },
    revalidate: 5,
  };
};
