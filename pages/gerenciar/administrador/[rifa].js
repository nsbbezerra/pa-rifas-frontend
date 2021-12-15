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
  ModalBody,
  ModalCloseButton,
  useToast,
  Stack,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/stat";
import { Button } from "@chakra-ui/button";
import { GiCardRandom } from "react-icons/gi";
import Icon from "@chakra-ui/icon";
import {
  AiOutlineTrophy,
  AiOutlineWhatsApp,
  AiOutlineZoomIn,
  AiOutlineUser,
  AiFillMail,
} from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { Tag } from "@chakra-ui/tag";
import configs from "../../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useState } from "react";
import api from "../../../configs/axios";

export default function AdminRaffles({ raffle, trophys, orders }) {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const [dialogEdit, setDialogEdit] = useState(false);
  const [dialogCancel, setDialogCancel] = useState(false);

  const [modal, setModal] = useState(false);
  const [idDrawn, setIdDrawn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trofeus, setTrofeus] = useState(trophys || []);
  const [number, setNumber] = useState("0");
  const [modalWinner, setModalWinner] = useState(false);
  const [trophy, setTrophy] = useState({});
  const [client, setClient] = useState({});

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function Drawn() {
    setLoading(true);
    try {
      const response = await api.put(
        `/drawn/${raffle.id}/${idDrawn}/${number}`
      );
      setTrofeus(response.data.newTrophys);
      setClient(response.data.client);
      setTrophy(response.data.myTrophy);
      setModal(false);
      setLoading(false);
      setModalWinner(true);
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
      showToast(mess, "error", "Sorteio não Realizado");
    }
  }

  function handleDrawn(id) {
    setIdDrawn(id);
    setModal(true);
  }

  function handleCloseModal() {
    setNumber("0");
    setModal(false);
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

  function calcPay() {
    let soma = orders.reduce(function (total, numero) {
      return total + parseFloat(numero.discounted_value);
    }, 0);
    let tax = parseFloat(raffle.tax_value);
    let total = ((tax / 100) * soma).toFixed(2);
    let totalParsed = parseFloat(total);
    return `R$ ${totalParsed.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
    })}`;
  }

  function calcRest() {
    let soma = orders.reduce(function (total, numero) {
      return total + parseFloat(numero.discounted_value);
    }, 0);
    let tax = parseFloat(raffle.tax_value);
    let total = ((tax / 100) * soma).toFixed(2);
    let totalParsed = parseFloat(total);
    let rest = soma - totalParsed;
    return `R$ ${rest.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
    })}`;
  }

  async function FindWinner(id) {
    setLoading(true);
    setModalWinner(true);
    try {
      const response = await api.get(`/trophy/${id}`);
      setTrophy(response.data.trophy);
      setClient(response.data.client);
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
          gap={10}
          justifyContent="center"
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
            <Grid
              templateColumns={[
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
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
                  <StatLabel>Taxa Pagamentos</StatLabel>
                  <StatNumber>{soma("tax")}</StatNumber>
                  <StatHelpText>* Taxa Cartões e PIX</StatHelpText>
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
                  <StatHelpText>
                    * Já descontado a taxa de Pagamentos
                  </StatHelpText>
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
                  <StatLabel>Total a Bloqueado</StatLabel>
                  <StatNumber>
                    {raffle.status !== "drawn" ? calcRest() : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>
                    * Descontado {calcPay()} da PA Rifas
                  </StatHelpText>
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
                    {raffle.status === "drawn" ? calcRest() : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>
                    * Descontado {calcPay()} da PA Rifas
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              >
                <Stat>
                  <StatLabel>Taxa Administrativa</StatLabel>
                  <StatNumber>{parseFloat(raffle.tax_value)}%</StatNumber>
                  <StatHelpText>* Porcentagem PA Rifas</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              >
                <Stat>
                  <StatLabel>Total a Pagar</StatLabel>
                  <StatNumber>{calcPay()}</StatNumber>
                  <StatHelpText>* Total devido à PA Rifas</StatHelpText>
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

            <Stack mt={5} spacing={5}>
              {trofeus.map((tro) => (
                <Grid
                  templateColumns={"60px 1fr 150px"}
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

                  {raffle.status === "open" && tro.status === "waiting" ? (
                    <Button
                      leftIcon={<GiCardRandom />}
                      colorScheme={"orange"}
                      isFullWidth
                      mr={5}
                      onClick={() => handleDrawn(tro.id)}
                      isDisabled={
                        new Date(raffle.draw_date) <= new Date() ? false : true
                      }
                    >
                      Sortear
                    </Button>
                  ) : (
                    ""
                  )}
                  {tro.status === "drawn" && (
                    <Button
                      leftIcon={<AiOutlineZoomIn />}
                      colorScheme={"green"}
                      isFullWidth
                      mr={5}
                      onClick={() => FindWinner(tro.id)}
                    >
                      Ver Ganhador
                    </Button>
                  )}
                </Grid>
              ))}
            </Stack>
            <Text
              color={useColorModeValue("red.400", "red.200")}
              fontSize={"xs"}
              mt={3}
            >
              * Você deve aguardar a data definida para o sorteio.
            </Text>

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
                "repeat(3, 1fr)",
                "repeat(3, 1fr)",
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

      <Modal isOpen={modal} onClose={() => handleCloseModal()} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sorteio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Insira o Número</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Insira o Número"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<GiCardRandom />}
              colorScheme={"green"}
              isLoading={loading}
              onClick={() => Drawn()}
            >
              Realizar Sorteio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalWinner}
        onClose={() => setModalWinner(false)}
        size={"sm"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ganhador</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {loading === true ? (
              <Flex justify={"center"} align={"center"} h="300px">
                <Spinner size={"xl"} />
              </Flex>
            ) : (
              <>
                {JSON.stringify(client) !== "{}" && (
                  <>
                    <Flex align={"center"} justify={"center"}>
                      <Avatar
                        icon={<AiOutlineUser />}
                        bg={useColorModeValue(
                          "blackAlpha.100",
                          "whiteAlpha.200"
                        )}
                        size={"xl"}
                        color={useColorModeValue("gray.800", "gray.100")}
                      />
                    </Flex>

                    <Text
                      fontSize={"lg"}
                      textAlign={"center"}
                      fontWeight={"bold"}
                      mt={5}
                    >
                      {client.name}
                    </Text>
                    <Text textAlign={"center"}>
                      {`${client.street}, ${client.number}, ${client.district}, ${client.comp}`}
                    </Text>
                    <Text textAlign={"center"}>CEP: {client.cep}</Text>
                    <Text textAlign={"center"}>
                      {`${client.city} - ${client.state}`}
                    </Text>
                    <Flex justify={"center"} align={"center"}>
                      <Icon as={AiOutlineWhatsApp} mr={2} />
                      <Text>{client.phone}</Text>
                    </Flex>
                    <Flex justify={"center"} align={"center"}>
                      <Icon as={AiFillMail} mr={2} />
                      <Text>{client.email}</Text>
                    </Flex>
                    <Text mt={5} textAlign={"center"}>
                      NÚMERO SORTEADO:
                    </Text>
                    <Heading textAlign={"center"}>{trophy.number}</Heading>
                  </>
                )}
              </>
            )}
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
