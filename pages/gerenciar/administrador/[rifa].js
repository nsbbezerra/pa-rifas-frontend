import Header from "../../../components/header";
import Footer from "../../../components/footer";
import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  LinkBox,
  Text,
} from "@chakra-ui/layout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { Button } from "@chakra-ui/button";
import { GiCardRandom } from "react-icons/gi";
import Icon from "@chakra-ui/icon";
import { AiOutlineTrophy, AiOutlineWhatsApp } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { Tag } from "@chakra-ui/tag";
import configs from "../../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useState } from "react";
import api from "../../../configs/axios";

export default function AdminRaffles({ raffle, trophys, orders, numbers }) {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const [dialogEdit, setDialogEdit] = useState(false);
  const [dialogCancel, setDialogCancel] = useState(false);

  const [modal, setModal] = useState(false);
  const [idDrawn, setIdDrawn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trofeus, setTrofeus] = useState(trophys || []);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function Drawn() {
    try {
      const response = await api.put(`/drawn/${raffle.id}/${idDrawn}`);
      setTrofeus(response.data.newTrophys);
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
        ? "Erro no cadastro do cliente"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  function handleDrawn(id) {
    setIdDrawn(id);
    setLoading(true);

    Drawn();
  }

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

  function soma(field) {
    if (field === "tax") {
      let soma = orders.reduce(function (total, numero) {
        return total + parseFloat(numero.tax);
      }, 0);
      return `R$ ${soma.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      })}`;
    }
    if (field === "total") {
      let soma = orders.reduce(function (total, numero) {
        return total + parseFloat(numero.discounted_value);
      }, 0);
      return `R$ ${soma.toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      })}`;
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
          gap={10}
          justifyContent="center"
          justifyItems={"center"}
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

          <Box w="100%">
            <Grid
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(4, 1fr)",
              ]}
              gap={5}
              justifyContent="center"
            >
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("orange.500", "orange.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Taxa Administrativa</StatLabel>
                  <StatNumber>{soma("tax")}</StatNumber>
                  <StatHelpText>* Taxa da PA Rifas</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("blue.500", "blue.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Arrecadado</StatLabel>
                  <StatNumber>{soma("total")}</StatNumber>
                  <StatHelpText>* Já descontado a taxa</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("red.500", "red.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Bloqueado</StatLabel>
                  <StatNumber>
                    {raffle.status !== "drawn" ? soma("total") : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>* Aguardando sorteio</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("green.500", "green.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Total Liberado</StatLabel>
                  <StatNumber>
                    {raffle.status === "drawn" ? soma("total") : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>* Liberado após o sorteio</StatHelpText>
                </Stat>
              </Box>
            </Grid>

            <Divider mt={5} mb={5} />

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
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={5}
              mt={5}
              justifyContent="center"
            >
              {trofeus.map((tro) => (
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

                  {!tro.name_client ||
                  tro.name_client === null ||
                  tro.name_client === "NULL" ? (
                    ""
                  ) : (
                    <>
                      <Divider />

                      <Box w="100%" p={2}>
                        <Text fontSize="xs">
                          Número Sorteado: <strong>{tro.number}</strong>
                        </Text>
                        <Text fontSize="xs">
                          Nome do Ganhador:{" "}
                          <strong>{tro.name_client.name}</strong>
                        </Text>
                        <Text fontSize="xs">
                          Telefone do Ganhador:{" "}
                          <strong>{tro.name_client.phone}</strong>
                        </Text>
                        <Text fontSize="xs">
                          Endereço do Ganhador:{" "}
                          <strong>
                            {tro.name_client.street}, {tro.name_client.number},{" "}
                            {tro.name_client.district} - CEP:{" "}
                            {tro.name_client.cep}, {tro.name_client.city} -{" "}
                            {tro.name_client.state}
                          </strong>
                        </Text>
                      </Box>
                    </>
                  )}
                </Flex>
              ))}
            </Grid>

            <Heading
              fontSize="2xl"
              color={useColorModeValue("green.500", "green.200")}
              mt={10}
            >
              OPÇÕES
            </Heading>
            <Box
              bgGradient={
                colorMode === "light"
                  ? "linear(to-r, green.500, orange.500)"
                  : "linear(to-r, green.200, orange.200)"
              }
              w="90px"
              h="3px"
              mt={1}
            />

            <Grid
              mt={5}
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
                "repeat(4, 1fr)",
              ]}
              gap={5}
            >
              <Button
                size="md"
                rounded="xl"
                h="90px"
                onClick={() => setDialogEdit(true)}
              >
                <Flex justify="center" align="center" direction="column">
                  <Icon as={FaRegEdit} fontSize="5xl" />
                  <Text mt={2}>Alterar Informação</Text>
                </Flex>
              </Button>
              <Button
                isFullWidth
                colorScheme="red"
                size="md"
                rounded="xl"
                h="90px"
              >
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  onClick={() => setDialogCancel(true)}
                >
                  <Icon as={ImCancelCircle} fontSize="5xl" />
                  <Text mt={2}>Cancelar Rifa</Text>
                </Flex>
              </Button>
              <Button
                size="md"
                rounded="xl"
                h="90px"
                colorScheme="green"
                onClick={() => setModal(true)}
              >
                <Flex justify="center" align="center" direction="column">
                  <Icon as={GiCardRandom} fontSize="5xl" />
                  <Text mt={2}>Realizar Sorteio</Text>
                </Flex>
              </Button>
              <Button size="md" rounded="xl" h="90px" colorScheme="whatsapp">
                <Flex justify="center" align="center" direction="column">
                  <Icon as={AiOutlineWhatsApp} fontSize="5xl" />
                  <Text mt={2}>Contato PA Rifas</Text>
                </Flex>
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Container>
      <Footer />

      <AlertDialog isOpen={dialogEdit} onClose={() => setDialogEdit(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Informação
            </AlertDialogHeader>

            <AlertDialogBody>
              Para alterar alguma informação da sua rifa, entre em contato com
              os administradores da PA Rifas e informe as informações que deseja
              Alterar
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button leftIcon={<AiOutlineWhatsApp />} colorScheme="whatsapp">
                Contato PA Rifas
              </Button>
              <Button onClick={() => setDialogEdit(false)} ml={3}>
                Fechar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={dialogCancel} onClose={() => setDialogCancel(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Informação
            </AlertDialogHeader>

            <AlertDialogBody>
              Para cancelar esta rifa, entre em contato com os administradores
              da PA Rifas informando o motivo do cancelamento, não esqueça de
              verificar as cláusulas na sessão Condições de Uso.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button leftIcon={<AiOutlineWhatsApp />} colorScheme="whatsapp">
                Contato PA Rifas
              </Button>
              <Button onClick={() => setDialogCancel(false)} ml={3}>
                Fechar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={modal} onClose={() => setModal(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sorteio</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
              ]}
              gap={5}
              justifyContent="center"
            >
              {trofeus.map((tro) => (
                <LinkBox
                  key={tro.id}
                  rounded="xl"
                  shadow="lg"
                  borderWidth="1px"
                  overflow="hidden"
                >
                  {idDrawn === tro.id && loading === true ? (
                    <Flex
                      w="100%"
                      h="100%"
                      position="absolute"
                      bg={useColorModeValue("whiteAlpha.700", "blackAlpha.700")}
                      justify="center"
                      align="center"
                      zIndex={100}
                    >
                      <Spinner size="xl" />
                    </Flex>
                  ) : (
                    ""
                  )}
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    h="min-content"
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
                    <Divider />
                    {!tro.name_client ||
                    tro.name_client === null ||
                    tro.name_client === "NULL" ? (
                      ""
                    ) : (
                      <>
                        <Divider />

                        <Box w="100%" p={2}>
                          <Text fontSize="xs">
                            Número Sorteado: <strong>{tro.number}</strong>
                          </Text>
                          <Text fontSize="xs">
                            Nome do Ganhador:{" "}
                            <strong>{tro.name_client.name}</strong>
                          </Text>
                          <Text fontSize="xs">
                            Telefone do Ganhador:{" "}
                            <strong>{tro.name_client.phone}</strong>
                          </Text>
                          <Text fontSize="xs">
                            Endereço do Ganhador:{" "}
                            <strong>
                              {tro.name_client.street}, {tro.name_client.number}
                              , {tro.name_client.district} - CEP:{" "}
                              {tro.name_client.cep}, {tro.name_client.city} -{" "}
                              {tro.name_client.state}
                            </strong>
                          </Text>
                        </Box>
                      </>
                    )}

                    <Divider mb={2} />

                    <Box pr={2} pl={2} w="100%" pb={2}>
                      <Button
                        leftIcon={<GiCardRandom />}
                        isFullWidth
                        colorScheme="green"
                        onClick={() => handleDrawn(tro.id)}
                      >
                        Sortear
                      </Button>
                    </Box>
                  </Flex>
                </LinkBox>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
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
  const response = await fetch(`${configs.url}/raffleAdmin/${raff}`);
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
