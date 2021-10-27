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
  FaSave,
  FaCheck,
  FaStop,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import MaskedInput from "react-text-mask";
import { AiOutlineWarning } from "react-icons/ai";
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
  const [modalConfirm, setModalConfirm] = useState(false);

  const [typeKeyPix, setTypeKeyPix] = useState("CPF");
  const [keyPix, setKeyPix] = useState("");

  const [bank, setBank] = useState("");
  const [ag, setAg] = useState("");
  const [tipoCc, setTipoCc] = useState("Conta Corrente");
  const [cc, setCc] = useState("");
  const [variation, setVariation] = useState("");
  const [operation, setOperation] = useState("");

  const [pix, setPix] = useState([]);
  const [transfer, setTransfer] = useState([]);

  const [raffle, setRaffle] = useState("");
  const [qtdNumbers, setQtdNumbers] = useState("0");
  const [raffleValue, setRaffleValue] = useState("0");

  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [banner, setBanner] = useState(null);
  const [description, setDescription] = useState("");

  const [disableBanner, setDisableBanner] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);

  const [idToBanner, setIdToBanner] = useState(null);
  const [loadingBanner, setLoadingBanner] = useState(false);

  function clear() {
    setRaffle("");
    setQtdNumbers("0");
    setRaffleValue("0");
    setPix([]);
    setTransfer([]);
    setThumbnail(null);
    setBanner(null);
    removeBanner();
    removeThumbnail();
    setDescription("");
    setStartDate(new Date());
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
  useEffect(() => {
    if (banner) {
      let size = banner.size / 1024;
      let thumbname = banner.name;
      if (thumbname.includes(" ")) {
        handleValidator("banner", "Nome da imagem não pode conter espaços");
      }
      if (size > 500) {
        handleValidator(
          "banner",
          "Imagem maior que 500kb, insira uma imagem menor"
        );
      }
    } else {
      setValidators([]);
    }
  }, [banner]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const previewBanner = useMemo(() => {
    return banner ? URL.createObjectURL(banner) : null;
  }, [banner]);

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

  async function removeBanner() {
    await URL.revokeObjectURL(banner);
    setBanner(null);
    setValidators([]);
  }

  async function handlePix() {
    const result = await pix.find((obj) => obj.pix === keyPix);
    if (result) {
      showToast("Chave pix já inserida", "warning", "Atenção");
      return false;
    } else {
      let info = { type: typeKeyPix, pix: keyPix };
      setPix([...pix, info]);
      setTypeKeyPix("CPF");
      setKeyPix("");
    }
  }

  async function removePix(id) {
    const result = await pix.filter((obj) => obj.pix !== id);
    setPix(result);
  }

  async function handleTransfer() {
    const result = await transfer.find((obj) => obj.cc === cc);
    if (result) {
      showToast("Conta já adicionada", "warning", "Atenção");
      return false;
    } else {
      let info = {
        bank: bank,
        ag: ag,
        cc: cc,
        type: tipoCc,
        op: operation,
        vr: variation,
      };
      setTransfer([...transfer, info]);
      setBank("");
      setAg("");
      setCc("");
      setTipoCc("Conta Corrente");
      setOperation("");
      setVariation("");
    }
  }

  async function removeTransfer(id) {
    const result = transfer.filter((obj) => obj.cc !== id);
    setTransfer(result);
  }

  async function saveRaffle() {
    if (!thumbnail) {
      handleValidator("image", "Insira uma imagem");
      showToast("Insira uma imagem", "warning", "Atenção");
      setModalConfirm(false);
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
      setModalConfirm(false);
      return false;
    }
    if (raffle === "") {
      handleValidator("raffle", "Campo Obrigatório");
      showToast("Campo Obrigatório", "warning", "Atenção");
      setModalConfirm(false);
      return false;
    }
    if (parseFloat(qtdNumbers) > parseFloat(config.max_numbers)) {
      showToast(
        `O número de rifas ultrapassa o número máximo permitido, a quatidade máxima permitida é de ${config.max_numbers} números.`,
        "warning",
        "Atenção"
      );
      setModalConfirm(false);
      return false;
    }
    if (description === "") {
      handleValidator("description", "Campo Obrigatório");
      showToast("A descrição é obrigatória", "warning", "Atenção");
      setModalConfirm(false);
      return false;
    }
    if (pix.length === 0 && transfer.length === 0) {
      showToast(
        "Insira pelo menos uma forma de pagamento",
        "warning",
        "Atenção"
      );
      setModalConfirm(false);
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
      data.append("pix_keys", JSON.stringify(pix));
      data.append("bank_transfer", JSON.stringify(transfer));
      data.append("description", description);
      data.append("raffle_value", raffleValue);

      const response = await api.post("/raffle", data);

      showToast(response.data.message, "success", "Sucesso");
      setIdToBanner(response.data.id);
      setDisableBanner(true);

      setLoadingSave(false);
      setModalConfirm(false);
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

  async function saveBanner() {
    if (banner === null) {
      showToast("Insira uma imagem de banner", "warning", "Atenção");
      return false;
    }
    setLoadingBanner(true);
    try {
      let data = new FormData();
      data.append("banner", banner);
      const response = await api.put(`/banner/${idToBanner}`, data);
      clear();
      showToast(response.data.message, "success", "Sucesso");
      setDisableBanner(false);
      setLoadingBanner(false);
    } catch (error) {
      setLoadingBanner(false);
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
                      >
                        <option>1º Prêmio</option>
                        <option>2º Prêmio</option>
                        <option>3º Prêmio</option>
                        <option>4º Prêmio</option>
                        <option>5º Prêmio</option>
                      </Select>
                      <Input
                        placeholder="Descrição do Prêmio"
                        focusBorderColor="green.500"
                      />
                      <Button leftIcon={<FaPlus />} colorScheme="green">
                        Adicionar
                      </Button>
                    </Grid>
                  </FormControl>

                  <Divider mt={5} mb={5} />

                  <FormControl isRequired>
                    <FormLabel>Opções de Pagamento:</FormLabel>
                    <Stack spacing={4} mt={3}>
                      <Flex align="center">
                        <Switch colorScheme="green" size="lg" />
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
                        <Button size="sm" ml={3}>
                          Taxas
                        </Button>
                      </Flex>
                      <Flex align="center">
                        <Switch colorScheme="green" size="lg" />
                        <Box w="35px" h="35px" ml={5} mr={3}>
                          <Image
                            src="/img/boleto.svg"
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
                          Habilitar pagamento por Boleto Bancário
                        </Text>
                        <Button size="sm" ml={3}>
                          Taxas
                        </Button>
                      </Flex>
                      <Flex align="center">
                        <Switch colorScheme="green" size="lg" />
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
                        <Button size="sm" ml={3}>
                          Taxas
                        </Button>
                      </Flex>
                    </Stack>
                  </FormControl>
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
                        <Checkbox colorScheme="green">
                          O valor arrecadado só será liberado após o sorteio e a
                          comprovação de entrega do prêmio.
                        </Checkbox>
                        <Checkbox colorScheme="green">
                          Não haverá reembolso caso haja o cancelamento desta
                          rifa.
                        </Checkbox>
                        <Checkbox colorScheme="green">
                          Realize o sorteio na data marcada pois o não
                          cumprimento deste item causará penalizações.
                        </Checkbox>
                        <Checkbox colorScheme="green">
                          Esta rifa só estará liberada após a confirmação do
                          pagamento pela equipe do PA Rifas.
                        </Checkbox>
                        <Checkbox colorScheme="green">
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
                    onClick={() => setModalConfirm(true)}
                  >
                    Finalizar Rifa
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
