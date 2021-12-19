import {
  Container,
  Heading,
  Box,
  Flex,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/layout";
import HeaderApp from "../components/header";
import Link from "next/link";
import FooterApp from "../components/footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../components/sliders";
import configGlobal from "../configs/index";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
import Messages from "../components/messages";

export default function FaleConosco({ config }) {
  return (
    <>
      <HeaderApp />
      <Container maxW="4xl" mt={10}>
        <Breadcrumb mb={10} fontSize={["xx-small", "md", "md", "md", "md"]}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href="/faleconosco">
              <a>
                <BreadcrumbLink>Fale Conosco</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex justify={"center"} align={"center"} direction={"column"}>
          <Heading
            fontSize={["3xl", "4xl", "4xl", "4xl", "4xl"]}
            textAlign={"center"}
          >
            Entre em contato conosco pelo Whatsapp
          </Heading>
          <Box
            bgGradient={useColorModeValue(
              "linear(to-r, green.500, orange.500)",
              "linear(to-r, green.200, orange.200)"
            )}
            w="200px"
            h="5px"
            mt={3}
            mb={3}
          />
        </Flex>
        <Flex justify="center" align="center" mt={10}>
          <LinkBox>
            <Link
              href={`https://wa.me/+55${config.admin_phone.replace(
                /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
                ""
              )}`}
              passHref
            >
              <LinkOverlay target="_blank">
                <Button
                  leftIcon={<FaWhatsapp />}
                  size={"lg"}
                  colorScheme={"whatsapp"}
                >
                  Whatsapp: {config.admin_phone}
                </Button>
              </LinkOverlay>
            </Link>
          </LinkBox>
        </Flex>

        <Flex justify={"center"} align={"center"} direction={"column"} mt={20}>
          <Heading
            fontSize={["3xl", "4xl", "4xl", "4xl", "4xl"]}
            textAlign={"center"}
          >
            Ou nos envie uma Mensagem
          </Heading>
          <Box
            bgGradient={useColorModeValue(
              "linear(to-r, green.500, orange.500)",
              "linear(to-r, green.200, orange.200)"
            )}
            w="200px"
            h="5px"
            mt={3}
            mb={3}
          />
        </Flex>
        <Messages />
      </Container>

      <FooterApp />
    </>
  );
}

export const getStaticProps = async () => {
  const response = await fetch(`${configGlobal.url}/configs`);
  const data = await response.json();
  return {
    props: {
      config: data,
    },
    revalidate: 30,
  };
};
