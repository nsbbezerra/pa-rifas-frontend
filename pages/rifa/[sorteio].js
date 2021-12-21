import { useEffect, useState, memo } from "react";
import HeaderApp from "../../components/header";
import {
  Box,
  Grid,
  Container,
  Text,
  Flex,
  Heading,
  HStack,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
  FormControl,
  FormLabel,
  InputLeftElement,
  InputGroup,
  Input,
  Divider,
  Checkbox,
  Center,
  IconButton,
  Skeleton,
  useColorMode,
  useColorModeValue,
  Link as ChakraLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/sliders";
import Image from "next/image";
import { FaCheck, FaTrash, FaWhatsapp } from "react-icons/fa";
import {
  AiOutlineCopy,
  AiOutlineFacebook,
  AiOutlineTrophy,
  AiOutlineUser,
  AiOutlineWhatsApp,
  AiOutlineDollar,
} from "react-icons/ai";
import MaskedInput from "react-text-mask";
import Link from "next/link";
import { useRouter } from "next/router";
import configGloba from "../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useClient } from "../../context/Clients";
import { useLoginModal } from "../../context/ModalLogin";
import { useRegisterModal } from "../../context/ModalRegister";
import api from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import FooterApp from "../../components/footer";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../assets/empty.json";
import errorAnimation from "../../assets/error.json";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Sorteio({ raffles, trophys, numbersRaffle }) {
  const { colorMode } = useColorMode();
  const { query, isFallback, push } = useRouter();
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    const host = window.location.href;
    setSiteUrl(host);
  }, []);

  if (isFallback) {
    return (
      <>
        <HeaderApp />
        <Container maxW="6xl">
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "220px 1fr",
              "220px 1fr",
              "220px 1fr",
            ]}
            gap="40px"
            justifyItems="center"
            alignItems="center"
            mt={10}
            mb={10}
          >
            <Box w="220px" h="220px">
              <Skeleton h="220px" w="220px" rounded="lg" />
            </Box>
            <Box w="100%">
              <Skeleton h="40px" w="100%" mb={5} />

              <Flex
                direction={["column", "column", "column", "row", "row"]}
                justifyContent="space-between"
              >
                <Skeleton h="30px" w="250px" />
                <Skeleton h="30px" w="250px" />
              </Flex>
              <Skeleton h="110px" w="100%" mt={3} />
            </Box>
          </Grid>
        </Container>
        <FooterApp />
      </>
    );
  }

  const toast = useToast();
  const { client, setClient } = useClient();
  const { setOpenRegister } = useRegisterModal();
  const { setOpenLogin } = useLoginModal();
  const { data } = useFetch(`/numbers/${query.sorteio}`);

  useEffect(() => {
    if (data !== undefined) {
      setNums(data.numbers);
    } else {
      setNums([]);
    }
  }, [data]);

  async function findClientLocal() {
    const myClient = await localStorage.getItem("client");
    if (myClient) {
      setClient(JSON.parse(myClient));
    }
  }

  useEffect(() => {
    findClientLocal();
  }, []);

  const [mynumbers, setMynumbers] = useState([]);
  const [amount, setAmount] = useState(0);
  const [amountCompare, setAmountCompare] = useState(0);

  const [modalSend, setModalSent] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

  const [raffle] = useState(raffles);
  const [trophy] = useState(trophys);
  const [nums, setNums] = useState([]); //Para compara os números, Livres, Reservados e Pagos

  const [concordo, setConcordo] = useState(0);

  const [loading, setLoading] = useState(false);

  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [nameCoupon, setNameCoupon] = useState("");
  const [isDiscounted, setIsDiscounted] = useState(false);

  const [numbersToShort, setNumbersToShort] = useState([]);
  const [order, setOrder] = useState({});

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  useEffect(() => {
    let number = [];
    if (JSON.stringify(raffle) !== "{}") {
      for (let index = 0; index < parseInt(raffle.qtd_numbers); index++) {
        let info = {
          num:
            (index < 10 - 1 && `00${index + 1}`) ||
            (index < 100 - 1 && `0${index + 1}`) ||
            (index >= 100 - 1 && `${index + 1}`),
        };
        number.push(info);
      }
    }
    setNumbersToShort(number);
  }, []);

  useEffect(() => {
    if (mynumbers.length > 0) {
      setAmount(mynumbers.length * parseFloat(raffle.raffle_value));
      setAmountCompare(mynumbers.length * parseFloat(raffle.raffle_value));
    }
  }, [mynumbers]);

  async function handleNumbers(num) {
    const findPayed = await nums.find((obj) => obj.number === parseFloat(num));
    if (!findPayed) {
      const find = await mynumbers.find((obj) => obj === num);
      if (find) {
        showToast("Este número já foi selecionado", "warning", "Atenção");
      } else {
        setMynumbers([...mynumbers, num]);
      }
    }
  }

  function capitalizeAllFirstLetter(string) {
    let toLower = string.toLowerCase();
    let splited = toLower.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function clearNumbers() {
    setMynumbers([]);
    setAmount(0);
    setAmountCompare(0);
    setIsDiscounted(false);
  }

  async function storeNumbers() {
    setLoading(true);
    try {
      const response = await api.post("/numbers", {
        raffle_id: raffle.id,
        client_id: client.id,
        numbers: mynumbers,
        orderValue: amount,
      });
      setAmount(0);
      setConcordo(false);
      setModalSent(false);
      setLoading(false);
      setIsDiscounted(false);
      setNameCoupon("");
      showToast(response.data.message, "success", "Sucesso");
      setOrder(response.data.order);
      setModalPayment(true);
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

  async function payById() {
    setLoading(true);

    try {
      const response = await api.post(`/rafflePaymentById/${order.id}`);
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

  function setBgAndColor(num) {
    let find = nums.find((obj) => obj.number === parseFloat(num));
    if (find) {
      if (JSON.stringify(client) !== "{}") {
        if (find.id_client === client.id) {
          return "red.600";
        } else {
          if (find.status === "reserved") {
            return "orange.400";
          }
          if (find.status === "paid_out") {
            return "green.400";
          }
        }
      } else {
        if (find.status === "reserved") {
          return "orange.400";
        }
        if (find.status === "paid_out") {
          return "green.400";
        }
      }
    } else {
      return "black";
    }
  }

  function calcPercent() {
    let totalNumbers = raffle.qtd_numbers;
    let numberSale = numbersRaffle.length;
    let firstCalc = 100 * numberSale;
    let finalCalc = firstCalc / totalNumbers;
    return finalCalc;
  }

  function calcDiscountCupom(value) {
    let calc = parseFloat(amount) * (parseFloat(value) / 100);
    let rest = parseFloat(amount) - calc;
    setAmount(rest);
  }

  async function findCoupon() {
    if (nameCoupon === "") {
      showToast("Insira um cupom", "warning", "Atenção");
      return false;
    }
    setLoadingCoupon(true);

    try {
      const response = await api.get(`/couponRaffleHash/${nameCoupon}`);
      if (mynumbers.length < response.data.min_numbers) {
        showToast(
          `Quantidade de números insuficiente para aplicar o desconto, a quantidade pedida é: ${response.data.min_numbers}`,
          "warning",
          "Atenção"
        );
      } else {
        setIsDiscounted(true);
        calcDiscountCupom(response.data.coupon_value);
      }
      setLoadingCoupon(false);
    } catch (error) {
      setLoadingCoupon(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      showToast("Erro ao buscar o cupom", "error", "Erro");
    }
  }

  return (
    <>
      <HeaderApp />
      {raffle.status !== "open" ? (
        <Container maxW={"4xl"}>
          <Flex
            justify={"center"}
            align={"center"}
            direction={"column"}
            mt={10}
          >
            <Lottie animation={errorAnimation} width={"40%"} />
            <Text
              textAlign={"center"}
              mt={5}
              fontSize={"lg"}
              fontWeight={"bold"}
            >
              Esta rifa não está disponível ou foi bloqueada pela equipe do PA
              RIFAS
            </Text>
            <Button
              leftIcon={<AiOutlineWhatsApp />}
              colorScheme={"whatsapp"}
              mt={5}
              onClick={() => push("/faleconosco")}
            >
              Fale Conosco
            </Button>
          </Flex>
        </Container>
      ) : (
        <Container maxW="6xl" mt={20}>
          {JSON.stringify(raffle) === "{}" ? (
            <Center>
              <Heading fontSize="2xl">Nenhuma informação para mostrar</Heading>
            </Center>
          ) : (
            <>
              <Breadcrumb
                mb={10}
                fontSize={["xx-small", "md", "md", "md", "md"]}
              >
                <BreadcrumbItem>
                  <Link href="/" passHref>
                    <a>
                      <BreadcrumbLink>Início</BreadcrumbLink>
                    </a>
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Link passHref href="/sorteios">
                    <a>
                      <BreadcrumbLink>Sorteios</BreadcrumbLink>
                    </a>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link passHref href={`/rifa/${raffle.identify}`}>
                    <a>
                      <BreadcrumbLink>
                        {capitalizeAllFirstLetter(raffle.name)}
                      </BreadcrumbLink>
                    </a>
                  </Link>
                </BreadcrumbItem>
              </Breadcrumb>

              <Grid
                templateColumns={[
                  "1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                ]}
                mt={10}
                gap={20}
                justifyItems="center"
              >
                <Box
                  w="100%"
                  overflow="hidden"
                  rounded="lg"
                  borderWidth="1px"
                  h="min-content"
                >
                  <Image
                    src={`${configGloba.url}/img/${raffle.thumbnail}`}
                    width={240}
                    height={240}
                    layout="responsive"
                    objectFit="cover"
                    alt="PA Rifas, rifas online"
                  />
                </Box>
                <Box
                  w="100%"
                  rounded="xl"
                  h="min-content"
                  rounded="xl"
                  shadow="lg"
                  borderWidth="1px"
                >
                  <Box p={5}>
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
                          {parseFloat(raffle.raffle_value).toLocaleString(
                            "pt-br",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
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
                  {calcPercent(raffle) < parseFloat(raffle.goal) ? (
                    <Slider
                      aria-label="slider-ex-4"
                      defaultValue={calcPercent()}
                      size="lg"
                      mt="-12px"
                      isReadOnly
                    >
                      <SliderTrack
                        bg={useColorModeValue("red.100", "red.100")}
                        h="10px"
                        rounded="none"
                      >
                        <SliderFilledTrack
                          bg={useColorModeValue("red.500", "red.300")}
                        />
                      </SliderTrack>
                      <SliderThumb
                        boxSize={10}
                        borderWidth="1px"
                        borderColor="red.200"
                      >
                        <Flex
                          justify="center"
                          align="center"
                          fontSize="sm"
                          fontWeight="bold"
                          color="red.500"
                        >
                          {calcPercent()}%
                        </Flex>
                      </SliderThumb>
                    </Slider>
                  ) : (
                    <Slider
                      aria-label="slider-ex-4"
                      defaultValue={calcPercent()}
                      size="lg"
                      mt="-12px"
                      isReadOnly
                    >
                      <SliderTrack
                        bg={useColorModeValue("green.100", "green.100")}
                        h="10px"
                        rounded="none"
                      >
                        <SliderFilledTrack
                          bg={useColorModeValue("green.500", "green.300")}
                        />
                      </SliderTrack>
                      <SliderThumb
                        boxSize={10}
                        borderWidth="1px"
                        borderColor="green.200"
                      >
                        <Flex
                          justify="center"
                          align="center"
                          fontSize="sm"
                          fontWeight="bold"
                          color="green.500"
                        >
                          {calcPercent()}%
                        </Flex>
                      </SliderThumb>
                    </Slider>
                  )}
                  <Box p={5} mt="-12px">
                    <Flex>
                      <Flex
                        rounded="full"
                        w="50px"
                        h="50px"
                        bg={
                          colorMode === "light"
                            ? "blackAlpha.100"
                            : "whiteAlpha.200"
                        }
                        justify="center"
                        align="center"
                      >
                        <Icon as={AiOutlineUser} fontSize="3xl" />
                      </Flex>
                      <Box ml={3}>
                        <Text fontSize="sm" fontWeight="bold">
                          {raffle.name_client}
                        </Text>
                        <Text
                          color={
                            colorMode === "light" ? "green.500" : "green.200"
                          }
                          fontSize="sm"
                        >
                          {raffle.client_city} - {raffle.client_state}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Divider />
                  <Center mt={3}>
                    <Text fontSize="sm">COMPARTILHAR</Text>
                  </Center>
                  <Center p={3}>
                    <ChakraLink
                      href={`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`}
                      target={"_blank"}
                    >
                      <IconButton
                        icon={<AiOutlineFacebook />}
                        colorScheme="green"
                        variant="outline"
                      />
                    </ChakraLink>
                    <ChakraLink
                      href={`https://api.whatsapp.com/send?text=${siteUrl}`}
                      target={"_blank"}
                    >
                      <IconButton
                        icon={<AiOutlineWhatsApp />}
                        colorScheme="green"
                        ml={3}
                        mr={3}
                        variant="outline"
                      />
                    </ChakraLink>
                    <CopyToClipboard
                      text={siteUrl}
                      onCopy={() =>
                        showToast(
                          "Url copiada para a área de transferência",
                          "info",
                          "Informação"
                        )
                      }
                    >
                      <IconButton
                        icon={<AiOutlineCopy />}
                        colorScheme="green"
                        variant="outline"
                      />
                    </CopyToClipboard>
                  </Center>
                </Box>
              </Grid>
            </>
          )}

          <Tabs mt={10} colorScheme={"green"} variant={"enclosed-colored"}>
            <TabList>
              <Tab roundedTop={"md"}>Números</Tab>
              <Tab roundedTop={"md"}>Prêmios</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                {new Date() >= new Date(raffle.draw_date) ? (
                  <Flex
                    justify={"center"}
                    align={"center"}
                    direction={"column"}
                    mt={10}
                  >
                    <Lottie animation={emptyAnimation} width={"30%"} />
                    <Text textAlign={"center"} mt={5}>
                      Nenhum número para sortear, rifa fora do período de
                      validade.
                    </Text>
                  </Flex>
                ) : (
                  <>
                    <Grid
                      templateColumns={[
                        "repeat(2, 140px)",
                        "repeat(3, 180px)",
                        "repeat(4, 180px)",
                        "repeat(4, 180px)",
                        "repeat(4, 180px)",
                      ]}
                      gap="15px"
                      mt={10}
                    >
                      <Box
                        rounded="3xl"
                        pt={1}
                        pb={1}
                        pr={3}
                        pl={3}
                        bg="black"
                        color="white"
                        textAlign="center"
                        fontSize={["xs", "md", "md", "md", "md"]}
                      >
                        Livres (
                        {nums.length > 0 && JSON.stringify(raffle) !== "{}"
                          ? raffle.qtd_numbers -
                            nums.filter((obj) => obj.status === "reserved")
                              .length -
                            nums.filter((obj) => obj.status === "paid_out")
                              .length
                          : raffle.qtd_numbers}
                        )
                      </Box>
                      <Box
                        rounded="3xl"
                        pt={1}
                        pb={1}
                        pr={3}
                        pl={3}
                        bg="orange.400"
                        color="white"
                        textAlign="center"
                        fontSize={["xs", "md", "md", "md", "md"]}
                      >
                        Reservado (
                        {nums.length > 0
                          ? nums.filter((obj) => obj.status === "reserved")
                              .length
                          : 0}
                        )
                      </Box>
                      <Box
                        rounded="3xl"
                        pt={1}
                        pb={1}
                        pr={3}
                        pl={3}
                        bg="green.400"
                        color="white"
                        textAlign="center"
                        fontSize={["xs", "md", "md", "md", "md"]}
                      >
                        Pago (
                        {nums.length > 0
                          ? nums.filter((obj) => obj.status === "paid_out")
                              .length
                          : 0}
                        )
                      </Box>
                      <Box
                        rounded="3xl"
                        pt={1}
                        pb={1}
                        pr={3}
                        pl={3}
                        bg="red.600"
                        color="white"
                        textAlign="center"
                        fontSize={["xs", "md", "md", "md", "md"]}
                      >
                        Meus Números (
                        {JSON.stringify(client) !== "{}"
                          ? nums.filter((obj) => obj.id_client === client.id)
                              .length
                          : 0}
                        )
                      </Box>
                    </Grid>

                    <Box
                      rounded="xl"
                      p={4}
                      shadow="lg"
                      bg={
                        colorMode === "light"
                          ? "rgba(0,0,0,0.02)"
                          : "whiteAlpha.300"
                      }
                      borderWidth="1px"
                      mt={5}
                    >
                      <Grid
                        templateColumns={[
                          "repeat(5, 1fr)",
                          "repeat(10, 1fr)",
                          "repeat(10, 1fr)",
                          "repeat(12, 1fr)",
                          "repeat(12, 1fr)",
                        ]}
                        gap="5px"
                        justifyContent="center"
                        h="400px"
                        overflow="auto"
                        pr={1}
                      >
                        {numbersToShort.map((num) => (
                          <Flex
                            rounded={"md"}
                            userSelect={"none"}
                            h="35px"
                            justify={"center"}
                            align={"center"}
                            cursor={
                              nums.find(
                                (obj) => obj.number === parseInt(num.num)
                              )
                                ? "not-allowed"
                                : "pointer"
                            }
                            bg={
                              mynumbers.find((obj) => obj === num.num)
                                ? "blue.500"
                                : setBgAndColor(num.num)
                            }
                            _active={{
                              bg: mynumbers.find((obj) => obj === num.num)
                                ? "blue.500"
                                : "gray.800",
                            }}
                            _
                            key={num.num}
                            onClick={() => handleNumbers(num.num)}
                            color="gray.100"
                          >
                            {num.num}
                          </Flex>
                        ))}
                      </Grid>

                      <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => clearNumbers()}
                        mt={5}
                      >
                        Limpar Números
                      </Button>
                    </Box>

                    <Grid
                      rounded="xl"
                      shadow="lg"
                      borderWidth="1px"
                      p={5}
                      h="min-content"
                      templateColumns={[
                        "1fr",
                        "1fr 1fr 1fr",
                        "1fr 1fr 1fr",
                        "1fr 1fr 1fr",
                        "1fr 1fr 1fr",
                      ]}
                      gap={5}
                      mt={10}
                      alignItems="center"
                      justifyItems={[
                        "center",
                        "initial",
                        "initial",
                        "initial",
                        "initial",
                      ]}
                    >
                      <Stat>
                        <StatLabel>Total a Pagar</StatLabel>
                        <StatNumber>
                          {isDiscounted === true ? (
                            <HStack>
                              <Text
                                textDecor={"line-through"}
                                color="gray.600"
                                fontWeight={"light"}
                              >
                                {parseFloat(amountCompare).toLocaleString(
                                  "pt-br",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )}
                              </Text>
                              <Text>
                                {parseFloat(amount).toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Text>
                            </HStack>
                          ) : (
                            parseFloat(amount).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })
                          )}
                        </StatNumber>
                      </Stat>

                      <HStack>
                        <Input
                          value={nameCoupon}
                          onChange={(e) =>
                            setNameCoupon(e.target.value.toUpperCase())
                          }
                          placeholder="Insira o Cupom"
                          focusBorderColor="green.500"
                        />
                        <IconButton
                          icon={<FaCheck />}
                          variant="outline"
                          colorScheme={"green"}
                          isLoading={loadingCoupon}
                          onClick={() => findCoupon()}
                        />
                      </HStack>

                      <Grid
                        templateColumns={"1fr"}
                        gap={[2, 5, 5, 5, 5]}
                        w="100%"
                      >
                        <Button
                          leftIcon={<FaCheck />}
                          colorScheme="green"
                          size="lg"
                          onClick={() => setModalSent(true)}
                          isFullWidth
                        >
                          Finalizar Compra
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </TabPanel>

              <TabPanel p={0}>
                <Stack mt={10} spacing={5}>
                  {trophy.length !== 0
                    ? trophy.map((tro) => (
                        <Grid
                          templateColumns={"60px 1fr"}
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
                        </Grid>
                      ))
                    : ""}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}

      <FooterApp />

      <Modal isOpen={modalSend} onClose={() => setModalSent(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reserva de Número</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {JSON.stringify(client) === "{}" || !client ? (
              <>
                <Flex justify="center" align="center" direction="column">
                  <Heading textAlign="center">Não encontramos você!</Heading>
                  <Box
                    bgGradient={
                      colorMode === "light"
                        ? "linear(to-r, green.500, orange.500)"
                        : "linear(to-r, green.200, orange.200)"
                    }
                    w="200px"
                    h="5px"
                    mt={3}
                    mb={3}
                  />
                </Flex>
                <Grid
                  templateColumns={[
                    "280px",
                    "350px",
                    "350px 350px",
                    "350px 350px",
                    "350px 350px",
                  ]}
                  gap={10}
                  mt={10}
                  justifyContent="center"
                >
                  <Flex
                    w="100%"
                    rounded="xl"
                    borderWidth="1px"
                    direction="column"
                    justify="center"
                    align="center"
                    p={5}
                  >
                    <Box w="40%">
                      <Image
                        src="/img/register.svg"
                        width={200}
                        height={200}
                        layout="responsive"
                        objectFit="contain"
                        alt="PA Rifas, rifas online"
                      />
                    </Box>

                    <Heading textAlign="center" fontSize="2xl" mt={5}>
                      Não possui conta?
                    </Heading>

                    <Button
                      size="lg"
                      isFullWidth
                      mt={5}
                      colorScheme="orange"
                      onClick={() => setOpenRegister(true)}
                    >
                      CADASTRE-SE
                    </Button>
                  </Flex>

                  <Flex
                    w="100%"
                    rounded="xl"
                    borderWidth="1px"
                    direction="column"
                    justify="center"
                    align="center"
                    p={5}
                  >
                    <Box w="40%">
                      <Image
                        src="/img/login.svg"
                        width={200}
                        height={200}
                        layout="responsive"
                        objectFit="contain"
                        alt="PA Rifas, rifas online"
                      />
                    </Box>

                    <Heading textAlign="center" fontSize="2xl" mt={5}>
                      Já possui conta?
                    </Heading>

                    <Button
                      size="lg"
                      isFullWidth
                      mt={5}
                      colorScheme="green"
                      onClick={() => setOpenLogin(true)}
                    >
                      FAÇA LOGIN
                    </Button>
                  </Flex>
                </Grid>
              </>
            ) : (
              <>
                <Text>Por favor verifique se seus dados estão corretos!</Text>
                <FormControl mb={3} mt={3}>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    focusBorderColor="green.500"
                    placeholder="Nome Completo"
                    value={client.name}
                    isReadOnly
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    focusBorderColor="green.500"
                    placeholder="Email"
                    isReadOnly
                    value={client.email}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>CPF</FormLabel>
                  <MaskedInput
                    mask={[
                      /[0-9]/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                    ]}
                    value={client.cpf}
                    placeholder="CPF"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor="green.500"
                        isReadOnly
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <MaskedInput
                    mask={[
                      "(",
                      /[0-9]/,
                      /\d/,
                      ")",
                      " ",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    placeholder="Telefone"
                    id="contact"
                    value={client.phone}
                    render={(ref, props) => (
                      <InputGroup>
                        <InputLeftElement children={<FaWhatsapp />} />
                        <Input
                          placeholder="Telefone"
                          ref={ref}
                          {...props}
                          focusBorderColor="green.500"
                          isReadOnly
                        />
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Text mt={4} fontSize="xs">
                  * Caso seus dados não esteja corretos, vá até{" "}
                  <Link href={`/meusdados/${client.identify}`} passHref>
                    <ChakraLink fontWeight="bold">MEUS DADOS</ChakraLink>
                  </Link>{" "}
                  para corrigi-los
                </Text>
                <Checkbox
                  defaultIsChecked
                  colorScheme="green"
                  mt={3}
                  isChecked={concordo}
                  onChange={(e) => setConcordo(e.target.checked)}
                >
                  Reservando seu(s) número(s), você declara que leu e concorda
                  com nossos{" "}
                  <Link href="/condicoesdeuso" passHref>
                    <a target="_blank" style={{ textDecoration: "underline" }}>
                      Termos de uso
                    </a>
                  </Link>
                </Checkbox>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              leftIcon={<FaCheck />}
              ml={3}
              onClick={() => storeNumbers()}
              isDisabled={!concordo}
              isLoading={loading}
            >
              Concluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayment}
        onClose={() => setModalPayment(false)}
        size={"xs"}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pagamento</ModalHeader>
          <ModalBody>
            <Box
              w="100%"
              overflow="hidden"
              rounded="lg"
              borderWidth="1px"
              h="min-content"
            >
              <Image
                src={`${configGloba.url}/img/${raffle.thumbnail}`}
                width={240}
                height={240}
                layout="responsive"
                objectFit="cover"
                alt="PA Rifas, rifas online"
              />
            </Box>

            <Text mt={3} fontSize={"sm"}>
              <strong>CÓDIGO:</strong> {order.identify}
            </Text>
            <Text mt={1} fontSize={"sm"}>
              <strong>CLIENTE:</strong> {client.name}
            </Text>
            <Text mt={1} fontSize={"sm"}>
              <strong>TELEFONE:</strong> {client.phone}
            </Text>

            <Text mt={3} fontSize={"sm"}>
              Números Reservados:
            </Text>

            <Grid templateColumns={"1fr 1fr 1fr"} gap={3}>
              {mynumbers.map((num) => (
                <Flex
                  bg="orange.500"
                  color={"gray.100"}
                  justify={"center"}
                  align={"center"}
                  rounded="md"
                  h="30px"
                  fontSize={"sm"}
                  key={num}
                >
                  {num}
                </Flex>
              ))}
            </Grid>

            <Stat mt={5} mb={-3}>
              <StatLabel>Total a Pagar</StatLabel>
              <StatNumber>{`R$ ${parseFloat(order.value).toLocaleString(
                "pt-br",
                {
                  minimumFractionDigits: 2,
                }
              )}`}</StatNumber>
            </Stat>
          </ModalBody>

          <ModalFooter>
            <Button
              isFullWidth
              colorScheme={"green"}
              leftIcon={<AiOutlineDollar />}
              isLoading={loading}
              onClick={() => payById()}
            >
              Pagar Agora
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default memo(Sorteio);

export const getStaticPaths = async () => {
  const response = await fetch(`${configGloba.url}/findRaffle`);
  const data = await response.json();
  const paths = await data.map((raf) => {
    return { params: { sorteio: raf.identify } };
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const raff = params.sorteio;
  const response = await fetch(`${configGloba.url}/findRaffleById/${raff}`);
  const data = await response.json();
  let raffles = !data.raffle ? null : data.raffle;
  let trophys = !data.trophys ? null : data.trophys;
  let numbersRaffle = !data.numbers ? null : data.numbers;
  return {
    props: {
      raffles,
      trophys,
      numbersRaffle,
    },
    revalidate: 5,
  };
};
