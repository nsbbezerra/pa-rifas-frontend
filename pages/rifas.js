import { useEffect, useState } from "react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footerTotal";
import {
  Container,
  Grid,
  LinkBox,
  LinkOverlay,
  Box,
  Text,
  Heading,
  Flex,
  Divider,
  HStack,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import Link from "next/link";
import { FaSearch, FaUserAlt, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import configsGlobal from "../configs/index";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Sorteios({ raffles }) {
  const [raffle, setRaffle] = useState([]);
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");

  useEffect(() => {
    if (raffles !== null) {
      setRaffle(raffles.raffles);
      setUrl(raffles.url);
    }
  }, [raffles]);

  async function finderBySource() {
    if (search === "all") {
      await setRaffle(raffles.raffles);
      setText("");
    }
    if (search === "user") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name_client.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }
    if (search === "title") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }
  }

  return (
    <>
      <HeaderApp />

      <Container maxW="6xl" mt={10}>
        <Breadcrumb fontSize={["xx-small", "md", "md", "md", "md"]} mb={10}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/sorteios">
              <a>
                <BreadcrumbLink>Sorteios</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid
          templateColumns={[
            "1fr",
            "1fr 1fr 200px",
            "1fr 2fr 200px",
            "1fr 2fr 200px",
            "1fr 3fr 1fr",
          ]}
          gap="15px"
        >
          <FormControl>
            <FormLabel>Selecione uma opção:</FormLabel>
            <Select
              placeholder="Selecione uma opção"
              focusBorderColor="purple.400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value="all">Todos os Sorteios</option>
              <option value="user">Nome do usuário</option>
              <option value="title">Título do Sorteio</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Digite para buscar</FormLabel>
            <Input
              focusBorderColor="purple.400"
              placeholder="Digite para buscar"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              isDisabled={search === "all" ? true : false}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              color="transparent"
              userSelect="none"
              display={["none", "block", "block", "block", "block"]}
            >
              .
            </FormLabel>
            <Button
              isFullWidth
              leftIcon={<FaSearch />}
              colorScheme="purple"
              variant="outline"
              onClick={() => finderBySource()}
            >
              Buscar
            </Button>
          </FormControl>
        </Grid>

        {raffle.length === 0 ? (
          <Center mt={10}>
            <Heading fontSize="2xl">Nenhum sorteio para mostrar</Heading>
          </Center>
        ) : (
          <Grid
            templateColumns="repeat(auto-fit, minmax(220px, 220px))"
            gap="30px"
            mt={10}
            justifyContent="center"
          >
            {raffle.map((raf) => (
              <LinkBox
                rounded="lg"
                overflow="hidden"
                w="220px"
                bg="white"
                shadow="lg"
                borderWidth="1px"
                key={raf.id}
              >
                {raf.status === "drawn" && (
                  <Flex
                    bg="blackAlpha.700"
                    position="absolute"
                    w="220px"
                    h="100%"
                    zIndex={1000}
                    justify="center"
                    align="center"
                  >
                    <Box
                      w="100%"
                      bg="green.600"
                      p={3}
                      textAlign="center"
                      fontWeight="700"
                      color="white"
                    >
                      <Text>FINALIZADA</Text>
                      <HStack justify="center" mt={2}>
                        <Text>Nº Sorteado:</Text>
                        <Text
                          p={2}
                          bg="white"
                          borderWidth="1px"
                          borderColor="purple.400"
                          rounded="md"
                          color="purple.400"
                          shadow="md"
                        >
                          {raf.number_drawn ? raf.number_drawn : 0}
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                )}
                {raf.status === "cancel" && (
                  <Flex
                    bg="blackAlpha.700"
                    position="absolute"
                    w="220px"
                    h="100%"
                    zIndex={1000}
                    justify="center"
                    align="center"
                  >
                    <Box
                      w="100%"
                      bg="red.600"
                      p={3}
                      textAlign="center"
                      fontWeight="700"
                    >
                      <Text mb={2} color="white">
                        CANCELADA
                      </Text>

                      <Text fontSize="sm" color="white">
                        Administrador:
                      </Text>
                      <Link
                        href={`https://wa.me/+55${raf.phone_client.replace(
                          /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                          ""
                        )}`}
                        passHref
                      >
                        <a target="_blank">
                          <Button
                            colorScheme="whatsapp"
                            leftIcon={<FaWhatsapp />}
                            size="sm"
                            w="160px"
                          >
                            {raf.phone_client}
                          </Button>
                        </a>
                      </Link>
                      <Popover>
                        <PopoverTrigger>
                          <Button colorScheme="gray" size="sm" w="160px" mt={2}>
                            Justificativa
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent _focus={{ outline: "none" }}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader fontSize="xs">
                            Justificativa
                          </PopoverHeader>
                          <PopoverBody fontSize="xs" fontWeight="normal">
                            {raf.justify}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                  </Flex>
                )}

                {raf.status === "refused" && (
                  <Flex
                    bg="blackAlpha.700"
                    position="absolute"
                    w="220px"
                    h="100%"
                    zIndex={1000}
                    justify="center"
                    align="center"
                  >
                    <Box
                      w="100%"
                      bg="gray.800"
                      p={3}
                      textAlign="center"
                      fontWeight="700"
                    >
                      <Text mb={2} color="white">
                        BLOQUEADA
                      </Text>

                      <Text fontSize="sm" color="white">
                        Administrador:
                      </Text>
                      <Link
                        href={`https://wa.me/+55${raf.phone_client.replace(
                          /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                          ""
                        )}`}
                        passHref
                      >
                        <a target="_blank">
                          <Button
                            colorScheme="whatsapp"
                            leftIcon={<FaWhatsapp />}
                            size="sm"
                            w="160px"
                          >
                            {raf.phone_client}
                          </Button>
                        </a>
                      </Link>
                      <Popover>
                        <PopoverTrigger>
                          <Button colorScheme="gray" size="sm" w="160px" mt={2}>
                            Justificativa
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent _focus={{ outline: "none" }}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader fontSize="xs">
                            Justificativa
                          </PopoverHeader>
                          <PopoverBody fontSize="xs" fontWeight="normal">
                            {raf.justify}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                  </Flex>
                )}

                <Box w="220px" h="220px">
                  <Image
                    src={`${url}/${raf.thumbnail}`}
                    width={260}
                    height={260}
                    layout="responsive"
                    objectFit="cover"
                    alt="PMW Rifas, rifas online"
                  />
                </Box>
                <Box p={2} w="260px">
                  <Link href={`/sorteio/${raf.identify}`} passHref>
                    <LinkOverlay>
                      <Heading
                        color="purple.400"
                        fontSize="md"
                        isTruncated
                        noOfLines={1}
                        w="200px"
                      >
                        {raf.name}
                      </Heading>
                    </LinkOverlay>
                  </Link>
                  <Text fontSize="xs" mt={2}>
                    Sorteio:{" "}
                    <strong>
                      {format(
                        new Date(raf.draw_date),
                        "dd 'de' MMMM', às ' HH:mm'h'",
                        { locale: ptBR }
                      )}
                    </strong>
                  </Text>
                  <Flex align="center" mt={1}>
                    <Text fontWeight="300" mr={2}>
                      R$
                    </Text>
                    <Text fontWeight="800">
                      {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </Flex>
                  <Divider mt={1} mb={1} />
                  <Flex align="center" fontSize="xs">
                    <Icon as={FaUserAlt} mr={2} />
                    <Text w="180px" isTruncated noOfLines={1}>
                      {raf.name_client}
                    </Text>
                  </Flex>
                </Box>
              </LinkBox>
            ))}
          </Grid>
        )}
      </Container>

      <FooterApp />
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configsGlobal.url}/showRaffles`);
  const data = await response.json();
  let raffles = !data ? null : data;
  return {
    props: {
      raffles,
    },
    revalidate: 10,
  };
};
