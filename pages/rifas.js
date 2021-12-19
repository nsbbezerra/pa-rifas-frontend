import { useMemo, useState } from "react";
import HeaderApp from "../components/header";
import FooterApp from "../components/footer";
import {
  Container,
  Center,
  Grid,
  Box,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import configsGlobal from "../configs/index";

import ShowRaffles from "../components/raffles";

export default function Sorteios({ raffles, numbers }) {
  const [raffle, setRaffle] = useState(raffles);
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [modal, setModal] = useState(false);
  const [number] = useState(numbers);

  async function finderBySource() {
    if (search === "all") {
      await setRaffle(raffles);
      setText("");
    }
    if (search === "user") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name_client.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }
    if (search === "title") {
      let termos = await text.split(" ");
      let frasesFiltradas = await raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setRaffle(frasesFiltradas);
      setText("");
    }

    if (search === "number") {
      let id = parseInt(text);
      const result = await raffles.filter((obj) => obj.id === id);
      if (result.length !== 0) {
        await setRaffle(result);
      }
      setText("");
    }
  }

  const SearchCustom = () => (
    <>
      <FormControl>
        <FormLabel>Selecione uma opção:</FormLabel>
        <Select
          placeholder="Selecione uma opção"
          focusBorderColor="green.500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        >
          <option value="all">Todas as Rifas</option>
          <option value="user">Nome do Usuário</option>
          <option value="title">Título da Rifa</option>
          <option value="number">Número da Rifa</option>
        </Select>
      </FormControl>

      <FormControl mt={5}>
        <FormLabel>Digite para Buscar</FormLabel>
        <Input
          focusBorderColor="green.500"
          placeholder="Digite para Buscar"
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          isDisabled={search === "all" ? true : false}
        />
      </FormControl>
      <Button
        mt={8}
        isFullWidth
        leftIcon={<FaSearch />}
        colorScheme="green"
        onClick={() => finderBySource()}
      >
        Buscar
      </Button>
    </>
  );

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
            <Link passHref href="/rifas">
              <a>
                <BreadcrumbLink>Sorteios</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <IconButton
          icon={<FaSearch />}
          size="lg"
          pos="fixed"
          bottom={5}
          zIndex={900}
          right={5}
          fontSize="2xl"
          shadow="lg"
          colorScheme="orange"
          d={["flex", "flex", "none", "none", "none"]}
          onClick={() => setModal(true)}
        />

        <Grid
          templateColumns={[
            "1fr",
            "1fr",
            "270px 1fr",
            "270px 1fr",
            "270px 1fr",
          ]}
          gap={7}
        >
          <Box
            rounded="xl"
            borderWidth="1px"
            p={3}
            shadow="lg"
            h="min-content"
            d={["none", "none", "block", "block", "block"]}
          >
            <FormControl>
              <FormLabel>Selecione uma opção:</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor="green.500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              >
                <option value="all">Todas as Rifas</option>
                <option value="user">Nome do Usuário</option>
                <option value="title">Título da Rifa</option>
                <option value="number">Número da Rifa</option>
              </Select>
            </FormControl>

            <FormControl mt={5}>
              <FormLabel>Digite para Buscar</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Digite para Buscar"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                isDisabled={search === "all" ? true : false}
              />
            </FormControl>
            <Button
              mt={8}
              isFullWidth
              leftIcon={<FaSearch />}
              colorScheme="green"
              onClick={() => finderBySource()}
            >
              Buscar
            </Button>
          </Box>

          <Box w="100%">
            {raffle.length === 0 ? (
              <Center>
                <Heading fontSize="2xl">Nenhum sorteio para mostrar</Heading>
              </Center>
            ) : (
              <ShowRaffles
                raffle={raffle}
                destination="rifa"
                numbers={numbers}
              />
            )}

            <Center mt={10} d="none">
              <Flex
                rounded="full"
                borderWidth="1px"
                overflow="hidden"
                shadow="md"
              >
                <Tooltip label="Página Anterior" hasArrow>
                  <IconButton icon={<FaArrowLeft />} rounded="none" />
                </Tooltip>
                <Flex
                  fontSize="lg"
                  fontWeight="bold"
                  w="100px"
                  justify="center"
                  align="center"
                >
                  1 / 2
                </Flex>
                <Tooltip label="Próxima Página" hasArrow>
                  <IconButton icon={<FaArrowRight />} rounded="none" />
                </Tooltip>
              </Flex>
            </Center>
          </Box>
        </Grid>
      </Container>

      <FooterApp />

      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buscar</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <FormControl>
              <FormLabel>Selecione uma opção:</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor="green.500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              >
                <option value="all">Todas as Rifas</option>
                <option value="user">Nome do Usuário</option>
                <option value="title">Título da Rifa</option>
                <option value="number">Número da Rifa</option>
              </Select>
            </FormControl>

            <FormControl mt={5}>
              <FormLabel>Digite para Buscar</FormLabel>
              <Input
                focusBorderColor="green.500"
                placeholder="Digite para Buscar"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                isDisabled={search === "all" ? true : false}
              />
            </FormControl>
            <Button
              mt={8}
              isFullWidth
              leftIcon={<FaSearch />}
              colorScheme="green"
              onClick={() => finderBySource()}
            >
              Buscar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configsGlobal.url}/showRaffles`);
  const data = await response.json();
  let raffles = !data.raffles ? null : data.raffles;
  let numbers = !data.numbers ? null : data.numbers;
  return {
    props: {
      raffles,
      numbers,
    },
    revalidate: 5,
  };
};
