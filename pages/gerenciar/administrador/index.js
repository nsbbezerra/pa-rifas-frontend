import Header from "../../../components/header";
import Footer from "../../../components/footer";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/layout";
import Image from "next/image";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/stat";
import { Progress } from "@chakra-ui/progress";

export default function AdminRaffles() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Header />
      <Container maxW="6xl" mt={20}>
        <Grid templateColumns="300px 1fr" gap={5}>
          <Box
            rounded="xl"
            overflow="hidden"
            borderWidth="1px"
            shadow="lg"
            h="min-content"
          >
            <Box>
              <Image
                width={300}
                height={300}
                src="https://img.freepik.com/psd-gratuitas/postagem-de-sorteio-no-instagram_442085-152.jpg?size=338&ext=jpg"
                layout="responsive"
                alt="PA Rifas, rifas online"
              />
            </Box>

            <Box p={4}>
              <Heading
                fontSize="2xl"
                color={colorMode === "light" ? "green.500" : "green.200"}
              >
                TÍTULO DO SORTEIO
              </Heading>
              <Text fontSize="md" mt={3}>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout
              </Text>

              <HStack mt={3}>
                <Stat>
                  <StatLabel>Valor</StatLabel>
                  <StatNumber>R$ 10,00</StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>Sorteio</StatLabel>
                  <StatNumber>11/11/1111</StatNumber>
                </Stat>
              </HStack>
            </Box>

            <Progress hasStripe value={100} colorScheme="green" size="sm" />

            <Box p={4}>
              <Heading
                fontSize="2xl"
                color={colorMode === "light" ? "green.500" : "green.200"}
              >
                PRÊMIOS
              </Heading>

              <Stack mt={5}>
                <Box
                  bg={useColorModeValue("gree.500", "green.200")}
                  rounded="xl"
                  p={3}
                >
                  <Flex align="center"></Flex>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
