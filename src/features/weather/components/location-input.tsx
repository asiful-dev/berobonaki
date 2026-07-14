"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  locationInputSchema,
  type LocationInput,
} from "@/features/location/schemas/location.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

type FormValues = z.input<typeof locationInputSchema>;
type FormOutput = z.output<typeof locationInputSchema>;

export function LocationInput({
  onSubmit,
  isLoading,
}: {
  onSubmit: (lat: number, lon: number) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(locationInputSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      lat: "",
      lon: "",
    },
  });

  function submitHandler(data: LocationInput) {
    onSubmit(data.lat, data.lon);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
      <div>
        <Input placeholder="Latitude (-90 to 90)" {...register("lat")} />
        {errors.lat && (
          <p className="text-red-500 text-sm">{errors.lat.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Longitude (-180 to 180)" {...register("lon")} />
        {errors.lon && (
          <p className="text-red-500 text-sm">{errors.lon.message}</p>
        )}
      </div>

      {errors.root && (
        <Alert variant="destructive">{errors.root.message}</Alert>
      )}

      <Button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Get Weather"}
      </Button>
    </form>
  );
}
