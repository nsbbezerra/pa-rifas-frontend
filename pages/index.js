import { useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import HeaderApp from "../components/header";
import Image from "next/image";
import { IoMdArrowForward } from "react-icons/io";
import configsGlobal from "../configs/index";
import FooterApp from "../components/footer";
import { useConfigs } from "../context/Configs";

import ShowRaffles from "../components/raffles";
import Messages from "../components/messages";

export default function Home({ config, raffles }) {
  const { setConfigs } = useConfigs();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setConfigs(config);
  }, [config]);

  return (
    <>
      <HeaderApp />

      <Container maxW="6xl" mt={10}>
        <Flex justify="center" align="center" direction="column" mb={10}>
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

        <ShowRaffles raffle={raffles} destination={"rifa"} />

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
        mt={10}
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
                Dê confiança e credibilidade a sua campanha, o sorteio será
                realizado com base na Loteria Federal.
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

      <Container mt={10} maxW="4xl">
        <Flex justify="center" align="center" direction="column">
          <Heading textAlign="center">Envie-nos o seu Feedback</Heading>
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
          <Text textAlign="center" fontSize="sm">
            Nos envie a sua Sugestão, Crítica, Elogio, o seu Feedback é muito
            importante para nós, assim estaremos melhorando cada vez mais os
            nossos serviços.
          </Text>
        </Flex>
        <Messages />
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
  return {
    props: {
      config: conf,
      raffles: raf,
    },
    revalidate: 5,
  };
};
