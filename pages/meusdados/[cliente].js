import { useState, useEffect } from "react";
import HeaderApp from "../../components/header";
import FooterApp from "../../components/footerTotal";
import {
  Box,
  Container,
  Grid,
  Divider,
  Button,
  Flex,
  Icon,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
} from "../../components/sliders";
import Link from "next/link";
import { FaBars, FaWhatsapp, FaSave } from "react-icons/fa";
import configGlobal from "../../configs/index";
import MaskedInput from "react-text-mask";
import Admin from "../../components/admin";
import Client from "../../components/client";
import { useClient } from "../../context/Clients";
import api from "../../configs/axios";
import { useRouter } from "next/router";
import FooterAppTot from "../../components/footerTotal";

export default function MeusDados({ information }) {
  const { query, isFallback } = useRouter();
  const { client, setClient } = useClient();

  if (isFallback) {
    return (
      <>
        <HeaderApp />
        <Container maxW="7xl" mt={10}>
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "200px 1fr",
              "200px 1fr",
              "200px 1fr",
            ]}
            gap="30px"
          >
            <Skeleton w="200px" h="250px" rounded="lg" />
            <Box>
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
              <Skeleton w="100%" h="40px" mb={3} />
            </Box>
          </Grid>
        </Container>
        <FooterAppTot />
      </>
    );
  }

  const toast = useToast();
  const [page, setPage] = useState("data");
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

  const [url, setUrl] = useState("");
  const [configs, setConfigs] = useState({});

  useEffect(() => {
    if (information !== null) {
      setUrl(information.url);
      setConfigs(information.configs);
    }
  }, [information]);

  useEffect(() => {
    if (JSON.stringify(client) !== "{}") {
      setName(client.name);
      setCpf(client.cpf);
      setPhone(client.phone);
      setEmail(client.email);
      setStreet(client.street);
      setNumber(client.number);
      setComp(client.comp);
      setDistrict(client.district);
      setCep(client.cep);
      setCity(client.city);
      setState(client.state);
    }
  }, [client]);

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

  async function update() {
    if (name === "") {
      handleValidator("name", "Campo Obrigatório");
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
      const response = await api.put(`/clients/${query.cliente}`, {
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
      let newClient = response.data.client[0];
      setClient(newClient);
      await localStorage.setItem("client", JSON.stringify(newClient));
      showToast(response.data.message, "success", "Sucesso");
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
        ? "Erro no cadastro do cliente"
        : error.response.data.message;
      showToast(mess, "error", "Erro");
    }
  }

  return (
    <>
      <HeaderApp />
      <Container maxW="7xl" mt={10}>
        <Breadcrumb fontSize={["xx-small", "md", "md", "md", "md"]} mb={10}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/meusdados">
              <a>
                <BreadcrumbLink>Meus Dados</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid
          templateColumns={[
            "1fr",
            "1fr",
            "200px 1fr",
            "200px 1fr",
            "200px 1fr",
          ]}
          gap="30px"
        >
          <Box borderWidth="1px" rounded="lg" h="min-content">
            <Flex p={3} align="center">
              <Icon as={FaBars} />
              <Heading fontSize="lg" ml={3}>
                Menu
              </Heading>
            </Flex>
            <Divider />

            <Flex direction="column" p={3}>
              <Button
                colorScheme="purple"
                variant="outline"
                mb={5}
                onClick={() => setPage("data")}
                size="sm"
              >
                Meus Dados
              </Button>
              <Text fontSize="sm" mb={2}>
                Meus Sorteios:
              </Text>
              <Button
                colorScheme="purple"
                variant="outline"
                mb={3}
                onClick={() => setPage("admin")}
                size="sm"
              >
                Como Administrador
              </Button>
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={() => setPage("client")}
                size="sm"
              >
                Como Participante
              </Button>
            </Flex>
          </Box>
          <Box borderWidth="1px" rounded="lg" p={3} h="min-content">
            {page === "data" && (
              <>
                <Grid templateColumns="1fr" gap="15px">
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "name")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Nome Completo</FormLabel>
                    <Input
                      id="name"
                      focusBorderColor="purple.400"
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
                      validators.find((obj) => obj.path === "cpf")
                        ? true
                        : false
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
                        <Input
                          ref={ref}
                          {...props}
                          focusBorderColor="purple.400"
                          isReadOnly
                        />
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
                      validators.find((obj) => obj.path === "phone")
                        ? true
                        : false
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
                            focusBorderColor="purple.400"
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
                      validators.find((obj) => obj.path === "email")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      focusBorderColor="purple.400"
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
                <Divider mt={7} mb={4} />
                <Grid
                  templateColumns={[
                    "1fr",
                    "3fr 1fr",
                    "3fr 1fr",
                    "3fr 1fr",
                    "3fr 1fr",
                  ]}
                  gap="15px"
                >
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "street")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>
                      Logradouro - Rua, Avenida, Alameda, etc...
                    </FormLabel>
                    <Input
                      focusBorderColor="purple.400"
                      placeholder="Logradouro - Rua, Avenida, Alameda, etc..."
                      value={street}
                      onChange={(e) => setStreet(e.target.value.toUpperCase())}
                      id="street"
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "street")
                        ? validators.find((obj) => obj.path === "street")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "number")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Número</FormLabel>
                    <Input
                      focusBorderColor="purple.400"
                      placeholder="Número"
                      value={number}
                      onChange={(e) => setNumber(e.target.value.toUpperCase())}
                      id="number"
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "number")
                        ? validators.find((obj) => obj.path === "number")
                            .message
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
                      focusBorderColor="purple.400"
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
                      focusBorderColor="purple.400"
                      placeholder="Bairro / Distrito"
                      value={district}
                      onChange={(e) =>
                        setDistrict(e.target.value.toUpperCase())
                      }
                      id="district"
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "district")
                        ? validators.find((obj) => obj.path === "district")
                            .message
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
                      validators.find((obj) => obj.path === "cep")
                        ? true
                        : false
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
                          focusBorderColor={"purple.400"}
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
                      validators.find((obj) => obj.path === "city")
                        ? true
                        : false
                    }
                    isRequired
                  >
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      focusBorderColor="purple.400"
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
                      validators.find((obj) => obj.path === "state")
                        ? true
                        : false
                    }
                    isRequired
                  >
                    <FormLabel>UF</FormLabel>
                    <Select
                      placeholder="Selecione"
                      variant="outline"
                      focusBorderColor={"purple.400"}
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
                <Divider mt={5} mb={5} />

                <Button
                  size="lg"
                  colorScheme="purple"
                  leftIcon={<FaSave />}
                  isLoading={loading}
                  onClick={() => update()}
                >
                  Salvar Alterações
                </Button>
              </>
            )}
            {page === "admin" && (
              <Admin info={query.cliente} url={url} configs={configs} />
            )}
            {page === "client" && (
              <Client info={query.cliente} url={url} configs={configs} />
            )}
          </Box>
        </Grid>
      </Container>
      <FooterApp />
    </>
  );
}

export const getStaticPaths = async () => {
  const response = await fetch(`${configGlobal.url}/clients`);
  const data = await response.json();
  const paths = await data.map((cli) => {
    return { params: { cliente: cli.identify } };
  });
  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async () => {
  const response = await fetch(`${configGlobal.url}/mydata`);
  const data = await response.json();
  let info = !data ? null : data;
  return {
    props: {
      information: info,
    },
    revalidate: 10,
  };
};
