import { useEffect, useMemo, useState } from "react";
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
  Tooltip,
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
  Stack,
  Progress,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/sliders";
import Image from "next/image";
import { FaCheck, FaCopy, FaTrash, FaWhatsapp } from "react-icons/fa";
import {
  AiFillBank,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineUser,
  AiOutlineWhatsApp,
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
import { CopyToClipboard } from "react-copy-to-clipboard";
import useFetch from "../../hooks/useFetch";
import FooterApp from "../../components/footer";

export default function Sorteio({ raffles, url }) {
  const { colorMode } = useColorMode();
  const { query, isFallback } = useRouter();

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
  const { client } = useClient();
  const { setOpenRegister } = useRegisterModal();
  const { setOpenLogin } = useLoginModal();
  const { data, error } = useFetch(`/numbers/${query.sorteio}`);

  useEffect(() => {
    if (data !== undefined) {
      setNums(data.numbers);
    } else {
      setNums([]);
    }
  }, [data]);

  const [mynumbers, setMynumbers] = useState([]);
  const [amount, setAmount] = useState(0);

  const [modalSend, setModalSent] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

  const [raffle, setRaffle] = useState({});
  const [nums, setNums] = useState([]); //Para compara os números, Livres, Reservados e Pagos

  const [concordo, setConcordo] = useState(0);

  const [loading, setLoading] = useState(false);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  if (error) {
    if (error.message === "Network Error") {
      showToast(
        "Erro de conexão, verifique sua conexão com a internet",
        "error",
        "Erro"
      );
    } else {
      showToast("Ocorreu um erro inesperado", "error", "Erro");
    }
  }

  useEffect(() => {
    if (raffles) {
      findActRaffle(query.sorteio);
    }
  }, [raffles]);

  async function findActRaffle(id) {
    const result = await raffles.find((obj) => obj.identify === id);
    setRaffle(result);
  }

  const generate = useMemo(() => {
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
    return number;
  }, [raffle]);

  useEffect(() => {
    if (mynumbers.length > 0) {
      setAmount(mynumbers.length * parseFloat(raffle.raffle_value));
    }
  }, [mynumbers]);

  async function handleNumbers(num) {
    const find = await mynumbers.find((obj) => obj === num);
    if (find) {
      showToast("Este número já foi selecionado", "warning", "Atenção");
    } else {
      setMynumbers([...mynumbers, num]);
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
  }

  async function storeNumbers() {
    setLoading(true);
    try {
      const response = await api.post("/numbers", {
        raffle_id: raffle.id,
        client_id: client.id,
        numbers: mynumbers,
      });
      setModalPayment(true);
      setAmount(0);
      setMynumbers([]);
      setConcordo(false);
      setModalSent(false);
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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

  function handleBG(id) {
    if (id !== undefined) {
      if (JSON.stringify(client) !== "{}") {
        if (id.id_client === client.id) {
          return "red.600";
        } else {
          if (id.status === "reserved") {
            return "orange.400";
          }
          if (id.status === "paid_out") {
            return "green.400";
          }
        }
      } else {
        if (id.status === "reserved") {
          return "orange.400";
        }
        if (id.status === "paid_out") {
          return "green.400";
        }
      }
    }
  }

  return (
    <>
      <HeaderApp />
      <Container maxW="6xl" mt={20}>
        {JSON.stringify(raffle) === "{}" ? (
          <Center>
            <Heading fontSize="2xl">Nenhuma informação para mostrar</Heading>
          </Center>
        ) : (
          <>
            <Breadcrumb mb={10} fontSize={["xx-small", "md", "md", "md", "md"]}>
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
                  src={`${url}/${raffle.thumbnail}`}
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
                <Progress hasStripe value={50} size="lg" colorScheme="green" />
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
                        NATANAEL DOS SANTOS BEZERRA
                      </Text>
                      <Text
                        color={
                          colorMode === "light" ? "green.500" : "green.200"
                        }
                        fontSize="sm"
                      >
                        PEDRO AFONSO - TO
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Divider />
                <Center mt={3}>
                  <Text fontSize="sm">COMPARTILHAR</Text>
                </Center>
                <Center p={3}>
                  <IconButton
                    icon={<AiOutlineFacebook />}
                    colorScheme="green"
                    variant="outline"
                  />
                  <IconButton
                    icon={<AiOutlineWhatsApp />}
                    colorScheme="green"
                    ml={3}
                    mr={3}
                    variant="outline"
                  />
                  <IconButton
                    icon={<AiOutlineInstagram />}
                    colorScheme="green"
                    variant="outline"
                  />
                </Center>
              </Box>
            </Grid>
          </>
        )}

        <Grid
          templateColumns={[
            "repeat(2, 180px)",
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
            rounded="3xl"
            pt={1}
            pb={1}
            pr={3}
            pl={3}
            bg="orange.400"
            color="white"
            textAlign="center"
          >
            Reservado (
            {nums.length > 0
              ? nums.filter((obj) => obj.status === "reserved").length
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
          >
            Pago (
            {nums.length > 0
              ? nums.filter((obj) => obj.status === "paid_out").length
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
          >
            Meus Números (
            {JSON.stringify(client) !== "{}"
              ? nums.filter((obj) => obj.id_client === client.id).length
              : 0}
            )
          </Box>
        </Grid>

        <Box
          rounded="xl"
          p={4}
          shadow="lg"
          bg={colorMode === "light" ? "rgba(0,0,0,0.02)" : "whiteAlpha.300"}
          borderWidth="1px"
          mt={5}
        >
          <Grid
            templateColumns="repeat(auto-fit, minmax(75px, 75px))"
            gap="5px"
            justifyContent="center"
            h="400px"
            overflow="auto"
          >
            {generate.map((num) => (
              <Button
                w="75px"
                colorScheme="blackAlpha"
                isDisabled={
                  nums.find((obj) => obj.number === parseInt(num.num))
                    ? true
                    : false
                }
                bg={
                  mynumbers.find((obj) => obj === num.num)
                    ? "blue.500"
                    : "black"
                }
                _focus={{
                  outline: "none",
                  bg: mynumbers.find((obj) => obj === num.num)
                    ? "blue.500"
                    : "gray.800",
                }}
                _active={{
                  bg: mynumbers.find((obj) => obj === num.num)
                    ? "blue.500"
                    : "gray.800",
                }}
                _hover={{
                  bg: mynumbers.find((obj) => obj === num.num)
                    ? "blue.500"
                    : "gray.800",
                }}
                key={num.num}
                onClick={() => handleNumbers(num.num)}
                color="gray.100"
                _disabled={{
                  bg: handleBG(
                    nums.find((obj) => obj.number === parseInt(num.num))
                  ),
                  _hover: {
                    bg: handleBG(
                      nums.find((obj) => obj.number === parseInt(num.num))
                    ),
                  },
                  _active: {
                    bg: handleBG(
                      nums.find((obj) => obj.number === parseInt(num.num))
                    ),
                  },
                  _focus: {
                    bg: handleBG(
                      nums.find((obj) => obj.number === parseInt(num.num))
                    ),
                  },
                }}
              >
                {num.num}
              </Button>
            ))}
          </Grid>
        </Box>

        <Grid
          rounded="xl"
          shadow="lg"
          borderWidth="1px"
          p={5}
          h="min-content"
          templateColumns={["1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
          gap={5}
          mt={10}
          alignItems="center"
          justifyItems={["center", "initial", "initial", "initial", "initial"]}
        >
          <Stat>
            <StatLabel>Total a Pagar</StatLabel>
            <StatNumber>
              {parseFloat(amount).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </StatNumber>
          </Stat>

          <Grid
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
            ]}
            gap={[2, 5, 5, 5, 5]}
            w="100%"
          >
            <Button
              leftIcon={<FaTrash />}
              colorScheme="red"
              size="lg"
              onClick={() => clearNumbers()}
              isFullWidth
              variant="outline"
            >
              Limpar Números
            </Button>

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
      </Container>

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
                    focusBorderColor="purple.400"
                    placeholder="Nome Completo"
                    value={client.name}
                    isReadOnly
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    focusBorderColor="purple.400"
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
                        focusBorderColor="purple.400"
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
                          focusBorderColor="purple.400"
                          isReadOnly
                        />
                      </InputGroup>
                    )}
                  />
                </FormControl>
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
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={AiFillBank} />
              <Text ml={3}>Forma de Pagamento</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <Grid
              templateColumns={[
                "1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
              ]}
              gap="15px"
            >
              <Box borderWidth="1px" rounded="lg">
                <Box p={3}>
                  <Image
                    src="/img/pix.svg"
                    width={150}
                    height={30}
                    layout="responsive"
                  />
                </Box>
                <Divider />
                <Box p={3} fontSize="sm">
                  <Text>Chave:</Text>
                  {raffle.pix_keys ? (
                    <>
                      {raffle.pix_keys.map((pi) => (
                        <CopyToClipboard
                          key={pi.pix}
                          text={pi.pix}
                          onCopy={() =>
                            showToast(
                              `Valor: ${pi.pix} copiado para área de transferência.`,
                              "info",
                              "Informação"
                            )
                          }
                        >
                          <HStack spacing="10px">
                            <Text mt={2}>
                              {pi.type}: <strong>{pi.pix}</strong>
                            </Text>
                            <IconButton
                              icon={<FaCopy />}
                              size="xs"
                              colorScheme="purple"
                            />
                          </HStack>
                        </CopyToClipboard>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
              <Box borderWidth="1px" rounded="lg">
                <Box p={3}>
                  <Image
                    src="/img/transferencia.svg"
                    width={150}
                    height={30}
                    layout="responsive"
                  />
                </Box>
                <Divider />
                <Box p={3} fontSize="sm">
                  {raffle.bank_transfer
                    ? raffle.bank_transfer.map((bnk) => (
                        <Box key={bnk.cc}>
                          {bnk.bank !== "" && (
                            <Text>
                              Banco: <strong>{bnk.bank}</strong>
                            </Text>
                          )}
                          {bnk.ag !== "" && (
                            <Text>
                              Agencia: <strong>{bnk.ag}</strong>
                            </Text>
                          )}
                          {bnk.cc !== "" && (
                            <Text>
                              {bnk.type}: <strong>{bnk.cc}</strong>
                            </Text>
                          )}
                          {bnk.op !== "" && (
                            <Text>
                              Operação: <strong>{bnk.op}</strong>
                            </Text>
                          )}
                          {bnk.vr !== "" && (
                            <Text>
                              Variação: <strong>{bnk.vr}</strong>
                            </Text>
                          )}
                          <Divider mt={2} mb={2} />
                        </Box>
                      ))
                    : ""}
                </Box>
              </Box>
            </Grid>
            <Text mt={3}>
              Escolha uma das opções de pagamento acima depois entre em contato
              com o administrador da rifa através do botão verde abaixo para
              confirmar o pagamento, seus números e as informações deste sorteio
              estão disponível na sessão MEUS DADOS.
            </Text>
            <Link
              href={
                raffle.phone_client
                  ? `https://wa.me/+55${raffle.phone_client.replace(
                      /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                      ""
                    )}`
                  : ""
              }
              passHref
            >
              <a target={"_blank"}>
                <Button colorScheme="green" leftIcon={<FaWhatsapp />} mt={3}>
                  {raffle.phone_client ? raffle.phone_client : ""}
                </Button>
              </a>
            </Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

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

export const getStaticProps = async () => {
  const response = await fetch(`${configGloba.url}/raffles`);
  const data = await response.json();
  let raffles = !data.raffles ? null : data.raffles;
  let url = !data.url ? null : data.url;
  return {
    props: {
      raffles,
      url,
    },
    revalidate: 10,
  };
};
