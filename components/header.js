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
  useToast,
  FormErrorMessage,
  MenuDivider,
  HStack,
  useColorMode,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import {
  FaUserAlt,
  FaSave,
  FaMoon,
  FaSun,
  FaIdCard,
  FaReceipt,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import MaskedInput from "react-text-mask";
import InputMask from "react-input-mask";
import {
  AiOutlineClose,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineUser,
} from "react-icons/ai";
import { useLoginModal } from "../context/ModalLogin";

import { useClient } from "../context/Clients";
import api from "../configs/axios";

import { useRouter } from "next/router";

function HeaderApp() {
  const { client, setClient } = useClient();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { push } = useRouter();
  const { openLogin, setOpenLogin } = useLoginModal();

  const [loading, setLoading] = useState(false);

  const [drawerMenu, setDrawerMenu] = useState(false);

  const [cpf, setCpf] = useState("");

  async function findClientLocal() {
    const myClient = await localStorage.getItem("client");
    if (myClient) {
      setClient(JSON.parse(myClient));
    }
  }

  useEffect(() => {
    findClientLocal();
  }, []);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
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
    <Flex justify="center" w="100%" h="52px">
      <HStack spacing={3} d={["none", "none", "none", "none", "flex"]}>
        <Link href="/" passHref>
          <a>
            <Button colorScheme="green" variant="ghost" size="sm">
              INÍCIO
            </Button>
          </a>
        </Link>
        <Link href="/rifas" passHref>
          <a>
            <Button colorScheme="green" variant="ghost" size="sm">
              RIFAS
            </Button>
          </a>
        </Link>
        <Link href="/faleconosco" passHref>
          <a>
            <Button colorScheme="green" variant="ghost" size="sm">
              FALE CONOSCO
            </Button>
          </a>
        </Link>
        <Link href="/condicoesdeuso" passHref>
          <a>
            <Button colorScheme="green" variant="ghost" size="sm">
              CONDIÇÔES DE USO
            </Button>
          </a>
        </Link>
      </HStack>
    </Flex>
  );

  const MenuButtonsIcon = () => (
    <HStack ml={3} spacing={3} d={["none", "none", "flex", "flex", "flex"]}>
      <IconButton
        colorScheme="green"
        icon={drawerMenu === false ? <AiOutlineMenu /> : <AiOutlineClose />}
        fontSize="xl"
        d={["flex", "flex", "flex", "flex", "none"]}
        onClick={() => setDrawerMenu(!drawerMenu)}
      />
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          leftIcon={<FaUserAlt />}
          colorScheme="green"
          variant="outline"
        >
          Área do Cliente
        </MenuButton>
        <MenuList shadow="lg">
          {JSON.stringify(client) === "{}" ? (
            <>
              <MenuItem
                icon={<FaSave />}
                onClick={() => push("/cadastro")}
                fontSize={"sm"}
              >
                CADASTRE-SE
              </MenuItem>
              <MenuItem
                icon={<AiOutlineLogin />}
                onClick={() => setOpenLogin(true)}
                fontSize={"sm"}
              >
                FAÇA LOGIN
              </MenuItem>
            </>
          ) : (
            <>
              <Flex justify={"center"} align={"center"} direction={"column"}>
                <Avatar icon={<AiOutlineUser />} size={"sm"} />
                <Text fontWeight={"bold"} fontSize={"x-small"} mt={2}>
                  {client.name}
                </Text>
              </Flex>
              <MenuDivider />
              <Link href={`/meusdados/${client.identify}`} passHref>
                <a>
                  <MenuItem icon={<FaIdCard />} fontSize={"sm"}>
                    MEUS DADOS
                  </MenuItem>
                </a>
              </Link>
              <Link href={`/minhasrifas/${client.identify}`} passHref>
                <a>
                  <MenuItem icon={<FaReceipt />} fontSize={"sm"}>
                    MINHAS RIFAS
                  </MenuItem>
                </a>
              </Link>
              <MenuItem
                icon={<AiOutlineLogout />}
                onClick={() => logout()}
                fontSize={"sm"}
              >
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
          colorScheme="green"
          variant="outline"
        />
      </Tooltip>
    </HStack>
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
        <meta
          name="google-site-verification"
          content="KsPVvA0XQe_YhROQ78xfkfzOME0H50RJFMe6NPFXF6o"
        />
      </Head>
      <Box
        h="55px"
        position="fixed"
        top={0}
        right={0}
        left={0}
        bg={useColorModeValue("orange.500", "orange.800")}
        zIndex={1000}
        shadow="lg"
        d={["none", "none", "block", "block", "block"]}
      >
        <Container maxW="6xl">
          <Flex h="55px" justify="space-between" align="center">
            <LinkBox
              overflow="hidden"
              w="110px"
              transform={"rotate(-10deg)"}
              mt={-1}
            >
              <Link href="/" passHref>
                <LinkOverlay>
                  <Image
                    src="/img/pa.svg"
                    width={446}
                    height={250}
                    layout="responsive"
                    alt="PA Rifas, rifas online"
                  />
                </LinkOverlay>
              </Link>
            </LinkBox>
            <MenuButtons />
            <MenuButtonsIcon />
          </Flex>
        </Container>
      </Box>
      <Box
        backgroundImage={'url("/img/background.jpg")'}
        backgroundPosition={"center"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        mt={["0px", "0px", "55px", "55px", "55px"]}
      >
        <Box
          pt={10}
          pb={10}
          bg={useColorModeValue("blackAlpha.500", "blackAlpha.700")}
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
              <LinkBox overflow="hidden" p={2} w="250px">
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
                <Heading
                  textAlign="center"
                  color="white"
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
                    onClick={() => push("/cadastro")}
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
      </Box>

      <Modal isOpen={openLogin} onClose={() => setOpenLogin(false)} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>CPF</FormLabel>
              <InputMask
                mask={"999.999.999-99"}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
              >
                {(inputProps) => (
                  <Input {...inputProps} focusBorderColor="green.500" />
                )}
              </InputMask>
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
        isOpen={drawerMenu}
        placement="left"
        onClose={() => setDrawerMenu(false)}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
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
              <Link href="/" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    _focus={{ outline: "none" }}
                    isFullWidth
                    variant="outline"
                  >
                    INÍCIO
                  </Button>
                </a>
              </Link>
              <Link href="/rifas" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    _focus={{ outline: "none" }}
                    isFullWidth
                    variant="outline"
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
                    variant="outline"
                  >
                    FALE CONOSCO
                  </Button>
                </a>
              </Link>
              <Link href="/condicoesdeuso" passHref>
                <a>
                  <Button
                    colorScheme="green"
                    isFullWidth
                    _focus={{ outline: "none" }}
                    variant="outline"
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
                colorScheme="green"
              >
                Área do Cliente
              </MenuButton>
              <MenuList shadow="lg">
                {JSON.stringify(client) === "{}" ? (
                  <>
                    <MenuItem
                      icon={<FaSave />}
                      onClick={() => push("/cadastro")}
                      fontSize={"sm"}
                    >
                      CADASTRE-SE
                    </MenuItem>
                    <MenuItem
                      icon={<AiOutlineLogin />}
                      onClick={() => setOpenLogin(true)}
                      fontSize={"sm"}
                    >
                      FAÇA LOGIN
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <Flex
                      justify={"center"}
                      align={"center"}
                      direction={"column"}
                    >
                      <Avatar icon={<AiOutlineUser />} size={"sm"} />
                      <Text fontWeight={"bold"} fontSize={"x-small"} mt={2}>
                        {client.name}
                      </Text>
                    </Flex>
                    <MenuDivider />
                    <Link href={`/meusdados/${client.identify}`} passHref>
                      <a>
                        <MenuItem icon={<FaIdCard />} fontSize={"sm"}>
                          MEUS DADOS
                        </MenuItem>
                      </a>
                    </Link>
                    <Link href={`/minhasrifas/${client.identify}`} passHref>
                      <a>
                        <MenuItem icon={<FaReceipt />} fontSize={"sm"}>
                          MINHAS RIFAS
                        </MenuItem>
                      </a>
                    </Link>
                    <MenuItem
                      icon={<AiOutlineLogout />}
                      fontSize={"sm"}
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
