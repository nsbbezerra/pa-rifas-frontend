import { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { Input } from "@chakra-ui/input";
import { useColorModeValue } from "@chakra-ui/react";

export default function MyInput({ name, ...rest }) {
  const InputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: InputRef,
      getValue: (ref) => {
        return name === "email"
          ? ref.current.value
          : ref.current.value.toUpperCase();
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <Input
      ref={InputRef}
      defaultValue={defaultValue}
      {...rest}
      focusBorderColor={useColorModeValue("green.500", "green.200")}
    />
  );
}
