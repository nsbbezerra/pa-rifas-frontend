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
  Divider,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { AiOutlineTrophy } from "react-icons/ai";
import configs from "../../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";

export default function GerenciarPartitipante({
  raffle,
  trophys,
  orders,
  numbers,
}) {
  const { colorMode } = useColorMode();

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

  return (
    <>
      <Header />

      <Container maxW="6xl" mt={10}>
        <Tag colorScheme="green" size="lg" fontWeight="bold" mb={10}>
          RIFA Nº {raffle.id}
        </Tag>

        <Box
          rounded="xl"
          p={2}
          textAlign="center"
          fontSize="large"
          bg={handleStatus(raffle.status).bg}
          color={useColorModeValue("gray.100", "gray.800")}
          mb={10}
        >
          {handleStatus(raffle.status).title}
        </Box>

        <Grid
          templateColumns={[
            "1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
            "300px 1fr",
          ]}
          gap={"10"}
        >
          <Box
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
          </Box>

          <Box>
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

            <Grid
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(5, 1fr)",
              ]}
              gap={5}
              mt={5}
              justifyContent="center"
            >
              {trophys.map((tro) => (
                <Flex
                  rounded="xl"
                  shadow="lg"
                  borderWidth="1px"
                  direction="column"
                  justify="center"
                  align="center"
                  h="min-content"
                  key={tro.id}
                >
                  <Flex align="center">
                    <Icon as={AiOutlineTrophy} />
                    <Heading fontSize="sm" textAlign="center" p={2} w="100%">
                      {tro.title}º PRÊMIO
                    </Heading>
                  </Flex>
                  <Divider />
                  <Text fontSize="sm" p={2}>
                    {tro.description}
                  </Text>
                </Flex>
              ))}
            </Grid>

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
              {orders.map((ord) => {
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
                              color={useColorModeValue("gray.800", "gray.100")}
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
    fallback: false,
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
    revalidate: 60,
  };
};
