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
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/sliders";
import Image from "next/image";
import { FaCheck, FaCopy, FaSave, FaTrash, FaWhatsapp } from "react-icons/fa";
import { AiFillBank, AiOutlineLogin } from "react-icons/ai";
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
import FooterApp from "../../components/footerTotal";

export default function Sorteio({ raffles, url }) {
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
      alert(
        "Sem conexão com o servidor, verifique sua conexão com a internet."
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
                <Link passHref href={`/sorteio/${raffle.identify}`}>
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
                "1fr",
                "220px 1fr",
                "220px 1fr",
                "220px 1fr",
              ]}
              gap="40px"
              justifyItems="center"
              alignItems="center"
            >
              <Box w="220px" h="220px" overflow="hidden" rounded="lg">
                <Image
                  src={`${url}/${raffle.thumbnail}`}
                  width={260}
                  height={260}
                  layout="responsive"
                  objectFit="cover"
                  alt="PMW Rifas, rifas online"
                />
              </Box>
              <Box minW="100%">
                <Heading fontSize="3xl">{raffle.name}</Heading>
                <Divider mt={5} mb={5} />
                <Flex
                  direction={["column", "column", "column", "row", "row"]}
                  justifyContent="space-between"
                >
                  <HStack
                    fontSize={["lg", "xl", "2xl", "2xl", "2xl"]}
                    spacing="15px"
                  >
                    <Text>R$</Text>
                    <Text fontWeight="700">
                      {parseFloat(raffle.raffle_value).toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </HStack>
                  <HStack
                    fontSize={["lg", "xl", "2xl", "2xl", "2xl"]}
                    spacing="15px"
                  >
                    <Text>Data do Sorteio</Text>
                    <Text fontWeight="700">
                      {format(
                        new Date(raffle.draw_date),
                        "dd 'de' MMMM', às ' HH:mm'h'",
                        { locale: pt_br }
                      )}
                    </Text>
                  </HStack>
                </Flex>
                <Box borderWidth="1px" mt={3} rounded="lg" p={4}>
                  {raffle.description}
                </Box>
              </Box>
            </Grid>
          </>
        )}
      </Container>

      <Box pt={10} pb={10} bg="purple.400" mt={20}>
        <Container maxW="7xl">
          <Grid
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
              "repeat(auto-fit, minmax(280px, 280px))",
            ]}
            gap="30px"
            justifyContent="center"
            justifyItems="center"
            alignItems="start"
          >
            <Flex w="280px" justify="center" align="center" direction="column">
              <Box w="100px" h="100px">
                <Image
                  src="/img/icon_01-01.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  alt="PMW Rifas, rifas online"
                />
              </Box>
              <Text
                color="white"
                textAlign="center"
                fontSize="sm"
                fontWeight="700"
                mt={5}
              >
                Escolha o prêmio que gostaria de concorrer, verifique a
                descrição, regulamento do sorteio e fotos, em caso de dúvidas
                contate o administrador
              </Text>
            </Flex>
            <Flex w="280px" justify="center" align="center" direction="column">
              <Box w="100px" h="100px">
                <Image
                  src="/img/icon_02-01.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  alt="PMW Rifas, rifas online"
                />
              </Box>
              <Text
                color="white"
                textAlign="center"
                fontSize="sm"
                fontWeight="700"
                mt={5}
              >
                Você pode escolher quantos números desejar! Mais números,mais
                chances de ganhar
              </Text>
            </Flex>
            <Flex w="280px" justify="center" align="center" direction="column">
              <Box w="100px" h="100px">
                <Image
                  src="/img/icon_03-01.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  alt="PMW Rifas, rifas online"
                />
              </Box>
              <Text
                color="white"
                textAlign="center"
                fontSize="sm"
                fontWeight="700"
                mt={5}
              >
                Faça o pagamento em uma das contas exibidas. Envie o comprovante
                ao administrador via whatsApp.
              </Text>
            </Flex>
            <Flex w="280px" justify="center" align="center" direction="column">
              <Box w="100px" h="100px">
                <Image
                  src="/img/icon_04-01.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  alt="PMW Rifas, rifas online"
                />
              </Box>
              <Text
                color="white"
                textAlign="center"
                fontSize="sm"
                fontWeight="700"
                mt={5}
              >
                Aguarde o sorteio, Cruze os dedos, Você pode ser o próximo
                sorteado.
              </Text>
            </Flex>
          </Grid>
          <Grid
            mt={10}
            templateColumns={[
              "repeat(1, 210px)",
              "repeat(2, 210px)",
              "repeat(2, 210px)",
              "repeat(4, 210px)",
              "repeat(4, 210px)",
            ]}
            gap="15px"
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
            rounded="lg"
            bg="gray.700"
            p={4}
            mt={5}
            shadow="dark-lg"
            h="350px"
            maxH="350px"
            overflow="auto"
          >
            <Grid
              templateColumns="repeat(auto-fit, minmax(75px, 75px))"
              gap="15px"
              justifyContent="center"
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
                      ? "purple.200"
                      : "black"
                  }
                  _focus={{
                    outline: "none",
                    bg: mynumbers.find((obj) => obj === num.num)
                      ? "purple.200"
                      : "gray.800",
                  }}
                  _active={{
                    bg: mynumbers.find((obj) => obj === num.num)
                      ? "purple.200"
                      : "gray.800",
                  }}
                  _hover={{
                    bg: mynumbers.find((obj) => obj === num.num)
                      ? "purple.200"
                      : "gray.800",
                  }}
                  key={num.num}
                  onClick={() => handleNumbers(num.num)}
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
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr",
            ]}
            gap="15px"
            alignItems="center"
            mt={5}
          >
            <Stat color="white">
              <StatLabel>Total a Pagar</StatLabel>
              <StatNumber>
                {parseFloat(amount).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </StatNumber>
            </Stat>
            <Flex
              justify="flex-end"
              direction={["column", "row", "row", "row", "row"]}
            >
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                w={[
                  "100%",
                  "max-content",
                  "max-content",
                  "max-content",
                  "max-content",
                ]}
                size="lg"
                onClick={() => clearNumbers()}
                mr={[0, 5, 5, 5, 5]}
                mb={[5, 0, 0, 0, 0]}
              >
                Limpar Números
              </Button>
              <Button
                leftIcon={<FaCheck />}
                colorScheme="green"
                w={[
                  "100%",
                  "max-content",
                  "max-content",
                  "max-content",
                  "max-content",
                ]}
                size="lg"
                onClick={() => setModalSent(true)}
              >
                Finalizar Compra
              </Button>
            </Flex>
          </Grid>
        </Container>
      </Box>
      <Box
        bg="green.400"
        p={5}
        textAlign="center"
        color="white"
        fontSize={["sm", "sm", "md", "md", "md"]}
      >
        © 2021 - RIFA PMW, Todos os Direitos Reservados!
      </Box>

      <Modal isOpen={modalSend} onClose={() => setModalSent(false)} size="lg">
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>Reserva de Número</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {JSON.stringify(client) === "{}" || !client ? (
              <Flex justify="center" align="center" direction="column">
                <Button
                  size="lg"
                  isFullWidth
                  colorScheme="purple"
                  leftIcon={<FaSave />}
                  variant="outline"
                  onClick={() => setOpenRegister(true)}
                >
                  CADASTRE-SE
                </Button>
                <Button
                  size="lg"
                  isFullWidth
                  colorScheme="purple"
                  leftIcon={<AiOutlineLogin />}
                  mt={5}
                  variant="outline"
                  onClick={() => setOpenLogin(true)}
                >
                  FAÇA LOGIN
                </Button>
              </Flex>
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
                  colorScheme="purple"
                  mt={3}
                  isChecked={concordo}
                  onChange={(e) => setConcordo(e.target.checked)}
                >
                  Reservando seu(s) número(s), você declara que leu e concorda
                  com nossos{" "}
                  <Link href="/condicoesdeuso" passHref>
                    <a
                      target="_blank"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
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
        <ModalContent borderWidth="3px" borderColor="green.400">
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
