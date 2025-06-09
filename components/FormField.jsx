import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

const FormField = ({
  name,
  control,
  label,
  placeholder = "",
  type = "text",
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input
            className="input"
            type={type}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;
