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
  Switch,
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
  ModalFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  FaQrcode,
  FaCopy,
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

registerLocale("pt_br", pt_br);

export default function NovoSorteio({ config }) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { client } = useClient();
  const { setOpenLogin } = useLoginModal();
  const { setOpenRegister } = useRegisterModal();

  const [startDate, setStartDate] = useState(new Date());
  const [modalTaxes, setModalTaxes] = useState(false);
  const [modalPayment, setModalPayment] = useState(true);

  const [raffle, setRaffle] = useState("");
  const [qtdNumbers, setQtdNumbers] = useState("0");
  const [raffleValue, setRaffleValue] = useState("0");

  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");

  const [loadingSave, setLoadingSave] = useState(false);

  const [checkOne, setCheckOne] = useState(false);
  const [checkTwo, setCheckTwo] = useState(false);
  const [checkThree, setCheckThree] = useState(false);
  const [checkFour, setCheckFour] = useState(false);
  const [checkFive, setCheckFive] = useState(false);

  const [pix, setPix] = useState(false);
  const [card, setCard] = useState(false);

  const [trophys, setTrophys] = useState([]);
  const [trophyOrder, setTrophyOrder] = useState("");
  const [trophyDescription, setTrophyDescription] = useState("");

  const [payment_method, setPayment_method] = useState("");

  const [numberCard, setNumberCard] = useState("");
  const [ownerCard, setOwnerCard] = useState("");
  const [validationCard, setValidationCard] = useState("");
  const [cvvCard, setCvvCard] = useState("");

  const [qrCode, setQrCode] = useState(
    "00020126580014br.gov.bcb.pix013607766818-3921-4827-91db-537b86f9a1c15204000053039865406100.005802BR5909Uplinx1366006recife62230519mpqrinter124412749963045ECF"
  );
  const [qrCode64, setQrCode64] = useState(
    "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"
  );
  const [idRaffle, setIdRaffle] = useState("");

  function clear() {
    setRaffle("");
    setQtdNumbers("0");
    setRaffleValue("0");
    setThumbnail(null);
    removeThumbnail();
    setDescription("");
    setStartDate(new Date());
    setCheckOne(false);
    setCheckTwo(false);
    setCheckThree(false);
    setCheckFour(false);
    setCheckFive(false);
    setPix(false);
    setCard(false);
    setTrophys([]);
  }

  function handleTrophy() {
    if (trophyOrder === "") {
      showToast("Escolha uma posição para o prêmio", "warning", "Atenção");
      return false;
    }
    if (trophyDescription === "") {
      showToast("Insira uma descrição para o Prêmio", "warning", "Atenção");
      return false;
    }
    const find = trophys.find((obj) => obj.order === trophyOrder);
    if (find) {
      showToast("Já existe um prêmio nesta posição", "warning", "Atenção");
      return false;
    }
    const info = { order: trophyOrder, desc: trophyDescription };
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
    if (pix === false && card === false) {
      showToast(
        "Habilite pelo menos uma forma de pagamento",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoadingSave(true);
    let payment;
    if (pix === true && card === false) {
      payment = "pix";
    }
    if (pix === false && card === true) {
      payment = "card";
    }
    if (pix === true && card === true) {
      payment = "all";
    }
    try {
      let data = new FormData();
      data.append("thumbnail", thumbnail);
      data.append("name", raffle);
      data.append("qtd_numbers", parseFloat(qtdNumbers));
      data.append("draw_date", startDate);
      data.append("draw_time", startDate);
      data.append("client_id", client.id);
      data.append("description", description);
      data.append("raffle_value", raffleValue);
      data.append("payment", payment);
      data.append("trophys", JSON.stringify(trophys));

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
                          <p>
                            Insira uma imagem 220px x 220px com no máximo 300kb
                          </p>
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
                            value={raffleValue}
                            onChange={(e) => setRaffleValue(e)}
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
                        "1fr 3fr 1fr",
                        "1fr 3fr 1fr",
                        "1fr 3fr 1fr",
                        "1fr 3fr 1fr",
                      ]}
                      gap={3}
                    >
                      <Select
                        focusBorderColor="green.500"
                        placeholder="Selecione uma opção"
                        value={trophyOrder}
                        onChange={(e) => setTrophyOrder(e.target.value)}
                      >
                        <option value="1">1º Prêmio</option>
                        <option value="2">2º Prêmio</option>
                        <option value="3">3º Prêmio</option>
                        <option value="4">4º Prêmio</option>
                        <option value="5">5º Prêmio</option>
                      </Select>
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

                  <Grid
                    templateColumns={[
                      "repeat(1, 1fr)",
                      "repeat(2, 1fr)",
                      "repeat(3, 1fr)",
                      "repeat(3, 1fr)",
                      "repeat(3, 1fr)",
                    ]}
                    gap={5}
                    mt={5}
                  >
                    {trophys.map((tro) => (
                      <Box
                        rounded="xl"
                        borderWidth="1px"
                        h="min-content"
                        key={tro.order}
                      >
                        <IconButton
                          icon={<FaTrash />}
                          size="xs"
                          colorScheme="red"
                          position="absolute"
                          mt={1}
                          ml={2}
                          onClick={() => handleDelTrophy(tro.order)}
                        />
                        <Flex justify="center" align="center" p={1}>
                          <Icon as={FaTrophy} mr={3} />
                          <Text fontWeight="bold">{tro.order}º Prêmio</Text>
                        </Flex>
                        <Divider />
                        <Text p={2}>{tro.desc}</Text>
                      </Box>
                    ))}
                  </Grid>

                  <Divider mt={5} mb={5} />

                  <FormControl isRequired>
                    <FormLabel>Opções de Pagamento:</FormLabel>
                    <Stack spacing={4} mt={3}>
                      <Flex align="center">
                        <Switch
                          colorScheme="green"
                          size="lg"
                          isChecked={card}
                          onChange={(e) => setCard(e.target.checked)}
                        />
                        <Box w="35px" h="35px" ml={5} mr={3}>
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
                          Habilitar pagamento por Cartão de Crédito
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Switch
                          colorScheme="green"
                          size="lg"
                          isChecked={pix}
                          onChange={(e) => setPix(e.target.checked)}
                        />
                        <Box w="35px" ml={5} mr={3}>
                          <Image
                            src="/img/pix.svg"
                            height={30}
                            width={67}
                            layout="responsive"
                            objectFit="cover"
                            alt="PA Rifas, rifas online"
                          />
                        </Box>
                        <Text
                          fontWeight="semibold"
                          fontSize={["sm", "md", "md", "md", "md"]}
                        >
                          Habilitar pagamento por PIX
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
                    <StatLabel>Total a Pagar</StatLabel>
                    <StatNumber>
                      {!config
                        ? 0
                        : parseFloat(config.raffle_value).toLocaleString(
                            "pt-br",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                    </StatNumber>
                  </Stat>
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
                          Não haverá reembolso caso haja o cancelamento desta
                          rifa.
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
                          Esta rifa só estará liberada após a confirmação do
                          pagamento pela equipe do PA Rifas.
                        </Checkbox>
                        <Checkbox
                          colorScheme="green"
                          isChecked={checkFive}
                          onChange={(e) => setCheckFive(e.target.checked)}
                        >
                          Verifique as taxas cobradas pelos meios de pagamento,
                          caso precise compense no valor da rifa.
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
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
                  <StatNumber>0,99%</StatNumber>
                  <StatHelpText>* Por transação</StatHelpText>
                </Stat>
              </Box>
              <Box rounded="xl" borderWidth="1px" p={3}>
                <Stat>
                  <StatLabel>Cartão de Crédito</StatLabel>
                  <StatNumber>4,99%</StatNumber>
                  <StatHelpText>* Por transação</StatHelpText>
                </Stat>
              </Box>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayment}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pagamento</ModalHeader>

          <ModalBody>
            <Tabs
              colorScheme="green"
              variant="enclosed"
              defaultIndex={0}
              onChange={(e) => setPayment_method(e)}
            >
              <TabList>
                <Tab>PIX</Tab>
                <Tab>Cartão de Crédito</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    p={5}
                  >
                    <ChakraImage
                      w="250px"
                      h="250px"
                      src={`data:image/jpeg;base64,${qrCode64}`}
                    />
                    <Box w="100%" textAlign="center">
                      <Text mt={3}>{qrCode}</Text>
                    </Box>
                    <Button leftIcon={<FaCopy />} size="sm" mt={3} mb={3}>
                      Clique para Copiar
                    </Button>

                    <Stat mt={3}>
                      <StatLabel>Total a Pagar</StatLabel>
                      <StatNumber>
                        {!config
                          ? 0
                          : parseFloat(config.raffle_value).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                      </StatNumber>
                    </Stat>

                    <Button
                      size="lg"
                      colorScheme="green"
                      leftIcon={<FaQrcode />}
                    >
                      Gerar Pagamento
                    </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <FormControl mt={5}>
                    <FormLabel>Número do Cartão</FormLabel>
                    <MaskedInput
                      mask={[
                        /[0-9]/,
                        /\d/,
                        /\d/,
                        /\d/,
                        " ",
                        " ",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        " ",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        " ",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                      placeholder="Número do Cartão"
                      id="contact"
                      value={numberCard}
                      onChange={(e) => setNumberCard(e.target.value)}
                      render={(ref, props) => (
                        <Input
                          placeholder="Número do Cartão"
                          ref={ref}
                          {...props}
                          focusBorderColor="green.500"
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl mt={3}>
                    <FormLabel>Titular do Cartão</FormLabel>
                    <Input
                      placeholder="Titular do Cartão"
                      focusBorderColor="green.500"
                      value={ownerCard}
                      onChange={(e) => setOwnerCard(e.target.value)}
                    />
                  </FormControl>

                  <Grid
                    mt={3}
                    templateColumns={[
                      "1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>Validade</FormLabel>
                      <MaskedInput
                        mask={[/[0-9]/, /\d/, "/", /\d/, /\d/]}
                        placeholder="Validade"
                        id="contact"
                        value={validationCard}
                        onChange={(e) => setValidationCard(e.target.value)}
                        render={(ref, props) => (
                          <Input
                            placeholder="Validade"
                            ref={ref}
                            {...props}
                            focusBorderColor="green.500"
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Cód. Segurança</FormLabel>
                      <MaskedInput
                        mask={[/[0-9]/, /\d/, /\d/]}
                        placeholder="Cód. Segurança"
                        id="contact"
                        value={cvvCard}
                        onChange={(e) => setCvvCard(e.target.value)}
                        render={(ref, props) => (
                          <Input
                            placeholder="Validade"
                            ref={ref}
                            {...props}
                            focusBorderColor="green.500"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Stat mt={5}>
                    <StatLabel>Total a Pagar</StatLabel>
                    <StatNumber>
                      {!config
                        ? 0
                        : parseFloat(config.raffle_value).toLocaleString(
                            "pt-br",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                    </StatNumber>
                  </Stat>

                  <Flex mt={5} justify="center" align="center">
                    <Button
                      leftIcon={<FaCheck />}
                      colorScheme="green"
                      size="lg"
                    >
                      Pagar
                    </Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
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
    revalidate: 5,
  };
};
