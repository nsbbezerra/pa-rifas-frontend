import { useEffect, useState, memo } from "react";
import Head from "next/head";
import {
  Box,
  Flex,
  IconButton,
  Container,
  LinkBox,
  LinkOverlay,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Stack,
  ModalCloseButton,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Grid,
  InputLeftElement,
  InputGroup,
  Select,
  useToast,
  FormErrorMessage,
  MenuDivider,
  HStack,
  useColorMode,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { FaWhatsapp, FaUserAlt, FaSave, FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import MaskedInput from "react-text-mask";
import { AiOutlineLogin, AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { useRegisterModal } from "../context/ModalRegister";
import { useLoginModal } from "../context/ModalLogin";

import { useClient } from "../context/Clients";
import api from "../configs/axios";

import { useRouter } from "next/router";

function HeaderApp() {
  const { client, setClient } = useClient();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { push } = useRouter();
  const { openRegister, setOpenRegister } = useRegisterModal();
  const { openLogin, setOpenLogin } = useLoginModal();

  const [validators, setValidators] = useState([]);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [loading, setLoading] = useState(false);

  const [drawerMenu, setDrawerMenu] = useState(false);

  function clear() {
    setName("");
    setCpf("");
    setPhone("");
    setEmail("");
    setStreet("");
    setNumber("");
    setComp("");
    setDistrict("");
    setCep("");
    setCity("");
    setState("");
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function register() {
    if (name === "") {
      handleValidator("name", "Campo Obrigatório");
      return false;
    }
    if (cpf === "") {
      handleValidator("cpf", "Campo Obrigatório");
      return false;
    }
    if (cpf.includes("_")) {
      handleValidator("cpf", "Preencha corretamente");
      return false;
    }
    if (phone === "") {
      handleValidator("phone", "Campo Obrigatório");
      return false;
    }
    if (phone.includes("_")) {
      handleValidator("phone", "Preencha corretamente");
      return false;
    }
    if (email === "") {
      handleValidator("email", "Campo Obrigatório");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      handleValidator(
        "email",
        "Preencha corretamente, precisa conter (@) e (.)"
      );
      return false;
    }
    if (street === "") {
      handleValidator("street", "Campo Obrigatório");
      return false;
    }
    if (number === "") {
      handleValidator("number", "Campo Obrigatório");
      return false;
    }
    if (district === "") {
      handleValidator("district", "Campo Obrigatório");
      return false;
    }
    if (cep === "") {
      handleValidator("cep", "Campo Obrigatório");
      return false;
    }
    if (cep.includes("_")) {
      handleValidator("cep", "Insira um CEP válido");
      return false;
    }
    if (city === "") {
      handleValidator("city", "Campo Obrigatório");
      return false;
    }
    if (state === "") {
      handleValidator("state", "Campo Obrigatório");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post("/clients", {
        name,
        cpf,
        phone,
        email,
        street,
        number,
        comp,
        district,
        cep,
        city,
        state,
      });
      showToast(response.data.message, "success", "Sucesso");
      setOpenRegister(false);
      setLoading(false);
      clear();
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

  async function login() {
    if (cpf === "") {
      handleValidator("cpflogin", "Campo Obrigatório");
      return false;
    }
    if (cpf.includes("_")) {
      handleValidator("cpflogin", "Preencha corretamente");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post("/login", { cpf });
      await localStorage.setItem("client", JSON.stringify(response.data));
      setLoading(false);
      setClient(response.data);
      clear();
      setOpenLogin(false);
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

  async function logout() {
    await localStorage.removeItem("client");
    setClient({});
    push("/");
  }

  const MenuButtons = () => (
    <Flex justify="flex-end" w="100%">
      <HStack spacing={3} d={["none", "none", "none", "none", "flex"]}>
        <Link href="/rifas" passHref>
          <a>
            <Button colorScheme="orange" size="sm">
              RIFAS
            </Button>
          </a>
        </Link>
        <Link href="/faleconosco" passHref>
          <a>
            <Button colorScheme="orange" size="sm">
              FALE CONOSCO
            </Button>
          </a>
        </Link>
        <Link href="/novarifa" passHref>
          <a>
            <Button colorScheme="orange" size="sm">
              CRIAR RIFA
            </Button>
          </a>
        </Link>
        <Link href="/condicoesdeuso" passHref>
          <a>
            <Button colorScheme="orange" size="sm">
              CONDIÇÔES DE USO
            </Button>
          </a>
        </Link>
      </HStack>
      <HStack ml={3} spacing={3} d={["none", "none", "flex", "flex", "flex"]}>
        <Menu placement="bottom-end">
          <MenuButton as={IconButton} icon={<FaUserAlt />} />
          <MenuList shadow="lg">
            {JSON.stringify(client) === "{}" ? (
              <>
                <MenuItem onClick={() => setOpenRegister(true)}>
                  CADASTRE-SE
                </MenuItem>
                <MenuItem onClick={() => setOpenLogin(true)}>
                  FAÇA LOGIN
                </MenuItem>
              </>
            ) : (
              <>
                <Link href={`/meusdados/${client.identify}`} passHref>
                  <a>
                    <MenuItem>MEUS DADOS</MenuItem>
                  </a>
                </Link>
                <MenuDivider />
                <MenuItem icon={<AiOutlineLogout />} onClick={() => logout()}>
                  SAIR
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
        <Tooltip
          label={colorMode === "light" ? "Modo Escuro" : "Modo Claro"}
          hasArrow
        >
          <IconButton
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Tooltip>
        <IconButton
          colorScheme="orange"
          icon={<AiOutlineMenu />}
          fontSize="xl"
          d={["flex", "flex", "flex", "flex", "none"]}
          onClick={() => setDrawerMenu(true)}
        />
      </HStack>
    </Flex>
  );

  return (
    <>
      <Head>
        <title>PA Rifas | Sua rifa online está aqui.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Rifas Online" />
        <meta
          name="keywords"
          content="rifas, rifa, sorteios, sorteio, prêmios, prêmio, ganhar, sortear, rifar, concorrer, ganhar"
        />
        <meta name="robots" content="index,nofollow" />
        <meta name="author" content="Natanael Bezerra - NK Informática" />
        <meta name="googletboot" content="index,nofollow" />
        <meta httpEquiv="content-language" content="pt-br" />
        <meta content="Global" name="distribution" />
      </Head>
      <Box
        bgGradient={
          colorMode === "light"
            ? "linear(to-r, green.500, green.400)"
            : "linear(to-r, green.800, green.800)"
        }
        pt={10}
        pb={10}
      >
        <IconButton
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          top={5}
          right={20}
          size="lg"
          pos="absolute"
          d={["flex", "flex", "none", "none", "none"]}
        />
        <IconButton
          colorScheme="orange"
          icon={<AiOutlineMenu />}
          fontSize="2xl"
          d={["flex", "flex", "none", "none", "none"]}
          onClick={() => setDrawerMenu(true)}
          pos="absolute"
          top={5}
          right={5}
          size="lg"
        />
        <Container maxW="6xl">
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "300px 1fr",
              "300px 1fr",
              "300px 1fr",
            ]}
            gap={10}
            mt={[10, 0, 0, 0, 0]}
            justifyItems="center"
            alignItems="center"
            justifyContent="center"
          >
            <LinkBox overflow="hidden" p={2} w="300px">
              <Link href="/" passHref>
                <LinkOverlay>
                  <Image
                    src="/img/logo.svg"
                    width={300}
                    height={300}
                    layout="responsive"
                    alt="PA Rifas, rifas online"
                  />
                </LinkOverlay>
              </Link>
            </LinkBox>
            <Flex direction="column" justify="center" align="center">
              <MenuButtons />

              <Heading
                textAlign="center"
                color="white"
                mt={10}
                fontSize={["4xl", "5xl", "5xl", "5xl", "5xl"]}
              >
                Sua Rifa online está aqui!
              </Heading>
              <Text
                textAlign="center"
                color="gray.100"
                mt={5}
                fontSize={["sm", "md", "md", "md", "md"]}
              >
                Crie suas rifas ou compre rifas com a melhor plataforma, de
                forma segura, prática e fácil!
              </Text>

              <Grid
                templateColumns={[
                  "1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                  "1fr 1fr",
                ]}
                gap={5}
                mt={5}
              >
                <Button
                  leftIcon={<FaSave />}
                  onClick={() => setOpenRegister(!openRegister)}
                  size="lg"
                >
                  Cadastre - se
                </Button>
                <Button
                  colorScheme="orange"
                  leftIcon={<AiOutlineLogin />}
                  onClick={() => setOpenLogin(!openLogin)}
                  size="lg"
                >
                  Faça Login
                </Button>
              </Grid>
            </Flex>
          </Grid>
        </Container>
      </Box>

      <Modal isOpen={openLogin} onClose={() => setOpenLogin(false)} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isInvalid={
                validators.find((obj) => obj.path === "cpflogin") ? true : false
              }
              isRequired
            >
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
                id="cpflogin"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                render={(ref, props) => (
                  <Input ref={ref} {...props} focusBorderColor="green.500" />
                )}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "cpflogin")
                  ? validators.find((obj) => obj.path === "cpflogin").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              leftIcon={<AiOutlineLogin />}
              isLoading={loading}
              onClick={() => login()}
            >
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={openRegister}
        placement="right"
        onClose={() => setOpenRegister(false)}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent roundedLeft="xl">
          <DrawerCloseButton />
          <DrawerHeader>Cadastro</DrawerHeader>

          <DrawerBody>
            <Grid templateColumns="1fr" gap="15px">
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "name") ? true : false
                }
              >
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  id="name"
                  focusBorderColor="green.500"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "name")
                    ? validators.find((obj) => obj.path === "name").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid
              mt={3}
              templateColumns={[
                "1fr",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
                "repeat(2, 1fr)",
              ]}
              gap="15px"
            >
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "cpf") ? true : false
                }
              >
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
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="CPF"
                  render={(ref, props) => (
                    <Input ref={ref} {...props} focusBorderColor="green.500" />
                  )}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "cpf")
                    ? validators.find((obj) => obj.path === "cpf").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "phone") ? true : false
                }
              >
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
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  render={(ref, props) => (
                    <InputGroup>
                      <InputLeftElement children={<FaWhatsapp />} />
                      <Input
                        placeholder="Telefone"
                        ref={ref}
                        {...props}
                        focusBorderColor="green.500"
                      />
                    </InputGroup>
                  )}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "phone")
                    ? validators.find((obj) => obj.path === "phone").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr" mt={3}>
              <FormControl
                mb={3}
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "email") ? true : false
                }
              >
                <FormLabel>Email</FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "email")
                    ? validators.find((obj) => obj.path === "email").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid
              templateColumns={[
                "1fr",
                "3fr 1fr",
                "3fr 1fr",
                "3fr 1fr",
                "3fr 1fr",
              ]}
              gap="15px"
              mt="15px"
            >
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "street") ? true : false
                }
              >
                <FormLabel>
                  Logradouro - Rua, Avenida, Alameda, etc...
                </FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Logradouro - Rua, Avenida, Alameda, etc..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value.toUpperCase())}
                  id="street"
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "street")
                    ? validators.find((obj) => obj.path === "street").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "number") ? true : false
                }
              >
                <FormLabel>Número</FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Número"
                  value={number}
                  onChange={(e) => setNumber(e.target.value.toUpperCase())}
                  id="number"
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "number")
                    ? validators.find((obj) => obj.path === "number").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid
              templateColumns={[
                "1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
              ]}
              mt={3}
              gap="15px"
            >
              <FormControl>
                <FormLabel>Ponto de Referência</FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Ponto de Referência"
                  value={comp}
                  onChange={(e) => setComp(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormControl
                isInvalid={
                  validators.find((obj) => obj.path === "district")
                    ? true
                    : false
                }
                isRequired
              >
                <FormLabel>Bairro / Distrito</FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Bairro / Distrito"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value.toUpperCase())}
                  id="district"
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "district")
                    ? validators.find((obj) => obj.path === "district").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid
              templateColumns={[
                "1fr",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
                "1fr 2fr 1fr",
              ]}
              mt={3}
              gap="15px"
            >
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "cep") ? true : false
                }
              >
                <FormLabel>CEP</FormLabel>
                <MaskedInput
                  mask={[
                    /[0-9]/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  id="cep"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="CEP"
                  render={(ref, props) => (
                    <Input
                      ref={ref}
                      {...props}
                      focusBorderColor={"green.500"}
                    />
                  )}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "cep")
                    ? validators.find((obj) => obj.path === "cep").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  validators.find((obj) => obj.path === "city") ? true : false
                }
                isRequired
              >
                <FormLabel>Cidade</FormLabel>
                <Input
                  focusBorderColor="green.500"
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value.toUpperCase())}
                  id="city"
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "city")
                    ? validators.find((obj) => obj.path === "city").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  validators.find((obj) => obj.path === "state") ? true : false
                }
                isRequired
              >
                <FormLabel>UF</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={"green.500"}
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </Select>
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "state")
                    ? validators.find((obj) => obj.path === "state").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="green"
              leftIcon={<FaSave />}
              isLoading={loading}
              onClick={() => register()}
            >
              Cadastrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={drawerMenu}
        placement="left"
        onClose={() => setDrawerMenu(false)}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent roundedRight="xl">
          <DrawerCloseButton />

          <DrawerBody>
            <Flex justify="center" align="center">
              <LinkBox w="60%" overflow="hidden" p={2}>
                <Link href="/" passHref>
                  <LinkOverlay>
                    <Image
                      src="/img/logo.svg"
                      width={300}
                      height={300}
                      layout="responsive"
                      alt="PA Rifas, rifas online"
                    />
                  </LinkOverlay>
                </Link>
              </LinkBox>
            </Flex>

            <Stack spacing={3} mt={10}>
              <Link href="/rifas" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    _focus={{ outline: "none" }}
                    isFullWidth
                  >
                    RIFAS
                  </Button>
                </a>
              </Link>
              <Link href="/faleconosco" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    isFullWidth
                    _focus={{ outline: "none" }}
                  >
                    FALE CONOSCO
                  </Button>
                </a>
              </Link>
              <Link href="/novarifa" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    isFullWidth
                    _focus={{ outline: "none" }}
                  >
                    CRIAR RIFA
                  </Button>
                </a>
              </Link>
              <Link href="/condicoesdeuso" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    isFullWidth
                    _focus={{ outline: "none" }}
                  >
                    CONDIÇÔES DE USO
                  </Button>
                </a>
              </Link>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Menu placement="top">
              <MenuButton
                as={Button}
                leftIcon={<FaUserAlt />}
                isFullWidth
                colorScheme="orange"
              >
                Área do Cliente
              </MenuButton>
              <MenuList shadow="lg">
                {JSON.stringify(client) === "{}" ? (
                  <>
                    <MenuItem onClick={() => setOpenRegister(true)}>
                      CADASTRE-SE
                    </MenuItem>
                    <MenuItem onClick={() => setOpenLogin(true)}>
                      FAÇA LOGIN
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <Link href={`/meusdados/${client.identify}`} passHref>
                      <a>
                        <MenuItem>MEUS DADOS</MenuItem>
                      </a>
                    </Link>
                    <MenuDivider />
                    <MenuItem
                      icon={<AiOutlineLogout />}
                      onClick={() => logout()}
                    >
                      SAIR
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default memo(HeaderApp);
