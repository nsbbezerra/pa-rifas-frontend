import { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { Input } from "@chakra-ui/input";
import { useColorMode } from "@chakra-ui/react";
import MaskedInput from "react-text-mask";
import InputMask from "react-input-mask";

export default function MyInputMask({ name, ...rest }) {
  const InputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);
  const { colorMode } = useColorMode();

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: InputRef.current,
      path: "value",
      setValue: (ref, value) => {
        ref.setInputRef(value);
      },
      clearValue: (ref) => {
        ref.setInputRef("");
      },
    });
  }, [fieldName, registerField]);

  return (
    <InputMask
      ref={InputRef}
      defaultValue={defaultValue}
      {...rest}
      mask={
        (name === "cpf" && "999.999.999-99") ||
        (name === "phone" && "(99) 99999-9999") ||
        (name === "cep" && "99.999-999")
      }
    >
      {(inputProps) => (
        <Input
          {...inputProps}
          focusBorderColor={colorMode === "light" ? "green.500" : "green.200"}
        />
      )}
    </InputMask>
  );
}
