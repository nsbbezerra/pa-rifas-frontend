import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";

import ClientProvider from "../context/Clients";
import ConfigProvider from "../context/Configs";
import NumbersProvider from "../context/Numbers";
import ModalRegisterProvider from "../context/ModalRegister";
import ModalLoginProvider from "../context/ModalLogin";

function MyApp({ Component, pageProps }) {
  return (
    <ClientProvider>
      <ConfigProvider>
        <NumbersProvider>
          <ModalRegisterProvider>
            <ModalLoginProvider>
              <ChakraProvider resetCSS={true} theme={theme}>
                <Component {...pageProps} />
              </ChakraProvider>
            </ModalLoginProvider>
          </ModalRegisterProvider>
        </NumbersProvider>
      </ConfigProvider>
    </ClientProvider>
  );
}

export default MyApp;
