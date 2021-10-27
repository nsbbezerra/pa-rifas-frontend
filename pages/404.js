import HeaderApp from "../components/header";
import FooterApp from "../components/footerTotal";
import { Container, Flex, Heading } from "@chakra-ui/react";
import Lottie from "../components/lottie";
import animation from "../assets/404.json";

export default function NotFound() {
  return (
    <>
      <HeaderApp />
      <Container maxW="6xl" mt={10}>
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={animation} width="40%" />
          <Heading
            fontSize={["md", "2xl", "2xl", "2xl", "2xl"]}
            textAlign="center"
            mt={5}
          >
            Página não Encontrada!
          </Heading>
        </Flex>
      </Container>
      <FooterApp />
    </>
  );
}
