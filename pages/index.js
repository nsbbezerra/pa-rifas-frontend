import { useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  Divider,
  Icon,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import HeaderApp from "../components/header";
import Image from "next/image";
import { IoMdArrowForward } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import configsGlobal from "../configs/index";
import FooterApp from "../components/footer";
import { useConfigs } from "../context/Configs";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";

export default function Home({ config, raffles, url }) {
  const { setConfigs } = useConfigs();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setConfigs(config);
  }, [config]);

  return (
    <>
      <HeaderApp />

      <Container maxW="6xl" mt={20}>
        <Flex justify="center" align="center" direction="column">
          <Heading textAlign="center">Rifas em Destaque</Heading>
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
          templateColumns="repeat(auto-fit, minmax(250px, 250px))"
          gap={5}
          justifyItems="center"
          mt={10}
          justifyContent="center"
        >
          {raffles.map((raf) => (
            <LinkBox
              rounded="xl"
              overflow="hidden"
              w="250px"
              shadow="lg"
              key={raf.id}
              borderWidth="1px"
            >
              <Box w="250px" h="250px">
                <Image
                  src={`${url}/${raf.thumbnail}`}
                  width={260}
                  height={260}
                  layout="responsive"
                  objectFit="cover"
                  alt="PA Rifas, rifas online"
                />
              </Box>
              <Box p={4}>
                <Link href={`/rifa/${raf.identify}`} passHref>
                  <LinkOverlay>
                    <Heading
                      color={colorMode === "light" ? "green.500" : "green.200"}
                      fontSize="md"
                      noOfLines={2}
                      textAlign="center"
                    >
                      {raf.name}
                    </Heading>
                  </LinkOverlay>
                </Link>

                <Flex
                  align="center"
                  mt={1}
                  justify="center"
                  fontSize="xl"
                  mt={3}
                  mb={3}
                >
                  <Text fontWeight="300" mr={2}>
                    R$
                  </Text>
                  <Text fontWeight="800">
                    {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </Flex>

                <Text
                  fontSize="xs"
                  mt={2}
                  isTruncated
                  noOfLines={1}
                  textAlign="center"
                >
                  Sorteio:{" "}
                  <strong>
                    {format(
                      new Date(raf.draw_date),
                      "dd 'de' MMMM', às ' HH:mm'h'",
                      { locale: pt_br }
                    )}
                  </strong>{" "}
                </Text>
                <Divider mt={3} mb={3} />
                <Flex align="center" fontSize="xs" justify="center">
                  <Icon as={FaUserAlt} mr={2} />
                  <Text noOfLines={1}>{raf.name_client}</Text>
                </Flex>
              </Box>
            </LinkBox>
          ))}
        </Grid>

        <Flex justify="center" align="center" mt={10}>
          <Link href="/rifas" passHref>
            <a>
              <Button
                rightIcon={<IoMdArrowForward />}
                colorScheme="green"
                variant="outline"
              >
                Mais Rifas
              </Button>
            </a>
          </Link>
        </Flex>
      </Container>

      <Box
        pt={10}
        pb={10}
        bg={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.200"}
        mt={20}
      >
        <Container maxW="6xl">
          <Flex justify="center" align="center" direction="column">
            <Heading textAlign="center">
              Arrecadar com a PA Rifas é simples!
            </Heading>
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
            templateColumns="repeat(auto-fit, minmax(230px, 230px))"
            gap={10}
            justifyItems="center"
            mt={10}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Flex justify="center" align="center" direction="column">
              <Box w="70px" h="70px">
                <Image
                  src="/img/pencil.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  objectFit="contain"
                />
              </Box>
              <Heading textAlign="center" fontSize="2xl" mt={3}>
                Crie sua Rifa
              </Heading>
              <Text textAlign="center" mt={2}>
                Insira as informações relacionadas à sua campanha, indique o
                objetivo e os prêmios sorteados, data e hora do sorteio.
              </Text>
            </Flex>
            <Flex justify="center" align="center" direction="column">
              <Box w="70px" h="70px">
                <Image
                  src="/img/share.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  objectFit="contain"
                />
              </Box>
              <Heading textAlign="center" fontSize="2xl" mt={3}>
                Divulgue e Compartilhe
              </Heading>
              <Text textAlign="center" mt={2}>
                Compartilhe o link da sua Rifa nas redes socias, entre amigos,
                faça a de divulgação aumentar pedindo para que eles divulguem
                também.
              </Text>
            </Flex>
            <Flex justify="center" align="center" direction="column">
              <Box w="70px" h="70px">
                <Image
                  src="/img/trophy.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  objectFit="contain"
                />
              </Box>
              <Heading textAlign="center" fontSize="2xl" mt={3}>
                Realize o Sorteio
              </Heading>
              <Text textAlign="center" mt={2}>
                Dê confiança e credibilidade a sua campanha, realizando o
                sorteio de forma eletrônica e sem fraudes na nossa plataforma,
                transmita o sorteio ao vivo nas suas redes sociais.
              </Text>
            </Flex>
            <Flex justify="center" align="center" direction="column">
              <Box w="70px" h="70px">
                <Image
                  src="/img/money.svg"
                  width={100}
                  height={100}
                  layout="responsive"
                  objectFit="contain"
                />
              </Box>
              <Heading textAlign="center" fontSize="2xl" mt={3}>
                Receba seu Dinheiro
              </Heading>
              <Text textAlign="center" mt={2}>
                Receba o valor arrecadado diretamente na sua conta bancária,
                logo após a realização do sorteio e a confirmação da entrega dos
                prêmios.
              </Text>
            </Flex>
          </Grid>
        </Container>
      </Box>

      <Container mt={20} maxW="6xl">
        <Flex justify="center" align="center" direction="column">
          <Heading textAlign="center">Formas de Pagamento</Heading>
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
          templateColumns="repeat(auto-fit, minmax(280px, 280px))"
          gap={7}
          justifyContent="center"
          justifyItems="center"
          mt={10}
        >
          <Flex
            justify="center"
            align="center"
            direction="column"
            p={5}
            rounded="xl"
            borderWidth="1px"
            shadow="lg"
            w="100%"
          >
            <Box w="70px" h="70px">
              <Image
                src="/img/credit.svg"
                width={100}
                height={100}
                layout="responsive"
                objectFit="contain"
              />
            </Box>
            <Heading textAlign="center" fontSize="2xl" mt={3}>
              Cartão de Crédito
            </Heading>
            <Text textAlign="center" mt={2}>
              Receba das principais bandeiras de cartões
            </Text>
          </Flex>

          <Flex
            justify="center"
            align="center"
            direction="column"
            p={5}
            rounded="xl"
            borderWidth="1px"
            shadow="lg"
            w="100%"
          >
            <Box w="200px">
              <Image
                src="/img/pix.svg"
                width={250}
                height={130}
                layout="responsive"
                objectFit="contain"
              />
            </Box>
            <Heading textAlign="center" fontSize="2xl" mt={3}>
              PIX
            </Heading>
            <Text textAlign="center" mt={2}>
              Receba instantaneamente
            </Text>
          </Flex>

          <Flex
            justify="center"
            align="center"
            direction="column"
            p={5}
            rounded="xl"
            borderWidth="1px"
            shadow="lg"
            w="100%"
          >
            <Box w="70px" h="70px">
              <Image
                src="/img/boleto.svg"
                width={100}
                height={100}
                layout="responsive"
                objectFit="contain"
              />
            </Box>
            <Heading textAlign="center" fontSize="2xl" mt={3}>
              Boleto Bancário
            </Heading>
            <Text textAlign="center" mt={2}>
              Emita boletos com facilidade
            </Text>
          </Flex>
        </Grid>
      </Container>

      <FooterApp />
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configsGlobal.url}/site`);
  const data = await response.json();
  let conf = !data.configs ? null : data.configs;
  let raf = !data.raffles ? null : data.raffles;
  let url = !data.url ? null : data.url;
  let banners = !data.banners ? null : data.banners;
  return {
    props: {
      config: conf,
      raffles: raf,
      url: url,
      banners,
    },
    revalidate: 10,
  };
};
