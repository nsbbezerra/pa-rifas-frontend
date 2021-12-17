import { useState, useEffect } from "react";
import HeaderApp from "../../components/header";
import FooterApp from "../../components/footer";
import {
  Box,
  Container,
  Grid,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
} from "../../components/sliders";
import Link from "next/link";
import configGlobal from "../../configs/index";
import Admin from "../../components/admin";
import Client from "../../components/client";
import { useClient } from "../../context/Clients";
import { useRouter } from "next/router";

export default function MinhasRifas({ information }) {
  const { query, isFallback } = useRouter();
  const { client } = useClient();

  if (isFallback) {
    return (
      <>
        <HeaderApp />
        <Container maxW="7xl" mt={10}>
          <Grid templateColumns={"1fr"} gap="30px">
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
        <FooterApp />
      </>
    );
  }

  const [url, setUrl] = useState("");
  const [configs, setConfigs] = useState({});

  useEffect(() => {
    if (information !== null) {
      setUrl(information.url);
      setConfigs(information.configs);
    }
  }, [information]);

  return (
    <>
      <HeaderApp />
      <Container maxW="5xl" mt={10}>
        <Breadcrumb fontSize={["xx-small", "md", "md", "md", "md"]} mb={10}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <a>
                <BreadcrumbLink>Início</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link passHref href={`/minhasrifas/${client.identify}`}>
              <a>
                <BreadcrumbLink>Minhas Rifas</BreadcrumbLink>
              </a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Tabs
          colorScheme="green"
          defaultIndex={0}
          mt={10}
          variant={"enclosed-colored"}
        >
          <TabList>
            <Tab roundedTop="md">ADMINISTRADOR</Tab>
            <Tab roundedTop="md">PARTICIPANTE</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Admin info={query.cliente} url={url} configs={configs} />
            </TabPanel>
            <TabPanel>
              <Client info={query.cliente} />
            </TabPanel>
          </TabPanels>
        </Tabs>
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
