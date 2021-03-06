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
  Icon,
  Input,
  Divider,
  Center,
  IconButton,
  Skeleton,
  useColorMode,
  useColorModeValue,
  Link as ChakraLink,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  List,
  ListItem,
  ListIcon,
  Tag,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/sliders";
import Image from "next/image";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  AiOutlineCopy,
  AiOutlineFacebook,
  AiOutlineTrophy,
  AiOutlineUser,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import configGloba from "../../configs/index";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import { useClient } from "../../context/Clients";
import { useLoginModal } from "../../context/ModalLogin";
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

  const [raffle] = useState(raffles);
  const [trophy] = useState(trophys);
  const [nums, setNums] = useState([]); //Para compara os n??meros, Livres, Reservados e Pagos

  const [loading, setLoading] = useState(false);

  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [nameCoupon, setNameCoupon] = useState("");
  const [isDiscounted, setIsDiscounted] = useState(false);

  const [numbersToShort, setNumbersToShort] = useState([]);

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
        showToast("Este n??mero j?? foi selecionado", "warning", "Aten????o");
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
    if (JSON.stringify(client) === "{}") {
      setModalSent(true);
      return false;
    }
    if (mynumbers.length === 0) {
      showToast(
        "Selecione pelo menos um n??mero para continuar",
        "warning",
        "Aten????o"
      );
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post("/numbers", {
        raffle_id: raffle.id,
        client_id: client.id,
        numbers: mynumbers,
        orderValue: amount,
      });
      setAmount(0);
      setModalSent(false);
      setLoading(false);
      setIsDiscounted(false);
      setNameCoupon("");
      showToast(response.data.message, "success", "Sucesso");
      push(
        `/checkout/?order=${response.data.order.id}&identify=${response.data.order.identify}`
      );
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
        );
        return false;
      }
      let mess = !error.response.data
        ? "Erro no cadastro do cliente"
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
            return "orange.500";
          }
          if (find.status === "paid_out") {
            return "green.500";
          }
        }
      } else {
        if (find.status === "reserved") {
          return "orange.500";
        }
        if (find.status === "paid_out") {
          return "green.500";
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
    return parseInt(finalCalc);
  }

  function calcDiscountCupom(value) {
    let calc = parseFloat(amount) * (parseFloat(value) / 100);
    let rest = parseFloat(amount) - calc;
    setAmount(rest);
  }

  async function findCoupon() {
    if (nameCoupon === "") {
      showToast("Insira um cupom", "warning", "Aten????o");
      return false;
    }
    setLoadingCoupon(true);

    try {
      const response = await api.get(`/couponRaffleHash/${nameCoupon}`);
      if (mynumbers.length < response.data.min_numbers) {
        showToast(
          `Quantidade de n??meros insuficiente para aplicar o desconto, a quantidade pedida ??: ${response.data.min_numbers}`,
          "warning",
          "Aten????o"
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
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
        );
        return false;
      }
      showToast("Erro ao buscar o cupom", "error", "Erro");
    }
  }

  function handleLogin() {
    setModalSent(false);
    setOpenLogin(true);
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
              Esta rifa n??o est?? dispon??vel ou foi bloqueada pela equipe do PA
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
              <Heading fontSize="2xl">Nenhuma informa????o para mostrar</Heading>
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
                      <BreadcrumbLink>In??cio</BreadcrumbLink>
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
                gap={10}
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
                      <Tag colorScheme={"red"}>PRORROGADO</Tag>
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
                    <Heading
                      fontSize={"xl"}
                      color={useColorModeValue("green.500", "green.200")}
                    >
                      CONCORRA A:
                    </Heading>

                    <List spacing={3} mt={3}>
                      {trophy.length !== 0
                        ? trophy.map((tro) => (
                            <ListItem key={tro.id}>
                              <ListIcon
                                as={AiOutlineTrophy}
                                color={useColorModeValue(
                                  "green.500",
                                  "green.200"
                                )}
                              />
                              {tro.description}
                            </ListItem>
                          ))
                        : ""}
                    </List>
                  </Box>

                  <Divider />

                  <Box p={5}>
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
                          "Url copiada para a ??rea de transfer??ncia",
                          "info",
                          "Informa????o"
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

          {new Date() >= new Date(raffle.draw_date) ? (
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              mt={10}
            >
              <Lottie animation={emptyAnimation} width={"30%"} />
              <Text textAlign={"center"} mt={5}>
                Nenhum n??mero para sortear, rifa fora do per??odo de validade.
              </Text>
            </Flex>
          ) : (
            <>
              <Grid
                templateColumns={[
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(4, 1fr)",
                  "repeat(4, 1fr)",
                  "repeat(4, 1fr)",
                ]}
                gap={0}
                mt={10}
                rounded="md"
                overflow={"hidden"}
              >
                <Box
                  p={3}
                  bg="black"
                  color="white"
                  textAlign="center"
                  fontWeight={"bold"}
                >
                  Livres (
                  {nums.length > 0 && JSON.stringify(raffle) !== "{}"
                    ? raffle.qtd_numbers -
                      nums.filter((obj) => obj.status === "reserved").length -
                      nums.filter((obj) => obj.status === "paid_out").length
                    : raffle.qtd_numbers}
                  )
                </Box>
                <Box
                  p={3}
                  bg="orange.500"
                  color="white"
                  textAlign="center"
                  fontWeight={"bold"}
                >
                  Reservado (
                  {nums.length > 0
                    ? nums.filter((obj) => obj.status === "reserved").length
                    : 0}
                  )
                </Box>
                <Box
                  p={3}
                  bg="green.500"
                  color="white"
                  textAlign="center"
                  fontWeight={"bold"}
                >
                  Pago (
                  {nums.length > 0
                    ? nums.filter((obj) => obj.status === "paid_out").length
                    : 0}
                  )
                </Box>
                <Box
                  p={3}
                  bg="red.600"
                  color="white"
                  textAlign="center"
                  fontWeight={"bold"}
                >
                  Meus N??meros (
                  {JSON.stringify(client) !== "{}"
                    ? nums.filter((obj) => obj.id_client === client.id).length
                    : 0}
                  )
                </Box>
              </Grid>

              <Box
                rounded="xl"
                p={3}
                shadow="lg"
                bg={
                  colorMode === "light" ? "rgba(0,0,0,0.02)" : "whiteAlpha.300"
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
                  h="480px"
                  pr={1}
                  overflow={"auto"}
                  justifyContent="center"
                >
                  {numbersToShort.map((num) => (
                    <Flex
                      rounded={"md"}
                      userSelect={"none"}
                      h="35px"
                      justify={"center"}
                      align={"center"}
                      cursor={
                        nums.find((obj) => obj.number === parseInt(num.num))
                          ? "not-allowed"
                          : "pointer"
                      }
                      bg={
                        mynumbers.find((obj) => obj === num.num)
                          ? "blue.500"
                          : setBgAndColor(num.num)
                      }
                      _active={{
                        bg:
                          mynumbers.find((obj) => obj === num.num) &&
                          "blue.500",
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
              </Box>

              <Grid
                rounded="xl"
                shadow="lg"
                borderWidth={"1px"}
                p={3}
                gap={[2, 2, 2, 3, 3]}
                h="min-content"
                templateColumns={[
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr 1fr 1fr",
                  "1fr 1fr 1fr 1fr",
                ]}
                alignItems="center"
                justifyItems={[
                  "center",
                  "initial",
                  "initial",
                  "initial",
                  "initial",
                ]}
                mt={5}
              >
                <Stat w="100px">
                  <StatLabel>Total a Pagar</StatLabel>
                  <StatNumber>
                    {isDiscounted === true ? (
                      <HStack>
                        <Text
                          textDecor={"line-through"}
                          color="gray.600"
                          fontWeight={"light"}
                        >
                          {parseFloat(amountCompare).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
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
                    placeholder="Cupom"
                    focusBorderColor="green.500"
                    w="100%"
                  />
                  <IconButton
                    icon={<FaCheck />}
                    variant="outline"
                    colorScheme={"green"}
                    isLoading={loadingCoupon}
                    onClick={() => findCoupon()}
                  />
                </HStack>

                <Button
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => clearNumbers()}
                  isFullWidth
                >
                  Limpar N??meros
                </Button>

                <Button
                  leftIcon={<FaCheck />}
                  colorScheme="green"
                  isFullWidth
                  onClick={() => storeNumbers()}
                  isLoading={loading}
                >
                  Finalizar Compra
                </Button>
              </Grid>
            </>
          )}
        </Container>
      )}

      <FooterApp />

      <AlertDialog isOpen={modalSend} onClose={() => setModalSent(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Informa????o
            </AlertDialogHeader>

            <AlertDialogBody>
              N??o encontramos um cliente logado para prosseguir com a reserva,
              por favor escolha uma das op????es abaixo.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => push(`/cadastro/?rifa=${query.sorteio}`)}>
                Cadastre-se
              </Button>
              <Button colorScheme="green" onClick={() => handleLogin()} ml={3}>
                Fa??a Login
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
