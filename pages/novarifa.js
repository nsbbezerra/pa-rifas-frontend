import { useEffect, useMemo, useState } from "react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footerTotal";
import { File, InputFile, InputFileFixed } from "../styles/uploader";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Icon,
  Text,
  Select,
  IconButton,
  Tooltip,
  useToast,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  FormErrorMessage,
  Image as ChakraImage,
  Heading,
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
import { AiOutlineWarning, AiOutlineLogin } from "react-icons/ai";
import Image from "next/image";
import { useClient } from "../context/Clients";
import configsGlobal from "../configs/index";
import api from "../configs/axios";
import { useLoginModal } from "../context/ModalLogin";
import { useRegisterModal } from "../context/ModalRegister";

registerLocale("pt_br", pt_br);

export default function NovoSorteio({ config }) {
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
        focusBorderColor="purple.400"
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
            <Link passHref href="/novosorteio">
              <a>
                <BreadcrumbLink>Criar Sorteio</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        {JSON.stringify(client) === "{}" ? (
          <Grid
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
            ]}
            gap="20px"
            borderWidth="1px"
            p={5}
            rounded="lg"
          >
            <Button
              colorScheme="purple"
              size="lg"
              variant="outline"
              leftIcon={<FaSave />}
              onClick={() => setOpenRegister(true)}
            >
              Cadastre - se
            </Button>
            <Button
              colorScheme="purple"
              size="lg"
              variant="outline"
              leftIcon={<AiOutlineLogin />}
              onClick={() => setOpenLogin(true)}
            >
              Faça Login
            </Button>
          </Grid>
        ) : (
          <>
            {client.active_admin === true ? (
              <Box
                borderWidth={["0px", "1px", "1px", "1px", "1px"]}
                rounded="lg"
                p={5}
              >
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
                        ? validators.find((obj) => obj.path === "image").message
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
                          focusBorderColor="purple.400"
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
                          focusBorderColor="purple.400"
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
                          focusBorderColor="purple.400"
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
                          focusBorderColor="purple.400"
                          isReadOnly
                          value={client.name}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          placeholder="Nome do Sorteio"
                          focusBorderColor="purple.400"
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
                                focusBorderColor="purple.400"
                                isReadOnly
                              />
                            </InputGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Box>
                </Grid>

                <FormControl isRequired mt={3}>
                  <FormLabel>Dados para Pagamento:</FormLabel>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "1fr",
                      "1fr 1fr",
                      "1fr 1fr",
                      "1fr 1fr",
                    ]}
                    gap="20px"
                  >
                    <Box borderWidth="1px" rounded="lg">
                      <Box p={3}>
                        <Image
                          src="/img/pix.svg"
                          width={125}
                          height={15}
                          layout="responsive"
                        />
                      </Box>
                      <Divider />
                      <Box p={3}>
                        <FormControl>
                          <FormLabel>Chave Pix:</FormLabel>
                          <Grid
                            templateColumns={[
                              "1fr ",
                              "1fr 50px",
                              "1fr 50px",
                              "1fr 50px",
                              "1fr 50px",
                            ]}
                            gap="15px"
                          >
                            <InputGroup>
                              <InputLeftElement w="6rem">
                                <Select
                                  focusBorderColor="purple.400"
                                  placeholder="Selecione"
                                  variant="filled"
                                  colorScheme="purple"
                                  value={typeKeyPix}
                                  onChange={(e) =>
                                    setTypeKeyPix(e.target.value)
                                  }
                                  size="sm"
                                  mt={-2}
                                >
                                  <option value="CPF">CPF</option>
                                  <option value="CNPJ">CNPJ</option>
                                  <option value="Email">Email</option>
                                  <option value="Telefone">Telefone</option>
                                  <option value="Aleatória">Aleatória</option>
                                </Select>
                              </InputLeftElement>
                              {typeKeyPix === "CPF" && (
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
                                  value={keyPix}
                                  onChange={(e) => setKeyPix(e.target.value)}
                                  placeholder="CPF"
                                  render={(ref, props) => (
                                    <Input
                                      ref={ref}
                                      {...props}
                                      focusBorderColor="purple.400"
                                      pl="6.5rem"
                                      size="sm"
                                    />
                                  )}
                                />
                              )}
                              {typeKeyPix === "CNPJ" && (
                                <MaskedInput
                                  mask={[
                                    /[0-9]/,
                                    /\d/,
                                    ".",
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    ".",
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    "/",
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    "-",
                                    /\d/,
                                    /\d/,
                                  ]}
                                  value={keyPix}
                                  onChange={(e) => setKeyPix(e.target.value)}
                                  placeholder="CNPJ"
                                  render={(ref, props) => (
                                    <Input
                                      ref={ref}
                                      {...props}
                                      focusBorderColor="purple.400"
                                      pl="6.5rem"
                                      size="sm"
                                    />
                                  )}
                                />
                              )}
                              {typeKeyPix === "Email" && (
                                <Input
                                  placeholder="Email"
                                  pl="6.5rem"
                                  focusBorderColor="purple.400"
                                  value={keyPix}
                                  onChange={(e) => setKeyPix(e.target.value)}
                                  size="sm"
                                />
                              )}
                              {typeKeyPix === "Telefone" && (
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
                                  value={keyPix}
                                  onChange={(e) => setKeyPix(e.target.value)}
                                  placeholder="Telefone"
                                  id="contact"
                                  render={(ref, props) => (
                                    <Input
                                      placeholder="Telefone"
                                      ref={ref}
                                      {...props}
                                      focusBorderColor="purple.400"
                                      pl="6.5rem"
                                      size="sm"
                                    />
                                  )}
                                />
                              )}
                              {typeKeyPix === "Aleatória" && (
                                <Input
                                  placeholder="Chave Aleatória"
                                  pl="6.5rem"
                                  focusBorderColor="purple.400"
                                  value={keyPix}
                                  onChange={(e) => setKeyPix(e.target.value)}
                                  size="sm"
                                />
                              )}
                            </InputGroup>
                            <Tooltip label="Adicionar Chave Pix" hasArrow>
                              <IconButton
                                icon={<FaPlus />}
                                colorScheme="purple"
                                onClick={() => handlePix()}
                                size="sm"
                              />
                            </Tooltip>
                          </Grid>
                        </FormControl>
                        {pix.length > 0 && (
                          <>
                            <Divider mt={3} mb={3} />
                            {pix.map((pi) => (
                              <HStack key={pi.pix} spacing="10px">
                                <Text>
                                  {pi.type}: <strong>{pi.pix}</strong>
                                </Text>
                                <Tooltip label="Excluir Chave" hasArrow>
                                  <IconButton
                                    icon={<FaTrash />}
                                    colorScheme="red"
                                    size="xs"
                                    variant="link"
                                    onClick={() => removePix(pi.pix)}
                                  />
                                </Tooltip>
                              </HStack>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box borderWidth="1px" rounded="lg">
                      <Box p={3}>
                        <Image
                          src="/img/transferencia.svg"
                          width={125}
                          height={15}
                          layout="responsive"
                        />
                      </Box>
                      <Divider />
                      <Box p={3}>
                        <Grid templateColumns="1fr 1fr" gap="15px">
                          <FormControl>
                            <FormLabel>Banco:</FormLabel>
                            <Input
                              size="sm"
                              placeholder="Banco"
                              focusBorderColor="purple.400"
                              value={bank}
                              onChange={(e) => setBank(e.target.value)}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Agencia:</FormLabel>
                            <Input
                              size="sm"
                              placeholder="Agencia"
                              focusBorderColor="purple.400"
                              value={ag}
                              onChange={(e) => setAg(e.target.value)}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          mt={3}
                          templateColumns={[
                            "repeat(2, 1fr)",
                            "repeat(4, 1fr)",
                            "repeat(4, 1fr)",
                            "repeat(4, 1fr)",
                            "repeat(4, 1fr)",
                          ]}
                          gap="15px"
                        >
                          <FormControl>
                            <FormLabel>Tipo:</FormLabel>
                            <Select
                              focusBorderColor="purple.400"
                              value={tipoCc}
                              onChange={(e) => setTipoCc(e.target.value)}
                              size="sm"
                            >
                              <option value="Conta Corrente">
                                Conta Corrente
                              </option>
                              <option value="Poupança">Poupança</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel>
                              {tipoCc === "Conta Corrente" ? "CC" : "PP"}:
                            </FormLabel>
                            <Input
                              size="sm"
                              placeholder={
                                tipoCc === "Conta Corrente" ? "CC" : "PP"
                              }
                              focusBorderColor="purple.400"
                              value={cc}
                              onChange={(e) => setCc(e.target.value)}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Variação:</FormLabel>
                            <Input
                              size="sm"
                              placeholder="Variação"
                              focusBorderColor="purple.400"
                              value={variation}
                              onChange={(e) => setVariation(e.target.value)}
                              isDisabled={
                                tipoCc === "Conta Corrente" ? true : false
                              }
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Operação:</FormLabel>
                            <Input
                              size="sm"
                              placeholder="Operação"
                              focusBorderColor="purple.400"
                              value={operation}
                              onChange={(e) => setOperation(e.target.value)}
                            />
                          </FormControl>
                        </Grid>
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme="purple"
                          size="sm"
                          isFullWidth
                          mt={2}
                          onClick={() => handleTransfer()}
                        >
                          Adicionar
                        </Button>
                        {transfer.length > 0 && (
                          <>
                            <Divider mt={3} mb={3} />
                            <Grid
                              templateColumns="repeat(auto-fit, minmax(240px, 240px))"
                              gap="10px"
                              justifyContent="center"
                            >
                              {transfer.map((tr) => (
                                <Box
                                  borderWidth="1px"
                                  rounded="lg"
                                  key={tr.cc}
                                  fontSize="sm"
                                  p={2}
                                >
                                  <Tooltip label="Excluir Conta" hasArrow>
                                    <IconButton
                                      icon={<FaTrash />}
                                      colorScheme="red"
                                      size="xs"
                                      variant="link"
                                      onClick={() => removeTransfer(tr.cc)}
                                      position="absolute"
                                      ml={"200px"}
                                    />
                                  </Tooltip>
                                  <Text>
                                    Banco: <strong>{tr.bank}</strong>
                                  </Text>
                                  <Text>
                                    Agencia: <strong>{tr.ag}</strong>
                                  </Text>
                                  <Text>
                                    {tr.cc === "Poupança"
                                      ? "Poupança"
                                      : "Conta Corrente"}{" "}
                                    <strong>{tr.cc}</strong>
                                  </Text>
                                  {tr.op !== "" && (
                                    <Text>
                                      Operação: <strong>{tr.op}</strong>
                                    </Text>
                                  )}
                                  {tr.vr !== "" && (
                                    <Text>
                                      Variação: <strong>{tr.vr}</strong>
                                    </Text>
                                  )}
                                </Box>
                              ))}
                            </Grid>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Grid>
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
                      focusBorderColor="purple.400"
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

                <Divider mt={5} mb={5} />

                <Grid
                  templateColumns={[
                    "1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                    "1fr 1fr",
                  ]}
                  gap="15px"
                  alignItems="center"
                >
                  <Stat>
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
                  <Flex justify="flex-end">
                    <Button
                      colorScheme="purple"
                      w={[
                        "100%",
                        "max-content",
                        "max-content",
                        "max-content",
                        "max-content",
                      ]}
                      size="lg"
                      leftIcon={<FaSave />}
                      onClick={() => setModalConfirm(true)}
                    >
                      Salvar Sorteio
                    </Button>
                  </Flex>
                </Grid>
              </Box>
            ) : (
              <Flex justify="center" align="center">
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
            )}
          </>
        )}
      </Container>
      <FooterApp />

      <Modal
        isOpen={disableBanner}
        onClose={() => setDisableBanner(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaImage} />
              <Text ml={3}>Cadastrar Banner</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isInvalid={
                validators.find((obj) => obj.path === "banner") ? true : false
              }
            >
              <FormLabel>Banner (Opcional)</FormLabel>
              {banner ? (
                <>
                  <Box w="100%" h="20vh" rounded="lg" overflow="hidden">
                    <ChakraImage w="100%" h="20vh" src={previewBanner} />
                  </Box>
                  <Flex mt={2} justify="center">
                    <IconButton
                      rounded="full"
                      colorScheme="red"
                      shadow="dark-lg"
                      onClick={() => removeBanner()}
                      mt={-10}
                      icon={<FaTrash />}
                    />
                  </Flex>
                </>
              ) : (
                <InputFileFixed disabled={false}>
                  <File
                    id="banner"
                    type="file"
                    disabled={false}
                    onChange={(event) => setBanner(event.target.files[0])}
                  />
                  <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                  <p>Insira uma imagem 4267px x 784px com no máximo 500kb</p>
                </InputFileFixed>
              )}

              <FormErrorMessage>
                {validators.find((obj) => obj.path === "banner")
                  ? validators.find((obj) => obj.path === "banner").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              size="lg"
              leftIcon={<FaSave />}
              isLoading={loadingBanner}
              onClick={() => saveBanner()}
            >
              Salvar Banner
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalConfirm}
        onClose={() => setModalConfirm(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>
            <Flex align="center">
              <Icon as={AiOutlineWarning} />
              <Text ml={3}>Leia com Atenção</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Verifique se as informações estão corretas, os dados para
              pagamento e seu número de Whatsapp, após finalizar entre em
              contato com o administrador do PMW Rifas através do Whatsapp:{" "}
              {
                <Link
                  href={`https://wa.me/+55${config.admin_phone.replace(
                    /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                    ""
                  )}`}
                  passHref
                >
                  <a target="_blank">
                    <Button
                      size="xs"
                      colorScheme="whatsapp"
                      leftIcon={<FaWhatsapp />}
                    >
                      {config.admin_phone}
                    </Button>
                  </a>
                </Link>
              }{" "}
              para confirmar o pagamento e liberar o seu sorteio. Está tudo
              correto? Deseja proseguir?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              leftIcon={<FaStop />}
              variant="outline"
              onClick={() => setModalConfirm(false)}
            >
              Não
            </Button>
            <Button
              colorScheme="green"
              leftIcon={<FaCheck />}
              ml={3}
              isLoading={loadingSave}
              onClick={() => saveRaffle()}
            >
              Sim
            </Button>
          </ModalFooter>
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
