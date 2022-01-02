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
  Table,
  Th,
  Td,
  Tr,
  Tbody,
  Thead,
  FormHelperText,
  Switch,
  Skeleton,
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
  AiFillSave,
} from "react-icons/ai";
import { FaReceipt, FaRegEdit } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { Tag } from "@chakra-ui/tag";
import configs from "../../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useState } from "react";
import api from "../../../configs/axios";
import { useRouter } from "next/router";

export default function AdminRaffles({
  raffle,
  trophys,
  orders,
  numbers,
  reserved,
}) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { query, isFallback, push } = useRouter();
  const { rifa } = query;

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

  const [modalCupom, setModalCupom] = useState(false);
  const [nameCupom, setNameCupom] = useState("");
  const [descCupom, setDescCupom] = useState(0);
  const [minCupom, setMinCupom] = useState(0);

  const [modalShowCupom, setModalShowCupom] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCupom, setLoadingCupom] = useState(false);

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

  function handleCloseCupom() {
    setMinCupom(0);
    setNameCupom("");
    setDescCupom(0);
    setModalCupom(false);
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

  async function saveCupom() {
    setLoadingCupom(true);

    try {
      const response = await api.post("/couponRaffle", {
        coupon_hash: nameCupom,
        coupon_value: descCupom,
        min_numbers: minCupom,
        raffle: rifa,
      });
      setLoadingCupom(false);
      showToast(response.data.message, "success", "Sucesso");
      handleCloseCupom();
    } catch (error) {
      setLoadingCupom(false);
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

  async function findCoupons() {
    setLoading(true);

    try {
      const response = await api.get(`/findCouponRaffle/${rifa}`);
      setCoupons(response.data);
      setLoading(false);
      setModalShowCupom(true);
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

  async function activeCoupon(id, value) {
    try {
      const response = await api.put(`/couponRaffle/${id}`, { active: value });
      showToast(response.data.message, "success", "Sucesso");
      const updated = await coupons.map((coup) => {
        if (coup.id === id) {
          return { ...coup, active: value };
        }
        return coup;
      });
      setCoupons(updated);
    } catch (error) {
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

  function calcTaxesPayment() {
    const pix = orders.filter((obj) => obj.pay_mode === "pix");
    const card = orders.filter((obj) => obj.pay_mode === "card");
    const debit = orders.filter((obj) => obj.pay_mode === "debit");
    const transfer = orders.filter((obj) => obj.pay_mode === "ticket");
    let somaPix = pix.reduce(function (total, numero) {
      return total + parseFloat(numero.value);
    }, 0);
    let somaCard = card.reduce(function (total, numero) {
      return total + parseFloat(numero.value);
    }, 0);
    let somaDebit = debit.reduce(function (total, numero) {
      return total + parseFloat(numero.value);
    }, 0);
    let somaTransfer = transfer.reduce(function (total, numero) {
      return total + parseFloat(numero.value);
    }, 0);

    let newpix = parseFloat(somaPix * (configs.pixTax / 100).toFixed(2));
    let newcard = parseFloat(somaCard * (configs.cardTax / 100).toFixed(2));
    let newdebit = parseFloat(somaDebit * (configs.debitTax / 100).toFixed(2));
    let newtransfer = parseFloat(
      somaTransfer * (configs.cardTax / 100).toFixed(2)
    );

    let totalSum = newpix + newcard + newdebit + newtransfer;

    return {
      totalSum,
      newpix,
      newcard,
      newdebit,
      newtransfer,
    };
  }

  function calcArrecadado() {
    let somaPix = orders.reduce(function (total, numero) {
      return total + parseFloat(numero.value);
    }, 0);

    return parseFloat(somaPix.toFixed(2));
  }

  function calcComission() {
    const arrcadado = parseFloat(
      calcArrecadado() - calcTaxesPayment().totalSum
    );
    const comission =
      parseFloat(arrcadado.toFixed(2)) * (parseFloat(raffle.tax_value) / 100);

    return comission;
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
                pb={1}
                pl={4}
                borderWidth={"1px"}
              >
                <Stat>
                  <StatLabel>Números Vendidos</StatLabel>
                  <StatNumber>{numbers}</StatNumber>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pb={1}
                pl={4}
                borderWidth={"1px"}
              >
                <Stat>
                  <StatLabel>Números Reservados</StatLabel>
                  <StatNumber>{reserved}</StatNumber>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("orange.500", "orange.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Taxa dos Pagamentos</StatLabel>
                  <StatNumber>
                    {calcTaxesPayment().totalSum.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </StatNumber>
                  <StatHelpText>* Taxa Cartões e PIX</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("blue.500", "blue.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Valor Arrecadado</StatLabel>
                  <StatNumber>
                    {parseFloat(
                      calcArrecadado() - calcTaxesPayment().totalSum
                    ).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </StatNumber>
                  <StatHelpText>
                    * Descontado{" "}
                    {calcTaxesPayment().totalSum.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    de taxas de Pagamentos
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("red.500", "red.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Valor Bloqueado</StatLabel>
                  <StatNumber>
                    {raffle.status !== "drawn"
                      ? parseFloat(
                          calcArrecadado() -
                            calcTaxesPayment().totalSum -
                            calcComission()
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>
                    * Descontado{" "}
                    {calcComission().toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    da PA Rifas
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("green.500", "green.200")}
              >
                <Stat color={useColorModeValue("gray.100", "gray.800")}>
                  <StatLabel>Valor Liberado</StatLabel>
                  <StatNumber>
                    {raffle.status === "drawn"
                      ? parseFloat(
                          calcArrecadado() -
                            calcTaxesPayment().totalSum -
                            calcComission()
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "R$ 0,00"}
                  </StatNumber>
                  <StatHelpText>
                    * Descontado{" "}
                    {calcComission().toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    da PA Rifas
                  </StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              >
                <Stat>
                  <StatLabel>Porcentagem da Comissão</StatLabel>
                  <StatNumber>{parseFloat(raffle.tax_value)}%</StatNumber>
                  <StatHelpText>* Comissão da Plataforma</StatHelpText>
                </Stat>
              </Box>
              <Box
                rounded="xl"
                shadow="lg"
                pt={2}
                pl={4}
                pr={2}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              >
                <Stat>
                  <StatLabel>Valor da Comissão</StatLabel>
                  <StatNumber>
                    {calcComission().toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </StatNumber>
                  <StatHelpText>* Comissão da Plataforma</StatHelpText>
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

            <Table size="sm" mt={5}>
              <Thead>
                <Tr>
                  <Th w="7%" textAlign={"center"}></Th>
                  <Th>PRÊMIO</Th>
                  <Th w="17%">Opções</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trofeus.map((tro) => (
                  <Tr key={tro.id}>
                    <Td w="7%" textAlign={"center"}>
                      <Icon as={AiOutlineTrophy} fontSize={"2xl"} />
                    </Td>
                    <Td>{tro.description}</Td>
                    <Td w="17%">
                      <>
                        {raffle.status === "open" &&
                        tro.status === "waiting" ? (
                          <Button
                            leftIcon={<GiCardRandom />}
                            colorScheme={"orange"}
                            isFullWidth
                            mr={5}
                            onClick={() => handleDrawn(tro.id)}
                            isDisabled={
                              new Date(raffle.draw_date) <= new Date()
                                ? false
                                : true
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
                      </>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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

            <Grid templateColumns={"1fr 1fr"} gap={5} mt={5}>
              <Button
                size={"lg"}
                leftIcon={<FaReceipt />}
                colorScheme={"green"}
                variant={"outline"}
                onClick={() => setModalCupom(true)}
                isDisabled={raffle.status === "refused" ? true : false}
              >
                Criar Cupom
              </Button>
              <Button
                size={"lg"}
                leftIcon={<FaReceipt />}
                colorScheme={"green"}
                variant={"outline"}
                onClick={() => findCoupons()}
                isLoading={loading}
                isDisabled={raffle.status === "refused" ? true : false}
              >
                Meus Cupons
              </Button>
            </Grid>

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
              <Button
                leftIcon={<AiOutlineWhatsApp />}
                colorScheme="whatsapp"
                onClick={() => push("/faleconosco")}
              >
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
              <Button
                leftIcon={<AiOutlineWhatsApp />}
                colorScheme="whatsapp"
                onClick={() => push("/faleconosco")}
              >
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

      <Modal isOpen={modalCupom} onClose={() => handleCloseCupom()} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Cupom</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Insira o Nome do Cupom</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Insira o Nome do Cupom"
                value={nameCupom}
                onChange={(e) => setNameCupom(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Desconto do Cupom (%)</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Valor do Cupom"
                value={descCupom}
                type="number"
                onChange={(e) => setDescCupom(e.target.value)}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Cota Mínima</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Cota Mínima"
                value={minCupom}
                type="number"
                onChange={(e) => setMinCupom(e.target.value)}
              />
              <FormHelperText>
                Mínimo de Números para aplicar o desconto
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<AiFillSave />}
              colorScheme={"green"}
              isLoading={loadingCupom}
              onClick={() => saveCupom()}
            >
              Salvar Cupom
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalShowCupom}
        onClose={() => setModalShowCupom()}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Meus Cupons</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5} overflow={"hidden"}>
            <Table size={"sm"}>
              <Thead>
                <Tr>
                  <Th w="5%">ATIVO?</Th>
                  <Th w="70%">CUPOM</Th>
                  <Th isNumeric>DESCONTO</Th>
                  <Th isNumeric>COTA</Th>
                </Tr>
              </Thead>
              <Tbody>
                {coupons.map((coup) => (
                  <Tr key={coup.id}>
                    <Td w="5%">
                      <Switch
                        colorScheme={"green"}
                        defaultChecked={coup.active}
                        onChange={(e) =>
                          activeCoupon(coup.id, e.target.checked)
                        }
                        size={"sm"}
                      />
                    </Td>
                    <Td w="70%">{coup.coupon_hash}</Td>
                    <Td isNumeric>{parseFloat(coup.coupon_value)}%</Td>
                    <Td isNumeric>{coup.min_numbers}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
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
    fallback: true,
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
  const reserved = !data.reserved ? null : data.reserved;

  return {
    props: {
      raffle,
      trophys,
      orders,
      numbers,
      reserved,
    },
    revalidate: 5,
  };
};
