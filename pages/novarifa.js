import { useEffect, useMemo, useState } from "react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footer";
import { File, InputFile } from "../styles/uploader";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Grid,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  InputRightAddon,
  Divider,
  Select,
  Flex,
  Text,
  IconButton,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  FormErrorMessage,
  Image as ChakraImage,
  Heading,
  useColorMode,
  Stack,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  StatHelpText,
  ModalBody,
  ModalCloseButton,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Tooltip,
  Center,
  InputLeftAddon,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import Link from "next/link";
import {
  FaImage,
  FaCalendarAlt,
  FaWhatsapp,
  FaPercentage,
  FaCheck,
  FaPlus,
  FaTrash,
  FaTrophy,
  FaCalculator,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import MaskedInput from "react-text-mask";
import Image from "next/image";
import { useClient } from "../context/Clients";
import configsGlobal from "../configs/index";
import api from "../configs/axios";
import { useLoginModal } from "../context/ModalLogin";
import { useRegisterModal } from "../context/ModalRegister";
import { useRouter } from "next/router";

registerLocale("pt_br", pt_br);

export default function NovoSorteio({ config }) {
  const { colorMode } = useColorMode();
  const { push } = useRouter();
  const toast = useToast();
  const { client } = useClient();
  const { setOpenLogin } = useLoginModal();
  const { setOpenRegister } = useRegisterModal();

  const [startDate, setStartDate] = useState(new Date());
  const [modalTaxes, setModalTaxes] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalCalc, setModalCalc] = useState(false);

  const [raffle, setRaffle] = useState("");
  const [qtdNumbers, setQtdNumbers] = useState("0");
  const [raffleValue, setRaffleValue] = useState(config.raffle_value || 0);
  const [raffleValueCompare, setRaffleValueCompare] = useState(
    config.raffle_value || 0
  );
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [raffleTotal, setRaffleTotal] = useState(0);
  const [goal, setGoal] = useState(100);

  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");

  const [loadingSave, setLoadingSave] = useState(false);

  const [checkOne, setCheckOne] = useState(false);
  const [checkTwo, setCheckTwo] = useState(false);
  const [checkThree, setCheckThree] = useState(false);
  const [checkFour, setCheckFour] = useState(false);
  const [checkFive, setCheckFive] = useState(false);

  const [trophys, setTrophys] = useState([]);
  const [trophyOrder, setTrophyOrder] = useState("");
  const [trophyDescription, setTrophyDescription] = useState("");

  const [pixTax, setPixTax] = useState(configsGlobal.pixTax);
  const [cardTax, setCardTax] = useState(configsGlobal.cardTax);
  const [rafflePreviousValue, setRafflePreviousValue] = useState(0);
  const [raffleDiscountValue, setRaffleDiscountValue] = useState(0);
  const [raffleDiscountTotal, setRaffleDiscountTotal] = useState(0);

  const [cardPreviousValue, setCardPreviousValue] = useState(0);
  const [cardDiscountValue, setCardDiscountValue] = useState(0);

  const [tax, setTax] = useState(configsGlobal.pixTax || 0);

  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponIdentify, setCouponIdentify] = useState("");

  function clear() {
    setRaffle("");
    setQtdNumbers("0");
    setRaffleValue(config.raffle_value || 0);
    setThumbnail(null);
    removeThumbnail();
    setDescription("");
    setStartDate(new Date());
    setCheckOne(false);
    setCheckTwo(false);
    setCheckThree(false);
    setCheckFive(false);
    setTrophys([]);
    setGoal(100);
    setRaffleTotal(0);
    setCoupon("");
    setIsDiscounted(false);
    setRaffleValueCompare(config.raffle_value || 0);
  }

  function handleTrophy() {
    if (trophyDescription === "") {
      showToast("Insira uma descrição para o Prêmio", "warning", "Atenção");
      return false;
    }
    const find = trophys.find((obj) => obj.order === trophyOrder);
    if (find) {
      showToast("Já existe um prêmio nesta posição", "warning", "Atenção");
      return false;
    }
    const info = { order: Math.random(), desc: trophyDescription };
    setTrophys([...trophys, info]);
    setTrophyOrder("");
    setTrophyDescription("");
  }

  function handleDelTrophy(pos) {
    const result = trophys.filter((obj) => obj.order !== pos);
    setTrophys(result);
  }

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size / 1024;
      let thumbname = thumbnail.name;
      if (thumbname.includes(" ")) {
        handleValidator("image", "Nome da imagem não pode conter espaços");
      }
      if (size > 500) {
        handleValidator(
          "image",
          "Imagem maior que 500kb, insira uma imagem menor"
        );
      }
    } else {
      setValidators([]);
    }
  }, [thumbnail]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image" || path !== "banner") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
  }

  useEffect(() => {
    calcPercent(cardPreviousValue);
  }, [tax]);

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input
        focusBorderColor="green.500"
        defaultValue={value}
        onClick={onClick}
      />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  async function saveRaffle() {
    if (!thumbnail) {
      handleValidator("image", "Insira uma imagem");
      showToast("Insira uma imagem", "warning", "Atenção");
      return false;
    }
    let size = thumbnail.size / 1024;
    if (size > 500) {
      handleValidator(
        "image",
        "Imagem maior que 500kb, insira uma imagem menor"
      );
      showToast(
        "Imagem maior que 500kb, insira uma imagem menor",
        "warning",
        "Atenção"
      );
      return false;
    }
    if (raffle === "") {
      handleValidator("raffle", "Campo Obrigatório");
      showToast("Campo Obrigatório", "warning", "Atenção");
      return false;
    }
    if (parseFloat(qtdNumbers) > parseFloat(config.max_numbers)) {
      showToast(
        `O número de rifas ultrapassa o número máximo permitido, a quatidade máxima permitida é de ${config.max_numbers} números.`,
        "warning",
        "Atenção"
      );
      return false;
    }
    if (description === "") {
      handleValidator("description", "Campo Obrigatório");
      showToast("A descrição é obrigatória", "warning", "Atenção");
      return false;
    }
    setLoadingSave(true);
    try {
      let data = new FormData();
      data.append("thumbnail", thumbnail);
      data.append("name", raffle);
      data.append("qtd_numbers", parseFloat(qtdNumbers));
      data.append("draw_date", startDate);
      data.append("draw_time", startDate);
      data.append("client_id", client.id);
      data.append("description", description);
      data.append("raffle_value", raffleTotal);
      data.append("trophys", JSON.stringify(trophys));
      data.append("goal", goal);
      data.append("tax_value", raffleValue);
      data.append("isDiscounted", isDiscounted === true ? "yes" : "no");
      data.append("coupon", couponIdentify);

      const response = await api.post("/raffle", data);
      showToast(response.data.message, "success", "Sucesso");
      setLoadingSave(false);
      clear();
    } catch (error) {
      setLoadingSave(false);
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

  function calcPercent(value) {
    let calc = value * (parseFloat(tax) / 100);
    let rest = value - calc;
    setCardPreviousValue(value);
    if (!isNaN(rest)) {
      setCardDiscountValue(parseFloat(rest.toFixed(2)));
    }
  }

  function calcPercentRaffle(value) {
    let calc = value * (parseFloat(raffleValue) / 100);
    let rest = value - calc;
    setRafflePreviousValue(value);
    if (!isNaN(rest)) {
      setRaffleDiscountValue(parseFloat(rest.toFixed(2)));
      setRaffleDiscountTotal(parseFloat(calc.toFixed(2)));
    }
  }

  function handleCloseModalCalc() {
    setPixTax(configsGlobal.pixTax);
    setCardTax(configsGlobal.cardTax);
    setCardPreviousValue(0);
    setCardDiscountValue(0);
    setRafflePreviousValue(0);
    setRaffleDiscountValue(0);
    setRaffleDiscountTotal(0);
    setModalCalc(false);
  }

  useEffect(() => {
    setCardPreviousValue(0);
    setCardDiscountValue(0);
    setRafflePreviousValue(0);
    setRaffleDiscountValue(0);
    setRaffleDiscountTotal(0);
  }, [raffleValue, pixTax, cardTax]);

  async function FindCoupon() {
    try {
      setCouponLoading(true);
      const response = await api.get(`/coupon/${coupon}`);
      setCouponIdentify(response.data.identify);
      setRaffleValue(parseFloat(response.data.coupon_value));
      setIsDiscounted(true);
      setCouponLoading(false);
    } catch (error) {
      setCouponLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      let mess = !error.response.data
        ? "Erro no cupom"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  return (
    <>
      <HeaderApp />
      <Container maxW="6xl" mt={10}>
        <Breadcrumb mb={10} fontSize={["xx-small", "md", "md", "md", "md"]}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/novarifa">
              <a>
                <BreadcrumbLink>Criar Sorteio</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        {JSON.stringify(client) === "{}" ? (
          <Container maxW="4xl">
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
                shadow="lg"
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
                shadow="lg"
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
          </Container>
        ) : (
          <>
            {client.active_admin === true ? (
              <Grid
                templateColumns={["1fr", "1fr", "1fr", "1fr", "1fr 300px"]}
                gap={10}
              >
                <Box>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "1fr",
                      "1fr",
                      "220px 1fr",
                      "220px 1fr",
                    ]}
                    gap="20px"
                    justifyContent="center"
                  >
                    <FormControl
                      isRequired
                      isInvalid={
                        validators.find((obj) => obj.path === "image")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Imagem do Sorteio</FormLabel>
                      {thumbnail ? (
                        <Box w="220px" h="220px" rounded="lg" overflow="hidden">
                          <ChakraImage
                            w="220px"
                            h="220px"
                            src={previewThumbnail}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            rounded="full"
                            colorScheme="red"
                            mt={-20}
                            ml="90px"
                            shadow="dark-lg"
                            onClick={() => removeThumbnail()}
                          />
                        </Box>
                      ) : (
                        <InputFile lar={220} alt={220}>
                          <File
                            type="file"
                            onChange={(event) =>
                              setThumbnail(event.target.files[0])
                            }
                            id="image"
                          />
                          <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                          <p>Insira uma imagem de proporções quadrada</p>
                        </InputFile>
                      )}
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "image")
                          ? validators.find((obj) => obj.path === "image")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                    <Box>
                      <Grid
                        templateColumns={[
                          "1fr",
                          "3fr 1fr",
                          "3fr 1fr",
                          "3fr 1fr",
                          "3fr 1fr",
                        ]}
                        gap="20px"
                      >
                        <FormControl
                          isRequired
                          isInvalid={
                            validators.find((obj) => obj.path === "raffle")
                              ? true
                              : false
                          }
                        >
                          <FormLabel>Nome do Sorteio</FormLabel>
                          <Input
                            id="raffle"
                            placeholder="Nome do Sorteio"
                            focusBorderColor="green.500"
                            value={raffle}
                            onChange={(e) =>
                              setRaffle(e.target.value.toUpperCase())
                            }
                          />
                          <FormErrorMessage>
                            {validators.find((obj) => obj.path === "raffle")
                              ? validators.find((obj) => obj.path === "raffle")
                                  .message
                              : ""}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isRequired
                          isInvalid={
                            validators.find((obj) => obj.path === "qtd")
                              ? true
                              : false
                          }
                        >
                          <FormLabel>Qtd. de Números</FormLabel>
                          <NumberInput
                            focusBorderColor="green.500"
                            id="qtd"
                            value={qtdNumbers}
                            onChange={(e) => setQtdNumbers(e)}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>
                            {validators.find((obj) => obj.path === "qtd")
                              ? validators.find((obj) => obj.path === "qtd")
                                  .message
                              : ""}
                          </FormErrorMessage>
                        </FormControl>
                      </Grid>
                      <Grid
                        templateColumns={[
                          "1fr",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                        ]}
                        gap="20px"
                        mt={4}
                      >
                        <FormControl
                          isRequired
                          isInvalid={
                            validators.find((obj) => obj.path === "value")
                              ? true
                              : false
                          }
                        >
                          <FormLabel>Valor do Sorteio (R$)</FormLabel>
                          <NumberInput
                            focusBorderColor="green.500"
                            step={0.01}
                            id="value"
                            value={raffleTotal}
                            onChange={(e) => setRaffleTotal(e)}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>
                            {validators.find((obj) => obj.path === "value")
                              ? validators.find((obj) => obj.path === "value")
                                  .message
                              : ""}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Data do Sorteio</FormLabel>
                          <div className="customDatePickerWidth">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              customInput={<CustomInputPicker />}
                              locale="pt_br"
                              dateFormat="dd/MM/yyyy"
                            />
                          </div>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Hora do Sorteio</FormLabel>
                          <div className="customDatePickerWidth">
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              customInput={<CustomInputPicker />}
                              locale="pt_br"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Horário"
                              dateFormat="h:mm aa"
                            />
                          </div>
                        </FormControl>
                      </Grid>

                      <Grid
                        templateColumns={[
                          "1fr",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                          "repeat(3, 1fr)",
                        ]}
                        gap="20px"
                        mt={4}
                      >
                        <FormControl>
                          <FormLabel>Nome do Administrador</FormLabel>
                          <Input
                            placeholder="Nome do Sorteio"
                            focusBorderColor="green.500"
                            isReadOnly
                            value={client.name}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            placeholder="Nome do Sorteio"
                            focusBorderColor="green.500"
                            isReadOnly
                            value={client.email}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Telefone - Whatsapp</FormLabel>
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
                      </Grid>
                    </Box>
                  </Grid>

                  <FormControl mt={4}>
                    <FormLabel>Meta Mínima</FormLabel>
                    <InputGroup>
                      <Input
                        focusBorderColor="green.500"
                        placeholder="Meta Mínima"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        type="number"
                      />
                      <InputRightAddon children="%" />
                    </InputGroup>
                  </FormControl>

                  <Grid templateColumns="1fr">
                    <FormControl
                      isRequired
                      mt={4}
                      isInvalid={
                        validators.find((obj) => obj.path === "description")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Descrição do Sorteio</FormLabel>
                      <Textarea
                        placeholder="Descrição do Sorteio"
                        focusBorderColor="green.500"
                        rows={5}
                        resize="none"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value.toUpperCase())
                        }
                        id="description"
                      />
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "description")
                          ? validators.find((obj) => obj.path === "description")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  </Grid>

                  <FormControl isRequired mt={5}>
                    <FormLabel>Prêmios</FormLabel>

                    <Grid
                      templateColumns={[
                        "1fr",
                        "3fr 1fr",
                        "3fr 1fr",
                        "3fr 1fr",
                        "3fr 1fr",
                      ]}
                      gap={5}
                    >
                      <Input
                        placeholder="Descrição do Prêmio"
                        focusBorderColor="green.500"
                        value={trophyDescription}
                        onChange={(e) =>
                          setTrophyDescription(e.target.value.toUpperCase())
                        }
                      />
                      <Button
                        leftIcon={<FaPlus />}
                        colorScheme="green"
                        onClick={() => handleTrophy()}
                      >
                        Adicionar
                      </Button>
                    </Grid>
                  </FormControl>

                  <Stack mt={5}>
                    {trophys.map((tro) => (
                      <Grid
                        templateColumns={"60px 1fr 80px"}
                        gap={5}
                        rounded={"xl"}
                        overflow={"hidden"}
                        borderWidth={"1px"}
                        justifyItems={"center"}
                        alignItems={"center"}
                        key={tro.order}
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
                          <Icon as={FaTrophy} fontSize={"3xl"} />
                        </Flex>
                        <Text p={2}>{tro.desc}</Text>
                        <IconButton
                          icon={<FaTrash />}
                          size="lg"
                          colorScheme="red"
                          position={"relative"}
                          w="40px"
                          h="40px"
                          onClick={() => handleDelTrophy(tro.order)}
                        />
                      </Grid>
                    ))}
                  </Stack>

                  <Divider mt={5} mb={5} />

                  <FormControl>
                    <FormLabel>Opções de Pagamento dos Números:</FormLabel>
                    <Stack spacing={4} mt={3}>
                      <Flex align="center">
                        <Box w="35px" h="35px" mr={3}>
                          <Image
                            src="/img/credit.svg"
                            height={50}
                            width={50}
                            layout="responsive"
                            objectFit="contain"
                            alt="PA Rifas, rifas online"
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          fontSize={["sm", "md", "md", "md", "md"]}
                        >
                          Cartão de Crédito
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Box w="35px" h="35px" mr={3}>
                          <Image
                            src="/img/credit.svg"
                            height={50}
                            width={50}
                            layout="responsive"
                            objectFit="contain"
                            alt="PA Rifas, rifas online"
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          fontSize={["sm", "md", "md", "md", "md"]}
                        >
                          Cartão de Débito
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Box w="35px" mr={3}>
                          <Image
                            src="/img/pix.svg"
                            height={30}
                            width={67}
                            layout="responsive"
                            objectFit="contain"
                            alt="PA Rifas, rifas online"
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          fontSize={["sm", "md", "md", "md", "md"]}
                        >
                          PIX
                        </Text>
                      </Flex>
                    </Stack>
                  </FormControl>
                  <Button
                    colorScheme="orange"
                    mt={5}
                    leftIcon={<FaPercentage />}
                    onClick={() => setModalTaxes(true)}
                  >
                    Verificar Taxas
                  </Button>
                </Box>

                <Box
                  rounded="xl"
                  p={5}
                  shadow="lg"
                  h="min-content"
                  borderWidth="1px"
                >
                  <Stat size="md">
                    <StatLabel>Comissão</StatLabel>
                    <StatNumber>
                      {isDiscounted ? (
                        <HStack>
                          <Text
                            fontWeight={"light"}
                            textDecor={"line-through"}
                            color={"gray.600"}
                            fontSize={"18px"}
                          >{`${parseFloat(raffleValueCompare)}%`}</Text>
                          <Text>{`${parseFloat(raffleValue)}%`}</Text>
                        </HStack>
                      ) : (
                        `${parseFloat(raffleValueCompare)}%`
                      )}
                    </StatNumber>
                    <StatHelpText
                      color={useColorModeValue("red.500", "red.200")}
                    >
                      * Do valor arrecadado
                    </StatHelpText>
                  </Stat>

                  <Button
                    leftIcon={<FaCalculator />}
                    colorScheme={"green"}
                    isFullWidth
                    size="sm"
                    onClick={() => setModalCalc(true)}
                  >
                    Calcular Custos
                  </Button>

                  <Divider mt={3} mb={3} />

                  <FormControl isRequired>
                    <FormLabel>Observações</FormLabel>

                    <CheckboxGroup size="sm">
                      <Stack spacing={3}>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkOne}
                          onChange={(e) => setCheckOne(e.target.checked)}
                        >
                          O valor arrecadado só será liberado após o sorteio e a
                          comprovação de entrega do prêmio.
                        </Checkbox>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkTwo}
                          onChange={(e) => setCheckTwo(e.target.checked)}
                        >
                          Não haverá pagamento do arrecadado caso haja o
                          cancelamento ou abandono desta rifa.
                        </Checkbox>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkThree}
                          onChange={(e) => setCheckThree(e.target.checked)}
                        >
                          Realize o sorteio na data marcada pois o não
                          cumprimento deste item causará penalizações.
                        </Checkbox>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkFour}
                          onChange={(e) => setCheckFour(e.target.checked)}
                        >
                          Verifique as taxas cobradas pelos meios de pagamento,
                          caso precise compense no valor da rifa.
                        </Checkbox>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkFive}
                          onChange={(e) => setCheckFive(e.target.checked)}
                        >
                          Leia atentamente nossos{" "}
                          <Link href={"/condicoesdeuso"} passHref>
                            <ChakraLink
                              target={"_blank"}
                              textDecor={"underline"}
                            >
                              Termos de Uso
                            </ChakraLink>
                          </Link>
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>

                  <Divider mt={3} mb={3} />

                  <FormControl>
                    <Flex align="center">
                      <Input
                        focusBorderColor="green.500"
                        placeholder="Cupom de Desconto"
                        value={coupon}
                        onChange={(e) =>
                          setCoupon(e.target.value.toUpperCase())
                        }
                      />
                      <Tooltip hasArrow label="Aplicar Desconto">
                        <IconButton
                          colorScheme="green"
                          variant="outline"
                          icon={<FaCheck />}
                          w="min-content"
                          ml={2}
                          rounded="xl"
                          isLoading={couponLoading}
                          onClick={() => FindCoupon()}
                        />
                      </Tooltip>
                    </Flex>
                  </FormControl>

                  <Divider mt={3} mb={3} />

                  <Button
                    colorScheme="green"
                    isFullWidth
                    size="lg"
                    leftIcon={<FaCheck />}
                    isLoading={loadingSave}
                    onClick={() => saveRaffle()}
                    isDisabled={
                      checkOne === true &&
                      checkTwo === true &&
                      checkThree === true &&
                      checkFour === true &&
                      checkFive === true
                        ? false
                        : true
                    }
                  >
                    Criar Rifa
                  </Button>
                </Box>
              </Grid>
            ) : (
              <Container maxW="4xl">
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  p={10}
                  rounded="xl"
                  shadow="lg"
                  borderWidth="1px"
                >
                  <Box w="20%" mb={10}>
                    <Image
                      src="/img/blocked.svg"
                      height={200}
                      width={200}
                      layout="responsive"
                      objectFit="cover"
                      alt="PA Rifas, rifas online"
                    />
                  </Box>
                  <Heading textAlign="center" color="red.500" fontSize="xl">
                    Você foi impedido de criar sorteios por não cumprir os{" "}
                    <Link href="/condicoesdeuso" passHref>
                      <a style={{ color: "blue", textDecoration: "underline" }}>
                        Termos de Uso
                      </a>
                    </Link>
                    , para mais informações entre em{" "}
                    <Link href="/faleconosco">
                      <a style={{ color: "blue", textDecoration: "underline" }}>
                        Contato Conosco
                      </a>
                    </Link>
                    .
                  </Heading>
                </Flex>
              </Container>
            )}
          </>
        )}
      </Container>
      <FooterApp />

      <Modal isOpen={modalTaxes} onClose={() => setModalTaxes(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Taxas</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns="1fr 1fr" gap={5}>
              <Box rounded="xl" borderWidth="1px" p={3}>
                <Stat>
                  <StatLabel>PIX</StatLabel>
                  <StatNumber>{configsGlobal.pixTax}%</StatNumber>
                  <StatHelpText>* Por transação</StatHelpText>
                </Stat>
              </Box>
              <Box rounded="xl" borderWidth="1px" p={3}>
                <Stat>
                  <StatLabel>Cartão de Crédito</StatLabel>
                  <StatNumber>{configsGlobal.cardTax}%</StatNumber>
                  <StatHelpText>* Por transação</StatHelpText>
                </Stat>
              </Box>
              <Box rounded="xl" borderWidth="1px" p={3}>
                <Stat>
                  <StatLabel>Cartão de Débito</StatLabel>
                  <StatNumber>{configsGlobal.debitTax}%</StatNumber>
                  <StatHelpText>* Por transação</StatHelpText>
                </Stat>
              </Box>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={modalPayment}
        onClose={() => setModalPayment(false)}
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Informação
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Sua Rifa está criada, porém ainda inativa, entre em contato com
                o atendimento da PA Rifas para a liberação da sua rifa.
              </Text>

              <Button
                colorScheme="whatsapp"
                leftIcon={<FaWhatsapp />}
                mt={4}
                isFullWidth
                variant="outline"
                size="lg"
                onClick={() => push("/faleconosco")}
              >
                Ir Para Contato
              </Button>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={() => setModalPayment(false)}
                colorScheme="green"
              >
                Fechar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={modalCalc}
        onClose={() => handleCloseModalCalc()}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calcular Custos</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Center
              p={2}
              bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              fontWeight="bold"
              rounded="lg"
            >
              CUSTOS DE ALOCAÇÃO DA RIFA
            </Center>
            <Grid
              templateColumns={[
                "1fr",
                "1fr 1fr",
                "1fr 1fr 1fr 1fr",
                "1fr 1fr 1fr 1fr",
                "1fr 1fr 1fr 1fr",
              ]}
              gap={3}
              mt={5}
            >
              <FormControl>
                <FormLabel mb={0}>Taxa</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="%" />
                  <Input
                    focusBorderColor="green.500"
                    value={raffleValue}
                    isReadOnly
                    type="number"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Arrecadação Prevista</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    focusBorderColor="green.500"
                    type="number"
                    value={rafflePreviousValue}
                    onChange={(e) =>
                      calcPercentRaffle(parseFloat(e.target.value))
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Total a Pagar</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    focusBorderColor="green.500"
                    type="number"
                    value={raffleDiscountTotal}
                    isReadOnly
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Arrecadação Final</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    focusBorderColor="green.500"
                    value={raffleDiscountValue}
                    isReadOnly
                  />
                </InputGroup>
              </FormControl>
            </Grid>

            <Center
              p={2}
              bg={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              fontWeight="bold"
              rounded="lg"
              mt={10}
            >
              CUSTOS DAS COMPRAS DOS NÚMEROS
            </Center>
            <Grid
              templateColumns={[
                "1fr",
                "1fr 1fr",
                "1fr 1fr 1fr 1fr",
                "1fr 1fr 1fr 1fr",
                "1fr 1fr 1fr 1fr",
              ]}
              gap={3}
              mt={5}
            >
              <FormControl>
                <FormLabel mb={0}>Pagamento</FormLabel>
                <Select
                  focusBorderColor="green.500"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                >
                  <option value={configsGlobal.pixTax}>PIX</option>
                  <option value={configsGlobal.cardTax}>
                    Cartão de Crédito
                  </option>
                  <option value={configsGlobal.debitTax}>
                    Cartão de Débito
                  </option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Taxa</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="%" />
                  <Input
                    focusBorderColor="green.500"
                    value={tax}
                    isReadOnly
                    type="number"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Valor Previsto</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    focusBorderColor="green.500"
                    value={cardPreviousValue}
                    onChange={(e) => calcPercent(parseFloat(e.target.value))}
                    type="number"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Valor Final</FormLabel>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    focusBorderColor="green.500"
                    value={cardDiscountValue}
                    isReadOnly
                  />
                </InputGroup>
              </FormControl>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configsGlobal.url}/configs`);
  const data = await response.json();
  let conf = !data ? null : data;
  return {
    props: {
      config: conf,
    },
    revalidate: 60,
  };
};
